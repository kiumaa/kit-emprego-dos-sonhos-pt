import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        padding: 'var(--space-12) 0 var(--space-8) 0',
        marginTop: 'auto',
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-8)',
          }}
        >
          <div>
            <span style={{ fontSize: '18px', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>
              Emprego dos Sonhos
            </span>
            <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: 'var(--space-2)' }}>
              Clareza para o próximo passo profissional em Portugal. Diagnósticos honestos e recursos de candidatura.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: 'var(--type-label)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>
              Ferramentas Gratuitas
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--type-small)' }}>
              <li><a href="/analisar-cv" style={{ color: 'var(--color-text-secondary)' }}>Analisador de CV</a></li>
              <li><a href="/quiz" style={{ color: 'var(--color-text-secondary)' }}>Quiz de Diagnóstico</a></li>
              <li><a href="/design-system" style={{ color: 'var(--color-text-secondary)' }}>Design System (Preview)</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 'var(--type-label)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>
              O Kit
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--type-small)' }}>
              <li><a href="/kit" style={{ color: 'var(--color-text-secondary)' }}>Kit Emprego dos Sonhos</a></li>
              <li><a href="/kit#comprar" style={{ color: 'var(--color-text-secondary)' }}>Comprar na OKANDA</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: 'var(--type-label)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-3)' }}>
              Informação Legal
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--type-small)' }}>
              <li><a href="/termos" style={{ color: 'var(--color-text-secondary)' }}>Termos e Condições</a></li>
              <li><a href="/privacidade" style={{ color: 'var(--color-text-secondary)' }}>Política de Privacidade</a></li>
              <li><a href="/cookies" style={{ color: 'var(--color-text-secondary)' }}>Preferências de Cookies</a></li>
              <li><a href="/apoio" style={{ color: 'var(--color-text-secondary)' }}>Apoio ao Cliente</a></li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            paddingTop: 'var(--space-6)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            fontSize: 'var(--type-small)',
            color: 'var(--color-text-secondary)',
          }}
        >
          <span>© {new Date().getFullYear()} Kit Emprego dos Sonhos — Portugal. Todos os direitos reservados.</span>
          <span>Preços em EUR · Sem garantias de emprego ou notas ATS arbitrárias</span>
        </div>
      </div>
    </footer>
  );
};
