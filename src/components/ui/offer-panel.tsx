import React from 'react';
import { Button } from './button';
import { Check, ShieldCheck, ArrowRight } from 'lucide-react';

export interface OfferPanelProps {
  onCheckout: () => void;
  isLoading?: boolean;
}

export const OfferPanel: React.FC<OfferPanelProps> = ({
  onCheckout,
  isLoading = false,
}) => {
  const inclusions = [
    'Percurso completo de 10 lições práticas em texto e exercícios',
    '2 Modelos de CV estáticos para download e edição externa (Essencial e Moderno)',
    '3 Estruturas de cartas de apresentação prontas a personalizar',
    '10 Mensagens de candidatura direta e contacto com recrutadores',
    '25 Instruções (prompts) testadas para apoio na redação',
    'Plano prático de ação para 7 dias',
    'Organizador e gestor de candidaturas simples com exportação CSV',
    'Acesso à área do membro por 12 meses (ficheiros descarregados são teus)',
  ];

  return (
    <section
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-large)',
        padding: 'var(--space-8) var(--space-6)',
        border: '2px solid var(--color-accent-soft)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            fontSize: 'var(--type-small)',
            fontWeight: 'var(--weight-semibold)',
            color: 'var(--color-accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Método Completo & Recursos Práticos
        </span>
        <h2 style={{ fontSize: 'var(--type-h2-desktop)', marginTop: 'var(--space-2)' }}>
          Kit Emprego dos Sonhos — Portugal
        </h2>
        <p className="secondary" style={{ marginTop: 'var(--space-2)', maxWidth: '640px', marginInline: 'auto' }}>
          Tudo o que precisas para preparar, organizar e submeter candidaturas consistentes no mercado de trabalho em Portugal.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 'var(--space-6)',
          backgroundColor: 'var(--color-surface-raised)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--type-hero-mobile)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>
            14,90 €
          </span>
          <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
            / pagamento único
          </span>
        </div>
        <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-1)' }}>
          Acesso de 12 meses à plataforma · Sem renovações automáticas
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 'var(--space-6) 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            width: '100%',
            maxWidth: '560px',
          }}
        >
          {inclusions.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
              <Check size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
              <span style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>{item}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={onCheckout}
          isLoading={isLoading}
          variant="primary"
          style={{ width: '100%', maxWidth: '400px', height: '52px', fontSize: '18px' }}
        >
          <span>Obter Acesso Imediato</span>
          <ArrowRight size={20} aria-hidden="true" />
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
          <ShieldCheck size={18} color="var(--color-text-secondary)" aria-hidden="true" />
          <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
            Pagamento seguro processado na OKANDA
          </span>
        </div>
      </div>
    </section>
  );
};
