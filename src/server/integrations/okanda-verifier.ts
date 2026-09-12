/**
 * Núcleo de verificação do Webhook OKANDA — TypeScript estrito.
 * Sem dependências externas além de node:crypto.
 * Contrato observado: OKANDA b51efa1, producer-webhooks.ts + complete-checkout.
 */
import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

export class WebhookError extends Error {
  code: string;
  constructor(code: string) {
    super(code);
    this.name = 'WebhookError';
    this.code = code;
  }
}

function fail(code: string): never {
  throw new WebhookError(code);
}

function header(headers: Headers | Record<string, string | string[] | undefined> | null | undefined, name: string): string | null {
  if (!headers) return null;
  if (typeof (headers as Headers).get === 'function') {
    return (headers as Headers).get(name);
  }
  const matches = Object.entries(headers as Record<string, string | string[] | undefined>).filter(
    ([key]) => key.toLowerCase() === name.toLowerCase()
  );
  if (matches.length !== 1) return null;
  const val = matches[0][1];
  if (typeof val !== 'string') return null;
  return val;
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function text(value: unknown, max = 200): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}

export function majorToMinor(value: unknown): number {
  const s: unknown = typeof value === 'number' && Number.isFinite(value) ? String(value) : value;
  if (typeof s !== 'string' || !/^\d{1,9}(?:\.\d{1,2})?$/.test(s)) {
    fail('INVALID_AMOUNT');
  }
  const [whole, fraction = ''] = s.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents) || cents <= 0) {
    fail('INVALID_AMOUNT');
  }
  return cents;
}

export interface ProductMapping {
  productKey: 'kit' | 'entrevista' | 'linkedin';
  currency: string;
  allowedAmountsMinor: number[];
  offerVersion: string;
}

export interface VerifySalePaidArgs {
  rawBody: Buffer;
  headers: Headers | Record<string, string | string[] | undefined>;
  secrets: string[];
  nowMs: number;
  productMap: Record<string, ProductMapping>;
  amountUnit: 'major';
  toleranceSeconds?: number;
}

export interface VerifiedSalePaid {
  eventId: string;
  saleId: string;
  productId: string;
  productKey: 'kit' | 'entrevista' | 'linkedin';
  email: string;
  amountMinor: number;
  currency: string;
  offerVersion: string;
  bodyDigest: string;
  occurredAt: string;
}

export function verifySalePaid(args: VerifySalePaidArgs): VerifiedSalePaid {
  const { rawBody, headers, secrets, nowMs, productMap, amountUnit } = args;
  const tolerance = args.toleranceSeconds ?? 300;

  if (!Number.isFinite(nowMs) || !Number.isFinite(tolerance) || tolerance <= 0) {
    fail('INVALID_CLOCK_CONFIG');
  }
  if (!Buffer.isBuffer(rawBody) || rawBody.length === 0 || rawBody.length > 65536) {
    fail('INVALID_BODY_SIZE');
  }
  if (!Array.isArray(secrets) || secrets.length === 0 || secrets.some((s) => typeof s !== 'string' || s.trim().length < 16)) {
    fail('SIGNING_NOT_CONFIGURED');
  }
  if (amountUnit !== 'major') {
    fail('AMOUNT_UNIT_NOT_VERIFIED');
  }

  const contentType = header(headers, 'content-type');
  if (!contentType || contentType.split(';')[0].trim().toLowerCase() !== 'application/json') {
    fail('INVALID_CONTENT_TYPE');
  }

  const stamp = header(headers, 'x-okanda-timestamp');
  const signature = header(headers, 'x-okanda-signature');
  const eventHeader = header(headers, 'x-okanda-event');

  if (!stamp || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(stamp)) {
    fail('INVALID_TIMESTAMP');
  }
  const parsedTime = Date.parse(stamp);
  if (!Number.isFinite(parsedTime) || new Date(parsedTime).toISOString() !== stamp || Math.abs(nowMs - parsedTime) > tolerance * 1000) {
    fail('STALE_OR_FUTURE_EVENT');
  }

  if (!signature || !/^sha256=[a-f0-9]{64}$/.test(signature)) {
    fail('MISSING_OR_INVALID_SIGNATURE');
  }
  const supplied = Buffer.from(signature.slice(7), 'hex');
  let valid = false;
  for (const secret of secrets) {
    const expected = createHmac('sha256', secret.trim()).update(stamp + '.').update(rawBody).digest();
    valid = timingSafeEqual(expected, supplied) || valid;
  }
  if (!valid) {
    fail('SIGNATURE_MISMATCH');
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(rawBody));
  } catch {
    fail('INVALID_JSON');
  }

  if (!record(payload) || payload.event !== 'sale.paid' || eventHeader !== payload.event) {
    fail('UNSUPPORTED_EVENT');
  }
  if (!text(payload.event_id) || !record(payload.sale) || !record(payload.customer)) {
    fail('INVALID_PAYLOAD');
  }

  const sale = payload.sale;
  const customer = payload.customer;

  if (!text(sale.id) || payload.event_id !== sale.id || !text(sale.product_id)) {
    fail('INVALID_SALE_ID');
  }
  if (!text(customer.email, 254)) {
    fail('INVALID_EMAIL');
  }

  const email = (customer.email as string).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail('INVALID_EMAIL');
  }
  if (!text(payload.occurred_at, 40) || !Number.isFinite(Date.parse(payload.occurred_at as string))) {
    fail('INVALID_OCCURRED_AT');
  }
  if (!record(productMap) || !Object.hasOwn(productMap, sale.product_id as string)) {
    fail('UNMAPPED_PRODUCT');
  }

  const product = productMap[sale.product_id as string];
  if (!record(product) || !['kit', 'entrevista', 'linkedin'].includes(product.productKey) || !text(product.offerVersion, 80)) {
    fail('INVALID_PRODUCT_CONFIG');
  }
  if (sale.currency !== product.currency || !/^[A-Z]{3}$/.test(sale.currency as string)) {
    fail('CURRENCY_MISMATCH');
  }

  const amountMinor = majorToMinor(sale.amount);
  if (!Array.isArray(product.allowedAmountsMinor) || !product.allowedAmountsMinor.includes(amountMinor)) {
    fail('PRICE_NOT_APPROVED');
  }

  return {
    eventId: payload.event_id as string,
    saleId: sale.id as string,
    productId: sale.product_id as string,
    productKey: product.productKey as 'kit' | 'entrevista' | 'linkedin',
    email,
    amountMinor,
    currency: sale.currency as string,
    offerVersion: product.offerVersion,
    bodyDigest: createHash('sha256').update(rawBody).digest('hex'),
    occurredAt: payload.occurred_at as string,
  };
}

/**
 * Usar depois da verificação; persistir esta decisão na transação com o direito.
 */
export function replayDecision(existingDigest: string | null | undefined, incomingDigest: string): 'insert' | 'already_processed' {
  if (!/^[a-f0-9]{64}$/.test(incomingDigest)) {
    fail('INVALID_BODY_DIGEST');
  }
  if (existingDigest == null) return 'insert';
  if (existingDigest === incomingDigest) return 'already_processed';
  fail('EVENT_ID_CONFLICT');
}
