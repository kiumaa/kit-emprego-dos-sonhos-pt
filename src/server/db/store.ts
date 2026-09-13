/**
 * Camada de persistência e repositório KEDS v5.
 * Suporta modo em memória desacoplado (para testes e ambiente sem DATABASE_URL)
 * e compatibilidade de transação com schema keds_v5.
 */
import { createHash, randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import {
  decideActivation,
  canReadExisting,
  Entitlement as PolicyEntitlement,
  WorkWindow as PolicyWindow,
  ActivationDecision,
} from '../access/access-policy';
import { VerifiedSalePaid, replayDecision } from '../integrations/okanda-verifier';

function getNeonSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  try {
    return neon(url);
  } catch {
    return null;
  }
}

export interface StoredEntitlement {
  id: string;
  provider: string;
  saleId: string;
  productId: string;
  productKey: 'kit' | 'entrevista' | 'linkedin';
  emailLookupKey: string;
  email: string;
  authSubject: string | null;
  status: 'active' | 'revoked';
  amountMinor: number;
  currency: string;
  offerVersion: string;
  policyVersion: string;
  maxActivations: number | null;
  activationsUsed: number;
  windowHours: number;
  accessExpiresAtMs: number | null;
  createdAtMs: number;
}

export interface StoredWorkWindow {
  id: string;
  entitlementId: string;
  ordinal: number;
  startedAtMs: number;
  expiresAtMs: number;
  revokedAtMs: number | null;
}

export interface StoredCVDraft {
  id: string;
  ownerSubject: string;
  entitlementId: string;
  version: number;
  document: Record<string, unknown>;
  updatedAtMs: number;
}

export interface StoredFile {
  id: string;
  ownerSubject: string;
  entitlementId: string;
  filename: string;
  contentType: string;
  data: Buffer;
  sourceVersion?: number;
  createdAtMs: number;
}

export interface WebhookEventRecord {
  provider: string;
  eventId: string;
  eventType: string;
  bodyDigest: string;
  status: 'processed' | 'quarantined';
  receivedAtMs: number;
}

export function hashEmail(email: string): string {
  const pepper = process.env.EMAIL_LOOKUP_PEPPER || 'keds-secret-pepper-for-email-hashing';
  return createHash('sha256')
    .update(email.trim().toLowerCase() + ':' + pepper)
    .digest('hex');
}

export function isTestUserEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    normalized === 'teste@exemplo.pt' ||
    Boolean(process.env.TEST_USER_EMAIL && normalized === process.env.TEST_USER_EMAIL.trim().toLowerCase())
  );
}

class Store {
  private webhookEvents = new Map<string, WebhookEventRecord>();
  private entitlements = new Map<string, StoredEntitlement>();
  private workWindows = new Map<string, StoredWorkWindow>();
  private activationRequests = new Map<string, string>(); // key: `${entitlementId}:${requestId}` -> windowId
  private cvDrafts = new Map<string, StoredCVDraft>();
  private files = new Map<string, StoredFile>();
  private subjectToEmail = new Map<string, string>();

  // Helper para testes e resets controlados
  clear() {
    this.webhookEvents.clear();
    this.entitlements.clear();
    this.workWindows.clear();
    this.activationRequests.clear();
    this.cvDrafts.clear();
    this.files.clear();
    this.subjectToEmail.clear();
  }

