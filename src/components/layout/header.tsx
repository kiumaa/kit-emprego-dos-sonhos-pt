import React from 'react';

export const Header: React.FC = () => {
  return (
    <header
      style={{
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface-raised)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
          <a
            href="/"
            style={{
              fontSize: '20px',
              fontWeight: 'var(--weight-bold)',
              color: 'var(--color-text)',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
            }}
          >
            Emprego dos Sonhos
          </a>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Portugal
          </span>
        </div>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-6)',
          }}
          aria-label="Navegação principal"
        >
          <a
            href="/analisar-cv"
            style={{
              fontSize: 'var(--type-button)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--color-text)',
              textDecoration: 'none',
            }}
          >
            Analisar CV
          </a>
          <a
            href="/quiz"
            style={{
              fontSize: 'var(--type-button)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--color-text)',
              textDecoration: 'none',
            }}
          >
            Quiz
          </a>
          <a
            href="/kit"
            style={{
              fontSize: 'var(--type-button)',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--color-text)',
              textDecoration: 'none',
            }}
          >
            O Kit
          </a>
          <a
            href="/area"
            style={{
              fontSize: 'var(--type-button)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              padding: '6px 14px',
              backgroundColor: 'var(--color-accent-soft)',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            Área do Membro
          </a>
        </nav>
      </div>
    </header>
  );
};
