import { NextResponse } from 'next/server';
import { getVerifiedSession } from '@/server/auth/session';
import { store } from '@/server/db/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const session = await getVerifiedSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const count = store.claimEntitlements(session.email, session.subject);
  return NextResponse.json({
    ok: true,
    claimedCount: count,
  });
}
