import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        padding: 'var(--space-8) 0',
        marginTop: 'auto',
      }}
    >
      <div
        className="container-reading"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 'var(--space-4)',
        }}
      >
        <span
          style={{
            fontSize: '15px',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--color-text)',
            letterSpacing: '-0.01em',
          }}
        >
          Emprego dos Sonhos
        </span>

        <nav
          aria-label="Informação institucional e legal"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--space-4)',
            fontSize: '13px',
          }}
        >
          <a href="/acesso" style={{ color: 'var(--color-text-secondary)' }}>
            Aceder ao meu produto
          </a>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <a href="/termos" style={{ color: 'var(--color-text-secondary)' }}>
            Termos
          </a>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <a href="/privacidade" style={{ color: 'var(--color-text-secondary)' }}>
            Privacidade
          </a>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <a href="/cookies" style={{ color: 'var(--color-text-secondary)' }}>
            Cookies
          </a>
          <span style={{ color: 'var(--color-border)' }}>·</span>
          <a href="/apoio" style={{ color: 'var(--color-text-secondary)' }}>
            Apoio
          </a>
        </nav>

        <p
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Pagamento processado com segurança pela OKANDA PAY.
        </p>

        <span
          style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
          }}
        >
          © 2026 Kit Emprego dos Sonhos. Todos os direitos reservados.
        </span>
      </div>
    </footer>
  );
};
