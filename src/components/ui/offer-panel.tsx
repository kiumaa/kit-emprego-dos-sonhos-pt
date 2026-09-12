import React from 'react';
import { ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { getValidatedCheckoutUrl } from '@/lib/funnel-config';
import { ProductMockup } from '@/components/marketing/ProductMockup';

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
        maxWidth: '860px',
        marginInline: 'auto',
        scrollMarginTop: '64px',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
      }}
      aria-label="Apresentação do Kit Emprego dos Sonhos"
    >
      {/* 1. Mockup Editorial dos Produtos */}
      <ProductMockup />

      {/* 2. Bloco Principal da Oferta */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '24px',
          padding: 'var(--space-8) var(--layout-mobile-gutter)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 32px rgba(29, 29, 31, 0.04)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-6)',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 'var(--weight-bold)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-accent)',
            }}
          >
            Produto Digital Descarregável
          </span>
          <h2
            style={{
              fontSize: 'clamp(26px, 5vw, 36px)',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '-0.02em',
              color: 'var(--color-text)',
              marginTop: 'var(--space-1)',
              lineHeight: 1.15,
            }}
          >
            {title}
          </h2>
          <p
            className="secondary"
            style={{
              fontSize: '15px',
              marginTop: 'var(--space-2)',
              maxWidth: '540px',
              marginInline: 'auto',
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Preço de 14,90 € */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span
            style={{
              fontSize: 'clamp(36px, 8vw, 48px)',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--color-text)',
              letterSpacing: '-0.03em',
            }}
          >
            14,90 €
          </span>
          <span
            style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
              fontWeight: 'var(--weight-medium)',
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
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-2)',
              width: '100%',
              maxWidth: '440px',
              height: '52px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-on-accent)',
              borderRadius: 'var(--radius-control)',
              fontSize: '17px',
              fontWeight: 'var(--weight-bold)',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0, 87, 217, 0.25)',
              transition: 'background-color 160ms ease, transform 160ms ease',
            }}
          >
            <span>Quero preparar a minha próxima candidatura</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        ) : (
          <div
            style={{
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-control)',
              textAlign: 'center',
              width: '100%',
              maxWidth: '440px',
              border: '1px solid var(--color-border)',
            }}
          >
            <p style={{ fontSize: '14px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)' }}>
              Checkout oficial em preparação
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              O link de compra na OKANDA PAY será ativado assim que os parâmetros comerciais forem finalizados.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} color="var(--color-text-secondary)" aria-hidden="true" />
          <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Pagamento seguro através da OKANDA PAY
          </span>
        </div>

        {/* 3. Conteúdo em Grupos (4 Pilares Claros) */}
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            marginTop: 'var(--space-4)',
            textAlign: 'left',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
              O teu CV
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              2 modelos editáveis em Word/DOCX (Essencial e Moderno) + exemplos reais para o mercado português.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
              As tuas candidaturas
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              3 cartas de apresentação + 10 mensagens de abordagem direta + checklist de 15 pontos críticos de pré-envio.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
              O teu plano
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              Guia principal de 10 lições práticas + roteiro de 7 dias + organizador de candidaturas em CSV offline.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid var(--color-border)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
              IA como apoio
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              25 prompts testados para acelerar a redação com ChatGPT ou Claude sem inventar experiências fictícias.
            </p>
          </div>
        </div>

        {/* 4. Complementos Opcionais (Bumps na OKANDA) */}
        <div
          style={{
            width: '100%',
            maxWidth: '680px',
            backgroundColor: 'var(--color-surface-raised)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px dashed var(--color-border)',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
            Queres ir ainda mais longe?
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
            Podes adicionar estes aceleradores diretamente no ecrã de checkout da OKANDA:
          </p>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontSize: '13px',
              color: 'var(--color-text)',
            }}
          >
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600 }}>Entrevista dos Sonhos (+ 4,90 €)</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>· Manual prático + Caderno STAR</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 600 }}>LinkedIn dos Sonhos (+ 5,90 €)</span>
              <span style={{ color: 'var(--color-text-secondary)' }}>· Manual prático + Otimização de perfil</span>
            </li>
          </ul>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            Disponíveis como complementos opcionais no checkout. A escolha acontece exclusivamente na OKANDA.
          </div>
        </div>
      </div>
    </section>
  );
};
