import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { getVerifiedSession } from '@/server/auth/session';
import { store } from '@/server/db/store';
import { getDeliverableById, getDeliverableFilePath } from '@/server/resources/deliverables-catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getVerifiedSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const { id } = await context.params;
  const deliverable = getDeliverableById(id);
  if (!deliverable) {
    return NextResponse.json({ ok: false, error: 'RESOURCE_NOT_FOUND' }, { status: 404 });
  }

  // Verifica se o comprador tem o direito para este recurso
  const userEntitlements = store.getEntitlementsBySubject(session.subject);
  const hasEntitlement = userEntitlements.some(
    (e) => e.productKey === deliverable.entitlement && e.status === 'active'
  );

  if (!hasEntitlement) {
    return NextResponse.json(
      { ok: false, error: 'FORBIDDEN', message: 'Não tens direito a este recurso.' },
      { status: 403 }
    );
  }

  const filePath = getDeliverableFilePath(deliverable);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { ok: false, error: 'FILE_NOT_FOUND', message: 'Ficheiro temporariamente indisponível.' },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': deliverable.contentType,
      'Content-Disposition': `attachment; filename="${deliverable.filename}"`,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    },
  });
}
