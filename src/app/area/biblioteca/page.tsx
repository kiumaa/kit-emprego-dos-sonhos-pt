'use client';

import React, { useState } from 'react';
import { ResourceTile } from '@/components/ui/resource-tile';
import { TextField } from '@/components/ui/text-field';
import { Search, FolderOpen, Filter } from 'lucide-react';
import resourcesData from '@content/resources.json';

interface CatalogItem {
  id: string;
  title: string;
  entitlement: 'kit' | 'entrevista' | 'linkedin';
  formats: string[];
  source: string;
  status: string;
  description?: string;
  downloadFile?: string;
  format?: 'DOCX' | 'PDF' | 'CSV' | 'WEB';
}

const RESOURCE_METADATA: Record<string, { description: string; downloadFile: string; format: 'DOCX' | 'PDF' | 'CSV' | 'WEB'; type: string }> = {
  'guia': {
    description: 'Guia editorial com as 10 lições estratégicas para o mercado de trabalho português.',
    downloadFile: 'guia-keds-portugal.pdf',
    format: 'PDF',
    type: 'lesson',
  },
  'cv-essencial': {
    description: 'Modelo sóbrio em 1 coluna para Word/Docs com foco em legibilidade e cronologia.',
    downloadFile: 'cv-essencial-modelo.docx',
    format: 'DOCX',
    type: 'template',
  },
  'cv-moderno': {
    description: 'Estrutura contemporânea com espaço para competências, ferramentas e foto opcional.',
    downloadFile: 'cv-moderno-modelo.docx',
    format: 'DOCX',
    type: 'template',
  },
  'cartas': {
    description: 'Pack com 3 estruturas de carta de apresentação adaptadas para o mercado nacional.',
    downloadFile: 'cartas-de-apresentacao-keds.docx',
    format: 'DOCX',
    type: 'message',
  },
  'mensagens': {
    description: '10 mensagens prontas para abordagem no LinkedIn, envio de CV e acompanhamento.',
    downloadFile: 'mensagens-de-candidatura-keds.pdf',
    format: 'PDF',
    type: 'message',
  },
  'checklists': {
    description: 'Listas de verificação rápida antes de submeter CV ou avançar para entrevista.',
    downloadFile: 'checklists-preparacao-keds.pdf',
    format: 'PDF',
    type: 'checklist',
  },
  'prompts': {
    description: '25 instruções éticas para copiloto de IA sem inventar experiência profissional.',
    downloadFile: '25-prompts-ia-keds.pdf',
    format: 'PDF',
    type: 'prompt',
  },
  'plano': {
    description: 'Roteiro estruturado de 7 dias com tarefas práticas diárias de 45 a 60 minutos.',
    downloadFile: 'plano-7-dias-keds.pdf',
    format: 'PDF',
    type: 'checklist',
  },
  'tracker': {
    description: 'Ficheiro CSV estruturado para organização local segura de candidaturas.',
    downloadFile: 'organizador-vazio.csv',
    format: 'CSV',
    type: 'template',
  },
  'entrevista-guia': {
    description: 'Workbook completo de preparação STAR e resposta a 15 perguntas difíceis.',
    downloadFile: 'entrevista-dos-sonhos-guia-workbook.pdf',
    format: 'PDF',
    type: 'bump',
  },
  'linkedin-guia': {
    description: 'Manual de otimização de perfil, título magnético e rotina semanal de contactos.',
    downloadFile: 'linkedin-dos-sonhos-guia-workbook.pdf',
    format: 'PDF',
    type: 'bump',
  },
};

export default function LibraryPage() {
  const [filter, setFilter] = useState<'all' | 'template' | 'lesson' | 'message' | 'checklist' | 'prompt'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const rawResources = resourcesData.resources as CatalogItem[];

  const enrichedResources = rawResources.map((item) => {
    const meta = RESOURCE_METADATA[item.id] || {
      description: 'Recurso prático de apoio à candidatura.',
      downloadFile: `${item.id}.pdf`,
      format: 'PDF' as const,
      type: 'template',
    };
    return {
      ...item,
      description: meta.description,
      downloadFile: meta.downloadFile,
      format: meta.format,
      type: meta.type,
    };
  });

  const filtered = enrichedResources.filter((item) => {
    const matchesFilter = filter === 'all' || item.type === filter;
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const triggerDownload = (fileName: string) => {
    const a = document.createElement('a');
    a.href = `/downloads/${fileName}`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ maxWidth: '1000px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-accent)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase' }}>
          Área do Membro
        </span>
        <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-1)' }}>
          Biblioteca Completa de Recursos
        </h1>
        <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
          Explora todos os modelos, guias, instruções de IA e mensagens incluídos no teu acesso.
        </p>
      </div>

      {/* Search and Filters */}
      <div
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-6)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        <TextField
          label="Pesquisar recurso por palavra-chave"
          placeholder="Ex.: carta, checklist, prompt, entrevista..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'Todos os Recursos' },
            { id: 'template', label: 'Modelos & CSV' },
            { id: 'lesson', label: 'Guia & Lições' },
            { id: 'message', label: 'Mensagens & Cartas' },
            { id: 'checklist', label: 'Checklists & Plano' },
            { id: 'prompt', label: 'Prompts IA' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id as typeof filter)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--color-border)',
                backgroundColor: filter === cat.id ? 'var(--color-accent)' : 'var(--color-surface)',
                color: filter === cat.id ? 'var(--color-on-accent)' : 'var(--color-text)',
                fontSize: 'var(--type-small)',
                fontWeight: filter === cat.id ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                cursor: 'pointer',
                transition: 'background-color 160ms ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {filtered.map((item) => (
          <ResourceTile
            key={item.id}
            title={item.title}
            description={item.description}
            format={item.format}
            version="2.0"
            onDownload={() => triggerDownload(item.downloadFile)}
          />
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              padding: 'var(--space-12) 0',
              textAlign: 'center',
            }}
          >
            <FolderOpen size={48} color="var(--color-text-secondary)" style={{ margin: '0 auto var(--space-3) auto' }} />
            <p className="secondary" style={{ fontSize: 'var(--type-body)' }}>
              Nenhum recurso encontrado para os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
