import { describe, it, expect } from 'vitest';
import {
  decideActivation,
  canReadExisting,
  Entitlement,
  WorkWindow,
} from '../access-policy';

const now = Date.parse('2026-09-12T22:00:46.000Z');
const ent = (used = 0): Entitlement => ({
  id: 'ent-kit',
  subject: 'user_verified',
  status: 'active',
  used,
  max: 3,
  windowHours: 24,
  accessExpiresAtMs: null,
});
const rid = '00000000-0000-4000-8000-000000000001';
const act = (e = ent(), extra: any = {}) => ({
  entitlement: e,
  subject: 'user_verified',
  requestId: rid,
  nowMs: now,
  ...extra,
});
const window = (expiresAtMs = now + 10000): WorkWindow => ({
  id: 'window-1',
  entitlementId: 'ent-kit',
  expiresAtMs,
});

describe('access-policy', () => {
  it('primeira ativação permitida', () => {
    const a = decideActivation(act());
    expect(a.kind).toBe('create');
    if (a.kind === 'create') {
      expect(a.ordinal).toBe(1);
      expect(a.remaining).toBe(2);
      expect(a.consumed).toBe(true);
    }
  });

  it('segunda ativação permitida', () => {
    const a = decideActivation(act(ent(1)));
    if (a.kind === 'create') {
      expect(a.ordinal).toBe(2);
    }
  });

  it('terceira ativação permitida (sem off-by-one)', () => {
    const a = decideActivation(act(ent(2)));
    if (a.kind === 'create') {
      expect(a.ordinal).toBe(3);
      expect(a.remaining).toBe(0);
    }
  });

  it('quarta NOVA ativação bloqueada', () => {
    expect(() => decideActivation(act(ent(3)))).toThrowError(
      expect.objectContaining({ code: 'ACTIVATION_LIMIT_REACHED' })
    );
  });

  it('janela ativa retoma mesmo com 3 usadas', () => {
    const a = decideActivation(act(ent(3), { activeWindow: window() }));
    expect(a.kind).toBe('resume');
    expect(a.consumed).toBe(false);
  });

  it('repetição do POST ativo não desconta', () => {
    expect(
      decideActivation(act(ent(1), { previousRequestWindow: window() })).consumed
    ).toBe(false);
  });

  it('replay de janela expirada não cria uma nova', () => {
    const a = decideActivation(
      act(ent(1), { previousRequestWindow: window(now - 1) })
    );
    expect(a.kind).toBe('expired_replay');
    expect(a.consumed).toBe(false);
  });

  it('janela expirada com novo request abre segunda', () => {
    const a = decideActivation(
      act(ent(1), { activeWindow: window(now - 1) })
    );
    if (a.kind === 'create') {
      expect(a.ordinal).toBe(2);
    }
  });

  it('outro subject recusado', () => {
    expect(() =>
      decideActivation(act(ent(), { subject: 'outra-pessoa' }))
    ).toThrowError(expect.objectContaining({ code: 'FORBIDDEN' }));
  });

  it('sem autenticação recusado', () => {
    expect(() =>
      decideActivation(act(ent(), { subject: null }))
    ).toThrowError(expect.objectContaining({ code: 'FORBIDDEN' }));
  });

  it('reembolso revoga mesmo janela ainda ativa', () => {
    const e = ent();
    e.status = 'revoked';
    expect(() =>
      decideActivation(act(e, { activeWindow: window() }))
    ).toThrowError(expect.objectContaining({ code: 'ENTITLEMENT_INACTIVE' }));
  });

  it('prazo comercial vencido recusado', () => {
    const e = ent();
    e.accessExpiresAtMs = now;
    expect(() => decideActivation(act(e))).toThrowError(
      expect.objectContaining({ code: 'ACCESS_EXPIRED' })
    );
  });

  it('política pode ser 2, não hardcode 3', () => {
    const e = ent(2);
    e.max = 2;
    expect(() => decideActivation(act(e))).toThrowError(
      expect.objectContaining({ code: 'ACTIVATION_LIMIT_REACHED' })
    );
  });

  it('direito legacy sem limite preservado', () => {
    const e = ent(99);
    e.max = null;
    const a = decideActivation(act(e));
    if (a.kind === 'create') {
      expect(a.ordinal).toBe(100);
    }
  });

  it('limite não impede ficheiros existentes', () => {
    expect(
      canReadExisting({
        entitlement: ent(3),
        subject: 'user_verified',
        nowMs: now,
      })
    ).toBe(true);
  });

  it('ficheiros não acessíveis a outro user', () => {
    expect(
      canReadExisting({
        entitlement: ent(3),
        subject: 'outro',
        nowMs: now,
      })
    ).toBe(false);
  });

  it('janela de outro produto não serve para este', () => {
    expect(() =>
      decideActivation(
        act(ent(), { activeWindow: { ...window(), entitlementId: 'bump' } })
      )
    ).toThrowError(expect.objectContaining({ code: 'INVALID_WINDOW' }));
  });

  it('política inválida não pode ser configurada', () => {
    const e = ent();
    e.max = 0;
    expect(() => decideActivation(act(e))).toThrowError(
      expect.objectContaining({ code: 'INVALID_POLICY' })
    );
  });

  it('UUID de pedido inválido recusado', () => {
    expect(() =>
      decideActivation(act(ent(), { requestId: '-'.repeat(36) }))
    ).toThrowError(expect.objectContaining({ code: 'INVALID_REQUEST' }));
  });

  it('janela não excede expiração comercial', () => {
    const e = ent();
    e.accessExpiresAtMs = now + 1000;
    const a = decideActivation(act(e));
    if (a.kind === 'create') {
      expect(a.expiresAtMs).toBe(now + 1000);
    }
  });
});
