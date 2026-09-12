import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function TermsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, padding: 'clamp(24px, 5vh, 48px) 0 clamp(40px, 6vh, 64px) 0' }}>
        <article className="container-reading" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <header>
            <span style={{ fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
              Condições Legais de Utilização
            </span>
            <h1 style={{ fontSize: 'var(--type-h1-desktop)', marginTop: 'var(--space-2)' }}>
              Termos e Condições
            </h1>
            <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: 'var(--space-1)' }}>
              Versão 2.0 · Em vigor a partir de setembro de 2026
            </p>
          </header>

          <section>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>1. Objeto e Âmbito do Serviço</h2>
            <p style={{ lineHeight: 1.6 }}>
              O <strong>Kit Emprego dos Sonhos — Portugal</strong> é um pacote de formação prática e recursos digitais para apoio na preparação de candidaturas de emprego em Portugal. O serviço é composto por conteúdos educativos, modelos de documentos descarregáveis e um gestor pessoal de candidaturas.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>2. Natureza dos Modelos (Sem Editor Online)</h2>
            <p style={{ lineHeight: 1.6 }}>
              Os modelos de currículo disponibilizados são ficheiros estáticos em formato DOCX e PDF para descarregamento. A edição e adaptação dos documentos são realizadas externamente pelo utilizador no seu processador de texto preferido (ex.: Microsoft Word, Google Docs ou LibreOffice). A plataforma <strong>não disponibiliza nem inclui um editor de CV online</strong>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>3. Condições de Acesso e Prazo</h2>
            <p style={{ lineHeight: 1.6 }}>
              A aquisição do Kit principal confere acesso à plataforma online da Área do Membro pelo período de <strong>12 meses</strong> a contar da data de confirmação do pagamento. O acesso não possui renovação automática. Os ficheiros descarregados durante o período de vigência permanecem na posse do utilizador para uso pessoal vitalício.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>4. Ausência de Garantia de Emprego</h2>
            <p style={{ lineHeight: 1.6 }}>
              O Kit fornece orientações de boas práticas, modelos e organização. <strong>Não prometemos, garantimos nem asseguramos colocação profissional, entrevistas ou decisões de contratação</strong>, as quais dependem exclusivamente do perfil do candidato, dos critérios dos empregadores e das condições do mercado de trabalho.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>5. Pagamentos e Reembolsos</h2>
            <p style={{ lineHeight: 1.6 }}>
              Os pagamentos são processados pela entidade intermediária <strong>OKANDA</strong>. Em conformidade com a legislação portuguesa e comunitária relativa a produtos digitais com acesso imediato, eventuais pedidos de apoio ou cancelamento devem ser submetidos através dos canais oficiais de apoio no prazo legal aplicável.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
