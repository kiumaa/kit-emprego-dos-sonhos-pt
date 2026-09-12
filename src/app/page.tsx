import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { FileSearch, HelpCircle, Check, ArrowRight, Shield, Download, FileText, CheckCircle2 } from 'lucide-react';
import pagesData from '../../content/marketing/pages.json';

export default function HomePage() {
  const homeData = pagesData.home;
  const faqData = pagesData.faq;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      {/* Hero Section */}
      <section
        style={{
          padding: 'var(--space-16) 0 var(--space-12) 0',
          backgroundColor: 'var(--color-background)',
          textAlign: 'center',
        }}
      >
        <div className="container-reading">
          <span
            style={{
              display: 'inline-flex',
              padding: '6px 16px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-pill)',
              fontSize: 'var(--type-small)',
              fontWeight: 'var(--weight-semibold)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-6)',
            }}
          >
            Diagnóstico gratuito & Recursos de candidatura em Portugal
          </span>

          <h1
            style={{
              fontSize: 'clamp(26px, 5vw, 56px)',
              lineHeight: 'var(--line-height-heading)',
              fontWeight: 'var(--weight-bold)',
              letterSpacing: '-0.025em',
              marginBottom: 'var(--space-6)',
              color: 'var(--color-text)',
            }}
          >
            {homeData.title}
          </h1>

          <p
            className="secondary"
            style={{
              fontSize: 'clamp(17px, 2.5vw, 20px)',
              lineHeight: 'var(--line-height-body)',
              marginBottom: 'var(--space-8)',
              maxWidth: '640px',
              marginInline: 'auto',
            }}
          >
            {homeData.description}
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              justifyContent: 'center',
              alignItems: 'center',
              maxWidth: '460px',
              marginInline: 'auto',
            }}
          >
            <a
              href="/analisar-cv"
              style={{
                width: '100%',
                height: '52px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-on-accent)',
                borderRadius: 'var(--radius-control)',
                fontSize: '18px',
                fontWeight: 'var(--weight-semibold)',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <FileSearch size={20} aria-hidden="true" />
              <span>{homeData.primaryCta}</span>
            </a>

            <a
              href="/quiz"
              style={{
                width: '100%',
                height: '48px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                borderRadius: 'var(--radius-control)',
                fontSize: '16px',
                fontWeight: 'var(--weight-medium)',
                textDecoration: 'none',
                border: '1px solid var(--color-border)',
              }}
            >
              <HelpCircle size={18} color="var(--color-text-secondary)" aria-hidden="true" />
              <span>{homeData.secondaryCta}</span>
            </a>

            <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
              {homeData.note}
            </span>
          </div>
        </div>
      </section>

      {/* Como Funciona — 3 Passos Claros */}
      <section
        style={{
          padding: 'var(--space-12) 0',
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span style={{ fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Processo Transparente
            </span>
            <h2 style={{ fontSize: 'var(--type-h2-desktop)', marginTop: 'var(--space-2)' }}>
              Três passos para candidaturas consistentes
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {[
              {
                num: '01',
                title: 'Diagnóstico Gratuito',
                desc: 'Envia o teu CV ou responde ao quiz de 8 perguntas para identificar as tuas prioridades imediatas sem notas inventadas.',
              },
              {
                num: '02',
                title: 'Ação Recomendada',
                desc: 'Recebe imediatamente uma ação prática aplicável e uma amostra gratuita para começar já hoje a preparar a tua candidatura.',
              },
              {
                num: '03',
                title: 'Método & Recursos do Kit',
                desc: 'Recebe o guia completo de 10 lições, modelos descarregáveis DOCX, cartas, mensagens e organizador de candidaturas entregues pela OKANDA.',
              },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  padding: 'var(--space-8) var(--space-6)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                }}
              >
                <span style={{ fontSize: '32px', fontWeight: 'var(--weight-bold)', color: 'var(--color-accent)' }}>
                  {step.num}
                </span>
                <h3 style={{ fontSize: 'var(--type-h3)' }}>{step.title}</h3>
                <p className="secondary" style={{ fontSize: 'var(--type-body)', lineHeight: 1.5 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O que está incluído no Kit */}
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span style={{ fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Sem Editor Online · Edição Externa no Word
            </span>
            <h2 style={{ fontSize: 'var(--type-h2-desktop)', marginTop: 'var(--space-2)' }}>
              Tudo o que o Kit inclui para o mercado de trabalho em Portugal
            </h2>
            <p className="secondary" style={{ marginTop: 'var(--space-2)', maxWidth: '640px', marginInline: 'auto' }}>
              Materiais estruturados para apoiar quem procura primeiro emprego, transição ou progressão de carreira.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--space-6)',
            }}
          >
            {[
              {
                icon: <FileText size={24} color="var(--color-accent)" />,
                title: '2 Modelos de CV Descarregáveis',
                desc: 'Modelos Essencial e Moderno em formato DOCX limpo. Descarregas e editas externamente no teu processador de texto habitual.',
              },
              {
                icon: <CheckCircle2 size={24} color="var(--color-accent)" />,
                title: '10 Lições Práticas',
                desc: 'Do objetivo profissional à leitura de vagas, estrutura de CV e revisão final, com explicações reais e tarefas.',
              },
              {
                icon: <Download size={24} color="var(--color-accent)" />,
                title: '3 Cartas & 10 Mensagens',
                desc: 'Estruturas de apresentação e mensagens diretas para recrutadores prontas a adaptar com contexto real.',
              },
              {
                icon: <Shield size={24} color="var(--color-accent)" />,
                title: 'Organizador de Candidaturas (CSV)',
                desc: 'Ficheiro de controlo simples para gerir empresas, funções, estados e datas diretamente no teu computador.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: 'var(--space-6)',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                }}
              >
                <div>{item.icon}</div>
                <h3 style={{ fontSize: 'var(--type-body)', fontWeight: 'var(--weight-semibold)' }}>{item.title}</h3>
                <p className="secondary" style={{ fontSize: 'var(--type-small)', lineHeight: 1.4 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-10)', textAlign: 'center' }}>
            <a
              href="/kit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: '18px',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-accent)',
                textDecoration: 'none',
              }}
            >
              <span>Conhecer todos os detalhes e condições do Kit</span>
              <ArrowRight size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* Perguntas Frequentes (FAQ) */}
      <section
        style={{
          padding: 'var(--space-16) 0',
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <div className="container-reading">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <h2 style={{ fontSize: 'var(--type-h2-desktop)' }}>Perguntas Frequentes</h2>
            <p className="secondary" style={{ marginTop: 'var(--space-2)' }}>
              Respostas claras sobre os diagnósticos, os ficheiros e o funcionamento do Kit.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {faqData.map((item, idx) => (
              <details
                key={idx}
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderRadius: 'var(--radius-control)',
                  padding: 'var(--space-4) var(--space-6)',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                }}
              >
                <summary
                  style={{
                    fontSize: 'var(--type-body)',
                    fontWeight: 'var(--weight-semibold)',
                    color: 'var(--color-text)',
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{item.question}</span>
                  <span style={{ fontSize: '18px', color: 'var(--color-text-secondary)' }}>+</span>
                </summary>
                <p
                  className="secondary"
                  style={{
                    marginTop: 'var(--space-3)',
                    fontSize: 'var(--type-small)',
                    lineHeight: 1.5,
                    borderTop: '1px solid var(--color-surface)',
                    paddingTop: 'var(--space-3)',
                  }}
                >
                  {item.answer.replace('{{approved_access_terms}}', 'Os ficheiros digitais são enviados diretamente para o teu email pela OKANDA após a compra, ficando disponíveis para teu uso pessoal no computador.')}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
