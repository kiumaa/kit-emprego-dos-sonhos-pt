import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export interface InsightCardProps {
  title: string;
  action: string;
  kind: 'first_step' | 'refinement' | 'unrated' | 'essential';
  source?: string;
  evidenceAnswer?: string;
  evidenceText?: string;
  resourceId?: string;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  action,
  kind,
  source = 'Autorrelato do questionário',
  evidenceAnswer,
  evidenceText,
}) => {
  const getBadgeConfig = () => {
    switch (kind) {
      case 'refinement':
        return {
          label: 'Aspeto a consolidar',
          icon: <CheckCircle2 size={18} color="var(--color-success)" aria-hidden="true" />,
          borderColor: 'var(--color-border)',
          accentColor: 'var(--color-success)',
          bgTag: '#EBF6EE',
          textTag: 'var(--color-success)',
        };
      case 'essential':
      case 'first_step':
        return {
          label: 'Prioridade identificada',
          icon: <AlertCircle size={18} color="var(--color-warning)" aria-hidden="true" />,
          borderColor: 'var(--color-border)',
          accentColor: 'var(--color-warning)',
          bgTag: '#FFF8E6',
          textTag: 'var(--color-warning)',
        };
      case 'unrated':
      default:
        return {
          label: 'Não avaliável',
          icon: <HelpCircle size={18} color="var(--color-text-secondary)" aria-hidden="true" />,
          borderColor: 'var(--color-border)',
          accentColor: 'var(--color-text-secondary)',
          bgTag: 'var(--color-surface)',
          textTag: 'var(--color-text-secondary)',
        };
    }
  };

  const badge = getBadgeConfig();

  return (
    <article
      style={{
        backgroundColor: 'var(--color-surface-raised)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-6)',
        border: `1px solid ${badge.borderColor}`,
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: 'var(--type-small)',
            fontWeight: 'var(--weight-semibold)',
            padding: 'var(--space-1) var(--space-3)',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: badge.bgTag,
            color: badge.textTag,
          }}
        >
          {badge.icon}
          {badge.label}
        </span>
        <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
          {source}
        </span>
      </div>

      <h3 style={{ fontSize: 'var(--type-h3)', marginTop: 'var(--space-1)' }}>{title}</h3>

      {evidenceAnswer && (
        <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
          <strong>A tua resposta:</strong> “{evidenceAnswer}”
        </p>
      )}

      {evidenceText && (
        <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
          <strong>Evidência no CV:</strong> “{evidenceText}”
        </p>
      )}

      <div
        style={{
          marginTop: 'var(--space-2)',
          padding: 'var(--space-4)',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-control)',
          borderLeft: `4px solid ${badge.accentColor}`,
        }}
      >
        <p style={{ fontSize: 'var(--type-body)', fontWeight: 'var(--weight-medium)', color: 'var(--color-text)' }}>
          <strong>Ação recomendada:</strong> {action}
        </p>
      </div>
    </article>
  );
};
