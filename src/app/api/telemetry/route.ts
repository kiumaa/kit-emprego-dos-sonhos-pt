import { NextRequest, NextResponse } from 'next/server';
import { recordTelemetryEvent, getBackofficeMetrics, clearTelemetryStore, TelemetryEvent } from '@/server/analytics/telemetry-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body && typeof body === 'object' && body.sessionId && body.path) {
      await recordTelemetryEvent(body as TelemetryEvent);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET() {
  const metrics = await getBackofficeMetrics();
  return NextResponse.json(
    { ok: true, data: metrics },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    }
  );
}

export async function DELETE() {
  await clearTelemetryStore();
  return NextResponse.json({ ok: true, message: 'Dados de telemetria reiniciados com sucesso' });
}
