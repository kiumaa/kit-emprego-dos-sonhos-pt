/**
 * Lógica de política de acessos e janelas de trabalho — TypeScript estrito.
 * O servidor deve executá-la sob lock/transação ou usar db/002.
 */
export class AccessError extends Error {
  code: string;
  constructor(code: string) {
    super(code);
    this.name = 'AccessError';
    this.code = code;
  }
}

function fail(code: string): never {
  throw new AccessError(code);
}

const integer = (value: unknown): value is number => Number.isSafeInteger(value);

export interface WorkWindow {
  id: string;
  entitlementId: string;
  ordinal?: number;
  startsAtMs?: number;
  expiresAtMs: number;
  revoked?: boolean;
}

export interface Entitlement {
  id: string;
  subject: string | null;
  status: 'active' | 'revoked';
  used: number;
  max: number | null;
  windowHours: number;
  accessExpiresAtMs: number | null;
}

function validateWindow(window: WorkWindow, entitlementId: string): void {
  if (
    !window ||
    typeof window.id !== 'string' ||
    window.entitlementId !== entitlementId ||
    !Number.isFinite(window.expiresAtMs)
  ) {
    fail('INVALID_WINDOW');
  }
}

export interface DecideActivationArgs {
  entitlement: Entitlement | null;
  subject: string | null;
  nowMs: number;
  requestId: string | null;
  previousRequestWindow?: WorkWindow | null;
  activeWindow?: WorkWindow | null;
}

export type ActivationDecision =
  | {
      kind: 'create';
      consumed: true;
      ordinal: number;
      startsAtMs: number;
      expiresAtMs: number;
      remaining: number | null;
    }
  | {
      kind: 'resume';
      window: WorkWindow;
      consumed: false;
      remaining: number | null;
    }
  | {
      kind: 'expired_replay';
      window: WorkWindow;
      consumed: false;
      remaining: number | null;
    };

/**
 * Identidade deve vir de sessão verificada, NUNCA do body HTTP.
 */
export function decideActivation(args: DecideActivationArgs): ActivationDecision {
  const { entitlement: e, subject, nowMs, requestId, previousRequestWindow = null, activeWindow = null } = args;

  if (!subject || !e || e.subject !== subject) {
    fail('FORBIDDEN');
  }
  if (e.status !== 'active') {
    fail('ENTITLEMENT_INACTIVE');
  }
  if (
    !Number.isFinite(nowMs) ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId ?? '')
  ) {
    fail('INVALID_REQUEST');
  }
  if (
    !integer(e.used) ||
    e.used < 0 ||
    !(e.max === null || (integer(e.max) && e.max >= 1)) ||
    !integer(e.windowHours) ||
    e.windowHours < 1 ||
    e.windowHours > 168
  ) {
    fail('INVALID_POLICY');
  }
  if (e.accessExpiresAtMs != null && (!Number.isFinite(e.accessExpiresAtMs) || e.accessExpiresAtMs <= nowMs)) {
    fail('ACCESS_EXPIRED');
  }

  const remaining = e.max === null ? null : Math.max(0, e.max - e.used);

  if (previousRequestWindow) {
    validateWindow(previousRequestWindow, e.id);
    return {
      kind: previousRequestWindow.revoked || previousRequestWindow.expiresAtMs <= nowMs ? 'expired_replay' : 'resume',
      window: previousRequestWindow,
      consumed: false,
      remaining,
    };
  }

  if (activeWindow) {
    validateWindow(activeWindow, e.id);
    if (!activeWindow.revoked && activeWindow.expiresAtMs > nowMs) {
      return {
        kind: 'resume',
        window: activeWindow,
        consumed: false,
        remaining,
      };
    }
  }

  if (e.max !== null && e.used >= e.max) {
    fail('ACTIVATION_LIMIT_REACHED');
  }

  const expiresAtMs = Math.min(nowMs + e.windowHours * 3600000, e.accessExpiresAtMs ?? Infinity);

  return {
    kind: 'create',
    consumed: true,
    ordinal: e.used + 1,
    startsAtMs: nowMs,
    expiresAtMs,
    remaining: e.max === null ? null : e.max - e.used - 1,
  };
}

/**
 * Consulta de trabalho existente não autoriza nova escrita, IA ou export de novo conteúdo.
 */
export function canReadExisting(args: {
  entitlement: Entitlement | null;
  subject: string | null;
  nowMs: number;
}): boolean {
  const { entitlement: e, subject, nowMs } = args;
  return Boolean(
    e &&
      subject &&
      e.subject === subject &&
      e.status === 'active' &&
      (e.accessExpiresAtMs == null || e.accessExpiresAtMs > nowMs)
  );
}
