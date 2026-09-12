'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import planoData from '@content/kit/plano-7-dias.json';

export default function Plan7DaysPage() {
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('keds_plan_days');
      if (stored) {
        setCompletedDays(JSON.parse(stored));
      }
    } catch {
      // Ignorar erro
    }
  }, []);

  const toggleDay = (dayNum: number) => {
    let updated: number[];
    if (completedDays.includes(dayNum)) {
      updated = completedDays.filter((d) => d !== dayNum);
    } else {
      updated = [...completedDays, dayNum];
    }
    setCompletedDays(updated);
    try {
      localStorage.setItem('keds_plan_days', JSON.stringify(updated));
    } catch {
      // Ignorar erro
    }
  };

  const days = planoData.days;
  const progressPercent = Math.round((completedDays.length / days.length) * 100);

  return (
    <div style={{ maxWidth: '800px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-accent)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase' }}>
          Rotina & Execução
        </span>
        <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-1)' }}>
          Plano de Ação para 7 Dias
        </h1>
        <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
          Um roteiro diário estruturado para avançares passo a passo na preparação das tuas candidaturas.
        </p>
      </div>

      {/* Barra de Progresso do Plano */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-6)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)' }}>
          <span>Progresso do Plano: {completedDays.length} de {days.length} dias concluídos</span>
          <span>{progressPercent}%</span>
        </div>
        <div style={{ height: '8px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-pill)', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: 'var(--color-accent)', transition: 'width 240ms ease' }} />
        </div>
      </div>

      {/* Lista dos 7 Dias */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {days.map((d: { day: number; title: string; task: string; lessonSlug?: string }) => {
          const isDone = completedDays.includes(d.day);
          return (
            <div
              key={d.day}
              onClick={() => toggleDay(d.day)}
              style={{
                backgroundColor: isDone ? '#EBF6EE' : 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-card)',
                padding: 'var(--space-6)',
                border: `1.5px solid ${isDone ? 'var(--color-success)' : 'var(--color-border)'}`,
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-4)',
                cursor: 'pointer',
                transition: 'all 160ms ease',
              }}
            >
              <div style={{ marginTop: '2px', color: isDone ? 'var(--color-success)' : 'var(--color-border)' }}>
                {isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'var(--weight-bold)', color: isDone ? 'var(--color-success)' : 'var(--color-accent)', textTransform: 'uppercase' }}>
                    Dia {d.day}
                  </span>
                  <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
                    {isDone ? 'Concluído' : 'Por concluir'}
                  </span>
                </div>

                <h3 style={{ fontSize: 'var(--type-body)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)', marginTop: '2px' }}>
                  {d.title}
                </h3>

                <p className="secondary" style={{ fontSize: 'var(--type-small)', lineHeight: 1.5, marginTop: 'var(--space-2)' }}>
                  {d.task}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
