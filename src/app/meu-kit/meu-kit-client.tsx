'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  MessageSquare,
  Share2,
  Clock,
  CheckCircle,
  Download,
  AlertTriangle,
  ArrowRight,
  LogOut,
  Package,
  BookOpen,
  Layers,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';

interface EntitlementItem {
  id: string;
  productKey: 'kit' | 'entrevista' | 'linkedin';
  status: 'active' | 'revoked';
  maxActivations: number | null;
  activationsUsed: number;
  remainingActivations: number | null;
  windowHours: number;
  activeWindow: {
    id: string;
    ordinal?: number;
    startsAtMs: number;
    expiresAtMs: number;
  } | null;
}

interface SavedFileItem {
  id: string;
  filename: string;
  contentType: string;
  createdAtMs: number;
}

interface DeliverableItem {
  id: string;
  name: string;
  filename: string;
  description: string;
  category: 'pacote' | 'cv' | 'guias' | 'comunicacao' | 'ferramentas';
  entitlement: 'kit' | 'entrevista' | 'linkedin';
  contentType: string;
  isZip?: boolean;
  downloadUrl: string;
}

export function MeuKitClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedProduct = searchParams.get('produto');

  const [user, setUser] = useState<{ email: string; subject: string } | null>(null);
  const [entitlements, setEntitlements] = useState<EntitlementItem[]>([]);
  const [savedFiles, setSavedFiles] = useState<SavedFileItem[]>([]);
  const [resources, setResources] = useState<DeliverableItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState<string | null>(null);
  const [confirmModalKey, setConfirmModalKey] = useState<'kit' | 'entrevista' | 'linkedin' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await fetch('/api/me/entitlements');
      if (res.status === 401) {
        router.replace('/acesso');
        return;
      }
      const data = await res.json();
      if (data.ok) {
        setUser(data.user);
        setEntitlements(data.entitlements || []);
      }

      const filesRes = await fetch('/api/me/files');
      if (filesRes.ok) {
        const filesData = await filesRes.json();
        setSavedFiles(filesData.files || []);
      }

      const resourcesRes = await fetch('/api/me/resources');
      if (resourcesRes.ok) {
        const resourcesData = await resourcesRes.json();
        setResources(resourcesData.resources || []);
      }
    } catch {
      setErrorMessage('Não foi possível carregar os teus dados. Tenta recarregar a página.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/acesso');
  };

  const getEntitlement = (key: 'kit' | 'entrevista' | 'linkedin') => {
    return entitlements.find((e) => e.productKey === key);
  };

  const handleStartSession = async (key: 'kit' | 'entrevista' | 'linkedin') => {
    setIsActivating(key);
    setErrorMessage(null);
    try {
      const requestId = crypto.randomUUID();
      const res = await fetch(`/api/me/products/${key}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'ACTIVATION_LIMIT_REACHED') {
          setErrorMessage('Atingiste o limite de 3 sessões de trabalho para esta ferramenta.');
        } else {
          setErrorMessage(data.message || data.error || 'Erro ao iniciar sessão.');
        }
        setIsActivating(null);
        setConfirmModalKey(null);
        return;
      }

      setConfirmModalKey(null);
      if (key === 'kit') router.push('/meu-kit/cv');
      else if (key === 'entrevista') router.push('/meu-kit/entrevista');
      else if (key === 'linkedin') router.push('/meu-kit/linkedin');
    } catch {
      setErrorMessage('Erro de rede ao comunicar com o servidor.');
    } finally {
      setIsActivating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>A carregar a tua área de trabalho e materiais...</p>
      </div>
    );
  }

  const kitEnt = getEntitlement('kit');
  const entrevistaEnt = getEntitlement('entrevista');
  const linkedinEnt = getEntitlement('linkedin');

  const kitZip = resources.find((r) => r.id === 'kit-principal-zip');
  const filteredResources = resources.filter((r) => {
    if (r.isZip) return false; // Mostrado em destaque
    if (activeCategory === 'todos') return true;
    return r.category === activeCategory;
  });

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '85vh', padding: '40px 16px' }}>
      <div className="container-wide" style={{ maxWidth: '1020px', margin: '0 auto' }}>
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Área de Trabalho & Entrega de Recursos
              </span>
              {requestedProduct && (
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', backgroundColor: 'var(--color-accent-soft)', color: 'var(--color-accent)' }}>
                  Acesso: {requestedProduct.toUpperCase()}
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)', margin: 0 }}>
              Meu Kit de Candidatura
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Comprador: <strong>{user?.email}</strong>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ fontSize: '14px', height: '42px', padding: '0 16px', gap: '8px' }}
          >
            <LogOut size={16} />
            Terminar sessão
          </button>
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
              marginBottom: '24px',
              fontSize: '14px',
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Informação sobre limites e downloads */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '14px',
            padding: '18px 22px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          }}
        >
          <Clock size={22} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.5 }}>
            <strong>Entrega Completa de Recursos:</strong> Tens acesso imediato a <strong>todos os ficheiros descarregáveis</strong> (modelos em Word, guias em PDF e folha de cálculo CSV) de forma permanente, <strong>sem consumir nenhuma das tuas sessões</strong>.
            Para as ferramentas interativas na web (Editor de CV, Simulador STAR e Otimizador LinkedIn), cada produto inclui <strong>3 sessões de trabalho de 24 horas</strong>.
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECÇÃO 1: FERRAMENTAS INTERATIVAS NA WEB                          */}
        {/* ================================================================= */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
              Ferramentas Interativas Web
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              3 sessões de 24h por produto
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
            {/* Card 1: Kit Principal (Editor de CV) */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: requestedProduct === 'kit' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: '#EFF6FF',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileText size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      backgroundColor: kitEnt ? '#DCFCE7' : '#F3F4F6',
                      color: kitEnt ? '#15803D' : '#6B7280',
                    }}
                  >
                    {kitEnt ? 'Adquirido (14,99 €)' : 'Não adquirido'}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  Editor Guiado de Currículo
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                  Preenche passo a passo, gera sugestões honestas em português e exporta um PDF A4 limpo, sem marcas promocionais.
                </p>

                {kitEnt && (
                  <div
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '13px',
                      marginBottom: '20px',
                    }}
                  >
                    {kitEnt.activeWindow ? (
                      <div style={{ color: '#15803D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={16} />
                        <span>
                          Sessão ativa até {new Date(kitEnt.activeWindow.expiresAtMs).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} ({new Date(kitEnt.activeWindow.expiresAtMs).toLocaleDateString('pt-PT')}).
                        </span>
                      </div>
                    ) : kitEnt.remainingActivations && kitEnt.remainingActivations > 0 ? (
                      <div style={{ color: 'var(--color-text-secondary)' }}>
                        Tens <strong>{kitEnt.remainingActivations}</strong> de {kitEnt.maxActivations} sessões de 24h por iniciar.
                      </div>
                    ) : (
                      <div style={{ color: '#DC2626', fontWeight: 600 }}>
                        Sessões de edição esgotadas (3 de 3). Podes consultar e descarregar os teus ficheiros abaixo.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                {kitEnt ? (
                  kitEnt.activeWindow ? (
                    <Link href="/meu-kit/cv" className="btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
                      Continuar a editar CV
                      <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </Link>
                  ) : kitEnt.remainingActivations && kitEnt.remainingActivations > 0 ? (
                    <button onClick={() => setConfirmModalKey('kit')} className="btn-primary" style={{ width: '100%' }}>
                      Começar sessão de trabalho
                      <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </button>
                  ) : (
                    <Link href="/meu-kit/cv" className="btn-secondary" style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}>
                      Ver trabalho guardado
                    </Link>
                  )
                ) : (
                  <a
                    href="https://okandapay.com/checkout/kit-emprego-dos-sonhos-mtz4h7e8?pid=c38e6af8-098c-48c6-b1c5-a680c5ee4a6b"
                    className="btn-secondary"
                    style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                  >
                    Adquirir Kit (14,99 €)
                  </a>
                )}
              </div>
            </div>

            {/* Card 2: Bump Entrevista */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: requestedProduct === 'entrevista' ? '2px solid #7E22CE' : '1px solid var(--color-border)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: '#F3E8FF',
                      color: '#7E22CE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <MessageSquare size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      backgroundColor: entrevistaEnt ? '#DCFCE7' : '#F3F4F6',
                      color: entrevistaEnt ? '#15803D' : '#6B7280',
                    }}
                  >
                    {entrevistaEnt ? 'Adquirido (4,99 €)' : 'Acelerador opcional'}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  Entrevista dos Sonhos
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                  Preparador interativo de perguntas difíceis, método STAR e guiões adaptados ao mercado de trabalho em Portugal.
                </p>

                {entrevistaEnt && (
                  <div
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '13px',
                      marginBottom: '20px',
                    }}
                  >
                    {entrevistaEnt.activeWindow ? (
                      <div style={{ color: '#15803D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={16} />
                        <span>Sessão ativa até {new Date(entrevistaEnt.activeWindow.expiresAtMs).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}.</span>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--color-text-secondary)' }}>
                        Tens <strong>{entrevistaEnt.remainingActivations ?? 3}</strong> sessões de 24h disponíveis.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                {entrevistaEnt ? (
                  entrevistaEnt.activeWindow ? (
                    <Link href="/meu-kit/entrevista" className="btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
                      Abrir Simulador
                      <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </Link>
                  ) : (
                    <button onClick={() => setConfirmModalKey('entrevista')} className="btn-primary" style={{ width: '100%' }}>
                      Começar sessão de trabalho
                      <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </button>
                  )
                ) : (
                  <a
                    href="https://okandapay.com/checkout/entrevista-dos-sonhos-mtz4l2oz?pid=cc9702e6-9a30-4def-b93c-c2c847b49fd1"
                    className="btn-secondary"
                    style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                  >
                    Adicionar por + 4,99 €
                  </a>
                )}
              </div>
            </div>

            {/* Card 3: Bump LinkedIn */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: requestedProduct === 'linkedin' ? '2px solid #0284C7' : '1px solid var(--color-border)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: '#E0F2FE',
                      color: '#0284C7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Share2 size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      backgroundColor: linkedinEnt ? '#DCFCE7' : '#F3F4F6',
                      color: linkedinEnt ? '#15803D' : '#6B7280',
                    }}
                  >
                    {linkedinEnt ? 'Adquirido (5,99 €)' : 'Acelerador opcional'}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                  LinkedIn dos Sonhos
                </h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                  Construtor de título profissional de alto impacto, secção Sobre e mensagens de contacto direto com recrutadores.
                </p>

                {linkedinEnt && (
                  <div
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      fontSize: '13px',
                      marginBottom: '20px',
                    }}
                  >
                    {linkedinEnt.activeWindow ? (
                      <div style={{ color: '#15803D', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={16} />
                        <span>Sessão ativa até {new Date(linkedinEnt.activeWindow.expiresAtMs).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}.</span>
                      </div>
                    ) : (
                      <div style={{ color: 'var(--color-text-secondary)' }}>
                        Tens <strong>{linkedinEnt.remainingActivations ?? 3}</strong> sessões de 24h disponíveis.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                {linkedinEnt ? (
                  linkedinEnt.activeWindow ? (
                    <Link href="/meu-kit/linkedin" className="btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
                      Abrir Construtor
                      <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </Link>
                  ) : (
                    <button onClick={() => setConfirmModalKey('linkedin')} className="btn-primary" style={{ width: '100%' }}>
                      Começar sessão de trabalho
                      <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                    </button>
                  )
                ) : (
                  <a
                    href="https://okandapay.com/checkout/linkedin-dos-sonhos-mtz4o9ju?pid=c54e5df7-c9a2-4166-9b37-485924130383"
                    className="btn-secondary"
                    style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                  >
                    Adicionar por + 5,99 €
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECÇÃO 2: MATERIAIS E MODELOS PARA DOWNLOAD (ENTREGA COMPLETA)     */}
        {/* ================================================================= */}
        <div
          id="downloads"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '28px',
            marginBottom: '32px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={22} color="var(--color-accent)" />
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                  Materiais e Modelos do Kit para Download
                </h2>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                Todos os 14 ficheiros apresentados na oferta para editar no Word ou consultar em PDF. Download permanente e ilimitado.
              </p>
            </div>

            {/* Banner de Download do ZIP Completo */}
            {kitZip && (
              <a
                href={kitZip.downloadUrl}
                download
                className="btn-primary"
                style={{
                  height: '46px',
                  padding: '0 20px',
                  fontSize: '14px',
                  fontWeight: 700,
                  gap: '8px',
                  textDecoration: 'none',
                }}
              >
                <Download size={18} />
                Descarregar Pacote Completo (ZIP)
              </a>
            )}
          </div>

          {/* Filtros de Categoria */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            {[
              { id: 'todos', label: 'Todos os Recursos' },
              { id: 'cv', label: 'Modelos de CV (Word)' },
              { id: 'guias', label: 'Guias e Plano' },
              { id: 'comunicacao', label: 'Cartas e Mensagens' },
              { id: 'ferramentas', label: 'Ferramentas e CSV' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  border: 'none',
                  background: activeCategory === cat.id ? 'var(--color-accent)' : 'var(--color-surface)',
                  color: activeCategory === cat.id ? '#FFFFFF' : 'var(--color-text)',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grelha de Ficheiros Oficiais */}
          {filteredResources.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px 0' }}>
              Nenhum recurso disponível nesta categoria para os produtos adquiridos.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
              {filteredResources.map((res) => {
                const isDocx = res.filename.endsWith('.docx');
                const isPdf = res.filename.endsWith('.pdf');
                const isCsv = res.filename.endsWith('.csv');

                const formatLabel = isDocx ? 'WORD' : isPdf ? 'PDF' : isCsv ? 'CSV' : 'ARQUIVO';
                const formatColor = isDocx ? '#0057D9' : isPdf ? '#DC2626' : isCsv ? '#15803D' : '#4B5563';
                const formatBg = isDocx ? '#EFF6FF' : isPdf ? '#FEF2F2' : isCsv ? '#DCFCE7' : '#F3F4F6';

                return (
                  <div
                    key={res.id}
                    style={{
                      border: '1px solid var(--color-border)',
                      borderRadius: '12px',
                      padding: '16px',
                      backgroundColor: 'var(--color-surface)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: formatBg,
                            color: formatColor,
                            letterSpacing: '0.04em',
                          }}
                        >
                          {formatLabel}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                          {res.filename}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text)', margin: '0 0 4px 0' }}>
                        {res.name}
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                        {res.description}
                      </p>
                    </div>

                    <a
                      href={res.downloadUrl}
                      download
                      className="btn-secondary"
                      style={{
                        height: '38px',
                        padding: '0 14px',
                        fontSize: '13px',
                        fontWeight: 600,
                        gap: '6px',
                        textDecoration: 'none',
                        justifyContent: 'center',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <Download size={15} />
                      Descarregar Ficheiro
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* SECÇÃO 3: FICHEIROS GERADOS PELO UTILIZADOR NO EDITOR DE CV       */}
        {/* ================================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>
                Os Teus PDFs Gerados no Editor
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                Documentos A4 criados e exportados através da ferramenta online.
              </p>
            </div>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Acesso permanente
            </span>
          </div>

          {savedFiles.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', padding: '16px 0', textAlign: 'center' }}>
              Ainda não tens ficheiros PDF exportados do editor. Quando preencheres o teu currículo em "Editor Guiado de Currículo" e clicares em "Exportar PDF", os teus ficheiros finais ficarão registados aqui.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {savedFiles.map((file) => (
                <div
                  key={file.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FileText size={20} style={{ color: 'var(--color-accent)' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)' }}>{file.filename}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        Gerado em {new Date(file.createdAtMs).toLocaleString('pt-PT')}
                      </div>
                    </div>
                  </div>

                  <a
                    href={`/api/me/files/${file.id}`}
                    download
                    className="btn-secondary"
                    style={{ height: '36px', padding: '0 14px', fontSize: '13px', gap: '6px', textDecoration: 'none' }}
                  >
                    <Download size={14} />
                    Descarregar
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Confirmação de Ativação */}
        {confirmModalKey && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '16px',
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                maxWidth: '460px',
                width: '100%',
                padding: '28px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <Clock size={24} style={{ color: 'var(--color-accent)' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
                  Começar sessão de trabalho?
                </h3>
              </div>

              <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '20px' }}>
                Esta ação utiliza <strong>1 dos teus acessos disponíveis</strong> e mantém a ferramenta interativa ativa durante <strong>24 horas consecutivas</strong>.
                Durante este período podes sair, voltar e recarregar a página sem consumir novos acessos.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  disabled={isActivating !== null}
                  onClick={() => setConfirmModalKey(null)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  disabled={isActivating !== null}
                  onClick={() => handleStartSession(confirmModalKey)}
                  className="btn-primary"
                >
                  {isActivating ? 'A iniciar...' : 'Começar sessão — utilizar 1 acesso'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
