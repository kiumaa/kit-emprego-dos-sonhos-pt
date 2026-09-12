'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ResultSummary } from '@/components/ui/result-summary';
import { InsightCard } from '@/components/ui/insight-card';
import { LeadCapture } from '@/components/ui/lead-capture';
import { OfferPanel } from '@/components/ui/offer-panel';
import { ResourceTile } from '@/components/ui/resource-tile';
import { QuizResult, evaluateQuiz } from '@/lib/quiz/quiz-engine';
import { CheckCircle2, PlayCircle, FileText } from 'lucide-react';

export default function ResultPage() {
  const params = useParams();
  const resultId = params.id as string;
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`keds_result_${resultId}`);
      if (stored) {
        setResult(JSON.parse(stored));
        return;
      }
    } catch {
      // Ignorar erro de storage
    }

    // Fallback com dados determinísticos para preview/testes se acedido diretamente
    const fallbackAnswers = {
      q1: 'primeiro',
      q2: 'administrativo',
      q3: 'desatualizado',
      q4: 'pontual',
      q5: 'exemplos',
      q6: 'memoria',
      q7: 'adaptada',
      q8: 'verifico',
    };
    setResult(evaluateQuiz(fallbackAnswers));
  }, [resultId]);

  if (!result) {
    return (
      <div className="container" style={{ padding: 'var(--space-16) 0', textAlign: 'center' }}>
        <p className="secondary">A carregar os teus resultados...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: 'var(--space-20)' }}>
      {/* Top Header */}
      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface-raised)',
          padding: 'var(--space-4) var(--layout-mobile-gutter)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          className="container"
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
          <a
            href="/quiz"
            style={{
              fontSize: 'var(--type-small)',
              color: 'var(--color-accent)',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            Repetir diagnóstico
          </a>
        </div>
      </header>

      {/* Hero Summary */}
      <div className="container-reading" style={{ paddingTop: 'var(--space-10)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        <ResultSummary
          title={result.title}
          summary={result.summary}
          disclaimer={result.disclaimer}
          sourceLabel="Diagnóstico por Questionário (Autorrelato)"
        />

        {/* Priorities / Insights */}
        <div>
          <h2 style={{ fontSize: 'var(--type-h2-mobile)', marginBottom: 'var(--space-4)' }}>
            As tuas 3 prioridades imediatas
          </h2>
          <p className="secondary" style={{ marginBottom: 'var(--space-6)' }}>
            Com base nas tuas respostas, estas são as ações mais eficazes para o teu momento:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {result.priorities.map((item, idx) => (
              <InsightCard
                key={idx}
                title={item.title}
                action={item.action}
                kind={item.kind}
                evidenceAnswer={item.evidenceAnswer}
                source="Autorrelato do questionário"
              />
            ))}
          </div>
        </div>

        {/* Free First Action */}
        <section
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--space-6)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <CheckCircle2 size={20} color="var(--color-success)" aria-hidden="true" />
            <h3 style={{ fontSize: 'var(--type-h3)' }}>O teu próximo passo gratuito</h3>
          </div>
          <p style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)', marginBottom: 'var(--space-4)' }}>
            Podes começar já hoje a trabalhar na tua candidatura. Descarrega o nosso modelo essencial para Word e preenche os teus dados externamente:
          </p>
          <div style={{ maxWidth: '320px' }}>
            <ResourceTile
              title="Modelo CV Essencial (DOCX)"
              description="Estrutura limpa e recomendada para edição externa."
              format="DOCX"
              version="2.0"
              onDownload={() => alert('Download do modelo gratuito iniciado.')}
            />
          </div>
        </section>

        {/* Lead Capture */}
        <section style={{ marginTop: 'var(--space-4)' }}>
          <LeadCapture
            onSavePlan={async (data) => {
              console.log('Plano enviado:', data);
              await new Promise((r) => setTimeout(r, 800));
            }}
          />
        </section>

        {/* Editorial Divider / Transition to Kit Offer */}
        <div
          style={{
            margin: 'var(--space-10) 0',
            textAlign: 'center',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <span
            style={{
              fontSize: 'var(--type-small)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Queres ir mais longe com método estruturado?
          </span>
          <h2 style={{ fontSize: 'var(--type-h2-desktop)', marginTop: 'var(--space-2)' }}>
            Prepara cada candidatura com confiança total
          </h2>
          <p className="secondary" style={{ marginTop: 'var(--space-2)' }}>
            Vê como o Kit Emprego dos Sonhos organiza todo o teu percurso de procura de emprego em Portugal.
          </p>

          {/* VSL Section (Video / Editorial) */}
          <div
            style={{
              marginTop: 'var(--space-6)',
              backgroundColor: '#1D1D1F',
              borderRadius: 'var(--radius-card)',
              color: '#FFFFFF',
              padding: 'var(--space-10) var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '260px',
              gap: 'var(--space-4)',
            }}
          >
            <PlayCircle size={56} color="var(--color-accent-soft)" aria-hidden="true" />
            <div style={{ textAlign: 'center', maxWidth: '480px' }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '20px' }}>Apresentação em Vídeo (VSL)</h3>
              <p style={{ color: '#A1A1A6', fontSize: '14px', marginTop: '6px' }}>
                Conhece a estratégia passo-a-passo para te destacares nas entrevistas e recrutamentos em Portugal.
              </p>
            </div>
          </div>
        </div>

        {/* Commercial Offer Panel */}
        <OfferPanel
          onCheckout={() => {
            alert('Redirecionamento seguro para a página de checkout da OKANDA.');
          }}
        />
      </div>
    </div>
  );
}
