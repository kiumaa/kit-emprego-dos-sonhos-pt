import React from 'react';

export interface BrandLogoProps {
  height?: number | string;
  className?: string;
  href?: string;
  style?: React.CSSProperties;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  height,
  className = '',
  href = '/',
  style,
}) => {
  const resolvedHeight = typeof height === 'number' ? `${height}px` : height;
  const image = (
    <img
      src="/images/logo.png"
      alt="Emprego dos Sonhos — Portugal"
      style={{
        height: resolvedHeight || 'var(--brand-logo-height, 60px)',
        width: 'auto',
        maxHeight: '100%',
        display: 'block',
        objectFit: 'contain',
        ...style,
      }}
      loading="eager"
    />
  );

  if (href) {
    return (
      <a
        href={href}
        className={`brand-logo-link ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          textDecoration: 'none',
          outlineOffset: '4px',
        }}
        aria-label="Emprego dos Sonhos — Portugal (Página inicial)"
      >
        {image}
      </a>
    );
  }

  return <div className={`brand-logo ${className}`}>{image}</div>;
};
