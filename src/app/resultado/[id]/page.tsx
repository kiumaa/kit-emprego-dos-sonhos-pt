'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ResultSummary } from '@/components/ui/result-summary';
import { InsightCard } from '@/components/ui/insight-card';
import { OfferPanel } from '@/components/ui/offer-panel';
import { VslPlayer } from '@/components/marketing/VslPlayer';
import { getFunnelConfig } from '@/lib/funnel-config';
import { UnifiedDiagnosticResult, DiagnosticPriority } from '@contracts/domain';
import { CheckCircle2, ArrowRight, HelpCircle, FileText, AlertCircle, ChevronDown } from 'lucide-react';

export default function ResultPage() {
  const params = useParams();
  const resultId = params.id as string;
  const [result, setResult] = useState<UnifiedDiagnosticResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const funnelConfig = getFunnelConfig();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`keds_result_${resultId}`);
      if (stored) {
        setResult(JSON.parse(stored));
        setLoading(false);
        return;
      }
    } catch {
      // Ignorar erro de storage
    }

    // AUDITORIA P0: Remoção estrita de fallbackAnswers predefinidas em rotas públicas!
    // Não inventar dados se a sessão expirou ou não existir.
    setNotFound(true);
    setLoading(false);
  }, [resultId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="secondary" style={{ fontSize: 'var(--type-body)' }}>A carregar os teus resultados...</p>
      </div>
    );
  }

  if (notFound || !result) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-raised)',
            padding: 'var(--space-4) var(--layout-mobile-gutter)',
          }}
        >
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/" style={{ fontSize: '18px', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)', textDecoration: 'none' }}>
              Emprego dos Sonhos
            </a>
          </div>
        </header>

        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12) var(--layout-mobile-gutter)' }}>
          <div
            className="container-form"
            style={{
              textAlign: 'center',
              backgroundColor: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-card)',
              padding: 'var(--space-10) var(--space-6)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-6)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={36} aria-hidden="true" />
            </div>

            <div>
              <h1 style={{ fontSize: 'var(--type-h2-mobile)', fontWeight: 'var(--weight-semibold)' }}>
                Diagnóstico não encontrado ou sessão expirada
              </h1>
              <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)', lineHeight: 1.5 }}>
                Por razões de privacidade e proteção de dados, os diagnósticos gratuitos não são armazenados de forma pública ou permanente. Podes iniciar um diagnóstico gratuito a qualquer momento.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%', maxWidth: '320px' }}>
              <a
                href="/quiz"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)',
                  height: '48px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-on-accent)',
                  borderRadius: 'var(--radius-control)',
                  fontWeight: 'var(--weight-semibold)',
                  textDecoration: 'none',
                }}
              >
                <HelpCircle size={18} aria-hidden="true" />
                <span>Fazer Quiz de 8 Perguntas</span>
              </a>
              <a
                href="/analisar-cv"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)',
                  height: '48px',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-control)',
                  fontWeight: 'var(--weight-medium)',
                  textDecoration: 'none',
                }}
              >
                <FileText size={18} aria-hidden="true" />
                <span>Analisar Currículo</span>
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const sourceLabel =
    result.source === 'cv'
      ? 'Diagnóstico por Análise de Currículo'
      : 'Diagnóstico por Questionário (Autorrelato)';

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', paddingBottom: 'var(--space-20)' }}>
      {/* 1. Marca discreta e indicação Portugal */}
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
        <div className="container header-container">
          <a href="/" className="header-brand">
            <span className="header-title">Emprego dos Sonhos</span>
            <span className="header-badge">Portugal</span>
          </a>

          <a
            href="/quiz"
            style={{
              fontSize: 'var(--type-small)',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 'var(--weight-medium)',
              whiteSpace: 'nowrap',
            }}
          >
            Novo diagnóstico
          </a>
        </div>
      </header>

      {/* 2. Título do resultado, resumo de 2-3 frases e prioridades */}
      <div className="container-reading" style={{ paddingTop: 'var(--space-10)', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        <ResultSummary
          title={result.title}
          summary={result.summary}
          disclaimer={result.disclaimer}
          sourceLabel={sourceLabel}
        />

        {/* Prioridades Justificadas */}
        <div>
          <h2 style={{ fontSize: 'var(--type-h2-mobile)', marginBottom: 'var(--space-4)' }}>
            As tuas prioridades imediatas
          </h2>
          <p className="secondary" style={{ marginBottom: 'var(--space-6)' }}>
            Com base na tua avaliação, estas são as ações mais relevantes para o teu momento profissional:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {result.priorities.map((item: DiagnosticPriority, idx: number) => (
              <InsightCard
                key={idx}
                title={item.title}
                action={item.action}
                kind={item.kind}
                evidenceAnswer={item.evidenceAnswer}
                evidenceText={item.evidenceText}
                source={item.source || sourceLabel}
              />
            ))}
          </div>
        </div>

        {/* 3. Uma ação gratuita concreta e útil */}
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
          <p style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
            {result.freeAction?.description ||
              'Revê os teus contactos no topo do currículo e certifica-te de que as tuas experiências mais recentes contêm tarefas concretas e resultados observáveis.'}
          </p>
        </section>

        {/* 4. CTA Âncora para a apresentação */}
        <div style={{ textAlign: 'center', margin: 'var(--space-4) 0' }}>
          <a
            href="#apresentacao"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              padding: '14px 28px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-on-accent)',
              borderRadius: 'var(--radius-control)',
              fontSize: '17px',
              fontWeight: 'var(--weight-semibold)',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0, 87, 217, 0.2)',
            }}
          >
            <span>Ver como preparar a minha candidatura</span>
            <ChevronDown size={18} aria-hidden="true" />
          </a>
        </div>

        {/* 5. Transição editorial */}
        <div
          style={{
            margin: 'var(--space-8) 0 var(--space-4) 0',
            textAlign: 'center',
            paddingTop: 'var(--space-8)',
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
            Método estruturado para Portugal
          </span>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', lineHeight: 1.15, marginTop: 'var(--space-2)' }}>
            Já tens um ponto de partida. Agora, prepara a próxima candidatura.
          </h2>
          <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
            Assiste à apresentação e conhece o conjunto completo de ferramentas e estratégias do Kit Emprego dos Sonhos.
          </p>
        </div>

        {/* 6. VSL Real */}
        <VslPlayer
          id="apresentacao"
          src={funnelConfig.vsl.src}
          poster={funnelConfig.vsl.poster}
          captionsSrc={funnelConfig.vsl.captionsSrc}
          title="Transforma o teu próximo passo numa candidatura preparada."
        />

        {/* 7. Apresentação da Oferta e Botão de Compra OKANDA */}
        <OfferPanel id="oferta" />

        {/* FAQ & Condições Transparentes */}
        <section style={{ marginTop: 'var(--space-8)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-8)' }}>
          <h3 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-4)', textAlign: 'center' }}>
            Perguntas Frequentes sobre a Compra e Entrega
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <details
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-control)',
                padding: 'var(--space-4)',
                border: '1px solid var(--color-border)',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--type-body)' }}>
                Como recebo os ficheiros após a compra?
              </summary>
              <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Os ficheiros são enviados automaticamente para o endereço de email que indicares no checkout da OKANDA. Vais receber as ligações diretas para descarregar o Guia principal em PDF, os modelos editáveis em Word (DOCX), as cartas e as mensagens.
              </p>
            </details>

            <details
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-control)',
                padding: 'var(--space-4)',
                border: '1px solid var(--color-border)',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--type-body)' }}>
                Preciso de algum programa específico para abrir os modelos?
              </summary>
              <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Não. Os modelos são ficheiros DOCX padrão compatíveis com Microsoft Word, Google Docs e LibreOffice. Não tens de utilizar nenhum editor online nem precisas de criar conta no nosso site.
              </p>
            </details>

            <details
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-control)',
                padding: 'var(--space-4)',
                border: '1px solid var(--color-border)',
              }}
            >
              <summary style={{ cursor: 'pointer', fontWeight: 'var(--weight-semibold)', fontSize: 'var(--type-body)' }}>
                Quais são os métodos de pagamento aceites?
              </summary>
              <p style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                O pagamento é processado pela OKANDA PAY com suporte aos métodos comuns em Portugal, incluindo MB WAY, cartão bancário e referência multibanco.
              </p>
            </details>
          </div>
        </section>
      </div>
    </div>
  );
}