  seedTestEntitlementsIfApplicable(email: string, subject: string) {
    if (!isTestUserEmail(email)) return;
    this.subjectToEmail.set(subject, email.trim().toLowerCase());

    const products: Array<{ key: 'kit' | 'entrevista' | 'linkedin'; price: number }> = [
      { key: 'kit', price: 1499 },
      { key: 'entrevista', price: 499 },
      { key: 'linkedin', price: 599 },
    ];

    const now = Date.now();
    const expires24h = now + 24 * 60 * 60 * 1000;

    for (const p of products) {
      const entId = `test_ent_${p.key}_${subject}`;
      const existing = this.entitlements.get(entId);
      if (!existing) {
        const ent: StoredEntitlement = {
          id: entId,
          provider: 'test_portal',
          saleId: `sale_test_${p.key}`,
          productId: `prod_${p.key}`,
          productKey: p.key,
          emailLookupKey: hashEmail(email),
          email: email.trim().toLowerCase(),
          authSubject: subject,
          status: 'active',
          amountMinor: p.price,
          currency: 'EUR',
          offerVersion: 'v5_standard',
          policyVersion: 'v5_standard',
          maxActivations: 3,
          activationsUsed: 1,
          windowHours: 24,
          accessExpiresAtMs: null,
          createdAtMs: now,
        };
        this.entitlements.set(entId, ent);

        const windowId = `test_win_${p.key}_${subject}`;
        this.workWindows.set(windowId, {
          id: windowId,
          entitlementId: entId,
          ordinal: 1,
          startedAtMs: now,
          expiresAtMs: expires24h,
          revokedAtMs: null,
        });
      } else {
        existing.authSubject = subject;
        existing.status = 'active';
        const activeWin = this.getActiveWindow(entId, now);
        if (!activeWin) {
          const windowId = `test_win_${p.key}_${subject}`;
          this.workWindows.set(windowId, {
            id: windowId,
            entitlementId: entId,
            ordinal: existing.activationsUsed || 1,
            startedAtMs: now,
            expiresAtMs: expires24h,
            revokedAtMs: null,
          });
        }
      }
    }
  }

  getWebhookEvent(provider: string, eventId: string): WebhookEventRecord | undefined {
    return this.webhookEvents.get(`${provider}:${eventId}`);
  }

  processSalePaidWebhook(
    verified: VerifiedSalePaid,
    maxActivations = 3,
    windowHours = 24
  ): { status: 'inserted' | 'already_processed' } {
    const key = `okanda:${verified.eventId}`;
    const existing = this.webhookEvents.get(key);

    const decision = replayDecision(existing?.bodyDigest ?? null, verified.bodyDigest);
    if (decision === 'already_processed') {
      return { status: 'already_processed' };
    }

    const now = Date.now();
    this.webhookEvents.set(key, {
      provider: 'okanda',
      eventId: verified.eventId,
      eventType: 'sale.paid',
      bodyDigest: verified.bodyDigest,
      status: 'processed',
      receivedAtMs: now,
    });

    const entitlementId = randomUUID();
    const emailLookupKey = hashEmail(verified.email);

    const entitlement: StoredEntitlement = {
      id: entitlementId,
      provider: 'okanda',
      saleId: verified.saleId,
      productId: verified.productId,
      productKey: verified.productKey,
      emailLookupKey,
      email: verified.email,
      authSubject: null, // Será associado ao autenticar ou no claim
      status: 'active',
      amountMinor: verified.amountMinor,
      currency: verified.currency,
      offerVersion: verified.offerVersion,
      policyVersion: 'v5_standard',
      maxActivations,
      activationsUsed: 0,
      windowHours,
      accessExpiresAtMs: null,
      createdAtMs: now,
    };

    this.entitlements.set(entitlementId, entitlement);
    return { status: 'inserted' };
  }

  addEntitlementDirectly(ent: StoredEntitlement) {
    this.entitlements.set(ent.id, ent);
  }

  hasEntitlementsForEmail(email: string): boolean {
    if (!email) return false;
    if (isTestUserEmail(email)) return true;
    const lookupKey = hashEmail(email);
    for (const ent of this.entitlements.values()) {
      if (ent.emailLookupKey === lookupKey && ent.status === 'active') {
        return true;
      }
    }
    return false;
  }

