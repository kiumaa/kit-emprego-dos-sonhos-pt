'use client';

import React from 'react';
import { ResourceTile } from '@/components/ui/resource-tile';
import { FileText, Download, AlertCircle, ExternalLink, Check } from 'lucide-react';
import pagesData from '@content/marketing/pages.json';

export default function CvTemplatesPage() {
  const memberData = pagesData.member;

  const handleDownload = (fileName: string) => {
    const a = document.createElement('a');
    a.href = `/downloads/${fileName}`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ maxWidth: '900px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-accent)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase' }}>
          Recursos de Candidatura
        </span>
        <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-1)' }}>
          {memberData.templatesTitle}
        </h1>
        <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
          {memberData.templatesHelp}
        </p>
      </div>

      {/* Notice box: No online editor */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-3)',
          padding: 'var(--space-4) var(--space-5)',
          backgroundColor: 'var(--color-accent-soft)',
          borderRadius: 'var(--radius-control)',
          border: '1px solid var(--color-accent)',
        }}
      >
        <AlertCircle size={20} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <div style={{ fontSize: 'var(--type-small)', color: 'var(--color-text)', lineHeight: 1.5 }}>
          <strong>Edição 100% Externa:</strong> Para tua total flexibilidade e privacidade, estes ficheiros não são editados num formulário online da plataforma. Podes abri-los, personalizá-los e guardá-los no Microsoft Word, LibreOffice Writer, Pages ou Google Docs sem restrições.
        </div>
      </div>

      {/* Modelos Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        <ResourceTile
          title="Modelo CV Essencial (DOCX)"
          description="Layout linear e sóbrio com excelente legibilidade. Ideal para percursos profissionais com continuidade na mesma área."
          format="DOCX"
          version="2.0"
          onDownload={() => handleDownload('cv-essencial-modelo.docx')}
        />

        <ResourceTile
          title="Modelo CV Moderno (DOCX)"
          description="Estrutura contemporânea com destaque equilibrado para competências, ferramentas e projetos recentes."
          format="DOCX"
          version="2.0"
          onDownload={() => handleDownload('cv-moderno-modelo.docx')}
        />

        <ResourceTile
          title="Exemplo Fictício Essencial (DOCX)"
          description="Exemplo completo preenchido (Inês Exemplo) em Word para te inspirares na redação e estrutura."
          format="DOCX"
          version="2.0"
          onDownload={() => handleDownload('cv-essencial-exemplo-ficticio.docx')}
        />

        <ResourceTile
          title="Exemplo Fictício Moderno (DOCX)"
          description="Exemplo moderno preenchido com tarefas concretas e competências para adaptação externa."
          format="DOCX"
          version="2.0"
          onDownload={() => handleDownload('cv-moderno-exemplo-ficticio.docx')}
        />

        <ResourceTile
          title="Referência Visual Essencial (PDF)"
          description="Ficheiro PDF de alta resolução com regras de formatação A4 e dicas de paginação."
          format="PDF"
          version="2.0"
          onDownload={() => handleDownload('cv-essencial-referencia.pdf')}
        />

        <ResourceTile
          title="Referência Visual Moderno (PDF)"
          description="Guia visual A4 do modelo Moderno com orientações de fotografia e secções."
          format="PDF"
          version="2.0"
          onDownload={() => handleDownload('cv-moderno-referencia.pdf')}
        />
      </div>

      {/* Guia de Edição Externa Passo-a-Passo */}
      <section
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-8) var(--space-6)',
          border: '1px solid var(--color-border)',
        }}
      >
        <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-4)' }}>
          Como adaptar o teu modelo em 3 passos:
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {[
            {
              step: '1. Descarrega o ficheiro',
              text: 'Guarda o ficheiro DOCX na tua pasta de trabalho local. Faz uma cópia de segurança antes de começar a escrever.',
            },
            {
              step: '2. Abre no teu processador de texto habitual',
              text: 'Usa o Microsoft Word, Google Docs ou LibreOffice. As fontes e margens já estão configuradas com as proporções recomendadas.',
            },
            {
              step: '3. Exporta para PDF antes de enviar',
              text: 'Quando terminares a personalização para uma oportunidade específica, grava sempre uma versão em PDF para garantir que o recrutador vê o documento com a mesma formatação.',
            },
          ].map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-on-accent)',
                  fontSize: '12px',
                  fontWeight: 'var(--weight-bold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                {idx + 1}
              </div>
              <div>
                <strong style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>{item.step}</strong>
                <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: '2px' }}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
