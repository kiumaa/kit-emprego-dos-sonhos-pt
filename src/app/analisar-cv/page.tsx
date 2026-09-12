'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { TextField, TextArea } from '@/components/ui/text-field';
import { UploadCloud, FileText, Lock, ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react';
import pagesData from '../../../content/marketing/pages.json';

export default function AnalyzeCvPage() {
  const router = useRouter();
  const analyzerData = pagesData.analyzer;
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [cvText, setCvText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      // Validar tamanho (máximo 5 MiB = 5 * 1024 * 1024 bytes)
      if (selected.size > 5 * 1024 * 1024) {
        setError('O ficheiro excede o limite de 5 MiB. Por favor reduz o tamanho ou cola o texto.');
        return;
      }
      // Validar extensão
      const name = selected.name.toLowerCase();
      if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.txt')) {
        setError('Por favor envia um ficheiro em formato PDF, DOCX ou TXT.');
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'upload' && !file) {
      setError('Por favor seleciona um ficheiro de CV ou muda para a aba de colar texto.');
      return;
    }

    if (activeTab === 'paste' && cvText.trim().length < 50) {
      setError('Por favor introduz o texto do teu CV (mínimo de 50 caracteres).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Criação de sessão de diagnóstico
      const analysisId = `cv-${Date.now().toString(36)}`;
      sessionStorage.setItem(
        `keds_analysis_${analysisId}`,
        JSON.stringify({
          source: 'cv',
          targetRole: targetRole.trim() || undefined,
          jobDescription: jobDescription.trim() || undefined,
          submittedAt: new Date().toISOString(),
        })
      );

      // Redirecionamento para a rota de processamento
      router.push(`/diagnostico/em-processamento?id=${analysisId}`);
    } catch {
      setIsSubmitting(false);
      setError('Ocorreu um erro ao submeter o pedido de análise.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <Header />

      <main style={{ flex: 1, padding: 'var(--space-12) var(--layout-mobile-gutter)' }}>
        <div className="container-form">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <span
              style={{
                fontSize: 'var(--type-small)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Diagnóstico de Conteúdo Gratuito
            </span>
            <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-2)' }}>
              {analyzerData.title}
            </h1>
            <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
              {analyzerData.description}
            </p>
          </div>

          {/* Tab Selector */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--color-surface)',
              padding: '4px',
              borderRadius: 'var(--radius-control)',
              marginBottom: 'var(--space-6)',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              type="button"
              onClick={() => { setActiveTab('upload'); setError(null); }}
              style={{
                flex: 1,
                height: '40px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'upload' ? 'var(--color-surface-raised)' : 'transparent',
                color: 'var(--color-text)',
                fontWeight: activeTab === 'upload' ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                boxShadow: activeTab === 'upload' ? 'var(--shadow-card)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <UploadCloud size={18} aria-hidden="true" />
              <span>{analyzerData.uploadTab}</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('paste'); setError(null); }}
              style={{
                flex: 1,
                height: '40px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTab === 'paste' ? 'var(--color-surface-raised)' : 'transparent',
                color: 'var(--color-text)',
                fontWeight: activeTab === 'paste' ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                boxShadow: activeTab === 'paste' ? 'var(--shadow-card)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <FileText size={18} aria-hidden="true" />
              <span>{analyzerData.pasteTab}</span>
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              padding: 'var(--space-8) var(--space-6)',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-6)',
            }}
          >
            {activeTab === 'upload' ? (
              <div>
                <label
                  htmlFor="cv-file-input"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--space-8) var(--space-4)',
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-control)',
                    backgroundColor: 'var(--color-surface)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'border-color 160ms ease',
                  }}
                >
                  <UploadCloud size={36} color="var(--color-accent)" style={{ marginBottom: 'var(--space-2)' }} aria-hidden="true" />
                  <span style={{ fontSize: 'var(--type-body)', fontWeight: 'var(--weight-semibold)', color: 'var(--color-text)' }}>
                    {file ? file.name : 'Clica para escolher o ficheiro do teu CV'}
                  </span>
                  <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    PDF ou DOCX (até 5 MiB)
                  </span>
                  <input
                    id="cv-file-input"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
                {file && (
                  <div style={{ marginTop: 'var(--space-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--type-small)' }}>
                    <span>Ficheiro selecionado: {file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <TextArea
                label="Texto do teu CV"
                description="Cola o conteúdo do teu currículo para revisão."
                placeholder="Exemplo: Experiência profissional, formação, projetos..."
                rows={8}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                maxLength={24000}
                required
              />
            )}

            {/* Context Fields (Optional) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-surface)' }}>
              <TextField
                label="Cargo ou área pretendida (opcional)"
                description="Ajuda a contextualizar se os teus exemplos estão alinhados com o teu objetivo."
                placeholder="Ex.: Técnico Administrativo, Desenvolvedor Web..."
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />

              <TextArea
                label="Descrição ou requisitos da vaga (opcional)"
                description="Se tiveres uma vaga concreta de referência, podemos verificar os pontos de contacto."
                placeholder="Cola aqui os requisitos principais da oferta a que queres concorrer..."
                rows={3}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={5000}
              />
            </div>

            {error && (
              <div
                role="alert"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: '#FDECEB',
                  borderRadius: 'var(--radius-control)',
                  color: 'var(--color-danger)',
                  fontSize: 'var(--type-small)',
                  fontWeight: 'var(--weight-medium)',
                }}
              >
                {error}
              </div>
            )}

            {/* Privacy Warning */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-control)',
                fontSize: 'var(--type-small)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <Lock size={18} style={{ flexShrink: 0, marginTop: '2px' }} color="var(--color-accent)" aria-hidden="true" />
              <span>{analyzerData.privacyHint}</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              style={{ width: '100%', height: '50px', fontSize: '18px' }}
            >
              <span>{analyzerData.submit}</span>
              <ArrowRight size={20} aria-hidden="true" />
            </Button>
          </form>

          {/* Alternative: Quiz */}
          <div
            style={{
              marginTop: 'var(--space-8)',
              padding: 'var(--space-4)',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-control)',
              textAlign: 'center',
            }}
          >
            <p className="secondary" style={{ fontSize: 'var(--type-small)' }}>
              Não tens um CV preparado ou estás a começar do zero?
            </p>
            <a
              href="/quiz"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginTop: 'var(--space-2)',
                fontSize: 'var(--type-small)',
                fontWeight: 'var(--weight-semibold)',
                color: 'var(--color-accent)',
                textDecoration: 'none',
              }}
            >
              <HelpCircle size={16} aria-hidden="true" />
              <span>Fazer o quiz de diagnóstico sem enviar documento</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