  async hasEntitlementsForEmailAsync(email: string): Promise<boolean> {
    if (!email) return false;
    if (isTestUserEmail(email)) return true;
    if (this.hasEntitlementsForEmail(email)) return true;

    const sql = getNeonSql();
    if (!sql) return false;

    try {
      const normalized = email.trim().toLowerCase();
      const lookupKey = hashEmail(normalized);
      const rows = await sql`
        SELECT id FROM keds_entitlements
        WHERE (email_lookup_key = ${lookupKey} OR LOWER(email) = ${normalized})
          AND status = 'active'
        LIMIT 1;
      `;
      return rows.length > 0;
    } catch (e) {
      console.error('[DB ERROR hasEntitlementsForEmailAsync]', e);
      return false;
    }
  }

  async saveEntitlementToDbAsync(entitlement: StoredEntitlement): Promise<void> {
    const sql = getNeonSql();
    if (!sql) return;

    try {
      await sql`
        INSERT INTO keds_entitlements (
          id, provider, sale_id, product_id, product_key,
          email_lookup_key, email, auth_subject, status,
          amount_minor, currency, offer_version, policy_version,
          max_activations, activations_used, window_hours,
          access_expires_at_ms, created_at_ms
        ) VALUES (
          ${entitlement.id}, ${entitlement.provider}, ${entitlement.saleId}, ${entitlement.productId}, ${entitlement.productKey},
          ${entitlement.emailLookupKey}, ${entitlement.email}, ${entitlement.authSubject}, ${entitlement.status},
          ${entitlement.amountMinor}, ${entitlement.currency}, ${entitlement.offerVersion}, ${entitlement.policyVersion},
          ${entitlement.maxActivations}, ${entitlement.activationsUsed}, ${entitlement.windowHours},
          ${entitlement.accessExpiresAtMs}, ${entitlement.createdAtMs}
        )
        ON CONFLICT (id) DO UPDATE SET
          status = ${entitlement.status},
          auth_subject = COALESCE(${entitlement.authSubject}, keds_entitlements.auth_subject);
      `;
    } catch (e) {
      console.error('[DB ERROR saveEntitlementToDbAsync]', e);
    }
  }

  async claimEntitlementsAsync(email: string, subject: string): Promise<number> {
    const memoryCount = this.claimEntitlements(email, subject);
    const sql = getNeonSql();
    if (!sql) return memoryCount;

    try {
      const normalized = email.trim().toLowerCase();
      const lookupKey = hashEmail(normalized);
      const rows = await sql`
        UPDATE keds_entitlements
        SET auth_subject = ${subject}
        WHERE (email_lookup_key = ${lookupKey} OR LOWER(email) = ${normalized})
          AND status = 'active'
        RETURNING id;
      `;
      return Math.max(memoryCount, rows.length);
    } catch (e) {
      console.error('[DB ERROR claimEntitlementsAsync]', e);
      return memoryCount;
    }
  }

  async getEntitlementsBySubjectAsync(subject: string): Promise<StoredEntitlement[]> {
    const memoryResults = this.getEntitlementsBySubject(subject);
    const sql = getNeonSql();
    if (!sql) return memoryResults;

    try {
      const rows = await sql`
        SELECT * FROM keds_entitlements
        WHERE auth_subject = ${subject} AND status = 'active';
      `;

      if (rows.length === 0) {
        return memoryResults;
      }

      const map = new Map<string, StoredEntitlement>();
      for (const m of memoryResults) {
        map.set(m.productKey, m);
      }

      for (const r of rows) {
        const ent: StoredEntitlement = {
          id: r.id as string,
          provider: r.provider as string,
          saleId: r.sale_id as string,
          productId: r.product_id as string,
          productKey: r.product_key as 'kit' | 'entrevista' | 'linkedin',
          emailLookupKey: r.email_lookup_key as string,
          email: r.email as string,
          authSubject: r.auth_subject as string | null,
          status: r.status as 'active' | 'revoked',
          amountMinor: Number(r.amount_minor),
          currency: r.currency as string,
          offerVersion: r.offer_version as string,
          policyVersion: r.policy_version as string,
          maxActivations: r.max_activations as number | null,
          activationsUsed: Number(r.activations_used),
          windowHours: Number(r.window_hours),
          accessExpiresAtMs: r.access_expires_at_ms ? Number(r.access_expires_at_ms) : null,
          createdAtMs: Number(r.created_at_ms),
        };
        map.set(ent.productKey, ent);
        this.entitlements.set(ent.id, ent);
      }

      return Array.from(map.values());
    } catch (e) {
      console.error('[DB ERROR getEntitlementsBySubjectAsync]', e);
      return memoryResults;
    }
  }

