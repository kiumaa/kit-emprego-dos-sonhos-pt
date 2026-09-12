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
      <div className="container header-container">
        <a href="/" className="header-brand">
          <span className="header-title">Emprego dos Sonhos</span>
          <span className="header-badge">Portugal</span>
        </a>

        <nav className="header-nav" aria-label="Navegação principal">
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
            className="header-kit-btn"
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
            O Kit
          </a>
        </nav>
      </div>
    </header>
  );
};
