import defaultSpec from '../../../content/quiz/quiz.json';

export interface QuizOption {
  id: string;
  label: string;
  score?: number;
}

export interface QuizQuestion {
  id: string;
  dimension: string | null;
  question: string;
  options: QuizOption[];
}

export interface QuizRecommendation {
  title: string;
  action: string;
  refinement: string;
  resource: string;
}

export interface QuizBand {
  min: number;
  max: number;
  id: 'base' | 'consolidar' | 'afinar';
  title: string;
  summary: string;
}

export interface QuizSpec {
  version: string;
  locale: string;
  scoreMeaning: string;
  displayNumericScore: boolean;
  questions: QuizQuestion[];
  priorityOrder: string[];
  recommendations: Record<string, QuizRecommendation>;
  bands: QuizBand[];
  disclaimer: string;
}

export interface QuizPriority {
  dimension: string;
  title: string;
  action: string;
  kind: 'refinement' | 'first_step';
  source: string;
  evidenceAnswer: string;
  resourceId: string;
}

export interface QuizResult {
  source: 'quiz';
  version: string;
  profileId: 'base' | 'consolidar' | 'afinar';
  title: string;
  summary: string;
  internalPreparationScore: number;
  showNumericScore: false;
  context: Record<string, string>;
  dimensions: Record<string, number>;
  priorities: QuizPriority[];
  disclaimer: string;
}

/**
 * Avalia as respostas do questionário seguindo a referência determinística do projeto.
 * Rejeita respostas desconhecidas, incompletas, com tipos inválidos ou opções inexistentes.
 */
export function evaluateQuiz(
  answers: unknown,
  spec: QuizSpec = defaultSpec as unknown as QuizSpec
): QuizResult {
  if (typeof answers !== 'object' || answers === null || Array.isArray(answers)) {
    throw new Error('As respostas devem ser um objeto de escolhas únicas.');
  }

  const ans = answers as Record<string, unknown>;
  const requiredQuestions = new Set(spec.questions.map((q) => q.id));
  const providedKeys = new Set(Object.keys(ans));

  if (
    providedKeys.size !== requiredQuestions.size ||
    [...requiredQuestions].some((id) => !providedKeys.has(id))
  ) {
    throw new Error('O questionário deve conter exatamente as cinco respostas esperadas.');
  }

  const dimensions: Record<string, number> = {};
  const context: Record<string, string> = {};
  const selected: Record<string, string> = {};

  for (const question of spec.questions) {
    const value = ans[question.id];
    if (typeof value !== 'string') {
      throw new Error('Cada pergunta exige uma escolha única válida.');
    }

    const choice = question.options.find((o) => o.id === value);
    if (!choice) {
      throw new Error(`Opção inválida para ${question.id}`);
    }

    selected[question.id] = choice.label;

    if (question.dimension === null) {
      context[question.id] = value;
    } else {
      dimensions[question.dimension] = choice.score ?? 0;
    }
  }

  const total = Object.values(dimensions).reduce((acc, curr) => acc + curr, 0);

  const band = spec.bands.find((b) => total >= b.min && total <= b.max);
  if (!band) {
    throw new Error(`Pontuação ${total} fora de qualquer faixa definida.`);
  }

  const rank: Record<string, number> = {};
  spec.priorityOrder.forEach((name, i) => {
    rank[name] = i;
  });

  const ordered = Object.keys(dimensions).sort((a, b) => {
    const scoreDiff = dimensions[a] - dimensions[b];
    if (scoreDiff !== 0) return scoreDiff;
    return rank[a] - rank[b];
  });

  const priorities: QuizPriority[] = ordered.slice(0, 3).map((dim) => {
    const item = spec.recommendations[dim];
    const isRefinement = dimensions[dim] >= 2;
    const question = spec.questions.find((q) => q.dimension === dim)!;

    return {
      dimension: dim,
      title: item.title,
      action: isRefinement ? item.refinement : item.action,
      kind: isRefinement ? 'refinement' : 'first_step',
      source: 'self_report',
      evidenceAnswer: selected[question.id],
      resourceId: item.resource,
    };
  });

  return {
    source: 'quiz',
    version: spec.version,
    profileId: band.id,
    title: band.title,
    summary: band.summary,
    internalPreparationScore: total,
    showNumericScore: false,
    context,
    dimensions,
    priorities,
    disclaimer: spec.disclaimer,
  };
}