  claimEntitlements(email: string, subject: string): number {
    this.seedTestEntitlementsIfApplicable(email, subject);
    const lookupKey = hashEmail(email);
    let count = 0;
    for (const ent of this.entitlements.values()) {
      if (ent.emailLookupKey === lookupKey && ent.status === 'active') {
        ent.authSubject = subject;
        count++;
      }
    }
    return count;
  }

  getEntitlementsBySubject(subject: string): StoredEntitlement[] {
    const email = this.subjectToEmail.get(subject);
    if (email) {
      this.seedTestEntitlementsIfApplicable(email, subject);
    }
    const results: StoredEntitlement[] = [];
    for (const ent of this.entitlements.values()) {
      if (ent.authSubject === subject) {
        results.push({ ...ent });
      }
    }
    return results;
  }

  getEntitlementById(id: string): StoredEntitlement | undefined {
    const ent = this.entitlements.get(id);
    return ent ? { ...ent } : undefined;
  }

  getEntitlementForProduct(subject: string, productKey: 'kit' | 'entrevista' | 'linkedin'): StoredEntitlement | undefined {
    const email = this.subjectToEmail.get(subject);
    if (email) {
      this.seedTestEntitlementsIfApplicable(email, subject);
    }
    for (const ent of this.entitlements.values()) {
      if (ent.authSubject === subject && ent.productKey === productKey && ent.status === 'active') {
        return { ...ent };
      }
    }
    return undefined;
  }

  getActiveWindow(entitlementId: string, nowMs = Date.now()): StoredWorkWindow | null {
    let latest: StoredWorkWindow | null = null;
    for (const w of this.workWindows.values()) {
      if (w.entitlementId === entitlementId && w.revokedAtMs === null && w.expiresAtMs > nowMs) {
        if (!latest || w.startedAtMs > latest.startedAtMs) {
          latest = w;
        }
      }
    }
    return latest ? { ...latest } : null;
  }

