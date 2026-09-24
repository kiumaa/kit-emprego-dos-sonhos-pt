'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OfferPanel } from '@/components/ui/offer-panel';
import { StickyMobileCta } from '@/components/ui/sticky-mobile-cta';
import { VslPlayer } from '@/components/marketing/VslPlayer';
import { getFunnelConfig } from '@/lib/funnel-config';
import { CheckCircle2, HelpCircle, FileText, AlertCircle, ChevronDown, Download, ArrowRight } from 'lucide-react';
import type { UnifiedDiagnosticResult, DiagnosticPriority } from '@contracts/domain';
import { trackViewContent } from '@/lib/analytics/meta-tracking';

export default function ResultPage() {
  const params = useParams();
  const resultId = params.id as string;
  const [result, setResult] = useState<UnifiedDiagnosticResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showFullDiagnostic, setShowFullDiagnostic] = useState(false);
  const [showResultCard, setShowResultCard] = useState(false);

  const funnelConfig = getFunnelConfig();

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(`keds_result_${resultId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          parsed &&
          typeof parsed === 'object' &&
          typeof parsed.title === 'string' &&
          typeof parsed.summary === 'string' &&
          Array.isArray(parsed.priorities)
        ) {
          setResult(parsed);
          setLoading(false);
          trackViewContent('Resultado do Diagnóstico', resultId);
          return;
        }
      }
    } catch {
      // Ignorar erro de storage malformado
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
          {/* BOTÃO VER RESULTADO (Oculto por defeito para máxima visibilidade da oferta) */}
          {/* ================================================================= */}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: showResultCard ? '0' : 'var(--space-2)' }}>
            <button
              type="button"
              onClick={() => setShowResultCard((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                padding: '12px 26px',
                backgroundColor: showResultCard ? 'var(--color-surface)' : '#FFFFFF',
                color: 'var(--color-text)',
                border: '1.5px solid var(--color-border)',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.02em',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(29, 29, 31, 0.06)',
                transition: 'all 160ms ease',
              }}
            >
              <FileText size={17} color="var(--color-accent)" aria-hidden="true" />
              <span>{showResultCard ? 'Ocultar Diagnóstico' : 'VER RESULTADO'}</span>
              <ChevronDown
                size={16}
                color="var(--color-text-secondary)"
                style={{
                  transform: showResultCard ? 'rotate(180deg)' : 'none',
                  transition: 'transform 200ms ease',
                }}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* ================================================================= */}
          {/* PARTE A: DIAGNÓSTICO GRATUITO (Apenas visível após clique em VER RESULTADO) */}
          {/* ================================================================= */}
          {showResultCard && (
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

              {/* Botão de expansão / recolhimento do diagnóstico completo */}
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowFullDiagnostic((prev) => !prev)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 22px',
                    backgroundColor: showFullDiagnostic ? 'var(--color-surface)' : 'rgba(0, 87, 217, 0.08)',
                    color: 'var(--color-accent)',
                    border: '1px solid rgba(0, 87, 217, 0.22)',
                    borderRadius: '999px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 160ms ease',
                  }}
                >
                  <span>{showFullDiagnostic ? 'Ocultar diagnóstico detalhado' : 'Diagnóstico completo'}</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: showFullDiagnostic ? 'rotate(180deg)' : 'none',
                      transition: 'transform 200ms ease',
                    }}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            {/* Conteúdo colapsável com prioridades e ação prática */}
            {showFullDiagnostic && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%', marginTop: 'var(--space-2)' }}>
                {/* As tuas prioridades — 3 Pontos Estruturados e Leves */}
                <div style={{ marginBottom: 'var(--space-2)' }}>
                  <h2
                    style={{
                      fontSize: '15px',
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
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Camada B: Disclosure Acessível com Diagnóstico Completo e Excertos */}
                  {topPriorities.some((p: DiagnosticPriority) => p.evidenceText) && (
                    <details
                      style={{
                        marginTop: '12px',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        fontSize: '13px',
                      }}
                    >
                      <summary style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--color-text)' }}>
                        Ver excertos textuais analisados
                      </summary>
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {topPriorities
                          .filter((p: DiagnosticPriority) => p.evidenceText)
                          .map((p: DiagnosticPriority, i: number) => (
                            <div
                              key={i}
                              style={{
                                padding: '8px 12px',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '8px',
                                borderLeft: '3px solid var(--color-accent)',
                                fontSize: '12px',
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              <strong style={{ color: 'var(--color-text)' }}>{p.title}:</strong> &ldquo;{p.evidenceText}&rdquo;
                            </div>
                          ))}
                      </div>
                    </details>
                  )}
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
              </div>
            )}
          </section>
          )}

          {/* ================================================================= */}
          {/* PARTE B: PONTE INEVITÁVEL PARA A OFERTA (#oferta / #apresentacao)  */}
          {/* ================================================================= */}
          <section
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: 'clamp(24px, 4vw, 36px)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 30px rgba(0, 87, 217, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              textAlign: 'center',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-accent)',
                backgroundColor: 'var(--color-accent-soft)',
                padding: '4px 12px',
                borderRadius: '999px',
              }}
            >
              O Teu Próximo Passo Decisivo
            </span>

            <h2
              style={{
                fontSize: 'clamp(22px, 5vw, 30px)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--color-text)',
                maxWidth: '620px',
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              O teu diagnóstico revelou falhas que te estão a custar chamadas para entrevistas em Portugal.
            </h2>

            <p
              style={{
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              Quanto tempo mais vais perder a enviar candidaturas no escuro? A partir de hoje tens duas opções:
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--space-3)',
                width: '100%',
                maxWidth: '680px',
                textAlign: 'left',
                margin: 'var(--space-2) 0',
              }}
            >
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#D9381E', marginBottom: '4px' }}>
                  ❌ Opção 1: Continuar por tentativa e erro
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  Passar semanas a reescrever o currículo sem saber se passa nos filtros ATS, continuar a usar modelos do Canva e arriscar mais meses sem respostas.
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(0, 87, 217, 0.04)',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 87, 217, 0.25)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent)', marginBottom: '4px' }}>
                  ✅ Opção 2: Descarregar o Kit Completo (14,99 €)
                </div>
                <div style={{ fontSize: '13px', color: 'var(--color-text)', lineHeight: 1.45 }}>
                  Descarregar os 14 ficheiros prontos e validados em Word (.docx), copiar as estruturas comprovadas e submeter candidaturas blindadas ainda hoje.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', width: '100%', maxWidth: '520px' }}>
              <a
                href="#oferta"
                className="btn-pulse"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  minHeight: '52px',
                  flex: '1 1 240px',
                  padding: '12px 24px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-on-accent)',
                  borderRadius: 'var(--radius-control)',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 6px 20px rgba(0, 87, 217, 0.28)',
                  transition: 'background-color 160ms ease',
                  boxSizing: 'border-box',
                }}
              >
                <span>Ver os Modelos e o Kit (14,99 €)</span>
                <ArrowRight size={17} aria-hidden="true" />
              </a>

              <a
                href="#apresentacao"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  minHeight: '48px',
                  flex: '1 1 180px',
                  padding: '10px 18px',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  borderRadius: 'var(--radius-control)',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '1px solid var(--color-border)',
                  transition: 'background-color 160ms ease',
                  boxSizing: 'border-box',
                }}
              >
                <span>Saber mais</span>
                <ChevronDown size={16} aria-hidden="true" />
              </a>
            </div>
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

      {/* Botão de compra flutuante para mobile */}
      <StickyMobileCta />

      <Footer />
    </div>
  );
}
