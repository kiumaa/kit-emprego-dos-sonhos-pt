'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Mail, AlertCircle } from 'lucide-react';

export function AccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const produtoParam = searchParams.get('produto') || 'kit';
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Verificar se o utilizador já tem sessão ativa
  useEffect(() => {
    fetch('/api/me/entitlements')
      .then((res) => {
        if (res.ok) {
          router.replace('/meu-kit');
        }
      })
      .catch(() => {});
  }, [router]);

  // Se email vier nos search params e o utilizador ainda não tiver alterado
  useEffect(() => {
    if (emailParam && !email) {
      setEmail(emailParam);
    }
  }, [emailParam, email]);

  const productName =
    produtoParam === 'entrevista'
      ? 'Entrevista dos Sonhos (Acelerador)'
      : produtoParam === 'linkedin'
      ? 'LinkedIn dos Sonhos (Acelerador)'
      : 'Kit Emprego dos Sonhos';

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('Por favor introduz um endereço de email válido.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.message ||
            data.error ||
            'Não foi possível encontrar a tua compra. Confirma se utilizaste este email na OKANDA.'
        );
        setIsLoading(false);
        return;
      }

      // Sucesso imediato: redirecionar para a área de ferramentas e downloads
      router.push('/meu-kit');
    } catch {
      setErrorMessage('Não foi possível contactar o servidor. Tenta novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', padding: '40px 16px' }}>
      <div
        className="container-form"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
          padding: 'clamp(24px, 5vw, 40px)',
          width: '100%',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '4px 14px',
              borderRadius: '20px',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-accent)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '12px',
            }}
          >
            <span>Portal de Entrega e Acesso</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
            Acesso ao teu {productName}
          </h1>

          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            Introduz o endereço de email que utilizaste na compra da OKANDA para acederes imediatamente aos teus produtos, ferramentas e downloads.
          </p>
        </div>

        {errorMessage && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              backgroundColor: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FCA5A5',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleAccess}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email-input"
              style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}
            >
              Email da compra
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                }}
              />
              <input
                id="email-input"
                type="email"
                required
                autoFocus
                placeholder="exemplo@dominio.pt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  height: '50px',
                  paddingLeft: '42px',
                  paddingRight: '14px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  fontSize: '15px',
                  outline: 'none',
                  backgroundColor: '#FAFAFA',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', cursor: isLoading ? 'wait' : 'pointer' }}
          >
            {isLoading ? 'A validar acesso...' : 'Aceder ao Meu Kit'}
            <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </form>

        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
          }}
        >
          <ShieldCheck size={18} style={{ color: '#0057D9', flexShrink: 0, marginTop: '2px' }} />
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
            <strong>Proteção do teu acesso:</strong> Entrar no portal nunca gasta sessões. O teu limite de 3 sessões de trabalho de 24 horas por produto só se inicia quando escolheres ativamente começar a editar.
          </p>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', textDecoration: 'none' }}>
            ← Voltar à página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
