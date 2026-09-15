import { NextRequest, NextResponse } from 'next/server';
import {
  sendMetaConversionEvent,
  MetaEventPayload,
} from '@/server/analytics/meta-conversions';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'meta-conversions-api',
    status: 'ready',
    pixelId: process.env.META_PIXEL_ID || '2355977538561849',
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object' || !body.eventName) {
      return NextResponse.json(
        { ok: false, error: 'MISSING_EVENT_NAME' },
        { status: 400 }
      );
    }

    // Extrair endereço IP real
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIpAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || undefined;

    // Extrair User-Agent
    const clientUserAgent = request.headers.get('user-agent') || undefined;

    // Extrair cookies primários da Meta (_fbp e _fbc) para máxima qualidade de correspondência (EMQ)
    const fbp = request.cookies.get('_fbp')?.value;
    const fbc = request.cookies.get('_fbc')?.value;

    const eventPayload: MetaEventPayload = {
      eventName: String(body.eventName),
      eventId: body.eventId ? String(body.eventId) : undefined,
      eventTime: typeof body.eventTime === 'number' ? body.eventTime : undefined,
      eventSourceUrl: body.eventSourceUrl ? String(body.eventSourceUrl) : request.headers.get('referer') || undefined,
      actionSource: 'website',
      userData: {
        ...(body.userData || {}),
        clientIpAddress: clientIpAddress || body.userData?.clientIpAddress,
        clientUserAgent: clientUserAgent || body.userData?.clientUserAgent,
        fbp: fbp || body.userData?.fbp,
        fbc: fbc || body.userData?.fbc,
      },
      customData: body.customData,
    };

    const testEventCode = body.testEventCode || process.env.META_TEST_EVENT_CODE;

    const result = await sendMetaConversionEvent(eventPayload, { testEventCode });

    return NextResponse.json({
      ok: result.success,
      eventsReceived: result.eventsReceived,
      fbtraceId: result.fbtraceId,
      error: result.error,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'INTERNAL_ERROR';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
