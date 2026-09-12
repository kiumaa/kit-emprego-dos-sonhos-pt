import { describe, it, expect } from 'vitest';
import { createHmac } from 'node:crypto';
import {
  verifySalePaid,
  majorToMinor,
  replayDecision,
  WebhookError,
  ProductMapping,
} from '../okanda-verifier';

const fixture = {
  event: 'sale.paid',
  event_id: 'example-sale-kit-001',
  occurred_at: '2026-09-12T22:00:46.000Z',
  sale: {
    id: 'example-sale-kit-001',
    product_id: 'example-product-kit',
    product_name: 'Kit Emprego dos Sonhos — Portugal',
    amount: 14.99,
    currency: 'EUR',
    payment_method: 'EXAMPLE_ONLY',
    payment_reference: 'example-payment-001',
    affiliate_id: null,
  },
  customer: {
    name: 'Pessoa Exemplo',
    email: 'comprador@example.com',
    phone: null,
  },
};

const secret = 'synthetic-test-key-only-never-use-in-production';
const stamp = '2026-09-12T22:00:46.000Z';
const now = Date.parse(stamp);
const map: Record<string, ProductMapping> = {
  'example-product-kit': {
    productKey: 'kit',
    currency: 'EUR',
    allowedAmountsMinor: [1499],
    offerVersion: 'interactive_v5',
  },
};

function request(payload: any = fixture, overrides: any = {}) {
  const rawBody = Buffer.from(JSON.stringify(payload));
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Okanda-Timestamp': stamp,
    'X-Okanda-Event': payload.event,
    'X-Okanda-Signature':
      'sha256=' +
      createHmac('sha256', secret)
        .update(stamp + '.')
        .update(rawBody)
        .digest('hex'),
  };
  return {
    rawBody,
    headers,
    secrets: [secret],
    nowMs: now,
    productMap: map,
    amountUnit: 'major' as const,
    ...overrides,
  };
}

const clone = () => structuredClone(fixture);

