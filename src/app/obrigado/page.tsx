'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import pagesData from '@content/marketing/pages.json';

function ThanksContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const isDemo = searchParams.get('demo') === 'true';
  const [status, setStatus] = useState<'loading' | 'paid' | 'pending' | 'unknown'>('loading');

  useEffect(() => {
    if (!orderId) {
      setStatus('unknown');
      return;
    }

    // Em modo demo local, atribui confirmação imediata identificada
    if (isDemo) {
      setStatus('paid');
      // Atribuir entitlement no storage de sessão local para testes
      sessionStorage.setItem('keds_entitlements', JSON.stringify(['kit', 'entrevista', 'linkedin']));
      sessionStorage.setItem('keds_user_email', 'cliente-demo@exemplo.pt');
      return;
    }

    // Em live real, simula consulta autoritativa no servidor
    setStatus('pending');
  }, [orderId, isDemo]);

  const thanksData = pagesData.thanks;

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
            {status === 'paid' && (
              <>
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
                    {isDemo ? 'Modo de Demonstração Local' : 'Compra Confirmada'}
                  </span>
                  <h1 style={{ fontSize: 'var(--type-h2-desktop)', marginTop: 'var(--space-2)' }}>
                    {thanksData.paid}
                  </h1>
                  <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
                    O teu acesso ao Kit Emprego dos Sonhos está ativo. Podes agora entrar na área do membro para aceder às lições, descarregar os modelos e utilizar o organizador de candidaturas.
                  </p>
                </div>

                <div
                  style={{
                    width: '100%',
                    padding: 'var(--space-4)',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-control)',
                    fontSize: 'var(--type-small)',
                    textAlign: 'left',
                  }}
                >
                  <p><strong>Referência da encomenda:</strong> {orderId}</p>
                  <p style={{ marginTop: '4px' }}><strong>Prazo de acesso:</strong> 12 meses à plataforma online.</p>
                </div>

                <a
                  href="/area"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--space-2)',
                    width: '100%',
                    maxWidth: '360px',
                    height: '52px',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-on-accent)',
                    borderRadius: 'var(--radius-control)',
                    fontSize: '18px',
                    fontWeight: 'var(--weight-semibold)',
                    textDecoration: 'none',
                  }}
                >
                  <span>{thanksData.access}</span>
                  <ArrowRight size={20} aria-hidden="true" />
                </a>
              </>
            )}

            {status === 'pending' && (
              <>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: '#FFF8E6',
                    color: 'var(--color-warning)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Clock size={36} aria-hidden="true" />
                </div>

                <div>
                  <h1 style={{ fontSize: 'var(--type-h2-desktop)' }}>{thanksData.pending}</h1>
                  <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
                    Estamos a aguardar a confirmação do pagamento por parte da OKANDA (por exemplo, aprovação de MB WAY ou transferência).
                  </p>
                </div>

                <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
                  Assim que o pagamento for verificado no servidor, receberás a confirmação por email e o teu acesso será desbloqueado.
                </p>

                <Button
                  onClick={() => window.location.reload()}
                  variant="secondary"
                  style={{ minWidth: '200px' }}
                >
                  Verificar estado novamente
                </Button>
              </>
            )}

            {status === 'unknown' && (
              <>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AlertCircle size={36} aria-hidden="true" />
                </div>

                <div>
                  <h1 style={{ fontSize: 'var(--type-h2-desktop)' }}>Informação de compra não encontrada</h1>
                  <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
                    {thanksData.unknown}
                  </p>
                </div>

                <a
                  href="/entrar"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 var(--space-6)',
                    height: '48px',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-on-accent)',
                    borderRadius: 'var(--radius-control)',
                    fontWeight: 'var(--weight-semibold)',
                    textDecoration: 'none',
                  }}
                >
                  Recuperar acesso por email
                </a>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ThanksPage() {
  return (
    <React.Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="secondary">A carregar detalhes da encomenda...</p>
        </div>
      }
    >
      <ThanksContent />
    </React.Suspense>
  );
}
