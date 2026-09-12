import { NextResponse } from 'next/server';
import { OkandaCommerceProvider } from '@/server/commerce/okanda-adapter';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID da encomenda em falta.' }, { status: 400 });
  }

  try {
    const provider = new OkandaCommerceProvider();
    const authoritative = await provider.fetchAuthoritativeState(id);
    return NextResponse.json(authoritative);
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string };
    if (error.code === 'INTEGRATION_NOT_CONFIGURED') {
      return NextResponse.json(
        { error: 'INTEGRATION_NOT_CONFIGURED', state: 'unknown' },
        { status: 503 }
      );
    }
    return NextResponse.json({ error: 'Falha na consulta da encomenda.' }, { status: 500 });
  }
}
