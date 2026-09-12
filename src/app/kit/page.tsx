'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VslPlayer } from '@/components/marketing/VslPlayer';
import { ProductMockup } from '@/components/marketing/ProductMockup';
import { getFunnelConfig, getValidatedCheckoutUrl } from '@/lib/funnel-config';
import { ArrowRight, ShieldCheck, Check, Sparkles, HelpCircle } from 'lucide-react';

export default function ProductKitPage() {
  const funnelConfig = getFunnelConfig();
  const checkout = getValidatedCheckoutUrl();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Header com apenas o logótipo oficial */}
      <Header />

      <main style={{ flex: 1, padding: 'var(--space-8) var(--layout-mobile-gutter) var(--space-20) var(--layout-mobile-gutter)' }}>
        <div className="container-reading" style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
          
          {/* ================================================================= */}
          {/* 1. HERO COM VISUAL DO PRODUTO, PREÇO E CTA IMEDIATO               */}
          {/* ================================================================= */}
          <section style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-accent)',
                backgroundColor: 'var(--color-accent-soft)',
                padding: '4px 14px',
                borderRadius: '999px',
                marginBottom: 'var(--space-3)',
              }}
            >
              Kit Completo · Recursos Descarregáveis
            </span>

            <h1
              style={{
                fontSize: 'clamp(28px, 6vw, 42px)',
                lineHeight: 1.15,
                fontWeight: 700,
                letterSpacing: '-0.025em',
                color: 'var(--color-text)',
                marginBottom: 'var(--space-3)',
              }}
            >
              Prepara a tua próxima candidatura sem começares do zero.
            </h1>

            <p
              className="secondary"
              style={{
                fontSize: '16px',
                lineHeight: 1.5,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                marginInline: 'auto',
                marginBottom: 'var(--space-6)',
              }}
            >
              Modelos de CV editáveis em Word, cartas de apresentação, mensagens para recrutadores e um plano de 7 dias desenhado para o mercado de trabalho em Portugal.
            </p>

            {/* Visual Grande do Produto (Mockup Editorial) */}
            <div style={{ margin: 'var(--space-4) 0 var(--space-8) 0' }}>
              <ProductMockup />
            </div>

            {/* Preço e CTA de Compra */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-6)',
                backgroundColor: 'var(--color-surface)',
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                maxWidth: '520px',
                marginInline: 'auto',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: 'clamp(32px, 6vw, 44px)', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.03em' }}>
                  14,90 €
                </span>
                <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  pagamento único
                </span>
              </div>

              {checkout.isConfigured && checkout.url ? (
                <a
                  href={checkout.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    height: '52px',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-on-accent)',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(0, 87, 217, 0.25)',
                    transition: 'background-color 160ms ease',
                  }}
                >
                  <span>Quero o Kit Emprego dos Sonhos</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              ) : (
                <div style={{ padding: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  Checkout oficial em preparação na OKANDA PAY
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--color-text-secondary)" aria-hidden="true" />
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Pagamento seguro através da OKANDA PAY · Entrega imediata por email
                </span>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* 2. VSL PROTAGONISTA                                                */}
          {/* ================================================================= */}
          <VslPlayer
            id="apresentacao-kit"
            src={funnelConfig.vsl.src}
            poster={funnelConfig.vsl.poster}
            captionsSrc={funnelConfig.vsl.captionsSrc}
            title="Antes de enviares a próxima candidatura, vê isto."
          />

          {/* ================================================================= */}
          {/* 3. TUDO O QUE RECEBES (4 PILARES E PREVIEWS REAIS)                */}
          {/* ================================================================= */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
                Tudo o que está incluído no Kit
              </h2>
              <p className="secondary" style={{ fontSize: '15px', marginTop: '4px' }}>
                Materiais estáticos, práticos e organizados para usares no teu próprio computador.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--space-4)',
              }}
            >
              <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '16px', padding: '24px 20px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  O teu CV
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  2 modelos editáveis no Word (DOCX): Modelo Essencial (1 coluna) e Modelo Moderno (equilibrado), acompanhados de exemplos reais para Portugal.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '16px', padding: '24px 20px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  As tuas candidaturas
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  3 cartas de apresentação prontas (anúncio, candidatura espontânea, transição), 10 mensagens de abordagem direta e checklist de 15 pontos críticos.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '16px', padding: '24px 20px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  O teu plano
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  Guia central com 10 lições práticas em PDF, plano de ação diário para 7 dias e folha de cálculo CSV offline para controlar as candidaturas.
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '16px', padding: '24px 20px', border: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  IA como apoio
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  25 prompts estratégicos testados para ChatGPT e Claude, desenhados para extrair pontos fortes reais sem criar biografias inventadas.
                </p>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* 4. ANTES VS DEPOIS CONCEPTUAL (Sem Métricas Falsas)               */}
          {/* ================================================================= */}
          <section
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: '24px',
              padding: 'var(--space-8) var(--layout-mobile-gutter)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'clamp(22px, 4.5vw, 28px)', fontWeight: 700, color: 'var(--color-text)' }}>
                A diferença de ter um método
              </h2>
              <p className="secondary" style={{ fontSize: '14px', marginTop: '4px' }}>
                Como o processo muda quando deixas de disparar currículos ao acaso.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--space-6)',
              }}
            >
              {/* Antes */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Sem método
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--color-danger)' }}>✕</span>
                    <span>O mesmo CV genérico enviado para dezenas de vagas</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--color-danger)' }}>✕</span>
                    <span>Frases vagas como "responsável por tarefas da equipa"</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ color: 'var(--color-danger)' }}>✕</span>
                    <span>Candidatar, cruzar os braços e esperar sem feedback</span>
                  </li>
                </ul>
              </div>

              {/* Com Método */}
              <div
                style={{
                  backgroundColor: 'var(--color-accent-soft)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(0, 87, 217, 0.2)',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Com o Kit Emprego dos Sonhos
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: 'var(--color-text)' }}>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <Check size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} aria-hidden="true" />
                    <span><strong>Analisar:</strong> ler a vaga e identificar as palavras-chave reais</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <Check size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} aria-hidden="true" />
                    <span><strong>Adaptar:</strong> destacar conquistas observáveis e métricas</span>
                  </li>
                  <li style={{ display: 'flex', gap: '8px' }}>
                    <Check size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} aria-hidden="true" />
                    <span><strong>Acompanhar:</strong> mensagens de seguimento profissionais</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* 5. BUMPS INFORMATIVOS                                             */}
          {/* ================================================================= */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px 20px',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '6px' }}>
              Queres ir ainda mais longe?
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '520px', marginInline: 'auto', lineHeight: 1.45 }}>
              Durante a finalização da encomenda na OKANDA PAY, podes adicionar os manuais especializados de <strong>Entrevista dos Sonhos (+ 4,90 €)</strong> e <strong>LinkedIn dos Sonhos (+ 5,90 €)</strong>.
            </p>
          </div>

          {/* ================================================================= */}
          {/* 6. PREÇO E CTA REPETIDO NO FINAL                                  */}
          {/* ================================================================= */}
          <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Dá o próximo passo na tua carreira.
            </h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: 'var(--space-2) 0' }}>
              <span style={{ fontSize: 'clamp(36px, 7vw, 48px)', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.03em' }}>
                14,90 €
              </span>
              <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                pagamento único
              </span>
            </div>

            {checkout.isConfigured && checkout.url ? (
              <a
                href={checkout.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  maxWidth: '440px',
                  height: '52px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-on-accent)',
                  borderRadius: '12px',
                  fontSize: '17px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0, 87, 217, 0.25)',
                }}
              >
                <span>Quero preparar a minha próxima candidatura</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            ) : (
              <div style={{ padding: '8px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Checkout oficial em preparação na OKANDA PAY
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <ShieldCheck size={16} color="var(--color-text-secondary)" aria-hidden="true" />
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Processamento seguro OKANDA PAY · Sem fidelização nem subscrições
              </span>
            </div>
          </section>

          {/* ================================================================= */}
          {/* 7. FAQ CURTO E OBJETIVO                                            */}
          {/* ================================================================= */}
          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-8)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 'var(--space-4)', textAlign: 'center' }}>
              Perguntas frequentes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <details
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}>
                  Como e quando recebo os ficheiros?
                </summary>
                <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '8px 0 0 0' }}>
                  Imediatamente após a conclusão do pagamento na OKANDA, os ficheiros digitais são enviados para o teu endereço de email. Vais receber ligações seguras para descarregar o Guia em PDF, os modelos em DOCX e os materiais de apoio.
                </p>
              </details>

              <details
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}>
                  Preciso de instalar algum programa específico?
                </summary>
                <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '8px 0 0 0' }}>
                  Não. Os modelos são ficheiros normais em formato Word (DOCX) e podem ser abertos e editados no Microsoft Word, Google Docs ou LibreOffice no teu próprio computador.
                </p>
              </details>

              <details
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: '15px' }}>
                  Quais são os métodos de pagamento aceites?
                </summary>
                <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: '8px 0 0 0' }}>
                  O checkout da OKANDA PAY suporta os métodos habituais em Portugal, incluindo MB WAY, cartões bancários Visa/Mastercard e referência multibanco.
                </p>
              </details>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Legal Mínimo */}
      <Footer />
    </div>
  );
}
