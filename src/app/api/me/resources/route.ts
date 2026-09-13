import { NextResponse } from 'next/server';
import { getVerifiedSession } from '@/server/auth/session';
import { store } from '@/server/db/store';
import { DELIVERABLES_CATALOG } from '@/server/resources/deliverables-catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getVerifiedSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const userEntitlements = await store.getEntitlementsBySubjectAsync(session.subject);
  const activeKeys = new Set(
    userEntitlements.filter((e) => e.status === 'active').map((e) => e.productKey)
  );

  const availableResources = DELIVERABLES_CATALOG.filter((item) => activeKeys.has(item.entitlement)).map((item) => ({
    id: item.id,
    name: item.name,
    filename: item.filename,
    description: item.description,
    category: item.category,
    entitlement: item.entitlement,
    contentType: item.contentType,
    isZip: item.isZip,
    downloadUrl: `/api/me/downloads/${item.id}`,
  }));

  return NextResponse.json({
    ok: true,
    resources: availableResources,
  });
}
