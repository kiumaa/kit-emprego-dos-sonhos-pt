'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TextField, TextArea } from '@/components/ui/text-field';
import { ApplicationRecord } from '@contracts/domain';
import { exportApplicationsToCsv } from '@/lib/tracker/csv-export';
import { Briefcase, Plus, Download, Archive, Edit3, CheckCircle2, ExternalLink, Trash2 } from 'lucide-react';
import pagesData from '@content/marketing/pages.json';

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [url, setUrl] = useState('');
  const [state, setState] = useState<ApplicationRecord['state']>('preparing');
  const [sentDate, setSentDate] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [nextActionDate, setNextActionDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('keds_applications');
      if (stored) {
        setApplications(JSON.parse(stored));
      } else {
        // Exemplo inicial de demonstração
        const sample: ApplicationRecord[] = [
          {
            id: 'app-sample-1',
            userId: 'user-demo',
            company: 'Exemplo Lda',
            role: 'Assistente Administrativo',
            url: 'https://exemplo.pt/vaga/1',
            state: 'sent',
            sentDate: new Date().toISOString().split('T')[0],
            nextAction: 'Confirmar receção por email',
            nextActionDate: '',
            notes: 'Enviado com o modelo Essencial.',
          },
        ];
        setApplications(sample);
      }
    } catch {
      // Ignorar erro
    }
  }, []);

  const saveToStorage = (list: ApplicationRecord[]) => {
    setApplications(list);
    try {
      localStorage.setItem('keds_applications', JSON.stringify(list));
    } catch {
      // Ignorar erro
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    if (editingId) {
      const updated = applications.map((a) =>
        a.id === editingId
          ? {
              ...a,
              company: company.trim(),
              role: role.trim(),
              url: url.trim() || null,
              state,
              sentDate: sentDate || null,
              nextAction: nextAction.trim() || 'Acompanhar oportunidade',
              nextActionDate: nextActionDate || null,
              notes: notes.trim(),
            }
          : a
      );
      saveToStorage(updated);
      setEditingId(null);
    } else {
      const newApp: ApplicationRecord = {
        id: `app-${Date.now()}`,
        userId: 'user-current',
        company: company.trim(),
        role: role.trim(),
        url: url.trim() || null,
        state,
        sentDate: sentDate || null,
        nextAction: nextAction.trim() || 'Definir próximo passo',
        nextActionDate: nextActionDate || null,
        notes: notes.trim(),
      };
      saveToStorage([newApp, ...applications]);
    }

    // Reset form
    setCompany('');
    setRole('');
    setUrl('');
    setState('preparing');
    setSentDate('');
    setNextAction('');
    setNextActionDate('');
    setNotes('');
    setIsAdding(false);
  };

  const handleEdit = (app: ApplicationRecord) => {
    setEditingId(app.id);
    setCompany(app.company);
    setRole(app.role);
    setUrl(app.url || '');
    setState(app.state);
    setSentDate(app.sentDate || '');
    setNextAction(app.nextAction);
    setNextActionDate(app.nextActionDate || '');
    setNotes(app.notes);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tens a certeza que pretendes remover esta oportunidade?')) {
      const filtered = applications.filter((a) => a.id !== id);
      saveToStorage(filtered);
    }
  };

  const handleExportCsv = () => {
    const csvContent = exportApplicationsToCsv(applications);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `candidaturas-keds-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  const stateLabels: Record<ApplicationRecord['state'], { label: string; color: string; bg: string }> = {
    preparing: { label: 'A preparar', color: '#805B00', bg: '#FFF8E6' },
    sent: { label: 'Enviada', color: '#0057D9', bg: '#EDF3FF' },
    interview: { label: 'Entrevista', color: '#6A1B9A', bg: '#F3E5F5' },
    offer: { label: 'Proposta', color: '#216E45', bg: '#EBF6EE' },
    closed: { label: 'Concluída', color: '#51515A', bg: '#F5F5F7' },
  };

  return (
    <div style={{ maxWidth: '1000px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-accent)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase' }}>
            Acompanhamento Pessoal
          </span>
          <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-1)' }}>
            Gestor de Candidaturas
          </h1>
          <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
            Regista as oportunidades a que te candidatas, mantém as datas em dia e exporta em CSV seguro.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {applications.length > 0 && (
            <Button onClick={handleExportCsv} variant="secondary">
              <Download size={16} />
              <span>Exportar CSV</span>
            </Button>
          )}

          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} variant="primary">
              <Plus size={16} />
              <span>{pagesData.member.trackerAdd}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Formulário de Adicionar / Editar */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          style={{
            backgroundColor: 'var(--color-surface-raised)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--space-6)',
            border: '2px solid var(--color-accent-soft)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 'var(--type-h3)' }}>
              {editingId ? 'Editar Oportunidade' : 'Nova Candidatura'}
            </h3>
            <button
              type="button"
              onClick={() => { setIsAdding(false); setEditingId(null); }}
              style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            <TextField
              label="Nome da Empresa"
              placeholder="Ex.: Farfetch, Worten, Hospital da Luz..."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <TextField
              label="Função ou Título da Vaga"
              placeholder="Ex.: Assistente de Atendimento, Gestor..."
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
            <TextField
              label="Ligação para a Vaga (opcional)"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />

            <div>
              <label style={{ fontSize: 'var(--type-label)', fontWeight: 'var(--weight-semibold)', display: 'block', marginBottom: '4px' }}>
                Estado Atual
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value as ApplicationRecord['state'])}
                style={{
                  width: '100%',
                  height: 'var(--layout-control-height)',
                  padding: '0 var(--space-4)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-control)',
                  fontSize: 'var(--type-body)',
                }}
              >
                <option value="preparing">A preparar</option>
                <option value="sent">Enviada</option>
                <option value="interview">Entrevista</option>
                <option value="offer">Proposta</option>
                <option value="closed">Concluída</option>
              </select>
            </div>

            <TextField
              type="date"
              label="Data de Envio (opcional)"
              value={sentDate}
              onChange={(e) => setSentDate(e.target.value)}
            />

            <TextField
              label="Próximo Passo / Ação"
              placeholder="Ex.: Enviar email de seguimento, preparar caso..."
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              required
            />
          </div>

          <TextArea
            label="Notas e Observações"
            placeholder="Ex.: Contacto de referência, perguntas que fizeram, versão de CV utilizada..."
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
            <Button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} variant="ghost">
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Guardar Alterações' : 'Adicionar Oportunidade'}
            </Button>
          </div>
        </form>
      )}

      {/* Lista de Candidaturas */}
      {applications.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--space-12) var(--space-6)',
            textAlign: 'center',
            border: '1px solid var(--color-border)',
          }}
        >
          <Briefcase size={48} color="var(--color-text-secondary)" style={{ margin: '0 auto var(--space-3) auto' }} />
          <h3 style={{ fontSize: 'var(--type-h3)' }}>Sem candidaturas registadas</h3>
          <p className="secondary" style={{ marginTop: 'var(--space-2)', maxWidth: '480px', marginInline: 'auto' }}>
            {pagesData.member.trackerEmpty}
          </p>
          <Button onClick={() => setIsAdding(true)} variant="primary" style={{ marginTop: 'var(--space-6)' }}>
            <Plus size={16} />
            <span>Adicionar a primeira candidatura</span>
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {applications.map((app) => {
            const badge = stateLabels[app.state] || stateLabels.preparing;
            return (
              <div
                key={app.id}
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderRadius: 'var(--radius-card)',
                  padding: 'var(--space-6)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)' }}>
                        {app.company}
                      </h3>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 'var(--weight-bold)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {app.role} {app.sentDate && `· Enviada em ${app.sentDate}`}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {app.url && (
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '6px',
                          color: 'var(--color-accent)',
                        }}
                        aria-label="Ver anúncio da vaga"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEdit(app)}
                      style={{ background: 'none', border: 'none', padding: '6px', color: 'var(--color-text)', cursor: 'pointer' }}
                      aria-label="Editar registo"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(app.id)}
                      style={{ background: 'none', border: 'none', padding: '6px', color: 'var(--color-danger)', cursor: 'pointer' }}
                      aria-label="Eliminar registo"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-control)',
                    padding: 'var(--space-3) var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 'var(--type-small)',
                  }}
                >
                  <span><strong>Próximo passo:</strong> {app.nextAction}</span>
                  {app.nextActionDate && <span>Data limite: {app.nextActionDate}</span>}
                </div>

                {app.notes && (
                  <p style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)' }}>
                    <strong>Notas:</strong> {app.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
