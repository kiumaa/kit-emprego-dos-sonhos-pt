'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VslPlayer } from '@/components/marketing/VslPlayer';
import { OfferPanel } from '@/components/ui/offer-panel';
import { getFunnelConfig } from '@/lib/funnel-config';
import { Check, ShieldCheck, Download, FileText, Sparkles } from 'lucide-react';
import pagesData from '@content/marketing/pages.json';

export default function ProductKitPage() {
  const offerData = pagesData.offer;
  const funnelConfig = getFunnelConfig();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, padding: 'var(--space-12) 0 var(--space-20) 0' }}>
        <div className="container-reading">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span
              style={{
                display: 'inline-flex',
                padding: '4px 14px',
                backgroundColor: 'var(--color-accent-soft)',
                color: 'var(--color-accent)',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--type-small)',
                fontWeight: 'var(--weight-semibold)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Recursos Práticos · Produto Digital Descarregável
            </span>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', lineHeight: 1.15, fontWeight: 'var(--weight-bold)' }}>
              {offerData.title}
            </h1>
            <p className="secondary" style={{ marginTop: 'var(--space-3)', fontSize: 'var(--type-body)', lineHeight: 1.5 }}>
              {offerData.description}
            </p>
          </div>

          {/* VSL Player */}
          <div style={{ marginBottom: 'var(--space-10)' }}>
            <VslPlayer
              id="apresentacao-kit"
              src={funnelConfig.vsl.src}
              poster={funnelConfig.vsl.poster}
              captionsSrc={funnelConfig.vsl.captionsSrc}
              title="Apresentação do Kit Emprego dos Sonhos"
            />
          </div>

          {/* Commercial Offer Panel */}
          <div style={{ marginBottom: 'var(--space-12)' }}>
            <OfferPanel id="comprar" />
          </div>

          {/* Conteúdo Detalhado dos Recursos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)', marginTop: 'var(--space-8)' }}>
            {/* Secção Modelos de CV */}
            <section
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-card)',
                padding: 'var(--space-8) var(--space-6)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h2 style={{ fontSize: 'var(--type-h2-mobile)', marginBottom: 'var(--space-2)' }}>
                2 Modelos de CV Desenhados para o Mercado Português
              </h2>
              <p className="secondary" style={{ marginBottom: 'var(--space-6)' }}>
                Ficheiros estáticos em Word (DOCX) para edição externa no teu computador, com guias de referência em PDF e exemplos fictícios. Sem editores online nem subscrições.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                <div style={{ backgroundColor: 'var(--color-surface-raised)', padding: 'var(--space-6)', borderRadius: 'var(--radius-control)', border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>
                    Modelo Essencial (1 Coluna)
                  </h3>
                  <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                    Estrutura clássica e linear. Leitura imediata pelos recrutadores e focada em resultados cronológicos comprováveis.
                  </p>
                </div>

                <div style={{ backgroundColor: 'var(--color-surface-raised)', padding: 'var(--space-6)', borderRadius: 'var(--radius-control)', border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>
                    Modelo Moderno (Equilibrado)
                  </h3>
                  <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
                    Destaque visual equilibrado para competências digitais, ferramentas e projetos de impacto. Fotografia opcional e removível.
                  </p>
                </div>
              </div>
            </section>

            {/* Secção Cartas e Mensagens */}
            <section
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-card)',
                padding: 'var(--space-8) var(--space-6)',
                border: '1px solid var(--color-border)',
              }}
            >
              <h2 style={{ fontSize: 'var(--type-h2-mobile)', marginBottom: 'var(--space-4)' }}>
                Materiais Complementares de Candidatura
              </h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  'Pack de 3 Cartas de Apresentação: Resposta a anúncio, candidatura espontânea e transição de área.',
                  '10 Mensagens de Contacto Direto: Modelos para LinkedIn, email a recrutadores e acompanhamento pós-entrevista.',
                  'Checklists de Pré-Envio: Verificação de 15 pontos críticos antes de submeter qualquer candidatura.',
                  '25 Prompts Testados de IA: Instruções práticas para ChatGPT/Claude sem inventar experiências falsas.',
                  'Plano de 7 Dias: Roteiro passo a passo para renovar a procura de emprego numa semana.',
                  'Organizador de Candidaturas em CSV: Registo simples e offline para controlar empresas e prazos.',
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                    <Check size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                    <span style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Disclaimer Final */}
          <p
            className="secondary"
            style={{
              textAlign: 'center',
              fontSize: 'var(--type-small)',
              marginTop: 'var(--space-10)',
              lineHeight: 1.5,
            }}
          >
            {offerData.limit}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
