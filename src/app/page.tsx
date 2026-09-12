import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FileSearch, HelpCircle, CheckCircle2, ShieldCheck, Target, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Header com logótipo oficial em destaque */}
      <Header />

      {/* Hero Principal — Direto, Limpo e Focado na Conversão */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <section
          style={{
            padding: 'var(--space-10) var(--layout-mobile-gutter) var(--space-12) var(--layout-mobile-gutter)',
            textAlign: 'center',
          }}
        >
          <div className="container-reading" style={{ maxWidth: '600px' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-accent)',
                backgroundColor: 'var(--color-accent-soft)',
                padding: '4px 14px',
                borderRadius: '999px',
                marginBottom: 'var(--space-4)',
              }}
            >
              Diagnóstico Gratuito de Candidatura
            </span>

            <h1
              style={{
                fontSize: 'clamp(28px, 6.5vw, 40px)',
                lineHeight: 1.15,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--color-text)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Antes da próxima candidatura, descobre o que podes melhorar.
            </h1>

            <p
              className="secondary"
              style={{
                fontSize: 'clamp(15px, 3.5vw, 17px)',
                lineHeight: 1.5,
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--space-8)',
                maxWidth: '500px',
                marginInline: 'auto',
              }}
            >
              Analisa o teu CV ou responde a algumas perguntas e recebe um diagnóstico gratuito.
            </p>

            {/* Ações Principais (Únicas no ecrã — sem duplicações) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                maxWidth: '380px',
                marginInline: 'auto',
              }}
            >
              <a
                href="/analisar-cv"
                style={{
                  height: '52px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-on-accent)',
                  borderRadius: 'var(--radius-control)',
                  fontSize: '16px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0, 87, 217, 0.25)',
                  transition: 'background-color 160ms ease, transform 160ms ease',
                }}
              >
                <FileSearch size={19} aria-hidden="true" />
                <span>Analisar o meu CV</span>
              </a>

              <a
                href="/quiz"
                style={{
                  height: '48px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text)',
                  borderRadius: 'var(--radius-control)',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '1px solid var(--color-border)',
                  transition: 'background-color 160ms ease',
                }}
              >
                <HelpCircle size={18} color="var(--color-text-secondary)" aria-hidden="true" />
                <span>Não tenho o CV comigo — fazer o quiz</span>
              </a>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--space-2)',
                }}
              >
                <CheckCircle2 size={14} color="var(--color-success)" aria-hidden="true" />
                <span>Gratuito · Sem cartão · 100% Confidencial</span>
              </div>
            </div>
          </div>
        </section>

        {/* Secção Leve e Discreta: Como te ajudamos (Sem duplicações de cartões) */}
        <section
          style={{
            padding: 'var(--space-10) var(--layout-mobile-gutter) var(--space-16) var(--layout-mobile-gutter)',
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="container-reading" style={{ maxWidth: '680px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--space-6)',
                textAlign: 'left',
              }}
            >
              {/* Ponto 1: Diagnóstico */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-accent-soft)',
                    color: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Target size={18} aria-hidden="true" />
                </div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                  Sem rodeios
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  Identificamos de imediato os pontos mais críticos que os recrutadores em Portugal notam num currículo.
                </p>
              </div>

              {/* Ponto 2: Prático */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-surface-raised)',
                    color: 'var(--color-text)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <Zap size={18} aria-hidden="true" />
                </div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                  Ação imediata
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  Recebes prioridades claras e uma recomendação gratuita que podes aplicar logo na próxima candidatura.
                </p>
              </div>

              {/* Ponto 3: Seguro */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-surface-raised)',
                    color: 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <ShieldCheck size={18} aria-hidden="true" />
                </div>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                  100% Seguro
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  Leitura em memória volátil. O teu documento nunca é partilhado, armazenado em bases de dados públicas ou vendido.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Mínimo */}
      <Footer />
    </div>
  );
}
