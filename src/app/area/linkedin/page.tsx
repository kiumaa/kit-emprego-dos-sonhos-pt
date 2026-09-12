'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, CheckCircle2 } from 'lucide-react';

export default function LinkedinBumpPage() {
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('keds_entitlements');
      if (stored) {
        const list: string[] = JSON.parse(stored);
        setHasAccess(list.includes('linkedin'));
      }
    } catch {
      // Ignorar erro
    }
  }, []);

  if (!hasAccess) {
    return (
      <div style={{ maxWidth: '800px', marginInline: 'auto', textAlign: 'center', padding: 'var(--space-12) 0' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4) auto',
          }}
        >
          <Lock size={32} />
        </div>
        <h1 style={{ fontSize: 'var(--type-h2-desktop)' }}>LinkedIn dos Sonhos</h1>
        <p className="secondary" style={{ marginTop: 'var(--space-2)', maxWidth: '520px', marginInline: 'auto' }}>
          Este complemento inclui otimização estratégica de perfil para o mercado português, palavras-chave e rotina de networking.
        </p>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button
            onClick={() => {
              sessionStorage.setItem('keds_entitlements', JSON.stringify(['kit', 'linkedin']));
              setHasAccess(true);
            }}
            variant="primary"
          >
            Adicionar à minha conta (5,90 €)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <div style={{ display: 'inline-flex', padding: '4px 12px', backgroundColor: '#EDF3FF', color: 'var(--color-accent)', borderRadius: 'var(--radius-pill)', fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
          Complemento Especial Adquirido
        </div>
        <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-1)' }}>
          LinkedIn dos Sonhos
        </h1>
        <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
          Guia de posicionamento e visibilidade profissional para atrair oportunidades e contactar recrutadores em Portugal.
        </p>
      </div>

      {/* Secção 1: Título e Resumo */}
      <section
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-8) var(--space-6)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <h2 style={{ fontSize: 'var(--type-h3)' }}>1. O Título que os Recrutadores Pesquisam</h2>
        <p style={{ lineHeight: 1.6 }}>
          O título do teu perfil deve indicar a tua função principal e 2 ou 3 competências-chave, evitando termos vagos como “À procura de novos desafios” ou apenas o nome da tua empresa atual.
        </p>
        <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)', borderLeft: '3px solid var(--color-accent)' }}>
          <strong>Fórmula Recomendada:</strong> [Função Principal] | [Especialização ou Setor] | [Ferramenta ou Competência Relevante]
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Exemplo: <em>Técnico Administrativo | Gestão Documental & Faturação | Excel & Primavera</em>
          </p>
        </div>
      </section>

      {/* Secção 2: Secção Sobre com Voz Humana */}
      <section
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-8) var(--space-6)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <h2 style={{ fontSize: 'var(--type-h3)' }}>2. Estrutura da Secção “Sobre”</h2>
        <p style={{ lineHeight: 1.6 }}>
          Divide o teu resumo em 3 parágrafos curtos:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)' }}>
            <strong>Parágrafo 1 — Ponto de partida:</strong> Quem és e a tua área principal de atuação em Portugal.
          </div>
          <div style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)' }}>
            <strong>Parágrafo 2 — Contributo comprovado:</strong> 2 exemplos concretos de tarefas ou resultados que conseguiste desempenhar.
          </div>
          <div style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)' }}>
            <strong>Parágrafo 3 — Próximo passo e contacto:</strong> O que procuras e a forma de contacto direto por mensagem ou email.
          </div>
        </div>
      </section>

      {/* Secção 3: Rotina Semanal de Contactos */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-8) var(--space-6)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-3)' }}>
          3. Rotina Semanal em 15 Minutos
        </h2>
        <ul style={{ paddingLeft: 'var(--space-6)', lineHeight: 1.8, fontSize: 'var(--type-body)' }}>
          <li>Segunda-feira: Pesquisa 3 empresas de referência na tua área e segue a página institucional.</li>
          <li>Quarta-feira: Identifica 2 pessoas da equipa de recrutamento ou departamento e envia pedido com nota personalizada.</li>
          <li>Sexta-feira: Atualiza o teu gestor de candidaturas e responde a mensagens pendentes.</li>
        </ul>
      </section>
    </div>
  );
}
