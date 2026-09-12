import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function PrivacyPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, padding: 'var(--space-16) var(--layout-mobile-gutter)' }}>
        <article className="container-reading" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <header>
            <span style={{ fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
              Transparência & Proteção de Dados
            </span>
            <h1 style={{ fontSize: 'var(--type-h1-desktop)', marginTop: 'var(--space-2)' }}>
              Política de Privacidade
            </h1>
            <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: 'var(--space-1)' }}>
              Última atualização: 12 de setembro de 2026 · Versão 2.0 (RGPD)
            </p>
          </header>

          <section>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>1. O nosso compromisso</h2>
            <p style={{ lineHeight: 1.6 }}>
              No <strong>Kit Emprego dos Sonhos — Portugal</strong>, respeitamos integralmente a privacidade dos teus dados pessoais. Não vendemos informações a terceiros, não partilhamos currículos com recrutadores sem a tua autorização expressa e não usamos dados de diagnóstico para publicidade direcionada.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>2. Tratamento de ficheiros e texto de CV</h2>
            <p style={{ lineHeight: 1.6 }}>
              Quando utilizas o nosso <em>Analisador de CV</em>:
            </p>
            <ul style={{ paddingLeft: 'var(--space-6)', marginTop: 'var(--space-2)', lineHeight: 1.6 }}>
              <li>O texto é processado em memória unicamente para extrair observações estruturais e sugestões de redação.</li>
              <li>Não armazenamos o ficheiro original no repositório de código nem em bases de dados públicas.</li>
              <li>Aconselhamos a remoção prévia de dados sensíveis (como morada completa, número de identificação civil ou dados fiscais).</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>3. Respostas ao Questionário (Quiz)</h2>
            <p style={{ lineHeight: 1.6 }}>
              As respostas às perguntas do quiz são autorrelatos anónimos utilizados unicamente no teu navegador para calcular o perfil de preparação e identificar as tuas prioridades de ação.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>4. Envio do Plano e Comunicações de Marketing</h2>
            <p style={{ lineHeight: 1.6 }}>
              O fornecimento do teu endereço de email para receber o plano de diagnóstico por escrito é opcional. A subscrição de dicas ou promoções exige consentimento prévio e explícito (caixa de seleção desmarcada por omissão) e pode ser cancelada a qualquer momento através de ligação em cada mensagem.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>5. Dados de Compras e Área do Membro</h2>
            <p style={{ lineHeight: 1.6 }}>
              Os pagamentos são processados pela plataforma externa certificada <strong>OKANDA</strong>. Não temos acesso nem armazenamos os números de cartão de crédito ou dados bancários do utilizador. Conservamos apenas o email e a referência da encomenda para concessão dos direitos de acesso à área privada.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>6. Os teus direitos</h2>
            <p style={{ lineHeight: 1.6 }}>
              Ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD), tens o direito de aceder, retificar, descarregar ou solicitar a eliminação completa de todos os teus dados associados à conta. Para exercer estes direitos, acede à página da tua conta ou contacta a nossa equipa através de <a href="/apoio">apoio ao cliente</a>.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
