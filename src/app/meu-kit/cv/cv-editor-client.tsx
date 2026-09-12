'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Download,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
} from 'lucide-react';
import { CVDraftData } from '@/server/pdf/cv-pdf-generator';

const DEFAULT_DOC: CVDraftData = {
  schemaVersion: 1,
  template: 'essencial',
  personal: {
    name: '',
    email: '',
    phone: '',
    city: '',
    targetRole: '',
    photoAssetId: null,
  },
  summary: '',
  experience: [
    {
      id: 'exp-1',
      role: '',
      organization: '',
      start: '',
      end: '',
      bullets: [''],
    },
  ],
  education: [
    {
      qualification: '',
      institution: '',
      period: '',
    },
  ],
  skills: [],
};

export function CvEditorClient() {
  const router = useRouter();
  const [doc, setDoc] = useState<CVDraftData>(DEFAULT_DOC);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [docVersion, setDocVersion] = useState<number>(1);
  const [activeWindow, setActiveWindow] = useState<{ id: string; expiresAtMs: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // IA modal/assistência
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ suggestion: string; explanation: string } | null>(null);

  const draftIdRef = useRef('meu-cv-principal');

  // Carregar rascunho
  useEffect(() => {
    fetch(`/api/me/cv/${draftIdRef.current}`)
      .then((res) => {
        if (res.status === 401) {
          router.replace('/acesso');
          return null;
        }
        if (res.status === 403) {
          router.replace('/meu-kit');
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.ok && data.draft) {
          setDoc((prev) => ({ ...prev, ...(data.draft.document || {}) }));
          setDocVersion(data.draft.version);
          setActiveWindow(data.activeWindow);
        }
      })
      .catch(() => setErrorMessage('Erro ao carregar rascunho.'))
      .finally(() => setIsLoading(false));
  }, [router]);

  // Guardar documento
  const saveDocument = useCallback(
    async (updatedDoc: CVDraftData) => {
      if (!activeWindow) return;
      setSaveStatus('saving');
      try {
        const res = await fetch(`/api/me/cv/${draftIdRef.current}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document: updatedDoc,
            expectedVersion: docVersion,
          }),
        });
        const data = await res.json();
        if (res.ok && data.ok) {
          setDocVersion(data.version);
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        } else {
          setSaveStatus('error');
        }
      } catch {
        setSaveStatus('error');
      }
    },
    [activeWindow, docVersion]
  );

  const updateDocField = (field: keyof CVDraftData, value: any) => {
    const updated = { ...doc, [field]: value };
    setDoc(updated);
    saveDocument(updated);
  };

  const updatePersonalField = (field: string, value: string) => {
    const updated = {
      ...doc,
      personal: { ...doc.personal, [field]: value },
    };
    setDoc(updated);
    saveDocument(updated);
  };

  // Gerar PDF
  const handleGeneratePdf = async () => {
    setPdfGenerating(true);
    setErrorMessage(null);
    try {
      // Guarda antes de exportar
      await saveDocument(doc);

      const res = await fetch(`/api/me/cv/${draftIdRef.current}/pdf`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPdfUrl(data.downloadUrl);
        // Descarregar imediatamente
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = data.filename || 'curriculo.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setErrorMessage(data.message || data.error || 'Erro ao gerar o PDF.');
      }
    } catch {
      setErrorMessage('Erro ao comunicar com o servidor de PDF.');
    } finally {
      setPdfGenerating(false);
    }
  };

  // Pedido à IA
  const handleRequestAi = async (section: string, text: string) => {
    setAiLoading(true);
    setErrorMessage(null);
    setAiSuggestion(null);
    try {
      const res = await fetch(`/api/me/cv/${draftIdRef.current}/suggest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section,
          currentText: text,
          targetRole: doc.personal.targetRole,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setAiSuggestion({
          suggestion: data.suggestion,
          explanation: data.explanation,
        });
      } else {
        setErrorMessage(data.message || 'Assistente de IA indisponível.');
      }
    } catch {
      setErrorMessage('Erro ao contactar o assistente de IA.');
    } finally {
      setAiLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>A carregar o teu currículo...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '90vh', padding: '30px 16px' }}>
      <div className="container-wide" style={{ maxWidth: '980px', margin: '0 auto' }}>
        {/* Barra de cabeçalho */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/meu-kit"
              className="btn-secondary"
              style={{ height: '38px', padding: '0 12px', fontSize: '13px', gap: '6px' }}
            >
              <ArrowLeft size={16} />
              Voltar ao painel
            </Link>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
              Editor de Currículo A4
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {activeWindow ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #A7F3D0',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <Clock size={13} />
                <span>Sessão ativa até {new Date(activeWindow.expiresAtMs).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FEF3C7',
                  color: '#92400E',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Modo de leitura (sem sessão ativa)
              </div>
            )}

            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              {saveStatus === 'saving' && 'A guardar...'}
              {saveStatus === 'saved' && '✓ Guardado'}
              {saveStatus === 'error' && 'Erro ao guardar'}
            </div>
          </div>
        </div>

        {errorMessage && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FCA5A5',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '14px',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Wizard Steps */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '6px',
            marginBottom: '24px',
            overflowX: 'auto',
          }}
        >
          {[
            { step: 1, label: 'Identificação', icon: User },
            { step: 2, label: 'Perfil Profissional', icon: FileText },
            { step: 3, label: 'Experiência', icon: Briefcase },
            { step: 4, label: 'Formação & Skills', icon: GraduationCap },
            { step: 5, label: 'Rever & Exportar PDF', icon: Eye },
          ].map(({ step, label, icon: Icon }) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(step as any)}
              style={{
                flex: 1,
                minWidth: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeStep === step ? 'var(--color-surface)' : 'transparent',
                color: activeStep === step ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontWeight: activeStep === step ? 700 : 500,
                fontSize: '13px',
                transition: 'all 150ms ease',
              }}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content Box */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: 'clamp(20px, 4vw, 36px)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
            marginBottom: '24px',
          }}
        >
          {/* PASSO 1: Identificação & Modelo */}
          {activeStep === 1 && (
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                1. Escolhe o Modelo e Dados Pessoais
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                Estes dados compõem o topo do teu documento A4.
              </p>

              {/* Seletor de Modelo */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Modelo de CV A4
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', maxWidth: '500px' }}>
                  <button
                    type="button"
                    onClick={() => updateDocField('template', 'essencial')}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: doc.template === 'essencial' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                      backgroundColor: doc.template === 'essencial' ? '#EFF6FF' : '#FAFAFA',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text)' }}>Essencial (Recomendado)</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      Clássico, elegante e focado no conteúdo com divisores finos.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateDocField('template', 'moderno')}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      border: doc.template === 'moderno' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                      backgroundColor: doc.template === 'moderno' ? '#EFF6FF' : '#FAFAFA',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text)' }}>Moderno</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      Faixa escura de cabeçalho em grafite com tipografia contrastada.
                    </div>
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ana Silva"
                    value={doc.personal.name}
                    onChange={(e) => updatePersonalField('name', e.target.value)}
                    style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Cargo pretendido / Título *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Assistente de Recursos Humanos"
                    value={doc.personal.targetRole || ''}
                    onChange={(e) => updatePersonalField('targetRole', e.target.value)}
                    style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Email profissional *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="exemplo@dominio.pt"
                    value={doc.personal.email}
                    onChange={(e) => updatePersonalField('email', e.target.value)}
                    style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Telefone
                  </label>
                  <input
                    type="text"
                    placeholder="+351 912 345 678"
                    value={doc.personal.phone || ''}
                    onChange={(e) => updatePersonalField('phone', e.target.value)}
                    style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Cidade / Região (Portugal)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Lisboa, Portugal"
                    value={doc.personal.city || ''}
                    onChange={(e) => updatePersonalField('city', e.target.value)}
                    style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASSO 2: Resumo / Perfil Profissional */}
          {activeStep === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                  2. Perfil Profissional (Resumo)
                </h2>
                <button
                  type="button"
                  disabled={aiLoading || !doc.summary.trim()}
                  onClick={() => handleRequestAi('perfil profissional', doc.summary)}
                  className="btn-secondary"
                  style={{ height: '34px', padding: '0 12px', fontSize: '12px', gap: '6px' }}
                >
                  <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
                  {aiLoading ? 'A refinar...' : 'Refinar com IA'}
                </button>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Apresenta em 3 a 4 linhas a tua área de atuação, principais pontos fortes e o que pretendes alcançar.
              </p>

              <textarea
                rows={5}
                placeholder="Ex: Profissional com 4 anos de experiência em apoio administrativo e faturação em empresas do setor de serviços. Conhecimento sólido em Excel e contacto diário com clientes e fornecedores..."
                value={doc.summary}
                onChange={(e) => updateDocField('summary', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  fontFamily: 'inherit',
                  outline: 'none',
                }}
              />

              {/* Caixa de Sugestão da IA */}
              {aiSuggestion && (
                <div
                  style={{
                    marginTop: '16px',
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '10px',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--color-accent)', fontWeight: 700, fontSize: '13px' }}>
                    <Sparkles size={16} />
                    Sugestão de Aperfeiçoamento (Português de Portugal)
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.5, marginBottom: '10px' }}>
                    {aiSuggestion.suggestion}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                    <em>Justificação:</em> {aiSuggestion.explanation}
                  </p>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        updateDocField('summary', aiSuggestion.suggestion);
                        setAiSuggestion(null);
                      }}
                      className="btn-primary"
                      style={{ height: '34px', padding: '0 14px', fontSize: '12px' }}
                    >
                      Aplicar esta sugestão
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiSuggestion(null)}
                      className="btn-secondary"
                      style={{ height: '34px', padding: '0 12px', fontSize: '12px' }}
                    >
                      Descartar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASSO 3: Experiência Profissional */}
          {activeStep === 3 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                    3. Experiência Profissional
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    Adiciona as tuas funções mais relevantes (por ordem cronológica inversa).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newExp = {
                      id: `exp-${Date.now()}`,
                      role: '',
                      organization: '',
                      start: '',
                      end: '',
                      bullets: [''],
                    };
                    updateDocField('experience', [...doc.experience, newExp]);
                  }}
                  className="btn-secondary"
                  style={{ height: '36px', padding: '0 12px', fontSize: '13px', gap: '6px' }}
                >
                  <Plus size={16} />
                  Adicionar Experiência
                </button>
              </div>

              {doc.experience.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                  Nenhuma experiência adicionada. Clica no botão acima para adicionar.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {doc.experience.map((exp, index) => (
                    <div
                      key={exp.id || index}
                      style={{
                        padding: '18px',
                        borderRadius: '12px',
                        backgroundColor: '#FAFAFA',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                          Experiência #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = doc.experience.filter((_, i) => i !== index);
                            updateDocField('experience', updated);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#DC2626',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Cargo / Função *</label>
                          <input
                            type="text"
                            placeholder="Ex: Técnico Comercial"
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...doc.experience];
                              updated[index].role = e.target.value;
                              updateDocField('experience', updated);
                            }}
                            style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Empresa / Organização *</label>
                          <input
                            type="text"
                            placeholder="Ex: Delta Cafés Lda"
                            value={exp.organization}
                            onChange={(e) => {
                              const updated = [...doc.experience];
                              updated[index].organization = e.target.value;
                              updateDocField('experience', updated);
                            }}
                            style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Início (Ano ou AAAA-MM) *</label>
                          <input
                            type="text"
                            placeholder="Ex: 2023-01"
                            value={exp.start}
                            onChange={(e) => {
                              const updated = [...doc.experience];
                              updated[index].start = e.target.value;
                              updateDocField('experience', updated);
                            }}
                            style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Fim (ou Presente)</label>
                          <input
                            type="text"
                            placeholder="Ex: Presente ou 2025-12"
                            value={exp.end || ''}
                            onChange={(e) => {
                              const updated = [...doc.experience];
                              updated[index].end = e.target.value;
                              updateDocField('experience', updated);
                            }}
                            style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                          />
                        </div>
                      </div>

                      {/* Bullets */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                          Principais responsabilidades & realizações:
                        </label>
                        {exp.bullets.map((bullet, bIndex) => (
                          <div key={bIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                              type="text"
                              placeholder="Ex: Gestão de carteira com mais de 80 clientes e faturação mensal..."
                              value={bullet}
                              onChange={(e) => {
                                const updated = [...doc.experience];
                                updated[index].bullets[bIndex] = e.target.value;
                                updateDocField('experience', updated);
                              }}
                              style={{ flex: 1, height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...doc.experience];
                                updated[index].bullets = updated[index].bullets.filter((_, i) => i !== bIndex);
                                updateDocField('experience', updated);
                              }}
                              style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...doc.experience];
                            updated[index].bullets.push('');
                            updateDocField('experience', updated);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-accent)',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            marginTop: '6px',
                          }}
                        >
                          <Plus size={14} /> Adicionar ponto
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PASSO 4: Formação & Competências */}
          {activeStep === 4 && (
            <div>
              {/* Educação */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                    Educação e Habilitações
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      const newEdu = { qualification: '', institution: '', period: '' };
                      updateDocField('education', [...doc.education, newEdu]);
                    }}
                    className="btn-secondary"
                    style={{ height: '34px', padding: '0 10px', fontSize: '12px', gap: '4px' }}
                  >
                    <Plus size={14} /> Adicionar Curso
                  </button>
                </div>

                {doc.education.map((edu, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 40px',
                      gap: '10px',
                      marginBottom: '10px',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Grau / Curso (Ex: Licenciatura em Gestão)"
                      value={edu.qualification}
                      onChange={(e) => {
                        const updated = [...doc.education];
                        updated[index].qualification = e.target.value;
                        updateDocField('education', updated);
                      }}
                      style={{ height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                    />
                    <input
                      type="text"
                      placeholder="Instituição (Ex: Univ. de Coimbra)"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...doc.education];
                        updated[index].institution = e.target.value;
                        updateDocField('education', updated);
                      }}
                      style={{ height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                    />
                    <input
                      type="text"
                      placeholder="Ano (Ex: 2022)"
                      value={edu.period || ''}
                      onChange={(e) => {
                        const updated = [...doc.education];
                        updated[index].period = e.target.value;
                        updateDocField('education', updated);
                      }}
                      style={{ height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = doc.education.filter((_, i) => i !== index);
                        updateDocField('education', updated);
                      }}
                      style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Competências */}
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  Competências Chave
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  Adiciona competências técnicas e comportamentais relevantes para a função.
                </p>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', maxWidth: '440px' }}>
                  <input
                    type="text"
                    placeholder="Ex: Gestão de Tempo, Excel, SAP..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && skillInput.trim()) {
                        e.preventDefault();
                        if (!doc.skills.includes(skillInput.trim())) {
                          updateDocField('skills', [...doc.skills, skillInput.trim()]);
                        }
                        setSkillInput('');
                      }
                    }}
                    style={{ flex: 1, height: '40px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (skillInput.trim() && !doc.skills.includes(skillInput.trim())) {
                        updateDocField('skills', [...doc.skills, skillInput.trim()]);
                        setSkillInput('');
                      }
                    }}
                    className="btn-secondary"
                    style={{ height: '40px', padding: '0 14px', fontSize: '13px' }}
                  >
                    Adicionar
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {doc.skills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: '#EFF6FF',
                        color: 'var(--color-accent)',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = doc.skills.filter((_, i) => i !== index);
                          updateDocField('skills', updated);
                        }}
                        style={{ background: 'none', border: 'none', color: '#93C5FD', cursor: 'pointer', padding: 0 }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PASSO 5: Rever e Exportar PDF */}
          {activeStep === 5 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
                    Pré-visualização do Currículo
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    Modelo selecionado: <strong>{doc.template === 'moderno' ? 'Moderno' : 'Essencial'}</strong>.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={pdfGenerating || !doc.personal.name}
                  onClick={handleGeneratePdf}
                  className="btn-primary"
                  style={{ height: '46px', padding: '0 24px', gap: '8px', fontSize: '15px' }}
                >
                  <Download size={18} />
                  {pdfGenerating ? 'A gerar PDF A4...' : 'Exportar PDF A4'}
                </button>
              </div>

              {/* Cartão de visualização estilo folha A4 */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #E5E7EB',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                  padding: '40px',
                  maxWidth: '720px',
                  margin: '0 auto',
                  fontFamily: 'var(--font-primary), Arial, sans-serif',
                }}
              >
                {/* Cabeçalho Preview */}
                {doc.template === 'moderno' ? (
                  <div
                    style={{
                      backgroundColor: '#1D1D1F',
                      color: '#FFFFFF',
                      padding: '24px',
                      borderRadius: '6px',
                      marginBottom: '24px',
                    }}
                  >
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>{doc.personal.name || 'O teu nome completo'}</h3>
                    {doc.personal.targetRole && (
                      <div style={{ fontSize: '14px', color: '#D1D5DB', marginTop: '4px', fontWeight: 600 }}>
                        {doc.personal.targetRole}
                      </div>
                    )}
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '10px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {doc.personal.city && <span>{doc.personal.city}</span>}
                      {doc.personal.email && <span>{doc.personal.email}</span>}
                      {doc.personal.phone && <span>{doc.personal.phone}</span>}
                    </div>
                  </div>
                ) : (
                  <div style={{ borderBottom: '2px solid #E5E7EB', paddingBottom: '16px', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#1D1D1F' }}>{doc.personal.name || 'O teu nome completo'}</h3>
                    {doc.personal.targetRole && (
                      <div style={{ fontSize: '14px', color: '#0057D9', marginTop: '4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {doc.personal.targetRole}
                      </div>
                    )}
                    <div style={{ fontSize: '13px', color: '#51515A', marginTop: '8px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      {doc.personal.city && <span>📍 {doc.personal.city}</span>}
                      {doc.personal.email && <span>✉️ {doc.personal.email}</span>}
                      {doc.personal.phone && <span>📞 {doc.personal.phone}</span>}
                    </div>
                  </div>
                )}

                {/* Perfil */}
                {doc.summary && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#1D1D1F', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #0057D9', paddingBottom: '3px', marginBottom: '8px', width: 'fit-content' }}>
                      Perfil Profissional
                    </div>
                    <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{doc.summary}</p>
                  </div>
                )}

                {/* Experiências */}
                {doc.experience.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#1D1D1F', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #0057D9', paddingBottom: '3px', marginBottom: '12px', width: 'fit-content' }}>
                      Experiência Profissional
                    </div>
                    {doc.experience.map((exp, i) => (
                      <div key={i} style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#1D1D1F' }}>{exp.role || 'Cargo'}</span>
                          <span style={{ fontSize: '12px', color: '#6B7280' }}>{exp.start} — {exp.end || 'Presente'}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#0057D9', fontWeight: 600 }}>{exp.organization}</div>
                        {exp.bullets.filter(Boolean).length > 0 && (
                          <ul style={{ margin: '6px 0 0 16px', padding: 0, fontSize: '12px', color: '#374151' }}>
                            {exp.bullets.filter(Boolean).map((b, bi) => (
                              <li key={bi} style={{ marginBottom: '3px' }}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Educação */}
                {doc.education.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#1D1D1F', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #0057D9', paddingBottom: '3px', marginBottom: '10px', width: 'fit-content' }}>
                      Educação e Formação
                    </div>
                    {doc.education.map((edu, i) => (
                      <div key={i} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1D1D1F' }}>{edu.qualification}</div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>{edu.institution}</div>
                        </div>
                        {edu.period && <div style={{ fontSize: '12px', color: '#6B7280' }}>{edu.period}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {/* Competências */}
                {doc.skills.length > 0 && (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#1D1D1F', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1.5px solid #0057D9', paddingBottom: '3px', marginBottom: '8px', width: 'fit-content' }}>
                      Competências
                    </div>
                    <div style={{ fontSize: '12px', color: '#374151' }}>
                      {doc.skills.join('  •  ')}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navegação Inferior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {activeStep > 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev - 1) as any)}
              className="btn-secondary"
            >
              <ArrowLeft size={16} style={{ marginRight: '6px' }} />
              Passo Anterior
            </button>
          ) : <div />}

          {activeStep < 5 ? (
            <button
              type="button"
              onClick={() => setActiveStep((prev) => (prev + 1) as any)}
              className="btn-primary"
            >
              Próximo Passo
              <ArrowRight size={16} style={{ marginLeft: '6px' }} />
            </button>
          ) : (
            <button
              type="button"
              disabled={pdfGenerating}
              onClick={handleGeneratePdf}
              className="btn-primary"
            >
              <Download size={16} style={{ marginRight: '6px' }} />
              {pdfGenerating ? 'A gerar PDF...' : 'Descarregar PDF'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
