import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Identificador em falta.' }, { status: 400 });
  }

  // Não devolver perfis fabricados para IDs aleatórios em rotas públicas.
  // Os diagnósticos são efémeros e residem na sessão do visitante.
  const response = NextResponse.json(
    {
      error: 'DIAGNOSTICO_NAO_ENCONTRADO',
      message: 'Diagnóstico não encontrado no servidor ou sessão expirada.',
      offerQuiz: true,
    },
    { status: 404 }
  );

  response.headers.set('Cache-Control', 'no-store, private');
  return response;
}
