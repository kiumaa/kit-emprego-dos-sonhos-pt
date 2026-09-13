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
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Check,
  Copy,
  Zap,
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

// Presets profissionais com dados realistas de mercado em Portugal
const PRESETS: Record<string, { label: string; doc: Partial<CVDraftData> }> = {
  admin: {
    label: 'Apoio Administrativo & Gestão',
    doc: {
      template: 'essencial',
      personal: {
        name: 'Inês Matos Ferreira',
        email: 'ines.ferreira@email.pt',
        phone: '+351 912 345 678',
        city: 'Lisboa, Portugal',
        targetRole: 'Assistente de Operações e Apoio à Gestão',
        photoAssetId: null,
      },
      summary: 'Profissional com 4 anos de experiência em PMEs em Portugal. Foco na organização de processos de faturação, apoio ao cliente multicanal e resolução célere de pendências operacionais com rigor e autonomia.',
      experience: [
        {
          id: 'exp-admin-1',
          role: 'Assistente Operacional e de Atendimento',
          organization: 'Soluções Integradas Lda.',
          start: 'Jan 2023',
          end: 'Presente',
          bullets: [
            'Assegurei o atendimento e resolução de 40+ pedidos diários de clientes com 94% de resolução no primeiro contacto.',
            'Estruturei o arquivo digital e conferência de 150+ faturas mensais, eliminando discrepâncias com a contabilidade externa.',
            'Formei 2 novos colaboradores no uso do software de faturação e nos procedimentos padrão de resposta por email.',
          ],
        },
        {
          id: 'exp-admin-2',
          role: 'Assistente Administrativa Júnior',
          organization: 'Logística e Distribuição SA',
          start: 'Set 2021',
          end: 'Dez 2022',
          bullets: [
            'Fiz a gestão da correspondência, marcação de transportes e acompanhamento do estado de 30 entregas diárias.',
            'Elaborei folhas de cálculo de controlo de rotas em Excel, reduzindo perdas de informação entre armazém e escritório.',
          ],
        },
      ],
      education: [
        {
          qualification: 'CTeSP em Assessoria de Gestão',
          institution: 'Instituto Politécnico de Lisboa',
          period: '2021',
        },
      ],
      skills: ['Microsoft Excel (VLOOKUP, Tabelas Dinâmicas)', 'Primavera ERP', 'Google Workspace', 'Atendimento ao Cliente', 'Faturação'],
    },
  },
  projetos: {
    label: 'Gestão de Projetos & Operações',
    doc: {
      template: 'moderno',
      personal: {
        name: 'Tiago Lourenço Rocha',
        email: 'tiago.rocha@email.pt',
        phone: '+351 920 111 222',
        city: 'Porto, Portugal',
        targetRole: 'Gestor de Projetos Digitais / Scrum Master',
        photoAssetId: null,
      },
      summary: 'Gestor de Projetos com 5 anos de experiência na implementação de soluções de e-commerce e automatização de fluxos de trabalho no mercado ibérico. Especialista em metodologias ágeis (Scrum/Kanban) e gestão de equipas multidisciplinares.',
      experience: [
        {
          id: 'exp-proj-1',
          role: 'Project Manager & Scrum Master',
          organization: 'TechVentures Ibéria',
          start: 'Fev 2022',
          end: 'Presente',
          bullets: [
            'Liderei 4 sprints de lançamento de nova plataforma B2B, entregando a versão MVP 3 semanas antes do prazo limite.',
            'Implementei fluxos no Jira que reduziram o lead time de entrega de funcionalidades em 28%.',
            'Fiz a gestão do orçamento do projeto (120.000 EUR) e coordenação direta de equipa com 8 engenheiros e designers.',
          ],
        },
      ],
      education: [
        {
          qualification: 'Mestrado em Engenharia e Gestão Industrial',
          institution: 'Faculdade de Engenharia da Univ. do Porto',
          period: '2021',
        },
      ],
      skills: ['Scrum & Kanban (PSM I)', 'Jira & Confluence', 'Power BI', 'Inglês Fluente C1', 'Gestão Orçamental'],
    },
  },
  comercial: {
    label: 'Comercial B2B & Atendimento',
    doc: {
      template: 'essencial',
      personal: {
        name: 'Mariana Duarte Silva',
        email: 'mariana.silva@email.pt',
        phone: '+351 931 888 999',
        city: 'Coimbra, Portugal',
        targetRole: 'Especialista Comercial B2B e Retenção',
        photoAssetId: null,
      },
      summary: 'Profissional com 3 anos de percurso na prospeção ativa, gestão de carteiras de clientes e apresentação de propostas comerciais no setor de serviços em Portugal. Comunicação empática e orientação clara para o cumprimento de metas de faturação.',
      experience: [
        {
          id: 'exp-com-1',
          role: 'Gestora Comercial de Contas',
          organization: 'Serviços Globais Ibéricos',
          start: 'Mar 2023',
          end: 'Presente',
          bullets: [
            'Geri uma carteira ativa de 65 clientes empresariais, aumentando a taxa de renovação de contratos em 18%.',
            'Conduzi reuniões de demonstração presencial e remota com taxas de conversão de 35% de proposta em fecho.',
            'Atualizei diariamente o pipeline de vendas no HubSpot CRM com previsões fiáveis de fecho mensal.',
          ],
        },
      ],
      education: [
        {
          qualification: 'Licenciatura em Marketing e Comunicação',
          institution: 'Universidade de Coimbra',
          period: '2022',
        },
      ],
      skills: ['HubSpot CRM', 'Negociação Comercial', 'Excel para Vendas', 'Apresentações Executivas', 'Gestão de Carteira'],
    },
  },
  ti: {
    label: 'Suporte Técnico TI & Redes',
    doc: {
      template: 'moderno',
      personal: {
        name: 'David Gonçalves Pires',
        email: 'david.pires@email.pt',
        phone: '+351 965 444 333',
        city: 'Braga, Portugal',
        targetRole: 'Técnico de Suporte TI e Administração de Sistemas',
        photoAssetId: null,
      },
      summary: 'Técnico de TI com experiência sólida em suporte a utilizadores, manutenção de hardware/software, gestão de acessos e resolução rápida de incidentes em ambiente de escritório e teletrabalho.',
      experience: [
        {
          id: 'exp-ti-1',
          role: 'Técnico de Helpdesk Nível 2',
          organization: 'InfraTech Portugal',
          start: 'Out 2022',
          end: 'Presente',
          bullets: [
            'Resolvi 80+ tickets semanais com tempo médio de primeira resposta inferior a 20 minutos.',
            'Configurei postos de trabalho e acessos VPN para 50+ colaboradores remotos em ambiente Windows 11 e macOS.',
            'Automatizei tarefas de rotina com scripts PowerShell, poupando 4 horas semanais de manutenção.',
          ],
        },
      ],
      education: [
        {
          qualification: 'Curso Técnico Profissional em Gestão e Redes',
          institution: 'Escola Profissional de Braga',
          period: '2021',
        },
      ],
      skills: ['Windows Server & Active Directory', 'Office 365 Admin', 'PowerShell', 'Redes & VPNs', 'Hardware & Diagnóstico'],
    },
  },
};

