import { NextResponse } from 'next/server';
import { parseDocument } from '@/server/diagnostics/document-parser';
import { runCvAnalysis } from '@/server/diagnostics/ai-analyzer';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let cvText = '';
    let targetRole = '';
    let jobDescription = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      cvText = (body.cvText || body.text || '').trim();
      targetRole = (body.targetRole || body.role || '').trim();
      jobDescription = (body.jobDescription || '').trim();
    } else {
      const formData = await request.formData();
      cvText = (formData.get('text') as string || '').trim();
      targetRole = (formData.get('role') as string || formData.get('targetRole') as string || '').trim();
      jobDescription = (formData.get('jobDescription') as string || '').trim();

      const file = formData.get('file') as File | null;
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const parseResult = await parseDocument(buffer, file.name, file.type);
        if (!parseResult.success) {
          const status = parseResult.errorCode === 'FILE_TOO_LARGE' ? 413 : 422;
          return NextResponse.json(
            {
              error: parseResult.errorCode || 'PARSE_ERROR',
              message: parseResult.error,
              allowPaste: parseResult.allowPaste ?? true,
              offerQuiz: parseResult.offerQuiz ?? true,
            },
            { status }
          );
        }

        cvText = parseResult.text;
      }
    }

    if (!cvText || cvText.length < 40) {
      return NextResponse.json(
        {
          error: 'TEXTO_INSUFICIENTE',
          message: 'O conteúdo fornecido é demasiado curto para uma análise fundamentada (mínimo 40 caracteres). Podes colar o texto completo ou fazer o Quiz gratuito de 5 perguntas.',
          allowPaste: true,
          offerQuiz: true,
        },
        { status: 400 }
      );
    }

    const outcome = await runCvAnalysis({
      cvText,
      targetRole: targetRole || undefined,
      jobDescription: jobDescription || undefined,
    });

    if (!outcome.success) {
      const status = outcome.error === 'IA_NAO_CONFIGURADA' ? 503 : outcome.error === 'PROMPT_INJECTION_DETECTED' ? 422 : 502;
      return NextResponse.json(
        {
          error: outcome.error,
          message: outcome.message,
          offerQuiz: outcome.offerQuiz,
          allowPaste: outcome.allowPaste ?? true,
        },
        { status }
      );
    }

    return NextResponse.json(outcome.result, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro no processamento do currículo.';
    return NextResponse.json({ error: 'SERVER_ERROR', message }, { status: 500 });
  }
}
