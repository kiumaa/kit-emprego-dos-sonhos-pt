import { describe, it, expect } from 'vitest';
import { evaluateQuiz } from '../quiz-engine';
import defaultSpec from '../../../../content/quiz/quiz.json';

function getOptionsForDimension(dimension: string) {
  const q = defaultSpec.questions.find((question) => question.dimension === dimension);
  return q ? q.options : [];
}

const scoredDimensions = ['cv', 'adaptacao', 'evidencia', 'organizacao', 'mensagem', 'revisao'];

function answersForScores(scores: number[]): Record<string, string> {
  const answers: Record<string, string> = {
    q1: 'primeiro',
    q2: 'administrativo',
  };

  scoredDimensions.forEach((dim, idx) => {
    const question = defaultSpec.questions.find((q) => q.dimension === dim)!;
    const scoreVal = scores[idx];
    const option = question.options.find((o) => (o as { id: string; score?: number }).score === scoreVal)!;
    answers[question.id] = option.id;
  });

  return answers;
}

describe('Motor de Quiz KEDS (TypeScript)', () => {
  it('test_11: avalia todas as 4096 combinações de pontuação com cálculo e faixas corretas', () => {
    let count = 0;

    for (let s0 = 0; s0 < 4; s0++) {
      for (let s1 = 0; s1 < 4; s1++) {
        for (let s2 = 0; s2 < 4; s2++) {
          for (let s3 = 0; s3 < 4; s3++) {
            for (let s4 = 0; s4 < 4; s4++) {
              for (let s5 = 0; s5 < 4; s5++) {
                const scores = [s0, s1, s2, s3, s4, s5];
                const answers = answersForScores(scores);
                const result = evaluateQuiz(answers);
                const total = s0 + s1 + s2 + s3 + s4 + s5;

                expect(result.internalPreparationScore).toBe(total);
                const expectedBand = total <= 6 ? 'base' : total <= 12 ? 'consolidar' : 'afinar';
                expect(result.profileId).toBe(expectedBand);
                expect(result.priorities).toHaveLength(3);
                expect(result.showNumericScore).toBe(false);
                count++;
              }
            }
          }
        }
      }
    }

    expect(count).toBe(4096);
  });

  it('test_12: contexto (q1 e q2) não altera a pontuação interna nem o resultado', () => {
    const baseAnswers = answersForScores([1, 2, 1, 3, 1, 2]);
    const expectedScore = evaluateQuiz(baseAnswers).internalPreparationScore;

    const q1Options = defaultSpec.questions[0].options;
    const q2Options = defaultSpec.questions[1].options;

    for (const opt1 of q1Options) {
      for (const opt2 of q2Options) {
        const testAnswers = {
          ...baseAnswers,
          q1: opt1.id,
          q2: opt2.id,
        };
        const res = evaluateQuiz(testAnswers);
        expect(res.internalPreparationScore).toBe(expectedScore);
      }
    }
  });

  it('test_13: respostas incompletas ou com chaves extra são rejeitadas com erro explícito', () => {
    const base = answersForScores([0, 0, 0, 0, 0, 0]);

    const incomplete = { ...base };
    delete (incomplete as Record<string, string>)['q8'];
    expect(() => evaluateQuiz(incomplete)).toThrow(/exatamente as oito respostas esperadas/);

    const extra = { ...base, q9: 'extra' };
    expect(() => evaluateQuiz(extra)).toThrow(/exatamente as oito respostas esperadas/);
  });

  it('test_14: opções inválidas e tipos não-string são rejeitados', () => {
    const base = answersForScores([0, 0, 0, 0, 0, 0]);

    expect(() => evaluateQuiz({ ...base, q3: 'inexistente' })).toThrow(/Opção inválida para q3/);
    expect(() => evaluateQuiz({ ...base, q3: 123 as unknown as string })).toThrow(/escolha única válida/);
    expect(() => evaluateQuiz({ ...base, q3: null as unknown as string })).toThrow(/escolha única válida/);
    expect(() => evaluateQuiz(null)).toThrow(/objeto de escolhas únicas/);
    expect(() => evaluateQuiz([])).toThrow(/objeto de escolhas únicas/);
  });

  it('test_15: resultados de alto desempenho mantêm ações como refinamento sem alarmismo', () => {
    const best = answersForScores([3, 3, 3, 3, 3, 3]);
    const result = evaluateQuiz(best);

    expect(result.profileId).toBe('afinar');
    expect(result.priorities.every((p) => p.kind === 'refinement')).toBe(true);
  });

  it('test_16: desempate entre dimensões de mesma pontuação segue priorityOrder determinístico', () => {
    const ties = answersForScores([0, 0, 0, 0, 0, 0]);
    const result = evaluateQuiz(ties);

    const priorityDims = result.priorities.map((p) => p.dimension);
    expect(priorityDims).toEqual(defaultSpec.priorityOrder.slice(0, 3));
  });
});
