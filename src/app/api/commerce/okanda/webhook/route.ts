import { NextResponse } from 'next/server';
import { OkandaCommerceProvider } from '@/server/commerce/okanda-adapter';

export async function POST(request: Request) {
  try {
    const rawBodyBuffer = await request.arrayBuffer();
    const rawBody = new Uint8Array(rawBodyBuffer);

    const headers: Record<string, string> = {};
    request.headers.forEach((val, key) => {
      headers[key.toLowerCase()] = val;
    });

    const provider = new OkandaCommerceProvider();
    const verified = await provider.verifyWebhook({ rawBody, headers });

    // Em produção: transação idempotente registando o evento e atribuindo os direitos
    return NextResponse.json({
      received: true,
      eventId: verified.eventId,
      orderId: verified.orderId,
      state: verified.state,
    });
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'INTEGRATION_NOT_CONFIGURED') {
      return NextResponse.json(
        { error: 'INTEGRATION_NOT_CONFIGURED: Assinatura de webhook não verificada.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: error.message || 'Erro ao processar webhook.' }, { status: 400 });
  }
}
