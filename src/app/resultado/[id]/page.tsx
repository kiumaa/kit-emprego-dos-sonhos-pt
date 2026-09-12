'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OfferPanel } from '@/components/ui/offer-panel';
import { VslPlayer } from '@/components/marketing/VslPlayer';
import { getFunnelConfig } from '@/lib/funnel-config';
import { UnifiedDiagnosticResult, DiagnosticPriority } from '@contracts/domain';
import { CheckCircle2, ArrowRight, HelpCircle, FileText, AlertCircle, ChevronDown, Check } from 'lucide-react';

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

        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-8) var(--layout-mobile-gutter)' }}>
          <div
            className="container-reading"
            style={{
              maxWidth: '460px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: 'var(--space-8) var(--space-6)',
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
                <span>Fazer Quiz de 8 Perguntas</span>
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
      <Header showBack={true} backHref="/quiz" backLabel="Novo teste" />

      <main style={{ flex: 1, padding: 'var(--space-6) var(--layout-mobile-gutter) var(--space-20) var(--layout-mobile-gutter)' }}>
        <div
          className="container-reading"
          style={{
            maxWidth: '680px',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
          }}
        >
          {/* ================================================================= */}
          {/* PARTE A: DIAGNÓSTICO GRATUITO (Concisão, Utilidade e Humanização) */}
          {/* ================================================================= */}
          <section
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: 'var(--space-8) var(--layout-mobile-gutter)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 32px rgba(29, 29, 31, 0.05)',
            }}
          >
            {/* Indicação e Título */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent-soft)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  marginBottom: 'var(--space-2)',
                }}
              >
                O teu diagnóstico
              </span>
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

            {/* As tuas prioridades — Máximo 3 Pontos com título, explicação e ação */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                As tuas prioridades
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {topPriorities.map((item: DiagnosticPriority, idx: number) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '14px',
                      padding: '16px',
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '999px',
                          backgroundColor: 'var(--color-accent)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                        {item.title}
                      </h3>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: '4px 0 8px 30px' }}>
                      {item.evidenceText || item.evidenceAnswer || 'Ponto crítico identificado na tua avaliação.'}
                    </p>
                    <div
                      style={{
                        marginLeft: '30px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--color-text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span style={{ color: 'var(--color-accent)' }}>Ação:</span>
                      <span>{item.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* O teu primeiro passo — Uma ação gratuita concreta */}
            <div
              style={{
                backgroundColor: 'var(--color-accent-soft)',
                borderRadius: '16px',
                padding: '16px 20px',
                border: '1px solid rgba(0, 87, 217, 0.15)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <CheckCircle2 size={22} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                  O teu primeiro passo gratuito
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text)', marginTop: '4px', lineHeight: 1.45, margin: 0 }}>
                  {result.freeAction?.description ||
                    'Revê as tuas experiências mais recentes e reformula as frases para incluírem números, prazos ou tarefas concretas executadas.'}
                </p>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* PARTE B: PONTE PARA A VENDA (#apresentacao)                        */}
          {/* ================================================================= */}
          <section
            style={{
              textAlign: 'center',
              padding: 'var(--space-4) 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(20px, 4.5vw, 26px)',
                lineHeight: 1.2,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--color-text)',
              }}
            >
              Já sabes onde começar. Agora falta saber como aplicar tudo isto.
            </h2>
            <p
              className="secondary"
              style={{
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.5,
                maxWidth: '520px',
              }}
            >
              Preparámos um método com modelos, mensagens e ferramentas para te ajudar a construir candidaturas mais fortes.
            </p>

            <a
              href="#apresentacao"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                height: '50px',
                padding: '0 28px',
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-on-accent)',
                borderRadius: 'var(--radius-control)',
                fontSize: '16px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0, 87, 217, 0.25)',
                marginTop: 'var(--space-2)',
                transition: 'background-color 160ms ease',
              }}
            >
              <span>Quero ver como funciona</span>
              <ChevronDown size={18} aria-hidden="true" />
            </a>
          </section>

          {/* ================================================================= */}
          {/* 6. VSL PROTAGONISTA (16:9 de Alta Visibilidade em Mobile)          */}
          {/* ================================================================= */}
          <VslPlayer
            id="apresentacao"
            src={funnelConfig.vsl.src}
            poster={funnelConfig.vsl.poster}
            captionsSrc={funnelConfig.vsl.captionsSrc}
            title="Antes de enviares a próxima candidatura, vê isto."
          />

          {/* ================================================================= */}
          {/* 7. OFERTA COM MOCKUP REALISTA E PREÇO ÚNICO DE 14,90 €             */}
          {/* ================================================================= */}
          <OfferPanel id="oferta" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
