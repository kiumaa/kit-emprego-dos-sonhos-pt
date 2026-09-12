/**
 * Camada de persistência e repositório KEDS v5.
 * Suporta modo em memória desacoplado (para testes e ambiente sem DATABASE_URL)
 * e compatibilidade de transação com schema keds_v5.
 */
import { createHash, randomUUID } from 'node:crypto';
import {
  decideActivation,
  canReadExisting,
  Entitlement as PolicyEntitlement,
  WorkWindow as PolicyWindow,
  ActivationDecision,
} from '../access/access-policy';
import { VerifiedSalePaid, replayDecision } from '../integrations/okanda-verifier';

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

class Store {
  private webhookEvents = new Map<string, WebhookEventRecord>();
  private entitlements = new Map<string, StoredEntitlement>();
  private workWindows = new Map<string, StoredWorkWindow>();
  private activationRequests = new Map<string, string>(); // key: `${entitlementId}:${requestId}` -> windowId
  private cvDrafts = new Map<string, StoredCVDraft>();
  private files = new Map<string, StoredFile>();

  // Helper para testes e resets controlados
  clear() {
    this.webhookEvents.clear();
    this.entitlements.clear();
    this.workWindows.clear();
    this.activationRequests.clear();
    this.cvDrafts.clear();
    this.files.clear();
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

  claimEntitlements(email: string, subject: string): number {
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
