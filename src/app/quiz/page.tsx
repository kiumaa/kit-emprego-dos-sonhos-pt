'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import defaultSpec from '../../../content/quiz/quiz.json';
import { BrandLogo } from '@/components/layout/brand-logo';
import { evaluateQuiz } from '@/lib/quiz/quiz-engine';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

// As 5 perguntas centrais de autorrelato para o diagnóstico de 5 perguntas
const activeQuestions = defaultSpec.questions;
const ALLOWED_QUESTION_IDS = new Set(defaultSpec.questions.map((q) => q.id));
const VALID_OPTIONS = new Map<string, Set<string>>(
  defaultSpec.questions.map((q) => [q.id, new Set(q.options.map((o) => o.id))])
);

const STORAGE_KEY_V2 = 'keds_quiz_answers_v2';
const STORAGE_KEY_LEGACY = 'keds_quiz_answers';

function sanitizeAnswers(data: unknown): Record<string, string> {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {};
  }
  const clean: Record<string, string> = {};
  for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
    if (ALLOWED_QUESTION_IDS.has(key) && typeof val === 'string') {
      const allowedOpts = VALID_OPTIONS.get(key);
      if (allowedOpts && allowedOpts.has(val)) {
        clean[key] = val;
      }
    }
  }
  return clean;
}

export default function QuizPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restaurar respostas da sessão de forma segura e com sanitização
  useEffect(() => {
    try {
      const savedV2 = sessionStorage.getItem(STORAGE_KEY_V2);
      if (savedV2) {
        const parsed = JSON.parse(savedV2);
        const clean = sanitizeAnswers(parsed);
        setAnswers(clean);
        return;
      }

      // Migração graciosa de sessão anterior (descartando q2, q6, q8 e dados inválidos)
      const legacy = sessionStorage.getItem(STORAGE_KEY_LEGACY);
      if (legacy) {
        const parsed = JSON.parse(legacy);
        const clean = sanitizeAnswers(parsed);
        if (Object.keys(clean).length > 0) {
          setAnswers(clean);
          sessionStorage.setItem(STORAGE_KEY_V2, JSON.stringify(clean));
        }
        sessionStorage.removeItem(STORAGE_KEY_LEGACY);
      }
    } catch {
      // Ignorar erros de storage malformado
    }
  }, []);

  const totalSteps = activeQuestions.length;
  const currentQuestion = activeQuestions[currentStepIndex];
  const selectedOption = answers[currentQuestion.id] || '';

  const handleSelectOption = (optionId: string) => {
    setError(null);
    const updated = {
      ...answers,
      [currentQuestion.id]: optionId,
    };
    setAnswers(updated);
    try {
      sessionStorage.setItem(STORAGE_KEY_V2, JSON.stringify(updated));
    } catch {
      // Ignorar erro
    }
  };

  const handleNext = () => {
    if (!selectedOption) {
      setError('Por favor escolhe uma das opções para continuar.');
      return;
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmitQuiz();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setError(null);
      setCurrentStepIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitting(true);
    try {
      // Contrato de 5 perguntas: passa estritamente as respostas do utilizador sem injeção de baselineAnswers
      const result = evaluateQuiz(answers);
      const resultId = `qz-${Date.now().toString(36)}`;
      sessionStorage.setItem(`keds_result_${resultId}`, JSON.stringify(result));
      router.push(`/resultado/${resultId}`);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setError((err as Error).message || 'Ocorreu um erro ao avaliar o questionário.');
    }
  };

  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header Minimalista com Logótipo e Botão Voltar */}
      <header
        style={{
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          backgroundColor: 'var(--color-background)',
          paddingTop: 'clamp(14px, 2.5vw, 18px)',
          paddingBottom: 'clamp(14px, 2.5vw, 18px)',
        }}
      >
        <div
          className="container-reading"
          style={{
            maxWidth: '560px',
            marginInline: 'auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <BrandLogo className="brand-logo-quiz" />

          {currentStepIndex > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 0,
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              <ArrowLeft size={15} aria-hidden="true" />
              <span>Anterior</span>
            </button>
          ) : (
            <a
              href="/"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
              }}
            >
              Cancelar
            </a>
          )}
        </div>
      </header>

      {/* Barra de Progresso Fina */}
      <div
        style={{
          width: '100%',
          height: '3px',
          backgroundColor: 'var(--color-surface)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            backgroundColor: 'var(--color-accent)',
            transition: 'width 240ms cubic-bezier(0.2, 0, 0, 1)',
          }}
        />
      </div>

      {/* Main Quiz Stepper & Question Form */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 'clamp(20px, 4vh, 36px)',
          paddingBottom: 'clamp(28px, 5vh, 48px)',
          paddingInline: 0,
        }}
      >
        <div
          className="container-reading"
          style={{
            maxWidth: '520px',
            width: '100%',
            marginInline: 'auto',
          }}
        >
          {/* Indicador de Passo */}
          <div style={{ marginBottom: 'var(--space-2)' }}>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--color-accent)',
              }}
            >
              Pergunta {currentStepIndex + 1} de {totalSteps}
            </span>
          </div>

          {/* Pergunta */}
          <h1
            style={{
              fontSize: 'clamp(20px, 4.5vw, 26px)',
              lineHeight: 1.25,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-6)',
            }}
          >
            {currentQuestion.question}
          </h1>

          {/* Opções de Resposta Grandes e Fáceis de Tocar */}
          <div
            role="radiogroup"
            aria-label={currentQuestion.question}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: 'var(--space-6)',
            }}
          >
            {currentQuestion.options.map((opt) => {
              const isChecked = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isChecked}
                  onClick={() => handleSelectOption(opt.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    minHeight: '54px',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: isChecked ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                    backgroundColor: isChecked ? 'var(--color-accent-soft)' : '#FFFFFF',
                    color: 'var(--color-text)',
                    fontSize: '15px',
                    fontWeight: isChecked ? 600 : 400,
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: isChecked ? '0 2px 10px rgba(0, 87, 217, 0.12)' : '0 2px 6px rgba(0, 0, 0, 0.02)',
                    transition: 'all 140ms ease',
                  }}
                >
                  <span style={{ lineHeight: 1.35, paddingRight: '12px' }}>{opt.label}</span>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '999px',
                      border: isChecked ? '0' : '2px solid var(--color-border)',
                      backgroundColor: isChecked ? 'var(--color-accent)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isChecked && <Check size={13} color="#FFFFFF" strokeWidth={3} aria-hidden="true" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Erro de Validação */}
          {error && (
            <div
              role="alert"
              style={{
                fontSize: '13px',
                color: 'var(--color-danger)',
                marginBottom: 'var(--space-4)',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* Botão de Continuação */}
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-on-accent)',
              border: 0,
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(0, 87, 217, 0.25)',
              transition: 'background-color 160ms ease',
            }}
          >
            <span>{currentStepIndex === totalSteps - 1 ? 'Ver o meu diagnóstico' : 'Continuar'}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </main>

      {/* Rodapé Mínimo Sem Distrações */}
      <footer
        style={{
          padding: '16px',
          textAlign: 'center',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
        }}
      >
        <span>Diagnóstico gratuito de autorrelato · Kit Emprego dos Sonhos</span>
      </footer>
    </div>
  );
}
