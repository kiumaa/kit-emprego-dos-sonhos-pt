import { NextRequest, NextResponse } from 'next/server';
import {
  verifySalePaid,
  ProductMapping,
  WebhookError,
} from '@/server/integrations/okanda-verifier';
import { store } from '@/server/db/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_SECRET = 'keds_okanda_sec_2026_pt';

function getProductMap(): Record<string, ProductMapping> {
  const map: Record<string, ProductMapping> = {
    // ID oficial do Kit Emprego dos Sonhos no checkout da OKANDA
    'c38e6af8-098c-48c6-b1c5-a680c5ee4a6b': {
      productKey: 'kit',
      currency: 'EUR',
      allowedAmountsMinor: [1499],
      offerVersion: 'interactive_v5',
    },
    'kit-emprego-dos-sonhos-mtz4h7e8': {
      productKey: 'kit',
      currency: 'EUR',
      allowedAmountsMinor: [1499],
      offerVersion: 'interactive_v5',
    },
    'kit-emprego-dos-sonhos': {
      productKey: 'kit',
      currency: 'EUR',
      allowedAmountsMinor: [1499],
      offerVersion: 'interactive_v5',
    },
    'entrevista-dos-sonhos': {
      productKey: 'entrevista',
      currency: 'EUR',
      allowedAmountsMinor: [499],
      offerVersion: 'interactive_v5',
    },
    'linkedin-dos-sonhos': {
      productKey: 'linkedin',
      currency: 'EUR',
      allowedAmountsMinor: [599],
      offerVersion: 'interactive_v5',
    },
    // Compatibilidade com fixtures de teste
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

/**
 * Endpoint GET para validação de conectividade / health check da OKANDA
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'keds-okanda-webhook',
    status: 'listening',
    products: ['kit', 'entrevista', 'linkedin'],
    version: 'v5.0',
  });
}

export async function POST(request: NextRequest) {
  try {
    const rawSecret =
      process.env.OKANDA_WEBHOOK_SIGNING_SECRET ||
      process.env.OKANDA_WEBHOOK_SECRET ||
      DEFAULT_SECRET;

    const secrets = rawSecret
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length >= 16);

    if (secrets.length === 0) {
      secrets.push(DEFAULT_SECRET);
    }

    const arrayBuffer = await request.arrayBuffer();
    const rawBody = Buffer.from(arrayBuffer);

    // Deteção e tratamento de pings/testes da OKANDA
    let payloadParsed: any = null;
    try {
      payloadParsed = JSON.parse(new TextDecoder('utf-8').decode(rawBody));
    } catch {
      // Formato inválido será tratado no verifier
    }

    if (
      payloadParsed?.event === 'ping' ||
      payloadParsed?.event === 'test' ||
      payloadParsed?.type === 'ping'
    ) {
      return NextResponse.json({ ok: true, message: 'Webhook connection verified successfully' });
    }

    // Mapeamento dinâmico inteligente por nome/montante se o UUID do bump for desconhecido
    const currentMap = getProductMap();
    if (payloadParsed?.sale?.product_id && !currentMap[payloadParsed.sale.product_id]) {
      const pName = String(payloadParsed.sale.product_name || '').toLowerCase();
      const pId = String(payloadParsed.sale.product_id || '').toLowerCase();
      const pAmount = Number(payloadParsed.sale.amount);

      if (pName.includes('entrevista') || pId.includes('entrevista') || Math.round(pAmount * 100) === 499) {
        currentMap[payloadParsed.sale.product_id] = {
          productKey: 'entrevista',
          currency: 'EUR',
          allowedAmountsMinor: [499],
          offerVersion: 'interactive_v5',
        };
      } else if (pName.includes('linkedin') || pId.includes('linkedin') || Math.round(pAmount * 100) === 599) {
        currentMap[payloadParsed.sale.product_id] = {
          productKey: 'linkedin',
          currency: 'EUR',
          allowedAmountsMinor: [599],
          offerVersion: 'interactive_v5',
        };
      } else if (pName.includes('kit') || pName.includes('emprego') || Math.round(pAmount * 100) === 1499) {
        currentMap[payloadParsed.sale.product_id] = {
          productKey: 'kit',
          currency: 'EUR',
          allowedAmountsMinor: [1499],
          offerVersion: 'interactive_v5',
        };
      }
    }

    const verified = verifySalePaid({
      rawBody,
      headers: request.headers,
      secrets,
      nowMs: Date.now(),
      productMap: currentMap,
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
