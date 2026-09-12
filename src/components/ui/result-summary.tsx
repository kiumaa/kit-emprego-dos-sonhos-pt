import React from 'react';
import { Info } from 'lucide-react';

export interface ResultSummaryProps {
  title: string;
  summary: string;
  disclaimer: string;
  sourceLabel?: string;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  title,
  summary,
  disclaimer,
  sourceLabel = 'Diagnóstico por questionário (Autorrelato)',
}) => {
  return (
    <section
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-large)',
        padding: 'var(--space-8) var(--space-6)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span
          style={{
            fontSize: 'var(--type-small)',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          {sourceLabel}
        </span>
      </div>

      <h2 style={{ fontSize: 'var(--type-h2-desktop)' }}>{title}</h2>

      <p style={{ fontSize: 'var(--type-body)', lineHeight: 'var(--line-height-body)', color: 'var(--color-text)' }}>
        {summary}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-3)',
          marginTop: 'var(--space-2)',
          padding: 'var(--space-3) var(--space-4)',
          backgroundColor: 'var(--color-surface-raised)',
          borderRadius: 'var(--radius-control)',
          border: '1px solid var(--color-border)',
        }}
      >
        <Info size={20} color="var(--color-text-secondary)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', margin: 0 }}>
          {disclaimer}
        </p>
      </div>
    </section>
  );
};
