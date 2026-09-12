'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Check, ShieldCheck, ArrowRight, FileText, CheckCircle2, Download, MessageSquare, ListTodo, Sparkles } from 'lucide-react';
import pagesData from '@content/marketing/pages.json';

export default function ProductKitPage() {
  const offerData = pagesData.offer;
  const [selectedBumps, setSelectedBumps] = useState<{ entrevista: boolean; linkedin: boolean }>({
    entrevista: false,
    linkedin: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const basePriceMinor = 1490;
  const entrevistaPriceMinor = 490;
  const linkedinPriceMinor = 590;

  const calculateTotal = () => {
    let total = basePriceMinor;
    if (selectedBumps.entrevista) total += entrevistaPriceMinor;
    if (selectedBumps.linkedin) total += linkedinPriceMinor;
    return (total / 100).toFixed(2).replace('.', ',') + ' €';
  };

  const handleCheckout = () => {
    setIsLoading(true);
    // Em modo de demonstração local, redireciona para a página de obrigado
    setTimeout(() => {
      const orderId = `ok-demo-${Date.now()}`;
      window.location.href = `/obrigado?order_id=${orderId}&demo=true`;
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, padding: 'var(--space-12) 0 var(--space-20) 0' }}>
        <div className="container-reading">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
            <span
              style={{
                display: 'inline-flex',
                padding: '4px 14px',
                backgroundColor: 'var(--color-accent-soft)',
                color: 'var(--color-accent)',
                borderRadius: 'var(--radius-pill)',
                fontSize: 'var(--type-small)',
                fontWeight: 'var(--weight-semibold)',
                marginBottom: 'var(--space-4)',
              }}
            >
              Acesso Completo de 12 Meses · Sem Renovações
            </span>
            <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 48px)', lineHeight: 1.15, fontWeight: 'var(--weight-bold)' }}>
              {offerData.title}
            </h1>
            <p className="secondary" style={{ marginTop: 'var(--space-3)', fontSize: 'var(--type-body)', lineHeight: 1.5 }}>
              {offerData.description}
            </p>
          </div>

          {/* Main Card */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-large)',
              padding: 'var(--space-8) var(--space-6)',
              border: '2px solid var(--color-accent-soft)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-8)',
            }}
          >
            {/* Price Box */}
            <div
              style={{
                backgroundColor: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-card)',
                padding: 'var(--space-6)',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}
            >
              <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Preço do Kit Principal
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--type-hero-desktop)', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>
                  14,90 €
                </span>
                <span style={{ fontSize: 'var(--type-body)', color: 'var(--color-text-secondary)' }}>
                  / pagamento único
                </span>
              </div>
              <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: 'var(--space-2)' }}>
                12 meses de acesso à área privada. Os ficheiros descarregados permanecem teus para uso pessoal.
              </p>
            </div>

            {/* Inclusions List */}
            <div>
              <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-4)' }}>
                O que está incluído no Kit:
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  '10 Lições práticas em texto com exemplos e tarefas aplicáveis',
                  '2 Modelos de CV estáticos para Word/DOCX (Essencial e Moderno)',
                  '3 Estruturas de cartas de apresentação prontas a adaptar',
                  '10 Mensagens de candidatura e contacto com recrutadores',
                  'Checklists de pré-envio e instruções de revisão',
                  '25 Prompts testados para apoio na redação com ferramentas de IA',
                  'Plano de ação organizado para 7 dias',
                  'Gestor de candidaturas com registo de empresas e exportação CSV',
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                    <Check size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                    <span style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bumps Opcionais */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-6)' }}>
              <h3 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>
                Complementos opcionais (adiciona se fizer sentido):
              </h3>
              <p className="secondary" style={{ fontSize: 'var(--type-small)', marginBottom: 'var(--space-4)' }}>
                Estes materiais são independentes do Kit principal e não são pré-selecionados.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Bump Entrevista */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-4)',
                    backgroundColor: selectedBumps.entrevista ? 'var(--color-accent-soft)' : 'var(--color-surface-raised)',
                    borderRadius: 'var(--radius-control)',
                    border: `1.5px solid ${selectedBumps.entrevista ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedBumps.entrevista}
                    onChange={(e) => setSelectedBumps({ ...selectedBumps, entrevista: e.target.checked })}
                    style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--color-accent)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>
                        Entrevista dos Sonhos
                      </strong>
                      <span style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-accent)' }}>+ 4,90 €</span>
                    </div>
                    <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      Exercícios práticos de preparação, banco com 20 perguntas frequentes e estrutura de resposta contextualizada.
                    </p>
                  </div>
                </label>

                {/* Bump LinkedIn */}
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-4)',
                    backgroundColor: selectedBumps.linkedin ? 'var(--color-accent-soft)' : 'var(--color-surface-raised)',
                    borderRadius: 'var(--radius-control)',
                    border: `1.5px solid ${selectedBumps.linkedin ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedBumps.linkedin}
                    onChange={(e) => setSelectedBumps({ ...selectedBumps, linkedin: e.target.checked })}
                    style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: 'var(--color-accent)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>
                        LinkedIn dos Sonhos
                      </strong>
                      <span style={{ fontWeight: 'var(--weight-bold)', color: 'var(--color-accent)' }}>+ 5,90 €</span>
                    </div>
                    <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      Guia de otimização de perfil, palavras-chave para recrutamento em Portugal e rotina de contactos semanais.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Total e Checkout */}
            <div
              style={{
                borderTop: '1px solid var(--color-border)',
                paddingTop: 'var(--space-6)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-4)',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 'var(--type-body)' }}>
                <span>Total a pagar:</span>
                <span style={{ fontSize: '24px', fontWeight: 'var(--weight-bold)', color: 'var(--color-text)' }}>
                  {calculateTotal()}
                </span>
              </div>

              <Button
                onClick={handleCheckout}
                isLoading={isLoading}
                variant="primary"
                style={{ width: '100%', height: '54px', fontSize: '18px' }}
              >
                <span>Concluir Compra na OKANDA</span>
                <ArrowRight size={20} aria-hidden="true" />
              </Button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <ShieldCheck size={18} color="var(--color-text-secondary)" aria-hidden="true" />
                <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
                  Checkout seguro com proteção de dados e faturação transparente.
                </span>
              </div>
            </div>
          </div>

          {/* Disclaimer Final */}
          <p
            className="secondary"
            style={{
              textAlign: 'center',
              fontSize: 'var(--type-small)',
              marginTop: 'var(--space-8)',
            }}
          >
            {offerData.limit}
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
