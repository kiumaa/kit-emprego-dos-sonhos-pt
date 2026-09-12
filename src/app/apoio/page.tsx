import React from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Mail, Clock, ShieldCheck } from 'lucide-react';

export default function SupportPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'suporte@empregodossonhos.pt';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Header com apenas o logótipo oficial */}
      <Header showBack={true} backHref="/" backLabel="Início" />

      <main style={{ flex: 1, padding: 'var(--space-12) var(--layout-mobile-gutter)' }}>
        <div className="container-reading" style={{ maxWidth: '540px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--color-accent)',
              }}
            >
              Apoio ao Cliente
            </span>
            <h1
              style={{
                fontSize: 'clamp(26px, 5.5vw, 34px)',
                lineHeight: 1.2,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--color-text)',
                marginTop: 'var(--space-1)',
              }}
            >
              Precisas de ajuda?
            </h1>
            <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: '15px', lineHeight: 1.5 }}>
              Estamos disponíveis para te ajudar com dúvidas sobre os recursos, ficheiros descarregáveis ou questões da tua encomenda.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: 'var(--space-8) var(--space-6)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 30px rgba(29, 29, 31, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-6)',
            }}
          >
            {/* Bloco de Contacto por Email Direto */}
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '16px',
                padding: '24px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Mail size={22} aria-hidden="true" />
              </div>

              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Escreve-nos diretamente para:
              </span>

              <a
                href={`mailto:${supportEmail}`}
                style={{
                  fontSize: 'clamp(17px, 4vw, 20px)',
                  fontWeight: 700,
                  color: 'var(--color-accent)',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                }}
              >
                {supportEmail}
              </a>
            </div>

            {/* Recomendações Úteis */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.45 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Clock size={18} color="var(--color-text)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                <span>
                  <strong>Tempo de resposta:</strong> Respondemos habitualmente em dias úteis no prazo de 24 a 48 horas.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <ShieldCheck size={18} color="var(--color-text)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                <span>
                  <strong>Dúvidas de compra:</strong> Se a tua questão estiver relacionada com uma compra na OKANDA PAY, inclui o email utilizado no checkout para localizarmos o teu envio com rapidez.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
