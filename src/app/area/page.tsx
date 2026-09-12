'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ResourceTile } from '@/components/ui/resource-tile';
import { BookOpen, Briefcase, Download, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import licoesData from '../../../content/kit/licoes.json';

export default function MemberDashboardPage() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const totalLessons = licoesData.lessons.length;

  useEffect(() => {
    try {
      const stored = localStorage.getItem('keds_completed_lessons');
      if (stored) {
        setCompletedLessons(JSON.parse(stored));
      }
    } catch {
      // Ignorar erro
    }
  }, []);

  const nextLesson = licoesData.lessons.find((l) => !completedLessons.includes(l.slug)) || licoesData.lessons[0];
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', maxWidth: '1000px', marginInline: 'auto' }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-accent)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase' }}>
          Painel do Comprador
        </span>
        <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-1)' }}>
          O teu próximo passo começa aqui.
        </h1>
        <p className="secondary" style={{ marginTop: 'var(--space-2)' }}>
          Acompanha o teu progresso, descarrega os modelos de currículo e organiza as tuas candidaturas.
        </p>
      </div>

      {/* Hero Action Card: Continuar o meu plano */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-8) var(--space-6)',
          border: '2px solid var(--color-accent-soft)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-accent)' }}>
            Próxima Ação Recomendada
          </span>
          <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
            {completedLessons.length} de {totalLessons} lições concluídas ({progressPercent}%)
          </span>
        </div>

        <div>
          <h2 style={{ fontSize: 'var(--type-h2-mobile)' }}>
            Lição: {nextLesson.title}
          </h2>
          <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
            Lição prática focada em técnicas comprovadas para o mercado de trabalho português.
          </p>
        </div>

        <div style={{ marginTop: 'var(--space-2)' }}>
          <a
            href={`/area/licoes/${nextLesson.slug}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              height: '48px',
              padding: '0 var(--space-6)',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-on-accent)',
              borderRadius: 'var(--radius-control)',
              fontWeight: 'var(--weight-semibold)',
              textDecoration: 'none',
            }}
          >
            <span>Continuar o meu plano</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h3 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-4)' }}>
          Acessos Rápidos aos Recursos
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {/* Card Modelos DOCX */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-card)',
              padding: 'var(--space-6)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <Download size={28} color="var(--color-accent)" style={{ marginBottom: 'var(--space-2)' }} />
              <h4 style={{ fontSize: 'var(--type-body)', fontWeight: 'var(--weight-semibold)' }}>
                Modelos de CV Estáticos
              </h4>
              <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: '4px' }}>
                Descarrega os modelos Essencial e Moderno em formato Word/DOCX para editar externamente.
              </p>
            </div>
            <a
              href="/area/modelos-cv"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--type-small)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-accent)',
                textDecoration: 'none',
              }}
            >
              <span>Ver e descarregar modelos</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Card Gestor de Candidaturas */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-card)',
              padding: 'var(--space-6)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <Briefcase size={28} color="var(--color-accent)" style={{ marginBottom: 'var(--space-2)' }} />
              <h4 style={{ fontSize: 'var(--type-body)', fontWeight: 'var(--weight-semibold)' }}>
                Gestor de Candidaturas
              </h4>
              <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: '4px' }}>
                Regista empresas, funções, prazos e próximos passos para nunca perderes o fio à meada.
              </p>
            </div>
            <a
              href="/area/candidaturas"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--type-small)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-accent)',
                textDecoration: 'none',
              }}
            >
              <span>Abrir gestor de candidaturas</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Card Mensagens & Cartas */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-card)',
              padding: 'var(--space-6)',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
            }}
          >
            <div>
              <BookOpen size={28} color="var(--color-accent)" style={{ marginBottom: 'var(--space-2)' }} />
              <h4 style={{ fontSize: 'var(--type-body)', fontWeight: 'var(--weight-semibold)' }}>
                Cartas & Mensagens
              </h4>
              <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: '4px' }}>
                Estruturas prontas a personalizar para contacto com recrutadores e submissão por email.
              </p>
            </div>
            <a
              href="/area/mensagens"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--type-small)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-accent)',
                textDecoration: 'none',
              }}
            >
              <span>Explorar mensagens copiáveis</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
