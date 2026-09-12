import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Mail, Download, HelpCircle, Info } from 'lucide-react';

export default function ThanksPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Header com apenas o logótipo oficial */}
      <Header showBack={true} backHref="/" backLabel="Início" />

      <main style={{ flex: 1, padding: 'var(--space-12) var(--layout-mobile-gutter)' }}>
        <div className="container-reading" style={{ maxWidth: '540px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: 'var(--space-8) var(--space-6)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 30px rgba(29, 29, 31, 0.05)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-6)',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '999px',
                backgroundColor: 'var(--color-accent-soft)',
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Info size={28} aria-hidden="true" />
            </div>

            <div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--color-accent)',
                }}
              >
                Entrega Digital por Email
              </span>
              <h1 style={{ fontSize: 'clamp(24px, 5vw, 30px)', fontWeight: 700, color: 'var(--color-text)', marginTop: 'var(--space-1)', lineHeight: 1.2 }}>
                Informação sobre o envio dos ficheiros
              </h1>
              <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: '14px', lineHeight: 1.5 }}>
                Se acabaste de concluir o teu pedido na OKANDA PAY, a entrega dos ficheiros digitais é processada automaticamente e enviada pela OKANDA para o endereço de email introduzido no checkout.
              </p>
            </div>

            <div
              style={{
                width: '100%',
                padding: '20px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: '16px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                O que fazer a seguir:
              </h2>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Mail size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  <strong>1. Verifica a tua caixa de correio:</strong> Procura o email da OKANDA com os links diretos para descarregar o Guia em PDF e os modelos em DOCX (consulta também a pasta de spam/promoções).
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Download size={18} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  <strong>2. Descarrega e guarda localmente:</strong> Guarda os ficheiros no teu computador para os editares quando precisares no Microsoft Word, Google Docs ou LibreOffice.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              <HelpCircle size={15} aria-hidden="true" />
              <span>
                Não recebeste a mensagem? <a href="/apoio" style={{ fontWeight: 600 }}>Entra em contacto connosco</a>.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
