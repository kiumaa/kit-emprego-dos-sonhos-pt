import { FileText, CheckCircle2, BookOpen, Layers, Calendar, MessageSquare } from 'lucide-react';

export interface ProductMockupProps {
  className?: string;
}

export const ProductMockup: React.FC<ProductMockupProps> = ({ className = '' }) => {
  return (
    <div
      className={`product-bundle-mockup ${className}`}
      style={{
        width: '100%',
        maxWidth: '820px',
        marginInline: 'auto',
        position: 'relative',
        padding: 'var(--space-6) 0 var(--space-4) 0',
      }}
      aria-label="Ecossistema de recursos do Kit Emprego dos Sonhos"
    >
      {/* Visual Editorial Grid of Deliverables */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {/* Deliverable 1: Guia Emprego dos Sonhos (Livro/Guia Principal) */}
        <div
          style={{
            backgroundColor: '#1D1D1F',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px',
            boxShadow: '0 12px 36px rgba(29, 29, 31, 0.18)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(0, 87, 217, 0.4) 0%, rgba(29, 29, 31, 0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#EDF3FF',
                  backgroundColor: 'rgba(0, 87, 217, 0.8)',
                  padding: '3px 8px',
                  borderRadius: '999px',
                }}
              >
                Guia Central PDF
              </span>
              <BookOpen size={18} color="#EDF3FF" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.2, color: '#FFFFFF', margin: 0 }}>
              Guia Emprego dos Sonhos
            </h3>
            <p style={{ fontSize: '13px', color: '#D2D2D7', marginTop: '8px', lineHeight: 1.4 }}>
              10 lições práticas para o mercado de trabalho português, do posicionamento ao envio.
            </p>
          </div>
          <div style={{ fontSize: '11px', color: '#A1A1A6', fontWeight: 500 }}>
            Formato PDF · 10 Lições Estruturadas
          </div>
        </div>

        {/* Deliverable 2: Modelos de CV (Essencial + Moderno) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px',
            boxShadow: '0 8px 24px rgba(29, 29, 31, 0.05)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent-soft)',
                  padding: '3px 8px',
                  borderRadius: '999px',
                }}
              >
                Word / DOCX
              </span>
              <FileText size={18} color="var(--color-accent)" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-text)', margin: 0 }}>
              2 Modelos de CV
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
              <strong>Essencial</strong> (linear) e <strong>Moderno</strong> (equilibrado). Editáveis no Word, Docs ou LibreOffice.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: 'var(--color-surface)', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>
              1 Coluna
            </span>
            <span style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: 'var(--color-surface)', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>
              Equilibrado
            </span>
            <span style={{ fontSize: '11px', padding: '2px 6px', backgroundColor: 'var(--color-surface)', borderRadius: '4px', color: 'var(--color-text-secondary)' }}>
              Exemplos preenchidos
            </span>
          </div>
        </div>

        {/* Deliverable 3: Candidaturas (Cartas + Mensagens + Checklists) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px',
            boxShadow: '0 8px 24px rgba(29, 29, 31, 0.05)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text-secondary)',
                  backgroundColor: 'var(--color-surface)',
                  padding: '3px 8px',
                  borderRadius: '999px',
                }}
              >
                Comunicação
              </span>
              <MessageSquare size={18} color="var(--color-text-secondary)" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-text)', margin: 0 }}>
              Cartas & Mensagens
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
              3 cartas de apresentação, 10 abordagens para recrutadores e checklist de 15 pontos críticos de pré-envio.
            </p>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            3 Cartas · 10 Mensagens · Checklist
          </div>
        </div>

        {/* Deliverable 4: Plano 7 Dias + 25 Prompts + Organizador CSV */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '220px',
            boxShadow: '0 8px 24px rgba(29, 29, 31, 0.03)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-accent)',
                  backgroundColor: 'var(--color-accent-soft)',
                  padding: '3px 8px',
                  borderRadius: '999px',
                }}
              >
                Método & IA
              </span>
              <Layers size={18} color="var(--color-accent)" aria-hidden="true" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2, color: 'var(--color-text)', margin: 0 }}>
              Plano de 7 Dias & 25 Prompts
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.4 }}>
              Roteiro diário de candidatura, 25 comandos estratégicos para IA e organizador em folha de cálculo CSV.
            </p>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Plano 7 Dias · 25 Prompts · Ficheiro CSV
          </div>
        </div>
      </div>
    </div>
  );
};
