import { NextResponse } from 'next/server';
import { evaluateQuiz } from '@/lib/quiz/quiz-engine';
import quizSpec from '@content/quiz/quiz.json';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Formato inválido. O objeto de respostas é obrigatório.' },
        { status: 400 }
      );
    }

    const result = evaluateQuiz(answers, quizSpec as Parameters<typeof evaluateQuiz>[1]);

    const diagnosticId = `quiz-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

    return NextResponse.json({
      id: diagnosticId,
      evaluatedAt: new Date().toISOString(),
      ...result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao processar as escolhas do quiz.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
