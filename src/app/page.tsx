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
          paddingTop: 'clamp(32px, 8vh, 64px)',
          paddingBottom: 'clamp(40px, 8vh, 72px)',
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
              <span>Fazer Quiz (Sem CV)</span>
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
        </section>
      </main>

      {/* Footer Mínimo */}
      <Footer />
    </div>
  );
}
