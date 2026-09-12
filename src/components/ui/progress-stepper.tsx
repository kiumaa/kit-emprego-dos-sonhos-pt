import React from 'react';

export interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  labelPrefix?: string;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  totalSteps,
  labelPrefix = 'Pergunta',
}) => {
  const percentage = Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100);

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'var(--type-label)',
          color: 'var(--color-text-secondary)',
          fontWeight: 'var(--weight-medium)',
        }}
      >
        <span>
          {labelPrefix} {currentStep} de {totalSteps}
        </span>
        <span aria-hidden="true">{Math.round(percentage)}%</span>
      </div>

      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`${labelPrefix} ${currentStep} de ${totalSteps}`}
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-pill)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: 'var(--color-accent)',
            borderRadius: 'var(--radius-pill)',
            transition: 'width 240ms cubic-bezier(0.2, 0, 0, 1)',
          }}
        />
      </div>
    </div>
  );
};
