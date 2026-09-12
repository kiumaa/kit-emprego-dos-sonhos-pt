import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createHash } from 'node:crypto';
import { store } from '@/server/db/store';
import * as sessionModule from '@/server/auth/session';
import { GET as getResourcesHandler } from '@/app/api/me/resources/route';
import { GET as getDownloadHandler } from '@/app/api/me/downloads/[id]/route';
import { NextRequest } from 'next/server';

describe('Entrega de Materiais e Downloads Seguros (/api/me/downloads)', () => {
  const buyerEmail = 'comprador@keds.pt';
  const buyerSubject = `sub_${buyerEmail}`;
  let mockSession: sessionModule.VerifiedSession | null = null;

  function grantEntitlement(productKey: 'kit' | 'entrevista' | 'linkedin', saleId: string) {
    const bodyDigest = createHash('sha256').update(saleId).digest('hex');
    store.processSalePaidWebhook({
      eventId: `evt_${saleId}`,
      saleId,
      productId: `prod_${productKey}`,
      productKey,
      productName: productKey === 'kit' ? 'Kit Emprego' : productKey === 'entrevista' ? 'Entrevista' : 'LinkedIn',
      email: buyerEmail,
      amountMinor: productKey === 'kit' ? 1499 : productKey === 'entrevista' ? 499 : 599,
      currency: 'EUR',
      offerVersion: 'v5',
      bodyDigest,
    });
    store.claimEntitlements(buyerEmail, buyerSubject);
  }

  beforeEach(() => {
    store.clear();
    mockSession = {
      subject: buyerSubject,
      email: buyerEmail,
    };
    vi.spyOn(sessionModule, 'getVerifiedSession').mockImplementation(async () => mockSession);
  });

  it('recusa pedidos sem sessão autenticada com 401', async () => {
    mockSession = null;
    const res = await getResourcesHandler();
    expect(res.status).toBe(401);
  });

  it('lista apenas os ficheiros do Kit quando o utilizador só comprou o Kit', async () => {
    grantEntitlement('kit', 'sale_kit_123');

    const res = await getResourcesHandler();
    const data = await res.json();

    expect(data.ok).toBe(true);
    expect(data.resources.length).toBeGreaterThanOrEqual(14);

    // Verifica que contém o pacote ZIP do Kit
    const zip = data.resources.find((r: any) => r.id === 'kit-principal-zip');
    expect(zip).toBeDefined();
    expect(zip.isZip).toBe(true);

    // Verifica que NÃO contém os bumps
    const entrevistaRes = data.resources.find((r: any) => r.entitlement === 'entrevista');
    expect(entrevistaRes).toBeUndefined();
  });

  it('permite descarregar o pacote ZIP do Kit e modelos DOCX', async () => {
    grantEntitlement('kit', 'sale_kit_123');

    // Teste download ZIP
    const reqZip = new NextRequest('http://localhost:3000/api/me/downloads/kit-principal-zip');
    const resZip = await getDownloadHandler(reqZip, {
      params: Promise.resolve({ id: 'kit-principal-zip' }),
    });

    expect(resZip.status).toBe(200);
    expect(resZip.headers.get('Content-Type')).toBe('application/zip');
    expect(resZip.headers.get('Content-Disposition')).toContain('kit-principal-keds-portugal.zip');

    // Teste download DOCX
    const reqDocx = new NextRequest('http://localhost:3000/api/me/downloads/cv-essencial-modelo-docx');
    const resDocx = await getDownloadHandler(reqDocx, {
      params: Promise.resolve({ id: 'cv-essencial-modelo-docx' }),
    });

    expect(resDocx.status).toBe(200);
    expect(resDocx.headers.get('Content-Type')).toContain('openxmlformats');
    expect(resDocx.headers.get('Content-Disposition')).toContain('cv-essencial-modelo.docx');
  });

  it('rejeita download de bumps não adquiridos com 403 Forbidden', async () => {
    grantEntitlement('kit', 'sale_kit_123');

    const reqBump = new NextRequest('http://localhost:3000/api/me/downloads/bump-entrevista-zip');
    const resBump = await getDownloadHandler(reqBump, {
      params: Promise.resolve({ id: 'bump-entrevista-zip' }),
    });

    expect(resBump.status).toBe(403);
    const data = await resBump.json();
    expect(data.error).toBe('FORBIDDEN');
  });

  it('permite descarregar bump quando o comprador tem o direito ativo', async () => {
    grantEntitlement('entrevista', 'sale_ent_456');

    const reqBump = new NextRequest('http://localhost:3000/api/me/downloads/bump-entrevista-zip');
    const resBump = await getDownloadHandler(reqBump, {
      params: Promise.resolve({ id: 'bump-entrevista-zip' }),
    });

    expect(resBump.status).toBe(200);
    expect(resBump.headers.get('Content-Disposition')).toContain('bump-entrevista-dos-sonhos.zip');
  });
});
