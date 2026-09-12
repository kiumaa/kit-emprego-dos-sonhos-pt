import React from 'react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  description?: string;
  error?: string;
  maxLength?: number;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ id, label, description, error, maxLength, value, style, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label
            htmlFor={inputId}
            style={{
              fontSize: 'var(--type-label)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-text)',
            }}
          >
            {label}
          </label>
          {maxLength && (
            <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>

        {description && (
          <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
            {description}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined}
          style={{
            height: 'var(--layout-control-height)',
            padding: '0 var(--space-4)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-control)',
            fontSize: 'var(--type-body)',
            transition: 'border-color 160ms ease, background-color 160ms ease',
            ...style,
          }}
          className={`input-field ${className}`}
          {...props}
        />

        {error && (
          <span
            id={`${inputId}-error`}
            role="alert"
            style={{
              fontSize: 'var(--type-small)',
              color: 'var(--color-danger)',
              fontWeight: 'var(--weight-medium)',
              marginTop: 'var(--space-1)',
            }}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  description?: string;
  error?: string;
  maxLength?: number;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ id, label, description, error, maxLength, value, rows = 4, style, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <label
            htmlFor={inputId}
            style={{
              fontSize: 'var(--type-label)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-text)',
            }}
          >
            {label}
          </label>
          {maxLength && (
            <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>

        {description && (
          <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
            {description}
          </span>
        )}

        <textarea
          ref={ref}
          id={inputId}
          value={value}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: `1.5px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-control)',
            fontSize: 'var(--type-body)',
            fontFamily: 'inherit',
            resize: 'vertical',
            ...style,
          }}
          className={`textarea-field ${className}`}
          {...props}
        />

        {error && (
          <span
            id={`${inputId}-error`}
            role="alert"
            style={{
              fontSize: 'var(--type-small)',
              color: 'var(--color-danger)',
              fontWeight: 'var(--weight-medium)',
              marginTop: 'var(--space-1)',
            }}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';
