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
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
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
          paddingTop: 'var(--space-5)',
          paddingBottom: 'var(--space-5)',
          minHeight: '68px',
        }}
      >
        <BrandLogo height={36} />

        {showBack && (
          <a
            href={backHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: 'var(--weight-medium)',
              color: 'var(--color-text-secondary)',
              textDecoration: 'none',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'var(--color-surface)',
              transition: 'background-color 160ms ease, color 160ms ease',
            }}
            aria-label={backLabel}
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>{backLabel}</span>
          </a>
        )}
      </div>
    </header>
  );
};
