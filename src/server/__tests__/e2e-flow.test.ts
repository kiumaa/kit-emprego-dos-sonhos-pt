import { describe, it, expect, beforeEach } from 'vitest';
import { createHmac } from 'node:crypto';
import { store } from '../db/store';
import { verifySalePaid } from '../integrations/okanda-verifier';
import { generateCvPdf } from '../pdf/cv-pdf-generator';
import { parseDocument } from '../diagnostics/document-parser';

const signingSecret = 'keds-super-secret-signing-key-for-test-suite-only';
const productMap = {
  'prod-kit-001': {
    productKey: 'kit' as const,
    currency: 'EUR',
    allowedAmountsMinor: [1499],
    offerVersion: 'interactive_v5',
  },
  'prod-ent-002': {
    productKey: 'entrevista' as const,
    currency: 'EUR',
    allowedAmountsMinor: [499],
    offerVersion: 'interactive_v5',
  },
};

describe('End-to-End: Compra OKANDA -> Acesso -> Ativação (3x24h) -> Edição CV -> PDF', () => {
  beforeEach(() => {
    store.clear();
  });

  it('executa o ciclo completo de compra, acesso, limites e geração de PDF', async () => {
    const buyerEmail = 'compradora.teste@exemplo.pt';
    const stamp = '2026-09-12T22:00:46.000Z';
    const nowMs = Date.parse(stamp);

    // 1. Simulação do Webhook assinado da OKANDA (Kit: 14,99 €)
    const salePayload = {
      event: 'sale.paid',
      event_id: 'sale-okanda-1001',
      occurred_at: stamp,
      sale: {
        id: 'sale-okanda-1001',
        product_id: 'prod-kit-001',
        product_name: 'Kit Emprego dos Sonhos',
        amount: 14.99,
        currency: 'EUR',
        payment_method: 'MULTIBANCO',
        payment_reference: '123456789',
        affiliate_id: null,
      },
      customer: {
        name: 'Maria Candidata',
        email: buyerEmail,
        phone: '+351910000000',
      },
    };

    const rawBody = Buffer.from(JSON.stringify(salePayload));
    const signature =
      'sha256=' +
      createHmac('sha256', signingSecret)
        .update(stamp + '.')
        .update(rawBody)
        .digest('hex');

    const verifiedSale = verifySalePaid({
      rawBody,
      headers: {
        'content-type': 'application/json',
        'x-okanda-timestamp': stamp,
        'x-okanda-event': 'sale.paid',
        'x-okanda-signature': signature,
      },
      secrets: [signingSecret],
      nowMs,
      productMap,
      amountUnit: 'major',
    });

    expect(verifiedSale.email).toBe(buyerEmail);
    expect(verifiedSale.amountMinor).toBe(1499);
    expect(verifiedSale.productKey).toBe('kit');

    // 2. Persistência transacional do webhook e do direito (entitlement)
    const webhookResult = store.processSalePaidWebhook(verifiedSale);
    expect(webhookResult.status).toBe('inserted');

    // Replay do mesmo evento é idempotente e já processado
    const replayResult = store.processSalePaidWebhook(verifiedSale);
    expect(replayResult.status).toBe('already_processed');

    // 3. Autenticação e claim do utilizador
    const userSubject = 'usr_maria_candidata_123';
    const claimedCount = store.claimEntitlements(buyerEmail, userSubject);
    expect(claimedCount).toBe(1);

    const userEntitlements = store.getEntitlementsBySubject(userSubject);
    expect(userEntitlements.length).toBe(1);
    const kitEnt = userEntitlements[0];
    expect(kitEnt.productKey).toBe('kit');
    expect(kitEnt.activationsUsed).toBe(0);
    expect(kitEnt.maxActivations).toBe(3);

    // 4. Primeira ativação de sessão de trabalho (Janela 1 de 24h)
    const req1 = '00000000-0000-4000-8000-000000000001';
    const act1 = store.openWorkWindow(kitEnt.id, userSubject, req1, nowMs);
    expect(act1.outcome).toBe('create');
    expect(act1.activationsUsed).toBe(1);
    expect(act1.remaining).toBe(2);
    expect(act1.window.expiresAtMs).toBe(nowMs + 24 * 3600000);

    // 5. Retoma de sessão na mesma janela (refresh de página ou nova aba) — NÃO CONSOME ACESSOS
    const act1Resume = store.openWorkWindow(kitEnt.id, userSubject, '00000000-0000-4000-8000-000000000002', nowMs + 2 * 3600000);
    expect(act1Resume.outcome).toBe('resume');
    expect(act1Resume.activationsUsed).toBe(1);
    expect(act1Resume.remaining).toBe(2);

    // 6. Edição e salvamento de rascunho de CV
    const cvDoc = {
      schemaVersion: 1 as const,
      template: 'essencial' as const,
      personal: {
        name: 'Maria Candidata',
        email: buyerEmail,
        phone: '+351 910 000 000',
        city: 'Porto, Portugal',
        targetRole: 'Gestora de Projetos Júnior',
      },
      summary: 'Profissional orientada a resultados com experiência em organização de processos e coordenação de equipas.',
      experience: [
        {
          id: 'exp-1',
          role: 'Assistente de Coordenação',
          organization: 'Projetos Norte Lda',
          start: '2023-03',
          end: '2025-12',
          bullets: [
            'Coordenação do cronograma de 12 projetos em simultâneo.',
            'Elaboração de atas executivas e contacto com fornecedores.',
          ],
        },
      ],
      education: [
        {
          qualification: 'Licenciatura em Gestão',
          institution: 'Universidade do Porto',
          period: '2022',
        },
      ],
      skills: ['Gestão de Projetos', 'Scrum', 'Excel Avançado', 'Comunicação'],
    };

    const savedDraft = store.saveCVDraft('draft-maria', userSubject, kitEnt.id, cvDoc);
    expect(savedDraft.version).toBe(1);

    // 7. Geração de PDF A4 a partir do rascunho
    const pdfBuffer = generateCvPdf(savedDraft.document as any);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);

    // Verificação de texto no PDF gerado
    const parsedPdf = await parseDocument(pdfBuffer, 'cv_maria.pdf', 'application/pdf');
    expect(parsedPdf.success).toBe(true);
    expect(parsedPdf.text).toContain('Maria Candidata');
    expect(parsedPdf.text).toContain('GESTORA DE PROJETOS JÚNIOR');
    expect(parsedPdf.text).toContain('Porto, Portugal');

    // Ficheiro guardado na conta do utilizador
    const storedFile = store.saveFile(userSubject, kitEnt.id, 'cv_maria_candidata.pdf', 'application/pdf', pdfBuffer, 1);
    expect(storedFile.id).toBeDefined();

    // 8. Simular expiração da Janela 1 (passadas 25 horas) e abertura da Janela 2
    const time25hLater = nowMs + 25 * 3600000;
    const req2 = '00000000-0000-4000-8000-000000000003';
    const act2 = store.openWorkWindow(kitEnt.id, userSubject, req2, time25hLater);
    expect(act2.outcome).toBe('create');
    expect(act2.activationsUsed).toBe(2);
    expect(act2.remaining).toBe(1);

    // 9. Simular expiração da Janela 2 e abertura da Janela 3 (última permitida)
    const time50hLater = nowMs + 50 * 3600000;
    const req3 = '00000000-0000-4000-8000-000000000004';
    const act3 = store.openWorkWindow(kitEnt.id, userSubject, req3, time50hLater);
    expect(act3.outcome).toBe('create');
    expect(act3.activationsUsed).toBe(3);
    expect(act3.remaining).toBe(0);

    // 10. Simular expiração da Janela 3 e tentativa de quarta janela (deve falhar por limite esgotado)
    const time75hLater = nowMs + 75 * 3600000;
    const req4 = '00000000-0000-4000-8000-000000000005';
    expect(() => store.openWorkWindow(kitEnt.id, userSubject, req4, time75hLater)).toThrowError(
      expect.objectContaining({ code: 'ACTIVATION_LIMIT_REACHED' })
    );

    // 11. Preservação de recuperação: mesmo com limites esgotados, o PDF previamente criado é recuperado!
    const retrievedFile = store.getFile(storedFile.id, userSubject);
    expect(retrievedFile).toBeDefined();
    expect(retrievedFile?.filename).toBe('cv_maria_candidata.pdf');
    expect(retrievedFile?.data.length).toBe(pdfBuffer.length);
  });
});
