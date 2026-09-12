'use client';

import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CheckCircle2, Mail, FileText, Download, HelpCircle } from 'lucide-react';

export default function ThanksPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, padding: 'var(--space-16) var(--layout-mobile-gutter)' }}>
        <div className="container-form">
          <div
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-card)',
              padding: 'var(--space-10) var(--space-6)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-6)',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: '#EBF6EE',
                color: 'var(--color-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircle2 size={36} aria-hidden="true" />
            </div>

            <div>
              <span style={{ fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-success)', textTransform: 'uppercase' }}>
                Entrega Digital por Email
              </span>
              <h1 style={{ fontSize: 'var(--type-h2-desktop)', marginTop: 'var(--space-2)' }}>
                Obrigado pelo teu pedido!
              </h1>
              <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)', lineHeight: 1.5 }}>
                Os teus ficheiros digitais são entregues diretamente no endereço de email associado à tua compra pela OKANDA.
              </p>
            </div>

            <div
              style={{
                width: '100%',
                padding: 'var(--space-6)',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-control)',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
              }}
            >
              <h2 style={{ fontSize: 'var(--type-body)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)' }}>
                Próximos passos para aceder aos recursos:
              </h2>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <Mail size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  <strong>1. Verifica o teu email:</strong> Procura a mensagem de confirmação da OKANDA com as ligações de descarregamento dos ficheiros (verifica também a pasta de spam/promoções).
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <Download size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  <strong>2. Descarrega os ficheiros:</strong> Guarda o Guia em PDF, os modelos DOCX e os materiais no teu computador para os utilizares sempre que precisares.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <FileText size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                  <strong>3. Edita externamente:</strong> Abre os modelos de CV no Microsoft Word, Google Docs ou LibreOffice e preenche os teus dados com base nos exemplos fornecidos.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <HelpCircle size={16} color="var(--color-text-secondary)" aria-hidden="true" />
              <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
                Dúvidas ou não recebeste o email? <a href="/apoio">Contacta a nossa equipa de apoio</a>.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
