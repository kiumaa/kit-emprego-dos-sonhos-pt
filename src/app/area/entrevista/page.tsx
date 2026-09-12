'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserCheck, Lock, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function InterviewBumpPage() {
  const [hasAccess, setHasAccess] = useState(true); // Default em demo

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('keds_entitlements');
      if (stored) {
        const list: string[] = JSON.parse(stored);
        setHasAccess(list.includes('entrevista'));
      }
    } catch {
      // Ignorar erro
    }
  }, []);

  const questions = [
    '1. Como apresentarias o teu percurso em 2 minutos?',
    '2. O que te interessou especificamente nesta função e empresa?',
    '3. Que experiência do teu percurso consideras mais relacionada com as responsabilidades?',
    '4. Dá um exemplo de uma situação em que tiveste de gerir prioridades concorrentes.',
    '5. Como lidaste com um pedido complexo de um cliente ou colega?',
    '6. Conta uma situação em que algo não correu como esperavas.',
    '7. O que aprendeste com um erro no teu trabalho?',
    '8. Como pedes ajuda quando te falta informação crítica?',
    '9. Que ferramentas utilizaste efetivamente no teu dia a dia?',
    '10. Como descreves a tua contribuição num projeto em equipa?',
    '11. Porque estás a considerar uma mudança de área ou de emprego?',
    '12. Que competência técnica ou interpessoal estás a desenvolver neste momento?',
    '13. Como te organizas para cumprir uma tarefa com prazo apertado?',
    '14. Que expectativas tens em relação à função e ao ambiente de trabalho?',
    '15. Que perguntas gostarias de fazer ao recrutador sobre a equipa?',
  ];

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
        <h1 style={{ fontSize: 'var(--type-h2-desktop)' }}>Entrevista dos Sonhos</h1>
        <p className="secondary" style={{ marginTop: 'var(--space-2)', maxWidth: '520px', marginInline: 'auto' }}>
          Este complemento prático inclui banco de 15 perguntas, estrutura STAR contextualizada e folhas de ensaio.
        </p>
        <div style={{ marginTop: 'var(--space-6)' }}>
          <Button
            onClick={() => {
              sessionStorage.setItem('keds_entitlements', JSON.stringify(['kit', 'entrevista']));
              setHasAccess(true);
            }}
            variant="primary"
          >
            Adicionar à minha conta (4,90 €)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <div style={{ display: 'inline-flex', padding: '4px 12px', backgroundColor: '#F3E5F5', color: '#6A1B9A', borderRadius: 'var(--radius-pill)', fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
          Complemento Especial Adquirido
        </div>
        <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-1)' }}>
          Entrevista dos Sonhos
        </h1>
        <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
          Preparação prática para apresentar o teu percurso com clareza, autenticidade e sem memorização mecânica.
        </p>
      </div>

      {/* Secção 1: Ficha da Oportunidade */}
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
        <h2 style={{ fontSize: 'var(--type-h3)' }}>1. Preparar a Ficha da Oportunidade</h2>
        <p style={{ lineHeight: 1.6 }}>
          Antes de qualquer entrevista, reúne informação confirmada sobre a função e a empresa. Escolhe 3 razões concretas para o teu interesse: em vez de dizer “gosto da vossa empresa”, relaciona as responsabilidades da função com exemplos reais do que já fizeste.
        </p>
        <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)', borderLeft: '3px solid var(--color-accent)' }}>
          <strong>Exercício Prático:</strong> Anota 3 responsabilidades descritas no anúncio e pensa num exemplo teu para cada uma. Se não tiveres experiência direta, identifica o que é transferível com honestidade.
        </div>
      </section>

      {/* Secção 2: Estrutura STAR Contextualizada */}
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
        <h2 style={{ fontSize: 'var(--type-h3)' }}>2. Contar Exemplos com Contexto (Estrutura STAR)</h2>
        <p style={{ lineHeight: 1.6 }}>
          Organiza as tuas respostas sobre projetos passados em 4 elementos:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
          {[
            { tag: 'S', name: 'Situação', desc: 'Contexto e desafio inicial' },
            { tag: 'T', name: 'Tarefa', desc: 'A tua responsabilidade exata' },
            { tag: 'A', name: 'Ação', desc: 'O que fizeste na prática' },
            { tag: 'R', name: 'Resultado', desc: 'Impacto ou o que aprendeste' },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)' }}>
              <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--color-accent)' }}>{item.tag}</span>
              <h4 style={{ fontSize: '15px', marginTop: '2px' }}>{item.name}</h4>
              <p className="secondary" style={{ fontSize: '13px', marginTop: '2px' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Secção 3: Banco de 15 Perguntas */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-8) var(--space-6)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-4)' }}>
          3. Banco de 15 Perguntas para Treino
        </h2>
        <p className="secondary" style={{ fontSize: 'var(--type-small)', marginBottom: 'var(--space-6)' }}>
          Não decores respostas. Escolhe 5 perguntas por dia e prepara pontos-chave em voz alta.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {questions.map((q, idx) => (
            <div
              key={idx}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-control)',
                fontSize: '15px',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            >
              {q}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
