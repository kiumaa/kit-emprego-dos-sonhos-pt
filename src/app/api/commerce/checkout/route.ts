import { NextResponse } from 'next/server';
import { OkandaCommerceProvider } from '@/server/commerce/okanda-adapter';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product = 'kit-emprego-pt', returnUrl } = body;

    if (product !== 'kit-emprego-pt') {
      return NextResponse.json({ error: 'Produto inválido.' }, { status: 400 });
    }

    const provider = new OkandaCommerceProvider();
    const internalOrderId = `keds-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const effectiveReturnUrl = returnUrl || `${new URL(request.url).origin}/obrigado`;

    const checkout = await provider.createCheckout({
      internalOrderId,
      product: 'kit-emprego-pt',
      returnUrl: effectiveReturnUrl,
    });

    return NextResponse.json(checkout);
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'INTEGRATION_NOT_CONFIGURED') {
      return NextResponse.json(
        {
          error: 'INTEGRATION_NOT_CONFIGURED: O checkout na OKANDA requer validação de credenciais oficiais.',
          code: 'INTEGRATION_NOT_CONFIGURED',
        },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: error.message || 'Erro no checkout.' }, { status: 500 });
  }
}
