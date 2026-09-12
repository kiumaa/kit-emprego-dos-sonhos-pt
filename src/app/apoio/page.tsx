'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { TextField, TextArea } from '@/components/ui/text-field';
import { Mail, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function SupportPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, padding: 'var(--space-16) var(--layout-mobile-gutter)' }}>
        <div className="container-reading">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span style={{ fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-accent)', textTransform: 'uppercase' }}>
              Apoio ao Cliente & Dúvidas
            </span>
            <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-2)' }}>
              Como podemos ajudar?
            </h1>
            <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
              Tens dúvidas sobre o teu acesso, problemas técnicos com um ficheiro ou queres colocar uma questão? Fala connosco.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-card)',
              padding: 'var(--space-8) var(--space-6)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
                <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: '0 auto var(--space-3) auto' }} />
                <h2 style={{ fontSize: 'var(--type-h3)' }}>Mensagem enviada com sucesso!</h2>
                <p className="secondary" style={{ marginTop: 'var(--space-2)' }}>
                  A nossa equipa de apoio responderá para <strong>{email}</strong> no prazo de 24 horas úteis.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <TextField
                  label="O teu nome"
                  placeholder="Como preferes ser chamado"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  type="email"
                  label="O teu email"
                  placeholder="exemplo@email.pt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextArea
                  label="Mensagem ou descrição da dúvida"
                  placeholder="Indica o número de encomenda se a tua questão estiver relacionada com uma compra..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
                <Button type="submit" variant="primary" style={{ width: '100%', height: '48px', marginTop: 'var(--space-2)' }}>
                  Enviar mensagem de apoio
                </Button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
