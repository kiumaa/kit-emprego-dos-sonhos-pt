import { NextRequest, NextResponse } from 'next/server';
import {
  verifySalePaid,
  ProductMapping,
  WebhookError,
} from '@/server/integrations/okanda-verifier';
import { store } from '@/server/db/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getProductMap(): Record<string, ProductMapping> {
  const map: Record<string, ProductMapping> = {
    'example-product-kit': {
      productKey: 'kit',
      currency: 'EUR',
      allowedAmountsMinor: [1499],
      offerVersion: 'interactive_v5',
    },
    'example-product-entrevista': {
      productKey: 'entrevista',
      currency: 'EUR',
      allowedAmountsMinor: [499],
      offerVersion: 'interactive_v5',
    },
    'example-product-linkedin': {
      productKey: 'linkedin',
      currency: 'EUR',
      allowedAmountsMinor: [599],
      offerVersion: 'interactive_v5',
    },
  };

  const envKitId = process.env.OKANDA_PRODUCT_KIT_ID?.trim();
  if (envKitId) {
    map[envKitId] = {
      productKey: 'kit',
      currency: 'EUR',
      allowedAmountsMinor: [1499],
      offerVersion: 'interactive_v5',
    };
  }

  const envEntrevistaId = process.env.OKANDA_PRODUCT_ENTREVISTA_ID?.trim();
  if (envEntrevistaId) {
    map[envEntrevistaId] = {
      productKey: 'entrevista',
      currency: 'EUR',
      allowedAmountsMinor: [499],
      offerVersion: 'interactive_v5',
    };
  }

  const envLinkedinId = process.env.OKANDA_PRODUCT_LINKEDIN_ID?.trim();
  if (envLinkedinId) {
    map[envLinkedinId] = {
      productKey: 'linkedin',
      currency: 'EUR',
      allowedAmountsMinor: [599],
      offerVersion: 'interactive_v5',
    };
  }

  return map;
}

export async function POST(request: NextRequest) {
  try {
    const rawSecret = process.env.OKANDA_WEBHOOK_SIGNING_SECRET || '';
    const secrets = rawSecret
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length >= 16);

    if (secrets.length === 0) {
      return NextResponse.json(
        {
          error: 'INTEGRATION_NOT_CONFIGURED',
          message: 'OKANDA webhook secret não está configurado no servidor.',
        },
        { status: 503 }
      );
    }

    const arrayBuffer = await request.arrayBuffer();
    const rawBody = Buffer.from(arrayBuffer);

    const verified = verifySalePaid({
      rawBody,
      headers: request.headers,
      secrets,
      nowMs: Date.now(),
      productMap: getProductMap(),
      amountUnit: 'major',
    });

    const result = store.processSalePaidWebhook(verified);

    return NextResponse.json({
      ok: true,
      status: result.status,
      saleId: verified.saleId,
      productKey: verified.productKey,
    });
  } catch (err: unknown) {
    if (err instanceof WebhookError) {
      const isAuth =
        err.code === 'SIGNATURE_MISMATCH' ||
        err.code === 'MISSING_OR_INVALID_SIGNATURE' ||
        err.code === 'SIGNING_NOT_CONFIGURED';
      return NextResponse.json(
        { ok: false, error: err.code },
        { status: isAuth ? 401 : 400 }
      );
    }
    return NextResponse.json(
      { ok: false, error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
