'use client';

import React from 'react';
import { ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { getValidatedCheckoutUrl } from '@/lib/funnel-config';
import { ProductMockup } from '@/components/marketing/ProductMockup';
import { trackInitiateCheckout } from '@/lib/analytics/meta-tracking';

export interface OfferPanelProps {
  id?: string;
  title?: string;
  subtitle?: string;
}

export const OfferPanel: React.FC<OfferPanelProps> = ({
  id = 'oferta',
  title = 'Kit Emprego dos Sonhos — Portugal',
  subtitle = 'Tudo o que precisas para preparar e submeter candidaturas mais consistentes no mercado português.',
}) => {
  const checkout = getValidatedCheckoutUrl();

  return (
    <section
      id={id}
      style={{
        width: '100%',
        maxWidth: '820px',
        marginInline: 'auto',
        scrollMarginTop: '80px',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
      aria-label="Apresentação da Oferta do Kit Emprego dos Sonhos"
    >
      {/* 1. Mockup Editorial dos 4 Componentes do Kit */}
      <ProductMockup />

      {/* 2. Bloco Principal da Oferta (Leve, Clean e de Alta Conversão) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: 'clamp(24px, 5vw, 40px) clamp(20px, 4vw, 36px)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 12px 40px rgba(29, 29, 31, 0.06)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
      >
        <div>
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
            }}
          >
            Acesso Completo e Imediato
          </span>
          <h2
            style={{
              fontSize: 'clamp(24px, 5vw, 34px)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--color-text)',
              marginTop: 'var(--space-2)',
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>
          <p
            className="secondary"
            style={{
              fontSize: '15px',
              marginTop: 'var(--space-2)',
              maxWidth: '520px',
              marginInline: 'auto',
              lineHeight: 1.5,
              color: 'var(--color-text-secondary)',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Preço de 14,99 € com "pagamento único" abaixo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            margin: '6px 0 10px 0',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(42px, 8vw, 54px)',
              fontWeight: 700,
              color: 'var(--color-text)',
              letterSpacing: '-0.035em',
              lineHeight: 1,
            }}
          >
            14,99 €
          </span>
          <span
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            pagamento único
          </span>
        </div>

        {/* CTA Principal para Checkout OKANDA */}
        {checkout.isConfigured && checkout.url ? (
          <a
            href={checkout.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackInitiateCheckout('kit', 14.99)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              maxWidth: '440px',
              minHeight: '52px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-on-accent)',
              borderRadius: 'var(--radius-control)',
              fontSize: '17px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 6px 20px rgba(0, 87, 217, 0.28)',
              transition: 'background-color 160ms ease, transform 160ms ease',
              padding: '14px 24px',
              boxSizing: 'border-box',
            }}
          >
            <span>Quero o Kit Completo — 14,99 €</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        ) : (
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-control)',
              textAlign: 'center',
              width: '100%',
              maxWidth: '440px',
              border: '1px solid var(--color-border)',
            }}
          >
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', margin: 0 }}>
              Checkout oficial em preparação
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px', margin: 0 }}>
              O link de compra na OKANDA PAY será ativado assim que os parâmetros comerciais forem finalizados.
            </p>
          </div>
        )}

        {/* Trust strip em linha única */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            marginTop: '4px',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Check size={15} color="var(--color-accent)" aria-hidden="true" />
            Entrega imediata por email
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={15} color="var(--color-accent)" aria-hidden="true" />
            Pagamento seguro OKANDA PAY
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Check size={15} color="var(--color-accent)" aria-hidden="true" />
            Sem fidelização nem subscrições
          </span>
        </div>

        {/* 3. Aceleradores Opcionais (Bumps na OKANDA) — Caixa Leve e Discreta */}
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            marginTop: 'var(--space-3)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: '14px',
            padding: '14px 18px',
            border: '1px solid var(--color-border)',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
            Aceleradores opcionais disponíveis no checkout:
          </div>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)',
              marginTop: '4px',
              lineHeight: 1.4,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div>
              • <strong>Entrevista dos Sonhos (+ 4,99 €):</strong> Manual prático e Caderno STAR.
            </div>
            <div>
              • <strong>LinkedIn dos Sonhos (+ 5,99 €):</strong> Manual de perfil e abordagem direta.
            </div>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
            A seleção dos complementos é 100% opcional e feita diretamente na página de pagamento da OKANDA.
          </div>
        </div>
      </div>
    </section>
  );
};
