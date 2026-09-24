'use client';

import React, { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VslPlayer } from '@/components/marketing/VslPlayer';
import { OfferPanel } from '@/components/ui/offer-panel';
import { StickyMobileCta } from '@/components/ui/sticky-mobile-cta';
import { getFunnelConfig } from '@/lib/funnel-config';
import { trackViewContent } from '@/lib/analytics/meta-tracking';

export default function ProductKitPage() {
  const funnelConfig = getFunnelConfig();

  useEffect(() => {
    trackViewContent('Kit Emprego dos Sonhos', 'kit', 14.99);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Header com o logótipo oficial em destaque */}
      <Header />

      <main style={{ flex: 1, padding: 'clamp(24px, 4vh, 40px) 0 clamp(48px, 8vh, 80px) 0' }}>
        <div
          className="container-reading"
          style={{
            maxWidth: '760px',
            marginInline: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
          }}
        >
          {/* Headline inicial e descrição curta */}
          <section style={{ textAlign: 'center', marginTop: 'var(--space-2)' }}>
            <h1
              style={{
                fontSize: 'clamp(26px, 5.5vw, 36px)',
                lineHeight: 1.2,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--color-text)',
                maxWidth: '640px',
                margin: '0 auto var(--space-3) auto',
              }}
            >
              Antes de enviares a próxima candidatura, vê isto.
            </h1>

            <p
              className="secondary"
              style={{
                fontSize: '16px',
                lineHeight: 1.5,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                marginInline: 'auto',
                margin: '0 auto',
              }}
            >
              Descobre como estruturar o teu currículo e candidaturas para passares nos filtros ATS e seres chamado para entrevistas no mercado de trabalho em Portugal.
            </p>
          </section>

          {/* VSL Protagonista (sem repetição de headline) */}
          <VslPlayer
            id="apresentacao"
            src={funnelConfig.vsl.src}
            poster={funnelConfig.vsl.poster}
            captionsSrc={funnelConfig.vsl.captionsSrc}
            title=""
          />

          {/* Oferta Completa com Mockup Editorial, Feedbacks Reais e Price Card */}
          <OfferPanel id="oferta" />
        </div>
      </main>

      {/* Botão de compra flutuante para mobile */}
      <StickyMobileCta />

      {/* Footer Legal */}
      <Footer />
    </div>
  );
}
