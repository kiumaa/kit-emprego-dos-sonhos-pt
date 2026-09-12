'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import defaultSpec from '../../../content/quiz/quiz.json';
import { ProgressStepper } from '@/components/ui/progress-stepper';
import { ChoiceGroup } from '@/components/ui/choice-group';
import { Button } from '@/components/ui/button';
import { evaluateQuiz } from '@/lib/quiz/quiz-engine';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore answers from session storage if returning
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('keds_quiz_answers');
      if (saved) {
        setAnswers(JSON.parse(saved));
      }
    } catch {
      // Ignorar erros de storage
    }
  }, []);

  const totalSteps = defaultSpec.questions.length;
  const currentQuestion = defaultSpec.questions[currentStepIndex];
  const selectedOption = answers[currentQuestion.id] || '';

  const handleSelectOption = (optionId: string) => {
    setError(null);
    const updated = {
      ...answers,
      [currentQuestion.id]: optionId,
    };
    setAnswers(updated);
    try {
      sessionStorage.setItem('keds_quiz_answers', JSON.stringify(updated));
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
      // Última pergunta -> Calcular resultado
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
      const result = evaluateQuiz(answers);
      const resultId = `qz-${Date.now().toString(36)}`;
      sessionStorage.setItem(`keds_result_${resultId}`, JSON.stringify(result));
      router.push(`/resultado/${resultId}`);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setError((err as Error).message || 'Ocorreu um erro ao avaliar o questionário.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header */}
      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface-raised)',
          padding: 'var(--space-4) var(--layout-mobile-gutter)',
        }}
      >
        <div
          className="container-form"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <a
            href="/"
            style={{
              fontSize: '18px',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--color-text)',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
            }}
          >
            Emprego dos Sonhos
          </a>
          <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
            Diagnóstico Gratuito
          </span>
        </div>
      </header>

      {/* Main Quiz Stepper & Question Form */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 'var(--space-8) var(--layout-mobile-gutter)',
        }}
      >
        <div
          className="container-form"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
          }}
        >
          {/* Stepper Progress */}
          <ProgressStepper
            currentStep={currentStepIndex + 1}
            totalSteps={totalSteps}
            labelPrefix="Pergunta"
          />

          {/* Question Card */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              padding: 'var(--space-8) var(--space-6)',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <h1
              style={{
                fontSize: 'var(--type-h2-mobile)',
                lineHeight: 'var(--line-height-subheading)',
                marginBottom: 'var(--space-6)',
                fontWeight: 'var(--weight-semibold)',
              }}
            >
              {currentQuestion.question}
            </h1>

            <ChoiceGroup
              name={`question-${currentQuestion.id}`}
              legend=""
              options={currentQuestion.options}
              selectedValue={selectedOption}
              onChange={handleSelectOption}
              error={error || undefined}
            />
          </div>

          {/* Navigation Controls */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}
          >
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={currentStepIndex === 0 || isSubmitting}
              style={{ visibility: currentStepIndex === 0 ? 'hidden' : 'visible' }}
            >
              <ArrowLeft size={18} aria-hidden="true" />
              <span>Voltar</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              isLoading={isSubmitting}
              style={{ minWidth: '160px' }}
            >
              {currentStepIndex === totalSteps - 1 ? (
                <>
                  <Sparkles size={18} aria-hidden="true" />
                  <span>Ver Diagnóstico</span>
                </>
              ) : (
                <>
                  <span>Continuar</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