describe('okanda-verifier', () => {
  it('webhook válido e normalização email', () => {
    const p = clone();
    p.customer.email = ' COMPRADOR@EXAMPLE.COM ';
    const a = verifySalePaid(request(p));
    expect(a.email).toBe('comprador@example.com');
    expect(a.amountMinor).toBe(1499);
    expect(a.productKey).toBe('kit');
  });

  it('header Headers e casing insensível', () => {
    const a = request();
    a.headers = new Headers(a.headers);
    expect(verifySalePaid(a).saleId).toBe(fixture.sale.id);
  });

  it('assinatura ausente recusada', () => {
    const a = request();
    delete a.headers['X-Okanda-Signature'];
    expect(() => verifySalePaid(a)).toThrowError(
      expect.objectContaining({ code: 'MISSING_OR_INVALID_SIGNATURE' })
    );
  });

  it('body adulterado recusado', () => {
    const a = request();
    a.rawBody = Buffer.from(a.rawBody.toString().replace('14.99', '0.99'));
    expect(() => verifySalePaid(a)).toThrowError(
      expect.objectContaining({ code: 'SIGNATURE_MISMATCH' })
    );
  });

  it('reformatar JSON quebra assinatura', () => {
    const a = request();
    a.rawBody = Buffer.from(JSON.stringify(fixture, null, 2));
    expect(() => verifySalePaid(a)).toThrowError(
      expect.objectContaining({ code: 'SIGNATURE_MISMATCH' })
    );
  });

  it('secret errado recusado', () => {
    expect(() =>
      verifySalePaid(request(fixture, { secrets: ['wrong-key-that-is-long-enough'] }))
    ).toThrowError(expect.objectContaining({ code: 'SIGNATURE_MISMATCH' }));
  });

  it('secret em rotação aceite', () => {
    expect(
      verifySalePaid(
        request(fixture, { secrets: ['other-long-secret-for-rotation', secret] })
      ).eventId
    ).toBe(fixture.event_id);
  });

  it('secret não configurado', () => {
    expect(() => verifySalePaid(request(fixture, { secrets: [] }))).toThrowError(
      expect.objectContaining({ code: 'SIGNING_NOT_CONFIGURED' })
    );
  });

  it('timestamp antigo recusado', () => {
    expect(() =>
      verifySalePaid(request(fixture, { nowMs: now + 301000 }))
    ).toThrowError(expect.objectContaining({ code: 'STALE_OR_FUTURE_EVENT' }));
  });

  it('timestamp futuro recusado', () => {
    expect(() =>
      verifySalePaid(request(fixture, { nowMs: now - 301000 }))
    ).toThrowError(expect.objectContaining({ code: 'STALE_OR_FUTURE_EVENT' }));
  });

  it('unidade monetária não confirmada', () => {
    expect(() =>
      verifySalePaid(request(fixture, { amountUnit: undefined as any }))
    ).toThrowError(expect.objectContaining({ code: 'AMOUNT_UNIT_NOT_VERIFIED' }));
  });

  it('content-type inválido', () => {
    const a = request();
    a.headers['Content-Type'] = 'text/plain';
    expect(() => verifySalePaid(a)).toThrowError(
      expect.objectContaining({ code: 'INVALID_CONTENT_TYPE' })
    );
  });

  it('body excessivo', () => {
    expect(() =>
      verifySalePaid(request(fixture, { rawBody: Buffer.alloc(65537) }))
    ).toThrowError(expect.objectContaining({ code: 'INVALID_BODY_SIZE' }));
  });

  it('produto não mapeado', () => {
    const p = clone();
    p.sale.product_id = 'outro';
    expect(() => verifySalePaid(request(p))).toThrowError(
      expect.objectContaining({ code: 'UNMAPPED_PRODUCT' })
    );
  });

  it('propriedades herdadas não autorizam produto', () => {
    const p = clone();
    p.sale.product_id = 'toString';
    expect(() => verifySalePaid(request(p))).toThrowError(
      expect.objectContaining({ code: 'UNMAPPED_PRODUCT' })
    );
  });

  it('moeda diferente recusada', () => {
    const p = clone();
    p.sale.currency = 'AOA';
    expect(() => verifySalePaid(request(p))).toThrowError(
      expect.objectContaining({ code: 'CURRENCY_MISMATCH' })
    );
  });

  it('preço não aprovado recusado', () => {
    const p = clone();
    p.sale.amount = 0.99;
    expect(() => verifySalePaid(request(p))).toThrowError(
      expect.objectContaining({ code: 'PRICE_NOT_APPROVED' })
    );
  });

  it('email inválido recusado', () => {
    const p = clone();
    p.customer.email = 'comprador';
    expect(() => verifySalePaid(request(p))).toThrowError(
      expect.objectContaining({ code: 'INVALID_EMAIL' })
    );
  });

  it('event_id precisa corresponder à venda', () => {
    const p = clone();
    p.event_id = 'diferente';
    expect(() => verifySalePaid(request(p))).toThrowError(
      expect.objectContaining({ code: 'INVALID_SALE_ID' })
    );
  });

  it('evento legado não aceite', () => {
    const p = clone();
    p.event = 'sale.completed';
    expect(() => verifySalePaid(request(p))).toThrowError(
      expect.objectContaining({ code: 'UNSUPPORTED_EVENT' })
    );
  });

  it('header event tem de corresponder ao body assinado', () => {
    const a = request();
    a.headers['X-Okanda-Event'] = 'sale.refunded';
    expect(() => verifySalePaid(a)).toThrowError(
      expect.objectContaining({ code: 'UNSUPPORTED_EVENT' })
    );
  });

  it('conversão monetária sem truncamento', () => {
    expect(majorToMinor(4.99)).toBe(499);
    expect(majorToMinor('5.99')).toBe(599);
    expect(majorToMinor(15)).toBe(1500);
    expect(() => majorToMinor(14.999)).toThrowError(
      expect.objectContaining({ code: 'INVALID_AMOUNT' })
    );
  });

  it('evento novo pode inserir', () => {
    expect(replayDecision(null, 'a'.repeat(64))).toBe('insert');
  });

  it('replay idêntico não concede novamente', () => {
    expect(replayDecision('a'.repeat(64), 'a'.repeat(64))).toBe('already_processed');
  });

  it('mesmo ID com corpo diferente não concede', () => {
    expect(() => replayDecision('a'.repeat(64), 'b'.repeat(64))).toThrowError(
      expect.objectContaining({ code: 'EVENT_ID_CONFLICT' })
    );
  });
});
