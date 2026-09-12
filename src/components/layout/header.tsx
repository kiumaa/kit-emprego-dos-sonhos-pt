import React from 'react';
import { BrandLogo } from './brand-logo';
import { ArrowLeft } from 'lucide-react';

export interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  isHome?: boolean;
  logoHeight?: number | string;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  backHref = '/',
  backLabel = 'Voltar',
  isHome = false,
  logoHeight,
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
          width: '100%',
          maxWidth: 'var(--layout-max-content, 1140px)',
          marginInline: 'auto',
          paddingInline: 'clamp(16px, 4vw, 36px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: showBack ? 'space-between' : 'center',
          paddingTop: isHome ? 'clamp(26px, 4vw, 38px)' : 'var(--space-5)',
          paddingBottom: isHome ? 'clamp(18px, 3vw, 26px)' : 'var(--space-4)',
          boxSizing: 'border-box',
        }}
      >
        <BrandLogo
          className={isHome ? 'brand-logo-home' : undefined}
          height={logoHeight}
        />

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
