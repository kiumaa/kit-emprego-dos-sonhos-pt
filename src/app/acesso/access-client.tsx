'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, ArrowRight, Mail, KeyRound, AlertCircle } from 'lucide-react';

export function AccessClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const produtoParam = searchParams.get('produto') || 'kit';

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [devCodeHelper, setDevCodeHelper] = useState<string | null>(null);

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

  const productName =
    produtoParam === 'entrevista'
      ? 'Entrevista dos Sonhos (Acelerador)'
      : produtoParam === 'linkedin'
      ? 'LinkedIn dos Sonhos (Acelerador)'
      : 'Kit Emprego dos Sonhos';

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setDevCodeHelper(null);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Por favor introduz um endereço de email válido.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || data.error || 'Erro ao enviar código.');
        setIsLoading(false);
        return;
      }

      setStep('otp');
      setInfoMessage(`Enviámos um código de 6 dígitos para ${email}.`);
      if (data.devCode) {
        setDevCodeHelper(data.devCode);
      }
    } catch {
      setErrorMessage('Não foi possível contactar o servidor. Tenta novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!code || code.length !== 6) {
      setErrorMessage('O código de verificação deve conter 6 dígitos.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || data.error || 'Código incorreto ou expirado.');
        setIsLoading(false);
        return;
      }

      // Sucesso! Redirecionar para a área de ferramentas
      router.push('/meu-kit');
    } catch {
      setErrorMessage('Erro de ligação. Tenta novamente.');
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
            {step === 'email'
              ? 'Confirma o endereço de email que utilizaste na compra da OKANDA para receberes o teu código de acesso seguro.'
              : 'Introduz o código de 6 dígitos que recebeste no teu email.'}
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

        {infoMessage && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#EFF6FF',
              color: '#1E40AF',
              border: '1px solid #BFDBFE',
              borderRadius: '10px',
              padding: '12px 14px',
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{infoMessage}</span>
          </div>
        )}

        {devCodeHelper && (
          <div
            style={{
              backgroundColor: '#F3F4F6',
              border: '1px dashed #9CA3AF',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '13px',
              color: '#374151',
              marginBottom: '20px',
            }}
          >
            <strong>Ambiente local / teste:</strong> Código gerado:{' '}
            <code style={{ fontWeight: 700, color: '#0057D9' }}>{devCodeHelper}</code>
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode}>
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
              {isLoading ? 'A enviar código...' : 'Receber código de acesso'}
              <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div style={{ marginBottom: '20px' }}>
              <label
                htmlFor="otp-input"
                style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}
              >
                Código de 6 dígitos
              </label>
              <div style={{ position: 'relative' }}>
                <KeyRound
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
                  id="otp-input"
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    height: '50px',
                    paddingLeft: '42px',
                    paddingRight: '14px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    fontSize: '18px',
                    fontWeight: 700,
                    letterSpacing: '4px',
                    outline: 'none',
                    backgroundColor: '#FAFAFA',
                    fontFamily: 'monospace',
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
              {isLoading ? 'A verificar...' : 'Confirmar e entrar'}
              <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setCode('');
                  setErrorMessage(null);
                  setInfoMessage(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-accent)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Alterar endereço de email
              </button>
            </div>
          </form>
        )}

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
