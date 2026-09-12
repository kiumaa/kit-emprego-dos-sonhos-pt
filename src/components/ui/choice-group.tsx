import React from 'react';

export interface ChoiceOption {
  id: string;
  label: string;
  description?: string;
}

export interface ChoiceGroupProps {
  name: string;
  legend: string;
  options: ChoiceOption[];
  selectedValue?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export const ChoiceGroup: React.FC<ChoiceGroupProps> = ({
  name,
  legend,
  options,
  selectedValue,
  onChange,
  error,
  disabled = false,
}) => {
  return (
    <fieldset
      style={{
        border: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
    >
      <legend
        style={{
          fontSize: 'var(--type-body)',
          fontWeight: 'var(--weight-semibold)',
          marginBottom: 'var(--space-3)',
          color: 'var(--color-text)',
        }}
      >
        {legend}
      </legend>

      {options.map((option) => {
        const isSelected = selectedValue === option.id;
        return (
          <label
            key={option.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-4)',
              minHeight: 'var(--layout-control-height)',
              padding: 'var(--space-3) var(--space-4)',
              backgroundColor: isSelected ? 'var(--color-accent-soft)' : 'var(--color-surface)',
              border: `1.5px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
              borderRadius: 'var(--radius-control)',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'border-color 160ms ease, background-color 160ms ease',
              userSelect: 'none',
            }}
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={isSelected}
              disabled={disabled}
              onChange={() => onChange(option.id)}
              style={{
                width: '20px',
                height: '20px',
                accentColor: 'var(--color-accent)',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: 'var(--type-body)',
                  fontWeight: isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                  color: 'var(--color-text)',
                }}
              >
                {option.label}
              </span>
              {option.description && (
                <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
                  {option.description}
                </span>
              )}
            </div>
          </label>
        );
      })}

      {error && (
        <span
          id={`${name}-error`}
          role="alert"
          style={{
            fontSize: 'var(--type-small)',
            color: 'var(--color-danger)',
            marginTop: 'var(--space-1)',
            fontWeight: 'var(--weight-medium)',
          }}
        >
          {error}
        </span>
      )}
    </fieldset>
  );
};
