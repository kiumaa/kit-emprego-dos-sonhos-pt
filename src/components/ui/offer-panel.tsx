import React from 'react';
import { Check, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { getValidatedCheckoutUrl } from '@/lib/funnel-config';

export interface OfferPanelProps {
  id?: string;
}

export const OfferPanel: React.FC<OfferPanelProps> = ({ id = 'oferta' }) => {
  const checkout = getValidatedCheckoutUrl();

  const inclusions = [
    'Guia completo com 10 lições práticas de candidatura em Portugal',
    '2 Modelos de CV estáticos para Word/DOCX (Essencial e Moderno)',
    '3 Cartas de apresentação prontas a personalizar',
    '10 Mensagens de candidatura direta e contacto com recrutadores',
    'Checklists de preparação e verificação de pré-envio',
    '25 Prompts estratégicos de IA para apoio na redação',
    'Plano de ação organizado para 7 dias',
    'Organizador de candidaturas em ficheiro CSV descarregável',
    'Entrega imediata dos ficheiros digitais por email pela OKANDA',
  ];

  return (
    <section
      id={id}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-large)',
        padding: 'var(--space-8) var(--space-6)',
        border: '2px solid var(--color-accent-soft)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            fontSize: 'var(--type-small)',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Recursos Práticos & Entrega Digital
        </span>
        <h2 style={{ fontSize: 'var(--type-h2-desktop)', marginTop: 'var(--space-2)' }}>
          Kit Emprego dos Sonhos — Portugal
        </h2>
        <p className="secondary" style={{ marginTop: 'var(--space-2)', maxWidth: '640px', marginInline: 'auto' }}>
          Tudo o que precisas para preparar, organizar e submeter candidaturas consistentes no mercado de trabalho português.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 'var(--space-8) var(--space-6)',
          backgroundColor: 'var(--color-surface-raised)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--type-hero-mobile)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>
            14,90 €
          </span>
          <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
            / pagamento único
          </span>
        </div>
        <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Produto digital descarregável · Entrega segura dos ficheiros por email
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 'var(--space-6) 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            width: '100%',
            maxWidth: '560px',
          }}
        >
          {inclusions.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
              <Check size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <span style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>{item}</span>
            </li>
          ))}
        </ul>

        {/* Informação sobre os bumps opcionais */}
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            padding: 'var(--space-4)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-control)',
            marginBottom: 'var(--space-6)',
            fontSize: 'var(--type-small)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <strong style={{ color: 'var(--color-text)' }}>Aceleradores opcionais disponíveis no checkout:</strong>
          <ul style={{ marginTop: 'var(--space-2)', paddingLeft: 'var(--space-4)' }}>
            <li>Entrevista dos Sonhos (+ 4,90 €): Manual + Caderno STAR e perguntas difíceis.</li>
            <li>LinkedIn dos Sonhos (+ 5,90 €): Manual + Otimização de perfil e rotina de contactos.</li>
          </ul>
        </div>

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
              maxWidth: '420px',
              height: '52px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-on-accent)',
              borderRadius: 'var(--radius-control)',
              fontSize: '18px',
              fontWeight: 'var(--weight-semibold)',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(0, 87, 217, 0.25)',
              transition: 'background-color 160ms ease',
            }}
          >
            <span>Quero o Kit Emprego dos Sonhos</span>
            <ArrowRight size={20} aria-hidden="true" />
          </a>
        ) : (
          <div
            style={{
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-control)',
              textAlign: 'center',
              width: '100%',
              maxWidth: '420px',
              border: '1px solid var(--color-border)',
            }}
          >
            <p style={{ fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)' }}>
              Checkout oficial em preparação
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              O link de compra na OKANDA PAY será ativado assim que os parâmetros comerciais forem finalizados.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          <ShieldCheck size={18} color="var(--color-text-secondary)" aria-hidden="true" />
          <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
            Checkout seguro e entrega direta gerida pela OKANDA PAY
          </span>
        </div>
      </div>
    </section>
  );
};
