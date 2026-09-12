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

  const files = store.getFilesBySubject(session.subject).map((f) => ({
    id: f.id,
    filename: f.filename,
    contentType: f.contentType,
    createdAtMs: f.createdAtMs,
  }));

  return NextResponse.json({ ok: true, files });
}
