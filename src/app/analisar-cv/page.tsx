'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { UploadCloud, FileText, Lock, ArrowRight, HelpCircle, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export default function AnalyzeCvPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [cvText, setCvText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);
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
        message: 'Por favor seleciona um ficheiro de CV ou muda para a opção de colar texto.',
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
    setStatusMessage('A processar o documento em memória segura...');

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

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        // Resposta não é JSON (ex: erro 500/504 em HTML do servidor)
      }

      if (!response.ok) {
        setIsSubmitting(false);
        setStatusMessage(null);
        setError({
          message: data?.message || (response.status === 503
            ? 'O analisador de currículo com inteligência artificial está temporariamente indisponível. Podes responder ao Quiz de Diagnóstico gratuito.'
            : response.status === 413
            ? 'O ficheiro excede o tamanho máximo permitido de 5 MiB. Podes colar o texto diretamente.'
            : response.status === 500
            ? 'Ocorreu um erro no servidor ao processar o documento. Podes colar o texto ou responder ao Quiz gratuito.'
            : 'Ocorreu um erro ao processar o currículo.'),
          offerQuiz: data?.offerQuiz ?? true,
          allowPaste: data?.allowPaste ?? true,
        });
        return;
      }

      if (!data || !data.id) {
        setIsSubmitting(false);
        setStatusMessage(null);
        setError({
          message: 'A resposta do analisador foi inconclusiva. Podes tentar colar o texto ou responder ao Quiz gratuito.',
          offerQuiz: true,
          allowPaste: true,
        });
        return;
      }

      // Guardar resultado na sessão e navegar imediatamente
      sessionStorage.setItem(`keds_result_${data.id}`, JSON.stringify(data));
      router.push(`/resultado/${data.id}`);
    } catch {
      setIsSubmitting(false);
      setStatusMessage(null);
      setError({
        message: 'Não foi possível contactar o servidor de análise. Verifica a tua ligação ou experimenta o Quiz de autorrelato.',
        offerQuiz: true,
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Header com logo e botão voltar discreto */}
      <Header showBack={true} backHref="/" backLabel="Início" />

      <main style={{ flex: 1, padding: 'clamp(20px, 4vh, 32px) 0 clamp(32px, 6vh, 64px) 0' }}>
        <div className="container-reading" style={{ maxWidth: '560px', marginInline: 'auto' }}>
          {/* Headline & Subheadline simples */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <h1
              style={{
                fontSize: 'clamp(26px, 6vw, 34px)',
                lineHeight: 1.15,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--color-text)',
              }}
            >
              Vamos olhar para o teu CV.
            </h1>
            <p
              className="secondary"
              style={{
                marginTop: 'var(--space-2)',
                fontSize: '15px',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.45,
              }}
            >
              Envia o ficheiro ou cola o texto. Em poucos instantes mostramos-te os principais pontos a rever.
            </p>
          </div>

          {/* Card do Formulário de Diagnóstico */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: 'clamp(20px, 4vw, 28px) clamp(16px, 4vw, 24px)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 30px rgba(29, 29, 31, 0.05)',
            }}
          >
            {/* Tabs: Enviar CV / Colar texto */}
            <div
              role="tablist"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
                padding: '4px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                marginBottom: 'var(--space-6)',
              }}
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'upload'}
                onClick={() => { setActiveTab('upload'); setError(null); }}
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  border: 0,
                  fontSize: '14px',
                  fontWeight: activeTab === 'upload' ? 700 : 500,
                  backgroundColor: activeTab === 'upload' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'upload' ? 'var(--color-text)' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'upload' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 160ms ease',
                }}
              >
                Enviar ficheiro
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'paste'}
                onClick={() => { setActiveTab('paste'); setError(null); }}
                style={{
                  height: '42px',
                  borderRadius: '10px',
                  border: 0,
                  fontSize: '14px',
                  fontWeight: activeTab === 'paste' ? 700 : 500,
                  backgroundColor: activeTab === 'paste' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'paste' ? 'var(--color-text)' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'paste' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 160ms ease',
                }}
              >
                Colar texto
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* Tab 1: Upload */}
              {activeTab === 'upload' && (
                <div>
                  <label
                    htmlFor="cv-file-upload"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '32px 20px',
                      border: '2px dashed var(--color-border)',
                      borderRadius: '16px',
                      backgroundColor: file ? 'var(--color-surface)' : '#FAFAFC',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'border-color 160ms ease, background-color 160ms ease',
                    }}
                  >
                    <UploadCloud size={36} color="var(--color-accent)" style={{ marginBottom: '10px' }} aria-hidden="true" />
                    {file ? (
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>
                          {file.name}
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                          {(file.size / 1024).toFixed(0)} KB · Clica para substituir
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text)' }}>
                          Clica para escolher o teu CV
                        </p>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                          Ficheiros PDF, DOCX ou TXT até 5 MiB
                        </p>
                      </div>
                    )}
                    <input
                      id="cv-file-upload"
                      type="file"
                      accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                      aria-label="Selecionar ficheiro de currículo em PDF, DOCX ou TXT"
                    />
                  </label>
                </div>
              )}

              {/* Tab 2: Colar Texto */}
              {activeTab === 'paste' && (
                <div>
                  <textarea
                    id="cv-text-input"
                    rows={7}
                    placeholder="Copia e cola aqui o conteúdo do teu currículo (experiência, formação, competências)..."
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      fontSize: '14px',
                      lineHeight: 1.45,
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      outline: 'none',
                    }}
                    aria-label="Texto completo do currículo"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    <span>Mínimo de 40 caracteres</span>
                    <span>{cvText.length} caracteres</span>
                  </div>
                </div>
              )}

              {/* Expandable Disclosure: Campos Opcionais de Contexto */}
              <div
                style={{
                  borderTop: '1px solid rgba(0,0,0,0.06)',
                  paddingTop: 'var(--space-3)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowOptionalFields(!showOptionalFields)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    background: 'none',
                    border: 0,
                    padding: '8px 0',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>Queres uma análise mais contextualizada? (Opcional)</span>
                  {showOptionalFields ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showOptionalFields && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                    <div>
                      <label htmlFor="target-role" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '4px' }}>
                        Função pretendida
                      </label>
                      <input
                        id="target-role"
                        type="text"
                        placeholder="Ex.: Gestor de Projetos, Contabilista, Desenvolvedor"
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        style={{
                          width: '100%',
                          height: '42px',
                          padding: '0 12px',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="job-description" style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text)', marginBottom: '4px' }}>
                        Descrição da vaga
                      </label>
                      <textarea
                        id="job-description"
                        rows={3}
                        placeholder="Cola aqui os requisitos ou a descrição da oferta que pretendes..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1px solid var(--color-border)',
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mensagem de Erro com Alternativa do Quiz se Necessário */}
              {error && (
                <div
                  role="alert"
                  style={{
                    backgroundColor: '#FFF0F0',
                    border: '1px solid #FFD0D0',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: 'var(--color-danger)',
                    fontSize: '13px',
                    lineHeight: 1.4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                    <span>{error.message}</span>
                  </div>

                  {error.offerQuiz && (
                    <a
                      href="/quiz"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 700,
                        color: 'var(--color-accent)',
                        textDecoration: 'none',
                        fontSize: '13px',
                        alignSelf: 'flex-start',
                      }}
                    >
                      <span>Fazer o Quiz de 5 perguntas em alternativa</span>
                      <ArrowRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}

              {/* Botão de Envio Principal (50-52px) */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-on-accent)',
                  border: 0,
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(0, 87, 217, 0.25)',
                  marginTop: 'var(--space-2)',
                  transition: 'background-color 160ms ease, opacity 160ms ease',
                  opacity: isSubmitting ? 0.8 : 1,
                }}
              >
                {isSubmitting ? (
                  <span>{statusMessage || 'A analisar o teu documento...'}</span>
                ) : (
                  <>
                    <span>Analisar o meu CV</span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </>
                )}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                <Lock size={13} aria-hidden="true" />
                <span>Leitura segura em memória · Ficheiro não partilhado</span>
              </div>
            </form>
          </div>

          {/* Alternativa Visível Permanente: Não tens o CV contigo? Faz o quiz */}
          <div
            style={{
              marginTop: 'var(--space-8)',
              textAlign: 'center',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>
              Não tens o CV contigo?
            </span>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0 }}>
              Responde a 5 perguntas breves e recebe o teu diagnóstico em menos de 1 minuto.
            </p>
            <a
              href="/quiz"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--color-accent)',
                textDecoration: 'none',
                marginTop: '4px',
              }}
            >
              <span>Fazer o quiz agora</span>
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
