'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FileSearch, HelpCircle } from 'lucide-react';

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (!id) {
      setHasChecked(true);
      return;
    }

    try {
      const stored = sessionStorage.getItem(`keds_result_${id}`);
      if (stored) {
        // Redirecionamento imediato sem atrasos artificiais
        router.replace(`/resultado/${id}`);
        return;
      }
    } catch {
      // Ignorar erro de storage
    }
    setHasChecked(true);
  }, [id, router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12) var(--layout-mobile-gutter)' }}>
        <div
          className="container-form"
          style={{
            textAlign: 'center',
            backgroundColor: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--space-12) var(--space-6)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
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
              backgroundColor: 'var(--color-accent-soft)',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileSearch size={32} aria-hidden="true" />
          </div>

          <div>
            <h1 style={{ fontSize: 'var(--type-h2-mobile)', fontWeight: 'var(--weight-semibold)' }}>
              Diagnóstico de Candidatura
            </h1>
            <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
              {hasChecked
                ? 'Nenhum resultado pendente encontrado para este identificador.'
                : 'A verificar os dados do teu relatório...'}
            </p>
          </div>

          {hasChecked && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%', maxWidth: '320px' }}>
              <a
                href="/quiz"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)',
                  height: '48px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-on-accent)',
                  borderRadius: 'var(--radius-control)',
                  fontWeight: 'var(--weight-semibold)',
                  textDecoration: 'none',
                }}
              >
                <HelpCircle size={18} aria-hidden="true" />
                <span>Fazer o Quiz Gratuito</span>
              </a>
              <a
                href="/analisar-cv"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '44px',
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                  fontSize: 'var(--type-small)',
                }}
              >
                Analisar outro currículo
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <React.Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="secondary">A verificar diagnóstico...</p>
        </div>
      }
    >
      <ProcessingContent />
    </React.Suspense>
  );
}
