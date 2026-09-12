import React from 'react';

export interface BrandLogoProps {
  height?: number;
  className?: string;
  href?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  height = 36,
  className = '',
  href = '/',
}) => {
  const image = (
    <img
      src="/images/logo.png"
      alt="Emprego dos Sonhos — Portugal"
      style={{
        height: `${height}px`,
        width: 'auto',
        maxHeight: '100%',
        display: 'block',
        objectFit: 'contain',
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
