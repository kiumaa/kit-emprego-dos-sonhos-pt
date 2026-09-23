'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, Check, Star } from 'lucide-react';
import { getValidatedCheckoutUrl } from '@/lib/funnel-config';
import { ProductMockup } from '@/components/marketing/ProductMockup';
import { trackInitiateCheckout } from '@/lib/analytics/meta-tracking';
import { appendTrackingToUrl } from '@/lib/analytics/utm-tracker';

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
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(checkout.url);

  useEffect(() => {
    if (checkout.url) {
      setCheckoutUrl(appendTrackingToUrl(checkout.url));
    }
  }, [checkout.url]);

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

        {/* Avaliação e Prova Social Discreta */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '999px',
            padding: '5px 14px',
            fontSize: '12px',
            color: 'var(--color-text)',
            fontWeight: 500,
          }}
        >
          <div style={{ display: 'flex', gap: '2px', color: '#F5A623' }}>
            <Star size={13} fill="#F5A623" />
            <Star size={13} fill="#F5A623" />
            <Star size={13} fill="#F5A623" />
            <Star size={13} fill="#F5A623" />
            <Star size={13} fill="#F5A623" />
          </div>
          <span><strong>4.9/5</strong> · Recomendado para o mercado de trabalho em Portugal</span>
        </div>

        {/* Preço e Destaque de Valor */}
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
              fontSize: 'clamp(44px, 8vw, 56px)',
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
            pagamento único · sem mensalidades
          </span>
          <span
            style={{
              fontSize: '13px',
              color: 'var(--color-accent)',
              fontWeight: 600,
              marginTop: '4px',
            }}
          >
            ⚡ Menos do que gastas num almoço para nunca mais seres ignorado por um recrutador.
          </span>
        </div>

        {/* Resumo de Alto Valor: O que recebes no Kit */}
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: '16px',
            padding: '18px 20px',
            border: '1px solid var(--color-border)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            O que está incluído no download imediato (14 ficheiros):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--color-text)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Check size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div><strong>2 Modelos de CV em Word (.docx):</strong> Estrutura editorial limpa e 100% legível por softwares ATS em Portugal.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Check size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div><strong>Guia Oficial KEDS Portugal (PDF):</strong> 10 lições práticas, do perfil de impacto à negociação salarial em Portugal.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Check size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div><strong>Guiões de Cartas e Mensagens:</strong> Modelos para abordar recrutadores no LinkedIn e candidaturas espontâneas.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Check size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div><strong>25 Prompts Estratégicos de IA:</strong> Para adaptares o teu CV e carta a qualquer anúncio em menos de 3 minutos.</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <Check size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div><strong>Plano de Ação de 7 Dias & Organizador CSV:</strong> Passo a passo estruturado para submeteres candidaturas esta semana.</div>
            </div>
          </div>
        </div>

        {/* CTA Principal para Checkout OKANDA com destaque MB WAY */}
        {checkout.isConfigured && checkout.url ? (
          <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <a
              href={checkoutUrl || checkout.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                const target = appendTrackingToUrl(checkout.url) || checkout.url || '#';
                e.currentTarget.href = target;
                trackInitiateCheckout('kit', 14.99);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                minHeight: '54px',
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-on-accent)',
                borderRadius: 'var(--radius-control)',
                fontSize: '17px',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 6px 22px rgba(0, 87, 217, 0.32)',
                transition: 'background-color 160ms ease, transform 160ms ease',
                padding: '14px 24px',
                boxSizing: 'border-box',
              }}
            >
              <span>Quero o Kit Completo — 14,99 €</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Disponível com <strong>MB WAY</strong> e <strong>Cartão bancário</strong>
            </span>
          </div>
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
            gap: '14px',
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
            100% editável em Word e LibreOffice
          </span>
        </div>

        {/* Caixa de Garantia Incondicional de 14 Dias */}
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            backgroundColor: 'rgba(0, 87, 217, 0.03)',
            border: '1px solid rgba(0, 87, 217, 0.18)',
            borderRadius: '14px',
            padding: '14px 18px',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <ShieldCheck size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '12px', color: 'var(--color-text)', lineHeight: 1.45 }}>
            <strong>Garantia Incondicional de 14 Dias:</strong> Descarrega todos os materiais no teu computador. Se sentires que este kit não torna as tuas candidaturas significativamente mais profissionais no mercado português, envia um email e devolvemos 100% do valor pago. O risco é todo nosso.
          </div>
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
