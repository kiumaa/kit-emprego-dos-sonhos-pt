import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FileSearch, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Header com logótipo oficial em destaque */}
      <Header isHome={true} />

      {/* Hero Principal — Focado, Limpo e Sem Distrações */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 'clamp(28px, 6vh, 48px)',
          paddingBottom: 'clamp(32px, 6vh, 56px)',
          paddingInline: 'clamp(16px, 4vw, 24px)',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <section
          style={{
            width: '100%',
            maxWidth: '620px',
            textAlign: 'center',
            marginInline: 'auto',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-accent)',
              backgroundColor: 'var(--color-accent-soft)',
              padding: '4px 14px',
              borderRadius: '999px',
              marginBottom: 'var(--space-4)',
            }}
          >
            Diagnóstico Gratuito · Mercado de Trabalho em Portugal
          </span>

          <h1
            style={{
              fontSize: 'clamp(28px, 6.5vw, 44px)',
              lineHeight: 1.15,
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--color-text)',
              marginBottom: 'var(--space-3)',
            }}
          >
            Estás farto de enviar currículos em Portugal e só receber silêncio?
          </h1>

          <p
            className="secondary"
            style={{
              fontSize: 'clamp(15px, 3.8vw, 17px)',
              lineHeight: 1.5,
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-8)',
              maxWidth: '560px',
              marginInline: 'auto',
            }}
          >
            Em Portugal, um recrutador demora apenas 7 segundos a descartar um currículo. Descobre gratuitamente os erros que estão a travar as tuas entrevistas e como corrigir hoje mesmo.
          </p>

          {/* Ações Principais */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              maxWidth: '420px',
              marginInline: 'auto',
              width: '100%',
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
              <span>Analisar o meu CV com IA — Gratuito</span>
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
              <span>Fazer o Quiz de 2 minutos (Sem CV)</span>
            </a>

            {/* Linha de Confiança */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                marginTop: 'var(--space-2)',
                flexWrap: 'wrap',
              }}
            >
              <CheckCircle2 size={14} color="var(--color-success)" aria-hidden="true" />
              <span>100% Gratuito · Confidencial · Sem registo nem cartão</span>
            </div>
          </div>

          {/* Secção de Choque de Realidade: Os 3 Erros Fatais */}
          <div
            style={{
              marginTop: 'var(--space-10)',
              paddingTop: 'var(--space-8)',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <h2
              style={{
                fontSize: '14px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-text-secondary)',
                margin: 0,
              }}
            >
              Porque é que 9 em cada 10 currículos são ignorados em Portugal?
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 'var(--space-3)',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                  1. Modelos do Canva & ATS
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  Colunas duplas, barras de competências e caixas de texto que os softwares de recrutamento descartam antes de qualquer humano ler.
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                  2. Listas de Tarefas sem Impacto
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  Descrever o que fazias no dia a dia em vez de mostrar resultados e métricas que provem que geras valor à empresa.
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                  3. Candidaturas no Escuro
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
                  Enviar o mesmo CV geral para centenas de anúncios sem adaptar palavras-chave estratégicas para o mercado português.
                </div>
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
