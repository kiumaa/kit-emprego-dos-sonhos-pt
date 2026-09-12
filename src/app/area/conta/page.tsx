'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import { User, Shield, Download, Trash2, CheckCircle2, Lock } from 'lucide-react';

export default function AccountSettingsPage() {
  const [email, setEmail] = useState('cliente-demo@exemplo.pt');
  const [entitlements, setEntitlements] = useState<string[]>(['kit']);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedEmail = sessionStorage.getItem('keds_user_email');
      if (storedEmail) setEmail(storedEmail);

      const storedEnt = sessionStorage.getItem('keds_entitlements');
      if (storedEnt) setEntitlements(JSON.parse(storedEnt));
    } catch {
      // Ignorar erro
    }
  }, []);

  const handleExportData = () => {
    const data = {
      account: { email, exportDate: new Date().toISOString() },
      entitlements,
      applications: JSON.parse(localStorage.getItem('keds_applications') || '[]'),
      completedLessons: JSON.parse(localStorage.getItem('keds_completed_lessons') || '[]'),
      completedPlanDays: JSON.parse(localStorage.getItem('keds_plan_days') || '[]'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dados-pessoais-keds-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedback('Ficheiro com os teus dados descarregado com sucesso.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleDeleteData = () => {
    if (confirm('Tens a certeza que pretendes apagar todos os teus dados locais (candidaturas registadas e progresso)?')) {
      localStorage.removeItem('keds_applications');
      localStorage.removeItem('keds_completed_lessons');
      localStorage.removeItem('keds_plan_days');
      setFeedback('Todos os dados pessoais locais foram eliminados.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div style={{ maxWidth: '800px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-accent)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase' }}>
          Configurações
        </span>
        <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-1)' }}>
          Conta & Gestão de Dados
        </h1>
        <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
          Gere os teus acessos ativos, preferências de privacidade e exerce os teus direitos de titular de dados.
        </p>
      </div>

      {feedback && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: '#EBF6EE',
            borderRadius: 'var(--radius-control)',
            color: 'var(--color-success)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: 'var(--type-small)',
            fontWeight: 'var(--weight-medium)',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{feedback}</span>
        </div>
      )}

      {/* Cartão de Acessos Ativos */}
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
        <h2 style={{ fontSize: 'var(--type-h3)' }}>Acessos & Produtos Ativos</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)' }}>
            <div>
              <strong>Kit Emprego dos Sonhos — Portugal</strong>
              <p className="secondary" style={{ fontSize: '13px', marginTop: '2px' }}>Acesso ativo à área do membro (12 meses)</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-success)', backgroundColor: '#EBF6EE', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
              ATIVO
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)' }}>
            <div>
              <strong>Entrevista dos Sonhos</strong>
              <p className="secondary" style={{ fontSize: '13px', marginTop: '2px' }}>Guia de preparação e banco de perguntas</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: entitlements.includes('entrevista') ? 'var(--color-success)' : 'var(--color-text-secondary)', backgroundColor: entitlements.includes('entrevista') ? '#EBF6EE' : 'var(--color-surface-raised)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
              {entitlements.includes('entrevista') ? 'ATIVO' : 'OPCIONAL'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)' }}>
            <div>
              <strong>LinkedIn dos Sonhos</strong>
              <p className="secondary" style={{ fontSize: '13px', marginTop: '2px' }}>Otimização estratégica de perfil</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: entitlements.includes('linkedin') ? 'var(--color-success)' : 'var(--color-text-secondary)', backgroundColor: entitlements.includes('linkedin') ? '#EBF6EE' : 'var(--color-surface-raised)', padding: '2px 8px', borderRadius: 'var(--radius-pill)' }}>
              {entitlements.includes('linkedin') ? 'ATIVO' : 'OPCIONAL'}
            </span>
          </div>
        </div>
      </section>

      {/* Cartão de Privacidade e RGPD */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-8) var(--space-6)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <h2 style={{ fontSize: 'var(--type-h3)' }}>Direitos de Titular de Dados (RGPD)</h2>
        <p className="secondary" style={{ fontSize: 'var(--type-small)', lineHeight: 1.5 }}>
          Em cumprimento do RGPD, podes descarregar uma cópia integral de todos os registos de candidaturas e progresso guardados nesta conta, ou eliminá-los permanentemente.
        </p>

        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
          <Button onClick={handleExportData} variant="secondary">
            <Download size={16} />
            <span>Descarregar todos os meus dados (JSON)</span>
          </Button>

          <Button onClick={handleDeleteData} variant="destructive">
            <Trash2 size={16} />
            <span>Eliminar registos locais</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