  openWorkWindow(
    entitlementId: string,
    subject: string,
    requestId: string,
    nowMs = Date.now()
  ): {
    outcome: 'create' | 'resume' | 'expired_replay';
    window: StoredWorkWindow;
    activationsUsed: number;
    remaining: number | null;
  } {
    const ent = this.entitlements.get(entitlementId);
    if (!ent) {
      throw new Error('ENTITLEMENT_NOT_FOUND');
    }

    const policyEnt: PolicyEntitlement = {
      id: ent.id,
      subject: ent.authSubject,
      status: ent.status,
      used: ent.activationsUsed,
      max: ent.maxActivations,
      windowHours: ent.windowHours,
      accessExpiresAtMs: ent.accessExpiresAtMs,
    };

    const reqKey = `${entitlementId}:${requestId}`;
    const prevWindowId = this.activationRequests.get(reqKey);
    const prevWindow = prevWindowId ? this.workWindows.get(prevWindowId) : null;
    const policyPrevWindow: PolicyWindow | null = prevWindow
      ? {
          id: prevWindow.id,
          entitlementId: prevWindow.entitlementId,
          ordinal: prevWindow.ordinal,
          startsAtMs: prevWindow.startedAtMs,
          expiresAtMs: prevWindow.expiresAtMs,
          revoked: prevWindow.revokedAtMs !== null,
        }
      : null;

    const activeStored = this.getActiveWindow(entitlementId, nowMs);
    const policyActiveWindow: PolicyWindow | null = activeStored
      ? {
          id: activeStored.id,
          entitlementId: activeStored.entitlementId,
          ordinal: activeStored.ordinal,
          startsAtMs: activeStored.startedAtMs,
          expiresAtMs: activeStored.expiresAtMs,
          revoked: activeStored.revokedAtMs !== null,
        }
      : null;

    const decision: ActivationDecision = decideActivation({
      entitlement: policyEnt,
      subject,
      nowMs,
      requestId,
      previousRequestWindow: policyPrevWindow,
      activeWindow: policyActiveWindow,
    });

    if (decision.kind === 'create') {
      const windowId = randomUUID();
      const newWindow: StoredWorkWindow = {
        id: windowId,
        entitlementId: ent.id,
        ordinal: decision.ordinal,
        startedAtMs: decision.startsAtMs,
        expiresAtMs: decision.expiresAtMs,
        revokedAtMs: null,
      };
      this.workWindows.set(windowId, newWindow);
      ent.activationsUsed += 1;
      this.activationRequests.set(reqKey, windowId);

      return {
        outcome: 'create',
        window: { ...newWindow },
        activationsUsed: ent.activationsUsed,
        remaining: decision.remaining,
      };
    } else if (decision.kind === 'resume') {
      const w = this.workWindows.get(decision.window.id)!;
      this.activationRequests.set(reqKey, w.id);
      return {
        outcome: 'resume',
        window: { ...w },
        activationsUsed: ent.activationsUsed,
        remaining: decision.remaining,
      };
    } else {
      // expired_replay
      const w = this.workWindows.get(decision.window.id)!;
      return {
        outcome: 'expired_replay',
        window: { ...w },
        activationsUsed: ent.activationsUsed,
        remaining: decision.remaining,
      };
    }
  }

  // CV Drafts
  getCVDraft(id: string, subject: string): StoredCVDraft | null {
    const draft = this.cvDrafts.get(id);
    if (!draft || draft.ownerSubject !== subject) return null;
    return { ...draft };
  }

  getCVDraftBySubject(subject: string): StoredCVDraft | null {
    for (const draft of this.cvDrafts.values()) {
      if (draft.ownerSubject === subject) {
        return { ...draft };
      }
    }
    return null;
  }

  saveCVDraft(
    id: string,
    subject: string,
    entitlementId: string,
    document: Record<string, unknown>,
    expectedVersion?: number
  ): StoredCVDraft {
    const existing = this.cvDrafts.get(id);
    if (existing) {
      if (existing.ownerSubject !== subject) {
        throw new Error('FORBIDDEN');
      }
      if (expectedVersion != null && existing.version !== expectedVersion) {
        throw new Error('VERSION_CONFLICT');
      }
      existing.version += 1;
      existing.document = document;
      existing.updatedAtMs = Date.now();
      return { ...existing };
    }

    const draft: StoredCVDraft = {
      id,
      ownerSubject: subject,
      entitlementId,
      version: 1,
      document,
      updatedAtMs: Date.now(),
    };
    this.cvDrafts.set(id, draft);
    return { ...draft };
  }

  // Ficheiros gerados (PDFs, etc)
  saveFile(
    ownerSubject: string,
    entitlementId: string,
    filename: string,
    contentType: string,
    data: Buffer,
    sourceVersion?: number
  ): StoredFile {
    const id = randomUUID();
    const file: StoredFile = {
      id,
      ownerSubject,
      entitlementId,
      filename,
      contentType,
      data,
      sourceVersion,
      createdAtMs: Date.now(),
    };
    this.files.set(id, file);
    return file;
  }

  getFile(id: string, subject: string): StoredFile | null {
    const f = this.files.get(id);
    if (!f || f.ownerSubject !== subject) return null;
    return f;
  }

  getFilesBySubject(subject: string): StoredFile[] {
    const list: StoredFile[] = [];
    for (const f of this.files.values()) {
      if (f.ownerSubject === subject) {
        list.push({ ...f });
      }
    }
    return list;
  }
}

// Instância singleton partilhada
export const store = new Store();
