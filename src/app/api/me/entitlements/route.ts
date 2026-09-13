import { NextResponse } from 'next/server';
import { getVerifiedSession } from '@/server/auth/session';
import { store } from '@/server/db/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getVerifiedSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  // Se houver compras não associadas para o email da sessão, associar agora (idempotente)
  await store.claimEntitlementsAsync(session.email, session.subject);

  const rawEntitlements = await store.getEntitlementsBySubjectAsync(session.subject);
  const now = Date.now();

  const entitlements = rawEntitlements.map((ent) => {
    const activeWindow = store.getActiveWindow(ent.id, now);
    const remaining = ent.maxActivations === null ? null : Math.max(0, ent.maxActivations - ent.activationsUsed);

    return {
      id: ent.id,
      productKey: ent.productKey,
      status: ent.status,
      maxActivations: ent.maxActivations,
      activationsUsed: ent.activationsUsed,
      remainingActivations: remaining,
      windowHours: ent.windowHours,
      activeWindow: activeWindow
        ? {
            id: activeWindow.id,
            ordinal: activeWindow.ordinal,
            startsAtMs: activeWindow.startedAtMs,
            expiresAtMs: activeWindow.expiresAtMs,
          }
        : null,
    };
  });

  return NextResponse.json({
    ok: true,
    user: {
      subject: session.subject,
      email: session.email,
    },
    entitlements,
  });
}
