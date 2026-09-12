export default function HomePage() {
  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--layout-mobile-gutter)', textAlign: 'center' }}>
      <h1>Kit Emprego dos Sonhos — Portugal</h1>
      <p className="secondary" style={{ marginTop: 'var(--space-4)', maxWidth: 'var(--layout-reading)', marginInline: 'auto' }}>
        Clareza para o próximo passo profissional. Diagnóstico honesto e recursos práticos para candidaturas.
      </p>
      <div style={{ marginTop: 'var(--space-8)', display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href="/quiz"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'var(--layout-controlHeight)',
            padding: '0 var(--space-6)',
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-onAccent)',
            borderRadius: 'var(--radius-control)',
            fontWeight: 'var(--weight-semibold)',
            textDecoration: 'none',
          }}
        >
          Fazer o Quiz Gratuito
        </a>
        <a
          href="/design-system"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'var(--layout-controlHeight)',
            padding: '0 var(--space-6)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            borderRadius: 'var(--radius-control)',
            fontWeight: 'var(--weight-semibold)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
          }}
        >
          Ver Design System
        </a>
      </div>
    </div>
  );
}
