import { NextRequest, NextResponse } from 'next/server';
import { recordTelemetryEvent, getBackofficeMetrics, TelemetryEvent } from '@/server/analytics/telemetry-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body && typeof body === 'object' && body.sessionId && body.path) {
      recordTelemetryEvent(body as TelemetryEvent);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

export async function GET() {
  const metrics = getBackofficeMetrics();
  return NextResponse.json({ ok: true, data: metrics });
}
