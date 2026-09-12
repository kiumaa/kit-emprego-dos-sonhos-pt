import { describe, it, expect } from 'vitest';
import { evaluateQuiz } from '../quiz-engine';
import defaultSpec from '../../../../content/quiz/quiz.json';

const scoredDimensions = ['cv', 'adaptacao', 'evidencia', 'mensagem'];

function answersForScores(scores: number[]): Record<string, string> {
  const answers: Record<string, string> = {
    q1: 'primeiro',
  };

  scoredDimensions.forEach((dim, idx) => {
    const question = defaultSpec.questions.find((q) => q.dimension === dim)!;
    const scoreVal = scores[idx];
    const option = question.options.find((o) => (o as { id: string; score?: number }).score === scoreVal)!;
    answers[question.id] = option.id;
  });

  return answers;
}

describe('Motor de Quiz KEDS (TypeScript - Contrato 5 Perguntas)', () => {
  it('test_11: avalia todas as 256 combinações de pontuação (escala 0-12) com cálculo e faixas corretas', () => {
    let count = 0;

    for (let s0 = 0; s0 < 4; s0++) {
      for (let s1 = 0; s1 < 4; s1++) {
        for (let s2 = 0; s2 < 4; s2++) {
          for (let s3 = 0; s3 < 4; s3++) {
            const scores = [s0, s1, s2, s3];
            const answers = answersForScores(scores);
            const result = evaluateQuiz(answers);
            const total = s0 + s1 + s2 + s3;

            expect(result.internalPreparationScore).toBe(total);
            const expectedBand = total <= 4 ? 'base' : total <= 8 ? 'consolidar' : 'afinar';
            expect(result.profileId).toBe(expectedBand);
            expect(result.priorities).toHaveLength(3);
            expect(result.showNumericScore).toBe(false);

            // Assegurar que apenas as 4 dimensões do quiz estão presentes
            expect(Object.keys(result.dimensions)).toEqual(scoredDimensions);
            count++;
          }
        }
      }
    }

    expect(count).toBe(256);
  });

  it('test_12: contexto (q1) não altera a pontuação interna nem o perfil', () => {
    const baseAnswers = answersForScores([1, 2, 1, 3]);
    const expectedScore = evaluateQuiz(baseAnswers).internalPreparationScore;

    const q1Options = defaultSpec.questions[0].options;

    for (const opt1 of q1Options) {
      const testAnswers = {
        ...baseAnswers,
        q1: opt1.id,
      };
      const res = evaluateQuiz(testAnswers);
      expect(res.internalPreparationScore).toBe(expectedScore);
      expect(res.context.q1).toBe(opt1.id);
    }
  });

  it('test_13: respostas incompletas ou com chaves extra são rejeitadas com erro explícito', () => {
    const base = answersForScores([0, 0, 0, 0]);

    const incomplete = { ...base };
    delete (incomplete as Record<string, string>)['q7'];
    expect(() => evaluateQuiz(incomplete)).toThrow(/exatamente as cinco respostas esperadas/);

    const extra = { ...base, q9: 'extra' };
    expect(() => evaluateQuiz(extra)).toThrow(/exatamente as cinco respostas esperadas/);

    // Respostas antigas de 8 perguntas (com q2, q6, q8) devem ser estritamente rejeitadas
    const legacyEight = {
      ...base,
      q2: 'outra',
      q6: 'notas',
      q8: 'rapida',
    };
    expect(() => evaluateQuiz(legacyEight)).toThrow(/exatamente as cinco respostas esperadas/);
  });

  it('test_14: opções inválidas e tipos não-string são rejeitados', () => {
    const base = answersForScores([0, 0, 0, 0]);

    expect(() => evaluateQuiz({ ...base, q3: 'inexistente' })).toThrow(/Opção inválida para q3/);
    expect(() => evaluateQuiz({ ...base, q3: 123 as unknown as string })).toThrow(/escolha única válida/);
    expect(() => evaluateQuiz({ ...base, q3: null as unknown as string })).toThrow(/escolha única válida/);
    expect(() => evaluateQuiz(null)).toThrow(/objeto de escolhas únicas/);
    expect(() => evaluateQuiz([])).toThrow(/objeto de escolhas únicas/);
  });

  it('test_15: pontuações máximas e mínimas avaliadas sem inventar hábitos de dimensões não perguntadas', () => {
    // Escolhas máximas
    const best = answersForScores([3, 3, 3, 3]);
    const resultBest = evaluateQuiz(best);

    expect(resultBest.profileId).toBe('afinar');
    expect(resultBest.internalPreparationScore).toBe(12);
    expect(resultBest.priorities.every((p) => p.kind === 'refinement')).toBe(true);

    // Dimensões não perguntadas NUNCA podem aparecer
    const bestDims = resultBest.priorities.map((p) => p.dimension);
    expect(bestDims).not.toContain('organizacao');
    expect(bestDims).not.toContain('revisao');

    // Escolhas mínimas
    const min = answersForScores([0, 0, 0, 0]);
    const resultMin = evaluateQuiz(min);

    expect(resultMin.profileId).toBe('base');
    expect(resultMin.internalPreparationScore).toBe(0);
    expect(resultMin.priorities.every((p) => p.kind === 'first_step')).toBe(true);

    const minDims = resultMin.priorities.map((p) => p.dimension);
    expect(minDims).not.toContain('organizacao');
    expect(minDims).not.toContain('revisao');
  });

  it('test_16: desempate entre dimensões de mesma pontuação segue priorityOrder determinístico', () => {
    const ties = answersForScores([0, 0, 0, 0]);
    const result = evaluateQuiz(ties);

    const priorityDims = result.priorities.map((p) => p.dimension);
    expect(priorityDims).toEqual(defaultSpec.priorityOrder.slice(0, 3));
    expect(priorityDims).toEqual(['cv', 'adaptacao', 'evidencia']);
  });

  it('test_17: sanitização de storage migra apenas escolhas válidas de sessões antigas', () => {
    const allowedQuestionIds = new Set(defaultSpec.questions.map((q) => q.id));
    const validOptions = new Map(
      defaultSpec.questions.map((q) => [q.id, new Set(q.options.map((o) => o.id))])
    );

    const legacyRaw = {
      q1: 'primeiro',
      q2: 'outra', // Antigo contexto -> deve ser descartado
      q3: 'revisto',
      q4: 'evidencia',
      q5: 'contexto',
      q6: 'notas', // Antigo organizacao -> deve ser descartado
      q7: 'concreta',
      q8: 'rapida', // Antigo revisao -> deve ser descartado
      malicious: '<script>',
    };

    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(legacyRaw)) {
      if (allowedQuestionIds.has(k) && typeof v === 'string') {
        const opts = validOptions.get(k);
        if (opts && opts.has(v)) {
          clean[k] = v;
        }
      }
    }

    expect(Object.keys(clean)).toEqual(['q1', 'q3', 'q4', 'q5', 'q7']);
    expect(clean.q2).toBeUndefined();
    expect(clean.q6).toBeUndefined();
    expect(clean.q8).toBeUndefined();

    // A sessão limpa avalia com sucesso de acordo com o novo contrato
    const res = evaluateQuiz(clean);
    expect(res.internalPreparationScore).toBe(12);
  });
});
