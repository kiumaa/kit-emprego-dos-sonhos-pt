'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { VslPlayer } from '@/components/marketing/VslPlayer';
import { ProductMockup } from '@/components/marketing/ProductMockup';
import { getFunnelConfig, getValidatedCheckoutUrl } from '@/lib/funnel-config';
import { ArrowRight, ShieldCheck, Check } from 'lucide-react';

export default function ProductKitPage() {
  const funnelConfig = getFunnelConfig();
  const checkout = getValidatedCheckoutUrl();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Header com o logótipo oficial em destaque */}
      <Header />

      <main style={{ flex: 1, padding: 'clamp(24px, 4vh, 40px) 0 clamp(48px, 8vh, 80px) 0' }}>
        <div className="container-reading" style={{ maxWidth: '820px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
          
          {/* ================================================================= */}
          {/* 1. HERO COM VISUAL DO PRODUTO, PREÇO E CTA IMEDIATO               */}
          {/* ================================================================= */}
          <section style={{ textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
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

            {/* Visual dos Componentes do Produto */}
            <div style={{ margin: 'var(--space-2) 0 var(--space-6) 0' }}>
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
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 30px rgba(29, 29, 31, 0.05)',
                maxWidth: '520px',
                marginInline: 'auto',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: 'clamp(38px, 8vw, 50px)', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  14,99 €
                </span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
                    gap: '10px',
                    width: '100%',
                    minHeight: '52px',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-on-accent)',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(0, 87, 217, 0.25)',
                    transition: 'background-color 160ms ease',
                    padding: '14px 24px',
                    boxSizing: 'border-box',
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
          {/* 2. VSL PROTAGONISTA (16:9 Autêntico)                              */}
          {/* ================================================================= */}
          <VslPlayer
            id="apresentacao-kit"
            src={funnelConfig.vsl.src}
            poster={funnelConfig.vsl.poster}
            captionsSrc={funnelConfig.vsl.captionsSrc}
            title="Antes de enviares a próxima candidatura, vê isto."
          />

          {/* ================================================================= */}
          {/* 3. ANTES VS DEPOIS CONCEPTUAL (Sem Métricas Falsas)               */}
          {/* ================================================================= */}
          <section
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: 'clamp(24px, 5vw, 36px) clamp(20px, 4vw, 32px)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 30px rgba(29, 29, 31, 0.04)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
              <h2 style={{ fontSize: 'clamp(22px, 4.5vw, 28px)', fontWeight: 700, color: 'var(--color-text)' }}>
                A diferença de ter um método
              </h2>
              <p className="secondary" style={{ fontSize: '14px', marginTop: '4px', color: 'var(--color-text-secondary)' }}>
                Como o processo muda quando deixas de disparar currículos ao acaso.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--space-4)',
              }}
            >
              {/* Sem Método */}
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
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

              {/* Com o Kit */}
              <div
                style={{
                  backgroundColor: 'var(--color-accent-soft)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(0, 87, 217, 0.18)',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
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
          {/* 4. BUMPS INFORMATIVOS                                             */}
          {/* ================================================================= */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: '16px',
              padding: '18px 20px',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 4px 0' }}>
              Aceleradores opcionais disponíveis no checkout
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', maxWidth: '520px', marginInline: 'auto', lineHeight: 1.45, margin: 0 }}>
              Durante a finalização da encomenda na OKANDA PAY, podes adicionar os manuais especializados de <strong>Entrevista dos Sonhos (+ 4,90 €)</strong> e <strong>LinkedIn dos Sonhos (+ 5,90 €)</strong>.
            </p>
          </div>

          {/* ================================================================= */}
          {/* 5. PREÇO E CTA FINAL                                              */}
          {/* ================================================================= */}
          <section style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)' }}>
            <h2 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Dá o próximo passo na tua carreira.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', margin: 'var(--space-2) 0' }}>
              <span style={{ fontSize: 'clamp(38px, 8vw, 50px)', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                14,99 €
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
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
                  minHeight: '52px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-on-accent)',
                  borderRadius: '12px',
                  fontSize: '17px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(0, 87, 217, 0.25)',
                  padding: '14px 24px',
                  boxSizing: 'border-box',
                }}
              >
                <span>Quero o Kit Completo — 14,99 €</span>
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
          {/* 6. FAQ CURTO E OBJETIVO                                            */}
          {/* ================================================================= */}
          <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-8)' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: 'var(--space-4)', textAlign: 'center' }}>
              Perguntas frequentes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <details
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
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
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
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
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
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
