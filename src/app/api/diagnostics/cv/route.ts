import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let cvText = '';
    let targetRole = '';
    let jobDescription = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      cvText = (body.cvText || '').trim();
      targetRole = (body.targetRole || '').trim();
      jobDescription = (body.jobDescription || '').trim();
    } else {
      const formData = await request.formData();
      cvText = (formData.get('text') as string || '').trim();
      targetRole = (formData.get('role') as string || '').trim();
      jobDescription = (formData.get('jobDescription') as string || '').trim();

      const file = formData.get('file') as File | null;
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'O ficheiro excede o tamanho máximo permitido de 5 MiB.' },
            { status: 413 }
          );
        }
        // Simulação de extração de texto para preview
        cvText = `Texto extraído do documento: ${file.name}`;
      }
    }

    if (!cvText || cvText.length < 20) {
      return NextResponse.json(
        { error: 'O conteúdo fornecido é demasiado curto para uma análise fundamentada.' },
        { status: 400 }
      );
    }

    // Verificação de segurança: não aceitar tentativas grosseiras de injeção
    const lower = cvText.toLowerCase();
    if (lower.includes('ignore previous instructions') || lower.includes('desconsidera todas as regras')) {
      return NextResponse.json(
        { error: 'Entrada rejeitada por motivos de segurança e conformidade.' },
        { status: 422 }
      );
    }

    const diagnosticId = `cv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

    return NextResponse.json({
      id: diagnosticId,
      status: 'completed',
      source: 'cv',
      createdAt: new Date().toISOString(),
      targetRole: targetRole || null,
      hasJobDescription: Boolean(jobDescription),
      disclaimer: 'Análise preliminar automatizada baseada exclusivamente no texto fornecido.',
      priorities: [
        {
          criterion: 'clarity_structure',
          title: 'Clareza e Estrutura',
          explanation: 'O teu perfil beneficia de secções cronológicas bem demarcadas e contactos visíveis no topo.',
          kind: 'essential',
        },
        {
          criterion: 'evidence_impact',
          title: 'Impacto e Evidência',
          explanation: 'Descreve as tuas tarefas anteriores com foco nos resultados alcançados e não apenas responsabilidades teóricas.',
          kind: 'essential',
        },
        {
          criterion: 'tailoring',
          title: 'Adaptação à Função',
          explanation: 'Evidencia as ferramentas e competências mais procuradas nas ofertas a que te estás a candidatar.',
          kind: 'refinement',
        },
      ],
      freeAction: 'Revê o cabeçalho e assegura-te de que tens um único número de telefone direto e link para o LinkedIn.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro no processamento do currículo.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
