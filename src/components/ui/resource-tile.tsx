import React from 'react';
import { FileText, Download, Lock } from 'lucide-react';
import { Button } from './button';

export interface ResourceTileProps {
  title: string;
  description: string;
  format: 'DOCX' | 'PDF' | 'CSV' | 'MD';
  version?: string;
  isLocked?: boolean;
  onDownload?: () => void;
}

export const ResourceTile: React.FC<ResourceTileProps> = ({
  title,
  description,
  format,
  version = '2.0',
  isLocked = false,
  onDownload,
}) => {
  const getFormatBadgeStyle = () => {
    switch (format) {
      case 'DOCX':
        return { bg: '#EAF1FB', color: '#185ABD' };
      case 'PDF':
        return { bg: '#FDECEB', color: '#C5221F' };
      case 'CSV':
        return { bg: '#E6F4EA', color: '#137333' };
      case 'MD':
      default:
        return { bg: 'var(--color-surface)', color: 'var(--color-text-secondary)' };
    }
  };

  const badgeStyle = getFormatBadgeStyle();

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface-raised)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-5)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        transition: 'transform 160ms ease, box-shadow 160ms ease',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: badgeStyle.bg,
              color: badgeStyle.color,
              fontSize: '12px',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '0.04em',
            }}
          >
            {format}
          </span>
          <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
            v{version}
          </span>
        </div>

        <h4 style={{ fontSize: 'var(--type-body)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)' }}>
          {title}
        </h4>

        <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
          {description}
        </p>
      </div>

      <div style={{ paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-surface)' }}>
        {isLocked ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-secondary)' }}>
            <Lock size={16} aria-hidden="true" />
            <span style={{ fontSize: 'var(--type-small)' }}>Requer acesso ao Kit</span>
          </div>
        ) : (
          <Button
            onClick={onDownload}
            variant="secondary"
            style={{ width: '100%', height: '40px', fontSize: 'var(--type-small)' }}
          >
            <Download size={16} aria-hidden="true" />
            <span>Descarregar ficheiro</span>
          </Button>
        )}
      </div>
    </div>
  );
};
