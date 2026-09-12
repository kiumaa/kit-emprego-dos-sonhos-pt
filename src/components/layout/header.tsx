import React from 'react';
import { BrandLogo } from './brand-logo';
import { ArrowLeft } from 'lucide-react';

export interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  backHref = '/',
  backLabel = 'Voltar',
}) => {
  return (
    <header
      style={{
        backgroundColor: 'var(--color-background)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: showBack ? 'space-between' : 'center',
          paddingTop: 'var(--space-6)',
          paddingBottom: 'var(--space-5)',
        }}
      >
        <BrandLogo />

        {showBack && (
          <a
            href={backHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-surface)',
              transition: 'background-color 160ms ease, color 160ms ease',
            }}
            aria-label={backLabel}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <span>{backLabel}</span>
          </a>
        )}
      </div>
    </header>
  );
};
