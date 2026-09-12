'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  HelpCircle,
  ShieldAlert,
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

export function MeuKitClient() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; subject: string } | null>(null);
  const [entitlements, setEntitlements] = useState<EntitlementItem[]>([]);
  const [savedFiles, setSavedFiles] = useState<SavedFileItem[]>([]);
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
      // Redireciona para a respetiva ferramenta
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
        <p style={{ color: 'var(--color-text-secondary)' }}>A carregar a tua área de trabalho...</p>
      </div>
    );
  }

  const kitEnt = getEntitlement('kit');
  const entrevistaEnt = getEntitlement('entrevista');
  const linkedinEnt = getEntitlement('linkedin');

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '85vh', padding: '40px 16px' }}>
      <div className="container-wide" style={{ maxWidth: '980px', margin: '0 auto' }}>
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
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Painel de Produtos & Ferramentas
            </span>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text)', marginTop: '4px' }}>
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

        {/* Informação sobre limites */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
          }}
        >
          <Clock size={22} style={{ color: 'var(--color-accent)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.5 }}>
            <strong>Regra de utilização das ferramentas:</strong> Cada produto inclui <strong>3 sessões de trabalho de 24 horas</strong>.
            Uma vez iniciada uma sessão, podes sair, voltar e recarregar a página as vezes que quiseres sem gastar novos acessos.
            Mesmo quando as sessões de edição terminarem, continuas a poder consultar e descarregar todos os teus ficheiros já criados.
          </div>
        </div>

        {/* Grelha de Produtos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {/* Card 1: Kit Principal (Editor de CV) */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
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

              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                Editor Guiado de Currículo
              </h2>
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
                  <Link
                    href="/meu-kit/cv"
                    className="btn-primary"
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
                    Continuar a editar CV
                    <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                  </Link>
                ) : kitEnt.remainingActivations && kitEnt.remainingActivations > 0 ? (
                  <button
                    onClick={() => setConfirmModalKey('kit')}
                    className="btn-primary"
                    style={{ width: '100%' }}
                  >
                    Começar sessão de trabalho
                    <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                  </button>
                ) : (
                  <Link
                    href="/meu-kit/cv"
                    className="btn-secondary"
                    style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                  >
                    Ver trabalho guardado
                  </Link>
                )
              ) : (
                <Link
                  href="/kit"
                  className="btn-secondary"
                  style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}
                >
                  Adquirir Kit (14,99 €)
                </Link>
              )}
            </div>
          </div>

          {/* Card 2: Bump Entrevista */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
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

              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                Entrevista dos Sonhos
              </h2>
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
                <Link href="/kit#oferta" className="btn-secondary" style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}>
                  Adicionar por + 4,99 €
                </Link>
              )}
            </div>
          </div>

          {/* Card 3: Bump LinkedIn */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
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

              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '8px' }}>
                LinkedIn dos Sonhos
              </h2>
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
                <Link href="/kit#oferta" className="btn-secondary" style={{ width: '100%', textDecoration: 'none', justifyContent: 'center' }}>
                  Adicionar por + 5,99 €
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Ficheiros Guardados / Recuperação */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: '14px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
              Ficheiros e Documentos Gerados
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Acesso permanente aos ficheiros criados
            </span>
          </div>

          {savedFiles.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', padding: '20px 0', textAlign: 'center' }}>
              Ainda não tens ficheiros PDF gerados. Quando concluíres o preenchimento do teu CV e clicares em "Exportar PDF", o documento ficará guardado aqui para descarregares sempre que precisares.
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
                Esta ação utiliza <strong>1 dos teus acessos disponíveis</strong> e mantém a ferramenta ativa durante <strong>24 horas consecutivas</strong>.
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
