import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedSession } from '@/server/auth/session';
import { store } from '@/server/db/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const session = await getVerifiedSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const file = store.getFile(params.id, session.subject);
  if (!file) {
    return NextResponse.json({ ok: false, error: 'FILE_NOT_FOUND' }, { status: 404 });
  }

  const uint8 = new Uint8Array(file.data);

  return new NextResponse(uint8, {
    status: 200,
    headers: {
      'Content-Type': file.contentType || 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`,
      'Content-Length': String(file.data.length),
    },
  });
}
