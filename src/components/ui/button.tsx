import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', isLoading = false, disabled, children, style, className = '', ...props }, ref) => {
    const getVariantStyles = (): React.CSSProperties => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-on-accent)',
            border: '1px solid transparent',
          };
        case 'secondary':
          return {
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: 'var(--color-text)',
            border: '1px solid transparent',
          };
        case 'destructive':
          return {
            backgroundColor: 'var(--color-danger)',
            color: 'var(--color-on-accent)',
            border: '1px solid transparent',
          };
      }
    };

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      height: 'var(--layout-control-height)',
      padding: '0 var(--space-6)',
      borderRadius: 'var(--radius-control)',
      fontSize: 'var(--type-button)',
      fontWeight: 'var(--weight-semibold)',
      fontFamily: 'var(--font-primary)',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background-color 160ms cubic-bezier(0.2, 0, 0, 1), transform 160ms ease, opacity 160ms ease',
      textDecoration: 'none',
      userSelect: 'none',
      ...getVariantStyles(),
      ...style,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        style={baseStyles}
        className={`btn btn-${variant} ${className}`}
        aria-busy={isLoading}
        {...props}
      >
        <span style={{ visibility: isLoading ? 'hidden' : 'visible', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {children}
        </span>
        {isLoading && (
          <span
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden="true"
          >
            <svg
              style={{
                width: '20px',
                height: '20px',
                animation: 'spin 0.8s linear infinite',
              }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          </span>
        )}
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          button:hover:not(:disabled) {
            filter: brightness(0.96);
          }
          button:active:not(:disabled) {
            transform: scale(0.99);
          }
        `}</style>
      </button>
    );
  }
);

Button.displayName = 'Button';
