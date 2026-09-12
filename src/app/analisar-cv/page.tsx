'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { TextField, TextArea } from '@/components/ui/text-field';
import { UploadCloud, FileText, Lock, ArrowRight, HelpCircle, AlertCircle } from 'lucide-react';
import pagesData from '../../../content/marketing/pages.json';

export default function AnalyzeCvPage() {
  const router = useRouter();
  const analyzerData = pagesData.analyzer;
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [cvText, setCvText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<{ message: string; offerQuiz?: boolean; allowPaste?: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 5 * 1024 * 1024) {
        setError({
          message: 'O ficheiro excede o limite de 5 MiB. Por favor reduz o ficheiro ou cola o texto.',
          allowPaste: true,
        });
        return;
      }
      const name = selected.name.toLowerCase();
      if (!name.endsWith('.pdf') && !name.endsWith('.docx') && !name.endsWith('.txt')) {
        setError({
          message: 'Por favor envia um ficheiro em formato PDF, DOCX ou TXT.',
          allowPaste: true,
        });
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'upload' && !file) {
      setError({
        message: 'Por favor seleciona um ficheiro de CV ou muda para a aba de colar texto.',
        allowPaste: true,
      });
      return;
    }

    if (activeTab === 'paste' && cvText.trim().length < 40) {
      setError({
        message: 'Por favor introduz o texto do teu CV (mínimo de 40 caracteres).',
        offerQuiz: true,
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('A enviar o documento para validação e leitura segura...');

    try {
      const formData = new FormData();
      if (activeTab === 'upload' && file) {
        formData.append('file', file);
      } else {
        formData.append('text', cvText.trim());
      }

      if (targetRole.trim()) {
        formData.append('targetRole', targetRole.trim());
      }
      if (jobDescription.trim()) {
        formData.append('jobDescription', jobDescription.trim());
      }

      const response = await fetch('/api/diagnostics/cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setIsSubmitting(false);
        setStatusMessage(null);
        setError({
          message: data.message || 'Ocorreu um erro ao processar o currículo.',
          offerQuiz: data.offerQuiz ?? true,
          allowPaste: data.allowPaste ?? true,
        });
        return;
      }

      // Sucesso: guardar derivação mínima em sessionStorage da sessão atual
      sessionStorage.setItem(`keds_result_${data.id}`, JSON.stringify(data));

      // Navegação direta sem temporizadores fictícios
      router.push(`/resultado/${data.id}`);
    } catch {
      setIsSubmitting(false);
      setStatusMessage(null);
      setError({
        message: 'Não foi possível ligar ao servidor de análise. Verifica a tua ligação ou faz o Quiz gratuito.',
        offerQuiz: true,
      });
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
              Diagnóstico Gratuito de Candidatura
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
                    PDF ou DOCX (até 5 MiB com texto selecionável)
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
                description="Cola o conteúdo textual do teu currículo para revisão."
                placeholder="Exemplo: Experiência profissional, formação, projetos..."
                rows={8}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                maxLength={30000}
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
                  padding: 'var(--space-4)',
                  backgroundColor: '#FDECEB',
                  borderRadius: 'var(--radius-control)',
                  border: '1px solid rgba(180, 35, 24, 0.2)',
                  color: 'var(--color-danger)',
                  fontSize: 'var(--type-small)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                  <span style={{ fontWeight: 'var(--weight-medium)' }}>{error.message}</span>
                </div>

                {error.offerQuiz && (
                  <div style={{ paddingTop: 'var(--space-2)', borderTop: '1px solid rgba(180, 35, 24, 0.15)' }}>
                    <a
                      href="/quiz"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        color: 'var(--color-accent)',
                        fontWeight: 'var(--weight-semibold)',
                        textDecoration: 'none',
                        fontSize: 'var(--type-small)',
                      }}
                    >
                      <HelpCircle size={16} aria-hidden="true" />
                      <span>Fazer o Quiz de Diagnóstico Gratuito (sem ficheiro)</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {isSubmitting && statusMessage && (
              <div
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  backgroundColor: 'var(--color-accent-soft)',
                  borderRadius: 'var(--radius-control)',
                  color: 'var(--color-accent)',
                  fontSize: 'var(--type-small)',
                  fontWeight: 'var(--weight-medium)',
                  textAlign: 'center',
                }}
              >
                {statusMessage}
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
              Não tens um CV preparado ou preferes responder a perguntas rápidas?
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
              <span>Fazer o quiz de diagnóstico de 8 perguntas</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
