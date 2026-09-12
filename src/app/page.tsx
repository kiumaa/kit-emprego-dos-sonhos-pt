import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FileSearch, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Header com apenas o logótipo oficial */}
      <Header />

      {/* Hero Principal — Foco Total na Decisão Gratuita */}
      <main style={{ flex: 1 }}>
        <section
          style={{
            padding: 'var(--space-8) var(--layout-mobile-gutter) var(--space-10) var(--layout-mobile-gutter)',
            textAlign: 'center',
          }}
        >
          <div className="container-reading" style={{ maxWidth: '640px' }}>
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
                marginBottom: 'var(--space-6)',
                maxWidth: '520px',
                marginInline: 'auto',
              }}
            >
              Analisa o teu CV ou responde a algumas perguntas e recebe um diagnóstico gratuito.
            </p>

            {/* CTAs Principais */}
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
                  marginTop: 'var(--space-1)',
                }}
              >
                <CheckCircle2 size={14} color="var(--color-success)" aria-hidden="true" />
                <span>Gratuito · Sem cartão</span>
              </div>
            </div>

            {/* Imagem de Apoio Humana e Profissional */}
            <div
              style={{
                marginTop: 'var(--space-8)',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 30px rgba(29, 29, 31, 0.05)',
                position: 'relative',
              }}
            >
              <img
                src="/images/ref-cv.png"
                alt="Profissional a preparar a sua candidatura em Portugal"
                style={{
                  width: '100%',
                  maxHeight: '360px',
                  objectFit: 'cover',
                  objectPosition: 'center 20%',
                  display: 'block',
                }}
                loading="eager"
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  insetInline: 0,
                  padding: '16px 20px',
                  background: 'linear-gradient(to top, rgba(29, 29, 31, 0.8) 0%, rgba(29, 29, 31, 0) 100%)',
                  color: '#FFFFFF',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  Clareza para o mercado de trabalho em Portugal
                </span>
                <span style={{ fontSize: '12px', color: '#D2D2D7' }}>
                  100% Confidencial
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Secção Imediatamente Abaixo: Escolhe como queres começar */}
        <section
          style={{
            padding: 'var(--space-8) var(--layout-mobile-gutter) var(--space-16) var(--layout-mobile-gutter)',
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <div className="container-reading" style={{ maxWidth: '640px' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <h2
                style={{
                  fontSize: 'clamp(22px, 5vw, 28px)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--color-text)',
                }}
              >
                Escolhe como queres começar
              </h2>
              <p className="secondary" style={{ fontSize: '14px', marginTop: '4px' }}>
                Os dois caminhos são gratuitos e mostram-te onde podes melhorar.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--space-4)',
              }}
            >
              {/* Opção 1: Analisar CV */}
              <a
                href="/analisar-cv"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  border: '1px solid var(--color-border)',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(29, 29, 31, 0.04)',
                  transition: 'transform 160ms ease, border-color 160ms ease',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-accent-soft)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <FileSearch size={22} aria-hidden="true" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                    Tenho o meu CV
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.45 }}>
                    Envia o teu ficheiro PDF, Word ou cola o texto para uma leitura estruturada dos pontos mais fracos e fortes.
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    marginTop: '16px',
                  }}
                >
                  <span>Analisar CV agora</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </div>
              </a>

              {/* Opção 2: Fazer Quiz */}
              <a
                href="/quiz"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '24px 20px',
                  border: '1px solid var(--color-border)',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(29, 29, 31, 0.04)',
                  transition: 'transform 160ms ease, border-color 160ms ease',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '14px',
                    }}
                  >
                    <HelpCircle size={22} aria-hidden="true" />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                    Não tenho o CV à mão
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.45 }}>
                    Responde a 8 perguntas simples em menos de 2 minutos e descobre as tuas prioridades imediatas.
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-accent)',
                    marginTop: '16px',
                  }}
                >
                  <span>Iniciar questionário</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Mínimo */}
      <Footer />
    </div>
  );
}
