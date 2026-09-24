import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { createHash } from 'node:crypto';
import { store, isTestUserEmail } from '../db/store';
import { POST } from '@/app/api/auth/login/route';
import { verifySessionToken } from '../auth/session';

describe('API /api/auth/login (Acesso Direto por Email)', () => {
  beforeEach(() => {
    store.clear();
  });

  it('permite acesso imediato para teste@exemplo.pt com todas as 3 ferramentas ativas', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'teste@exemplo.pt' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.email).toBe('teste@exemplo.pt');
    expect(data.redirect).toBe('/meu-kit');

    // Cookie de sessão keds_session foi definido
    const cookie = res.cookies.get('keds_session');
    expect(cookie).toBeDefined();
    expect(cookie?.value).toBeTruthy();

    // Sessão decodificável
    const session = verifySessionToken(cookie!.value);
    expect(session).not.toBeNull();
    expect(session?.email).toBe('teste@exemplo.pt');

    // Verifica que o utilizador de teste tem os 3 produtos no store
    const ents = store.getEntitlementsBySubject(session!.subject);
    expect(ents.length).toBe(3);
    const keys = ents.map((e) => e.productKey).sort();
    expect(keys).toEqual(['entrevista', 'kit', 'linkedin']);
  });

  it('recusa email sem compra e sem acesso de teste', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'comprador.fantasma@exemplo.pt' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(404);

    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe('PURCHASE_NOT_FOUND');
  });

  it('permite acesso a comprador real após webhook da OKANDA', async () => {
    const buyerEmail = 'comprador.real@dominio.pt';
    const bodyDigest = createHash('sha256').update('test-sale').digest('hex');

    // Simular webhook da OKANDA
    store.processSalePaidWebhook({
      eventId: 'sale-ok-777',
      saleId: 'sale-777',
      productId: 'prod-kit-001',
      productKey: 'kit',
      email: buyerEmail,
      amountMinor: 1499,
      currency: 'EUR',
      offerVersion: 'interactive_v5',
      occurredAt: new Date().toISOString(),
      bodyDigest,
    });

    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: buyerEmail }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.claimedCount).toBe(1);

    const cookie = res.cookies.get('keds_session');
    expect(cookie).toBeDefined();

    const session = verifySessionToken(cookie!.value);
    const userEnts = store.getEntitlementsBySubject(session!.subject);
    expect(userEnts.length).toBe(1);
    expect(userEnts[0].productKey).toBe('kit');
  });
});
