import React, { useState } from 'react';
import { Button } from './button';
import { TextField } from './text-field';
import { Send, Check } from 'lucide-react';

export interface LeadCaptureProps {
  onSavePlan: (data: { email: string; name?: string; marketingConsent: boolean }) => Promise<void>;
  isSubmitted?: boolean;
}

export const LeadCapture: React.FC<LeadCaptureProps> = ({
  onSavePlan,
  isSubmitted = false,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(isSubmitted);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Por favor introduz um endereço de email válido.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await onSavePlan({ email, name: name.trim() || undefined, marketingConsent });
      setSubmitted(true);
    } catch {
      setError('Ocorreu um erro ao guardar o plano. Por favor tenta novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: 'var(--space-6)',
          backgroundColor: '#EBF6EE',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--color-success)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-success)',
            color: 'var(--color-on-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Check size={24} aria-hidden="true" />
        </div>
        <div>
          <h4 style={{ color: 'var(--color-success)', fontSize: 'var(--type-body)', fontWeight: 'var(--weight-bold)' }}>
            Plano enviado com sucesso!
          </h4>
          <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text)', marginTop: 'var(--space-1)' }}>
            Enviámos uma cópia do teu diagnóstico e próximos passos para <strong>{email}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-6)',
        border: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
      }}
    >
      <div>
        <h3 style={{ fontSize: 'var(--type-h3)' }}>Guardar e receber o meu plano</h3>
        <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: 'var(--space-1)' }}>
          Enviamos-te um resumo dos teus resultados e ações prioritárias para teres sempre à mão.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <TextField
          id="lead-email"
          type="email"
          label="O teu email"
          placeholder="exemplo@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error || undefined}
        />

        <TextField
          id="lead-name"
          type="text"
          label="O teu nome (opcional)"
          placeholder="Como preferes ser tratado"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
        <input
          id="marketing-optin"
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          style={{
            marginTop: '4px',
            width: '18px',
            height: '18px',
            accentColor: 'var(--color-accent)',
            cursor: 'pointer',
          }}
        />
        <label
          htmlFor="marketing-optin"
          style={{
            fontSize: 'var(--type-small)',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.4',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          Aceito receber ocasionalmente dicas de carreira, novidades do kit e ofertas relevantes. (Opcional; podes cancelar a qualquer momento.)
        </label>
      </div>

      <Button type="submit" variant="primary" isLoading={isLoading} style={{ marginTop: 'var(--space-2)' }}>
        <Send size={18} aria-hidden="true" />
        Enviar o meu plano gratuito
      </Button>
    </form>
  );
};
