'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Sparkles } from 'lucide-react';

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || `diag-${Date.now().toString(36)}`;
  const [statusText, setStatusText] = useState('A ler a estrutura do documento...');

  useEffect(() => {
    // Simula as etapas reais de sanitização e extração segura
    const t1 = setTimeout(() => {
      setStatusText('A verificar pontos de contacto com oportunidades...');
    }, 1200);

    const t2 = setTimeout(() => {
      setStatusText('A preparar as tuas 3 prioridades de ação...');
    }, 2400);

    const t3 = setTimeout(() => {
      router.push(`/resultado/${id}`);
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
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
            <Sparkles size={32} aria-hidden="true" />
          </div>

          <div>
            <h1 style={{ fontSize: 'var(--type-h2-mobile)', fontWeight: 'var(--weight-semibold)' }}>
              A processar o teu diagnóstico
            </h1>
            <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
              {statusText}
            </p>
          </div>

          <div
            style={{
              width: '100%',
              maxWidth: '320px',
              height: '6px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-pill)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '40%',
                backgroundColor: 'var(--color-accent)',
                borderRadius: 'var(--radius-pill)',
                animation: 'indeterminate 1.5s infinite ease-in-out',
              }}
            />
          </div>

          <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
            Não fechamos este separador. O teu relatório será apresentado de seguida.
          </span>
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
          <p className="secondary">A carregar diagnóstico...</p>
        </div>
      }
    >
      <ProcessingContent />
    </React.Suspense>
  );
}
