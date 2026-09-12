'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Check } from 'lucide-react';

export default function CookiesPage() {
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAcceptAll = () => {
    setAnalytics(true);
    setMarketing(true);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRejectOptional = () => {
    setAnalytics(false);
    setMarketing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, padding: 'clamp(24px, 5vh, 48px) 0 clamp(40px, 6vh, 64px) 0' }}>
        <div className="container-reading">
          <header style={{ marginBottom: 'var(--space-8)' }}>
            <span style={{ fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
              Privacidade & Consentimento
            </span>
            <h1 style={{ fontSize: 'var(--type-h1-desktop)', marginTop: 'var(--space-2)' }}>
              Preferências de Cookies
            </h1>
            <p className="secondary" style={{ marginTop: 'var(--space-2)' }}>
              Controla de forma transparente quais os identificadores e cookies que autorizas no teu navegador.
            </p>
          </header>

          <div
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-card)',
              padding: 'var(--space-8) var(--space-6)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-6)',
            }}
          >
            {saved && (
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: '#EBF6EE',
                  borderRadius: 'var(--radius-control)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  fontSize: 'var(--type-small)',
                  fontWeight: 'var(--weight-medium)',
                }}
              >
                <Check size={18} />
                <span>As tuas preferências foram guardadas com sucesso.</span>
              </div>
            )}

            {/* Categoria 1: Essenciais */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-surface)' }}>
              <div>
                <strong style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>
                  Cookies Técnicos Essenciais
                </strong>
                <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: '4px' }}>
                  Necessários para o funcionamento da plataforma, manutenção da sessão de utilizador e segurança do checkout. Não podem ser desativados.
                </p>
              </div>
              <span style={{ fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text-secondary)', padding: '4px 8px', backgroundColor: 'var(--color-surface)', borderRadius: '4px' }}>
                Sempre Ativo
              </span>
            </div>

            {/* Categoria 2: Analíticos */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-surface)' }}>
              <div>
                <strong style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>
                  Métricas e Estatísticas Agregadas
                </strong>
                <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: '4px' }}>
                  Ajudam-nos a compreender de forma anónima o desempenho das páginas e eventuais erros de navegação.
                </p>
              </div>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                style={{ width: '22px', height: '22px', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
                aria-label="Ativar métricas anónimas"
              />
            </div>

            {/* Categoria 3: Marketing */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
              <div>
                <strong style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>
                  Comunicações Personalizadas & Campanhas
                </strong>
                <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: '4px' }}>
                  Permitem apresentar novidades relevantes e ofertas do Kit apenas a quem tiver interesse manifesto.
                </p>
              </div>
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                style={{ width: '22px', height: '22px', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
                aria-label="Ativar cookies de marketing"
              />
            </div>

            {/* Ações com simetria visual (sem dark patterns) */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
              <Button onClick={handleSave} variant="primary" style={{ flex: '1 1 180px' }}>
                Guardar Seleção
              </Button>
              <Button onClick={handleAcceptAll} variant="secondary" style={{ flex: '1 1 180px' }}>
                Aceitar Todos
              </Button>
              <Button onClick={handleRejectOptional} variant="ghost" style={{ flex: '1 1 180px' }}>
                Rejeitar Opcionais
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