const ACTION_VERBS = [
  { category: 'Liderança & Gestão', verbs: ['Liderei', 'Coordenei', 'Estruturei', 'Deleguei', 'Facilitei', 'Supervisionei'] },
  { category: 'Otimização & Resultados', verbs: ['Otimizei', 'Reduzi', 'Acelerei', 'Automatizei', 'Eliminei', 'Poupei', 'Aumentei'] },
  { category: 'Execução & Rigor', verbs: ['Implementei', 'Assegurei', 'Desenvolvi', 'Conduzi', 'Elaborei', 'Auditei', 'Resolvi'] },
  { category: 'Comunicação & Parcerias', verbs: ['Negociei', 'Apresentei', 'Formei', 'Mediei', 'Alinhei', 'Articulei'] },
];

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
  const [showVerbBank, setShowVerbBank] = useState(false);
  const [copiedVerb, setCopiedVerb] = useState<string | null>(null);

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

  const applyPreset = (presetKey: string) => {
    const preset = PRESETS[presetKey];
    if (!preset) return;
    if (doc.personal.name && !confirm('Preencher com o modelo de referência irá substituir os dados atuais. Pretendes continuar?')) {
      return;
    }
    const updated: CVDraftData = {
      ...doc,
      ...preset.doc,
      personal: {
        ...doc.personal,
        ...(preset.doc.personal || {}),
      },
    } as CVDraftData;
    setDoc(updated);
    saveDocument(updated);
  };

  // Gerar PDF
  const handleGeneratePdf = async () => {
    setPdfGenerating(true);
    setErrorMessage(null);
    try {
      await saveDocument(doc);
      const res = await fetch(`/api/me/cv/${draftIdRef.current}/pdf`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setPdfUrl(data.downloadUrl);
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

  const copyVerb = (verb: string) => {
    navigator.clipboard.writeText(verb);
    setCopiedVerb(verb);
    setTimeout(() => setCopiedVerb(null), 1500);
  };

  // Auditoria ATS em tempo real
  const atsChecks = [
    {
      id: 'contacts',
      label: 'Localização e contactos em Portugal (+351 / Cidade)',
      valid: Boolean(doc.personal.city && doc.personal.phone && doc.personal.email),
    },
    {
      id: 'summary',
      label: 'Resumo profissional conciso (80 a 350 carateres)',
      valid: Boolean(doc.summary && doc.summary.length >= 80 && doc.summary.length <= 350),
    },
    {
      id: 'verbs',
      label: 'Verbos de ação no percurso (ex.: Otimizei, Coordenei, Assegurei)',
      valid: doc.experience.some((e) =>
        e.bullets.some((b) =>
          /(otimizei|coordenei|assegurei|liderei|estruturei|implementei|reduzi|desenvolvi|resolvi|elaborei)/i.test(b)
        )
      ),
    },
    {
      id: 'metrics',
      label: 'Métricas quantificadas nas tarefas (ex.: %, números ou prazos)',
      valid: doc.experience.some((e) =>
        e.bullets.some((b) => /\d+(%|\+|€|EUR| dias| clientes| colaboradores)/i.test(b))
      ),
    },
    {
      id: 'skills',
      label: 'Competências técnicas declaradas (mínimo 4 competências)',
      valid: doc.skills.length >= 4,
    },
  ];
  const atsScore = atsChecks.filter((c) => c.valid).length;

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>A carregar o teu currículo...</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '90vh', padding: '30px 16px' }}>
      <div className="container-wide" style={{ maxWidth: '1020px', margin: '0 auto' }}>
        {/* Barra de cabeçalho */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
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
              Criador de Currículo A4 de Alta Fidelidade
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

        {/* Barra de Presets Rápidos */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '12px 18px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bookmark size={16} style={{ color: 'var(--color-accent)' }} />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)' }}>
              Modelos de Referência para Portugal:
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(PRESETS).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => applyPreset(key)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F9FAFB',
                  color: 'var(--color-text)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F9FAFB')}
              >
                + {val.label}
              </button>
            ))}
          </div>
        </div>

        {/* Painel de Auditoria ATS em Tempo Real */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: atsScore >= 4 ? '1px solid #A7F3D0' : '1px solid #E5E7EB',
            padding: '14px 18px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} style={{ color: atsScore >= 4 ? '#059669' : 'var(--color-accent)' }} />
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                Auditoria ATS em Tempo Real:
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: atsScore >= 4 ? '#ECFDF5' : '#EFF6FF',
                  color: atsScore >= 4 ? '#059669' : 'var(--color-accent)',
                }}
              >
                {atsScore} de {atsChecks.length} critérios cumpridos
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowVerbBank(!showVerbBank)}
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
              }}
            >
              <Zap size={14} />
              {showVerbBank ? 'Ocultar Banco de Verbos' : 'Ver Banco de Verbos de Ação (PT-PT)'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
            {atsChecks.map((c) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  color: c.valid ? '#065F46' : 'var(--color-text-secondary)',
                }}
              >
                {c.valid ? (
                  <CheckCircle2 size={14} style={{ color: '#059669', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #D1D5DB', flexShrink: 0 }} />
                )}
                <span>{c.label}</span>
              </div>
            ))}
          </div>

          {/* Banco de Verbos Expansível */}
          {showVerbBank && (
            <div
              style={{
                marginTop: '14px',
                paddingTop: '12px',
                borderTop: '1px solid #F3F4F6',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                Clica num verbo para copiar e usar nas tuas frases de experiência:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {ACTION_VERBS.map((cat) => (
                  <div key={cat.category} style={{ backgroundColor: '#F9FAFB', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>
                      {cat.category}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {cat.verbs.map((verb) => (
                        <button
                          key={verb}
                          type="button"
                          onClick={() => copyVerb(verb)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: '1px solid #E5E7EB',
                            backgroundColor: copiedVerb === verb ? '#ECFDF5' : '#FFFFFF',
                            color: copiedVerb === verb ? '#059669' : 'var(--color-text)',
                            fontSize: '11px',
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          {copiedVerb === verb ? '✓ Copiado' : verb}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            { step: 1, label: 'Identificação & Modelo', icon: User },
            { step: 2, label: 'Perfil Profissional', icon: FileText },
            { step: 3, label: 'Experiência Reversa', icon: Briefcase },
            { step: 4, label: 'Formação & Skills', icon: GraduationCap },
            { step: 5, label: 'Rever & Exportar PDF', icon: Eye },
          ].map(({ step, label, icon: Icon }) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(step as any)}
              style={{
                flex: 1,
                minWidth: '150px',
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', maxWidth: '520px' }}>
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
                      Clássico, linear de 1 coluna, 100% legível por ATS e com separadores finos.
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
                    <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-text)' }}>Moderno Executivo</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      Faixa escura de cabeçalho em grafite com tipografia contrastada e foco técnico.
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
                    placeholder="Ex: ana.silva@email.pt"
                    value={doc.personal.email}
                    onChange={(e) => updatePersonalField('email', e.target.value)}
                    style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Telefone direto (+351) *
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: +351 912 345 678"
                    value={doc.personal.phone || ''}
                    onChange={(e) => updatePersonalField('phone', e.target.value)}
                    style={{ width: '100%', height: '44px', padding: '0 12px', borderRadius: '8px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
                    Cidade e País *
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

          {/* PASSO 2: Perfil Profissional */}
          {activeStep === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                  2. Perfil Profissional (Resumo Executivo)
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
                Apresenta em 3 a 4 linhas a tua área de atuação, principais pontos fortes e o que pretendes alcançar em Portugal.
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

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: doc.summary.length >= 80 && doc.summary.length <= 350 ? '#059669' : '#6B7280' }}>
                <span>Recomendado: 80 a 350 carateres</span>
                <span>{doc.summary.length} carateres</span>
              </div>

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
                    3. Experiência Profissional Reversa
                  </h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    Começa pela tua função mais recente. Foca-te em verbos de ação e tarefas mensuráveis.
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
                    updateDocField('experience', [newExp, ...doc.experience]);
                  }}
                  className="btn-secondary"
                  style={{ height: '36px', padding: '0 12px', fontSize: '13px', gap: '6px' }}
                >
                  <Plus size={16} />
                  Adicionar Função
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {doc.experience.map((exp, index) => (
                  <div
                    key={exp.id || index}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      padding: '20px',
                      backgroundColor: '#FAFAFA',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                        Função #{index + 1}
                      </span>
                      {doc.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = doc.experience.filter((_, i) => i !== index);
                            updateDocField('experience', updated);
                          }}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                          title="Remover experiência"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Cargo / Função *</label>
                        <input
                          type="text"
                          placeholder="Ex: Assistente Administrativo"
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
                          placeholder="Ex: Soluções Integradas Lda."
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
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Mês/Ano Início *</label>
                        <input
                          type="text"
                          placeholder="Ex: Jan 2023"
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
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Mês/Ano Fim (ou Presente)</label>
                        <input
                          type="text"
                          placeholder="Ex: Presente"
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
                        Responsabilidades & Realizações (formato: Verbo de Ação + Tarefa + Métrica)
                      </label>
                      {exp.bullets.map((bullet, bi) => (
                        <div key={bi} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                          <input
                            type="text"
                            placeholder="Ex: Assegurei o atendimento a 40+ clientes diários com 94% de resolução no primeiro contacto..."
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...doc.experience];
                              updated[index].bullets[bi] = e.target.value;
                              updateDocField('experience', updated);
                            }}
                            style={{ flex: 1, height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                          />
                          {exp.bullets.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...doc.experience];
                                updated[index].bullets = updated[index].bullets.filter((_, i) => i !== bi);
                                updateDocField('experience', updated);
                              }}
                              style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
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
                          padding: '4px 0',
                        }}
                      >
                        + Adicionar ponto de experiência
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PASSO 4: Formação e Competências */}
          {activeStep === 4 && (
            <div>
              {/* Formação Académica */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                    4. Formação Académica & Certificações
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      const newEdu = { qualification: '', institution: '', period: '' };
                      updateDocField('education', [...doc.education, newEdu]);
                    }}
                    className="btn-secondary"
                    style={{ height: '34px', padding: '0 12px', fontSize: '12px', gap: '6px' }}
                  >
                    <Plus size={14} />
                    Adicionar Curso
                  </button>
                </div>

                {doc.education.map((edu, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto',
                      gap: '12px',
                      alignItems: 'end',
                      marginBottom: '12px',
                      padding: '14px',
                      backgroundColor: '#FAFAFA',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Grau / Curso *</label>
                      <input
                        type="text"
                        placeholder="Ex: Licenciatura em Gestão"
                        value={edu.qualification}
                        onChange={(e) => {
                          const updated = [...doc.education];
                          updated[index].qualification = e.target.value;
                          updateDocField('education', updated);
                        }}
                        style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Instituição de Ensino *</label>
                      <input
                        type="text"
                        placeholder="Ex: Universidade de Lisboa"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...doc.education];
                          updated[index].institution = e.target.value;
                          updateDocField('education', updated);
                        }}
                        style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Ano de Conclusão</label>
                      <input
                        type="text"
                        placeholder="Ex: 2021"
                        value={edu.period || ''}
                        onChange={(e) => {
                          const updated = [...doc.education];
                          updated[index].period = e.target.value;
                          updateDocField('education', updated);
                        }}
                        style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                      />
                    </div>

                    <button
                      type="button"
                      disabled={doc.education.length <= 1}
                      onClick={() => {
                        const updated = doc.education.filter((_, i) => i !== index);
                        updateDocField('education', updated);
                      }}
                      style={{ height: '38px', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0 8px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Competências */}
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  Competências Chave & Ferramentas
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  Adiciona competências técnicas e comportamentais relevantes para a função (mínimo 4 recomendadas para filtros ATS).
                </p>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', maxWidth: '460px' }}>
                  <input
                    type="text"
                    placeholder="Ex: Excel Avançado, Primavera ERP, Gestão de Prazos..."
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
                    Modelo selecionado: <strong>{doc.template === 'moderno' ? 'Moderno Executivo' : 'Essencial (1 Coluna ATS)'}</strong>.
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
                  {pdfGenerating ? 'A gerar PDF A4...' : 'Exportar PDF A4 de Alta Fidelidade'}
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
                      Competências & Ferramentas
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
