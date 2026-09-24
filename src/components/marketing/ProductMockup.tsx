import React from 'react';
import { FileText, BookOpen, Layers, MessageSquare } from 'lucide-react';

export interface ProductMockupProps {
  className?: string;
  showTitle?: boolean;
}

export const ProductMockup: React.FC<ProductMockupProps> = ({
  className = '',
  showTitle = true,
}) => {
  return (
    <div
      className={`product-bundle-mockup ${className}`}
      style={{
        width: '100%',
        maxWidth: '820px',
        marginInline: 'auto',
        position: 'relative',
        padding: 'var(--space-4) 0',
      }}
      aria-label="Ecossistema de recursos do Kit Emprego dos Sonhos"
    >
      {/* Título da Secção: O que recebes */}
      {showTitle && (
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
          <h2
            style={{
              fontSize: 'clamp(20px, 4vw, 26px)',
              fontWeight: 700,
              color: 'var(--color-text)',
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            O que recebes
          </h2>
        </div>
      )}

      {/* Grelha Compacta de Entregáveis */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
        }}
      >
        {/* Deliverable 1: Guia Emprego dos Sonhos (Livro/Guia Principal) */}
        <div
          style={{
            backgroundColor: '#1D1D1F',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(29, 29, 31, 0.14)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(0, 87, 217, 0.4) 0%, rgba(29, 29, 31, 0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#EDF3FF',
                backgroundColor: 'rgba(0, 87, 217, 0.85)',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              Guia Central PDF
            </span>
            <BookOpen size={16} color="#EDF3FF" aria-hidden="true" />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.25, color: '#FFFFFF', margin: 0 }}>
              Guia Emprego dos Sonhos
            </h3>
            <p style={{ fontSize: '13px', color: '#D2D2D7', marginTop: '6px', lineHeight: 1.4, margin: '6px 0 0 0' }}>
              10 lições práticas para o mercado de trabalho português, do posicionamento ao envio.
            </p>
          </div>
        </div>

        {/* Deliverable 2: Modelos de CV (Bónus Grátis) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(29, 29, 31, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#059669',
                backgroundColor: '#ECFDF5',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              Bónus Grátis
            </span>
            <FileText size={16} color="var(--color-accent)" aria-hidden="true" />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text)', margin: 0 }}>
              2 Modelos de CV
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px', lineHeight: 1.4, margin: '6px 0 0 0' }}>
              <strong>Essencial</strong> (linear) e <strong>Moderno</strong> (equilibrado). Editáveis no Word, Docs ou LibreOffice.
            </p>
          </div>
        </div>

        {/* Deliverable 3: Cartas & Mensagens (Bónus Grátis) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(29, 29, 31, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#059669',
                backgroundColor: '#ECFDF5',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              Bónus Grátis
            </span>
            <MessageSquare size={16} color="var(--color-accent)" aria-hidden="true" />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text)', margin: 0 }}>
              Cartas & Mensagens
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px', lineHeight: 1.4, margin: '6px 0 0 0' }}>
              3 cartas de apresentação, 10 abordagens para recrutadores e checklist de 15 pontos críticos de pré-envio.
            </p>
          </div>
        </div>

        {/* Deliverable 4: Plano 7 Dias & 25 Prompts (Bónus Grátis) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '16px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(29, 29, 31, 0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#059669',
                backgroundColor: '#ECFDF5',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              Bónus Grátis
            </span>
            <Layers size={16} color="var(--color-accent)" aria-hidden="true" />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, lineHeight: 1.25, color: 'var(--color-text)', margin: 0 }}>
              Plano de 7 Dias & 25 Prompts
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px', lineHeight: 1.4, margin: '6px 0 0 0' }}>
              Roteiro diário de candidatura, 25 comandos estratégicos para IA e organizador em folha de cálculo CSV.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
