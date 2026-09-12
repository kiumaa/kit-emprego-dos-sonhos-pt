'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OfferPanel } from '@/components/ui/offer-panel';
import { VslPlayer } from '@/components/marketing/VslPlayer';
import { getFunnelConfig } from '@/lib/funnel-config';
import { CheckCircle2, HelpCircle, FileText, AlertCircle, ChevronDown, Download } from 'lucide-react';
import type { UnifiedDiagnosticResult, DiagnosticPriority } from '@contracts/domain';

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

    setNotFound(true);
    setLoading(false);
  }, [resultId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="secondary" style={{ fontSize: '15px' }}>A carregar os teus resultados...</p>
      </div>
    );
  }

  if (notFound || !result) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', display: 'flex', flexDirection: 'column' }}>
        <Header showBack={true} backHref="/" backLabel="Início" />

        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(20px, 4vh, 40px) 0' }}>
          <div
            className="container-reading"
            style={{
              maxWidth: '460px',
              marginInline: 'auto',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: 'clamp(24px, 5vw, 36px) clamp(18px, 4vw, 24px)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 30px rgba(29, 29, 31, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-4)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '999px',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertCircle size={28} aria-hidden="true" />
            </div>

            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
                Diagnóstico não encontrado ou sessão expirada
              </h1>
              <p className="secondary" style={{ marginTop: '8px', fontSize: '14px', lineHeight: 1.45 }}>
                Por razões de privacidade, os diagnósticos gratuitos não são armazenados de forma pública ou permanente. Podes iniciar um novo diagnóstico a qualquer momento.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px', marginTop: '8px' }}>
              <a
                href="/quiz"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  height: '48px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-on-accent)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <HelpCircle size={17} aria-hidden="true" />
                <span>Fazer Quiz de 5 Perguntas</span>
              </a>
              <a
                href="/analisar-cv"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  height: '48px',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <FileText size={17} aria-hidden="true" />
                <span>Analisar Currículo</span>
              </a>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Filtrar para no máximo 3 prioridades essenciais
  const topPriorities = (result.priorities || []).slice(0, 3);

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header com logo oficial e botão discreto de novo diagnóstico */}
      <Header
        showBack={true}
        backHref={result.source === 'cv' ? '/analisar-cv' : '/quiz'}
        backLabel={result.source === 'cv' ? 'Nova análise' : 'Novo teste'}
      />

      <main style={{ flex: 1, padding: 'clamp(20px, 3vh, 32px) 0 clamp(40px, 6vh, 64px) 0' }}>
        <div
          className="container-reading"
          style={{
            maxWidth: '720px',
            marginInline: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
          }}
        >
          {/* ================================================================= */}
          {/* PARTE A: DIAGNÓSTICO GRATUITO (Leve, Respirável e Visualmente Limpo) */}
          {/* ================================================================= */}
          <section
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: 'clamp(24px, 5vw, 40px) clamp(18px, 4vw, 36px)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 32px rgba(29, 29, 31, 0.04)',
            }}
          >
            {/* Indicação e Título */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent-soft)',
                  padding: '4px 14px',
                  borderRadius: '999px',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {result.source === 'cv' ? 'Diagnóstico do teu Currículo' : 'O teu diagnóstico'}
              </span>

              {result.targetRole && (
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                  Candidatura para: <strong style={{ color: 'var(--color-text)' }}>{result.targetRole}</strong>
                </div>
              )}

              <h1
                style={{
                  fontSize: 'clamp(24px, 5.5vw, 32px)',
                  lineHeight: 1.2,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text)',
                  marginTop: 'var(--space-1)',
                }}
              >
                {result.title}
              </h1>
              <p
                className="secondary"
                style={{
                  fontSize: '15px',
                  lineHeight: 1.5,
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--space-3)',
                  maxWidth: '540px',
                  marginInline: 'auto',
                }}
              >
                {result.summary}
              </p>
            </div>

            {/* As tuas prioridades — 3 Pontos Estruturados e Leves */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                Prioridades identificadas
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topPriorities.map((item: DiagnosticPriority, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      border: '1px solid rgba(0, 0, 0, 0.04)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-accent)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                        {item.action || item.evidenceAnswer || item.evidenceText}
                      </div>
                      {item.evidenceText && item.action && (
                        <div
                          style={{
                            marginTop: '6px',
                            fontSize: '12px',
                            color: 'var(--color-text-secondary)',
                            fontStyle: 'italic',
                            backgroundColor: 'rgba(0, 0, 0, 0.03)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            borderLeft: '2px solid var(--color-accent)',
                          }}
                        >
                          Excerto do CV: &ldquo;{item.evidenceText}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* O teu primeiro passo — Uma ação gratuita concreta */}
            <div
              style={{
                backgroundColor: 'var(--color-accent-soft)',
                borderRadius: '14px',
                padding: '14px 18px',
                border: '1px solid rgba(0, 87, 217, 0.15)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              <CheckCircle2 size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Ação Imediata · {result.freeAction?.title || 'Revisão Prática'}
                </span>
                <p style={{ fontSize: '14px', color: 'var(--color-text)', marginTop: '2px', lineHeight: 1.45, margin: 0 }}>
                  {result.freeAction?.description ||
                    'Revê as tuas experiências mais recentes e reformula as frases para incluírem números, prazos ou tarefas concretas executadas.'}
                </p>
                {result.freeAction?.sampleUrl && (
                  <a
                    href={result.freeAction.sampleUrl}
                    download
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--color-accent)',
                      textDecoration: 'none',
                    }}
                  >
                    <Download size={14} aria-hidden="true" />
                    <span>{result.freeAction.actionLabel || 'Descarregar Modelo Gratuito'}</span>
                  </a>
                )}
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* PARTE B: PONTE DIRETA E LEVE PARA A VSL (#apresentacao)           */}
          {/* ================================================================= */}
          <section
            style={{
              textAlign: 'center',
              padding: 'var(--space-2) 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(20px, 4.5vw, 26px)',
                lineHeight: 1.25,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--color-text)',
                maxWidth: '560px',
              }}
            >
              Como aplicar estas recomendações passo a passo?
            </h2>
            <p
              className="secondary"
              style={{
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
                maxWidth: '500px',
              }}
            >
              Vê a apresentação oficial de 3 minutos para descobrires a metodologia completa.
            </p>

            <a
              href="#apresentacao"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '48px',
                padding: '0 24px',
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-on-accent)',
                borderRadius: 'var(--radius-control)',
                fontSize: '15px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(0, 87, 217, 0.22)',
                marginTop: 'var(--space-1)',
                transition: 'background-color 160ms ease',
              }}
            >
              <span>Ver apresentação em vídeo</span>
              <ChevronDown size={17} aria-hidden="true" />
            </a>
          </section>

          {/* ================================================================= */}
          {/* PARTE C: VSL PROTAGONISTA (16:9 de Alta Visibilidade em Mobile)   */}
          {/* ================================================================= */}
          <VslPlayer
            id="apresentacao"
            src={funnelConfig.vsl.src}
            poster={funnelConfig.vsl.poster}
            captionsSrc={funnelConfig.vsl.captionsSrc}
            title="Antes de enviares a próxima candidatura, vê isto."
          />

          {/* ================================================================= */}
          {/* PARTE D: OFERTA COM MOCKUP REALISTA E PREÇO ÚNICO DE 14,99 €      */}
          {/* ================================================================= */}
          <OfferPanel id="oferta" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
