'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Por favor introduz um email válido.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      // Para testes locais imediatos, guarda sessão demo
      sessionStorage.setItem('keds_user_email', email);
      sessionStorage.setItem('keds_entitlements', JSON.stringify(['kit']));
    }, 800);
  };

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
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-6)',
            }}
          >
            {isSent ? (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: '#EBF6EE',
                    color: 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircle2 size={32} aria-hidden="true" />
                </div>
                <h1 style={{ fontSize: 'var(--type-h2-desktop)' }}>Ligação de acesso enviada</h1>
                <p className="secondary" style={{ fontSize: 'var(--type-body)' }}>
                  Enviámos uma ligação segura de entrada para <strong>{email}</strong>. Clica na ligação no teu email para aceder à tua área privada.
                </p>
                <a
                  href="/area"
                  style={{
                    marginTop: 'var(--space-2)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '48px',
                    padding: '0 var(--space-6)',
                    backgroundColor: 'var(--color-accent)',
                    color: 'var(--color-on-accent)',
                    borderRadius: 'var(--radius-control)',
                    fontWeight: 'var(--weight-semibold)',
                    textDecoration: 'none',
                  }}
                >
                  Entrar diretamente (Ambiente Demo)
                </a>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'var(--color-accent-soft)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto var(--space-3) auto',
                    }}
                  >
                    <KeyRound size={24} aria-hidden="true" />
                  </div>
                  <h1 style={{ fontSize: 'var(--type-h2-mobile)', fontWeight: 'var(--weight-semibold)' }}>
                    Entrar na Área do Membro
                  </h1>
                  <p className="secondary" style={{ marginTop: 'var(--space-1)', fontSize: 'var(--type-small)' }}>
                    Introduz o endereço de email que utilizaste na compra para receber uma ligação de acesso segura sem password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  <TextField
                    id="login-email"
                    type="email"
                    label="Email de compra"
                    placeholder="o-teu-email@exemplo.pt"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error || undefined}
                    required
                  />

                  <Button type="submit" variant="primary" isLoading={isLoading} style={{ width: '100%', height: '48px' }}>
                    <span>Enviar ligação de acesso</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Button>
                </form>

                <div style={{ textAlign: 'center', borderTop: '1px solid var(--color-surface)', paddingTop: 'var(--space-4)' }}>
                  <p className="secondary" style={{ fontSize: 'var(--type-small)' }}>
                    Ainda não tens o Kit Emprego dos Sonhos?{' '}
                    <a href="/kit" style={{ color: 'var(--color-accent)', fontWeight: 'var(--weight-semibold)' }}>
                      Conhecer o Kit
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
