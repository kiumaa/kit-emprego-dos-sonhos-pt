import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Identificador em falta.' }, { status: 400 });
  }

  // Devolve o relatório com cabeçalhos de segurança no-store (privacidade dos dados)
  const response = NextResponse.json({
    id,
    status: 'completed',
    disclaimer: 'Resultado de autorrelato fundamentado. Sem pontuações fictícias de ATS.',
    priorities: [
      {
        title: 'Estruturação Cronológica Reversa',
        explanation: 'Garante que a tua experiência profissional recente está no topo e é facilmente legível.',
        kind: 'essential',
      },
      {
        title: 'Verificação de Evidências Reais',
        explanation: 'Substitui frases vagas por exemplos de tarefas efetivamente executadas.',
        kind: 'essential',
      },
      {
        title: 'Personalização do Objetivo',
        explanation: 'Alinha o teu perfil com a oportunidade específica em Portugal.',
        kind: 'refinement',
      },
    ],
    freeAction: 'Elimina referências a formações incompletas como se estivessem terminadas e grava o teu documento em PDF.',
  });

  response.headers.set('Cache-Control', 'no-store, private');
  return response;
}
