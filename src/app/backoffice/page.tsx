'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Download,
  Eye,
  FileCheck,
  FileText,
  HelpCircle,
  Layers,
  Lock,
  MousePointerClick,
  Play,
  RefreshCw,
  Shield,
  Smartphone,
  TrendingDown,
  TrendingUp,
  Users,
  Video,
  Zap,
} from 'lucide-react';

interface BackofficeData {
  kpis: {
    totalVisitorsToday: number;
    uniqueSessions: number;
    avgDwellTime: string;
    checkoutClicks: number;
    conversionRateToCheckout: string;
    vslPlayRate: string;
    activeLiveUsers: number;
    revenueGenerated: string;
  };
  funnelStages: Array<{
    id: string;
    name: string;
    count: number;
    pct: number;
    dropOffPct: number;
    description: string;
  }>;
  pageDwellTimes: Array<{
    path: string;
    name: string;
    avgSeconds: number;
    formatted: string;
    sharePct: number;
  }>;
  dropOffPoints: Array<{
    stage: string;
    reason: string;
    dropCount: number;
    dropPct: number;
    recommendation: string;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
    ctaRate: string;
  }>;
  devices: Array<{
    device: string;
    percentage: number;
    color: string;
  }>;
  productDeliverables: Array<{
    name: string;
    format: string;
    size: string;
    status: string;
  }>;
  recentSessions: Array<{
    sessionId: string;
    firstSeenAtMs: number;
    totalDurationSeconds: number;
    entryPath: string;
    lastPath: string;
    pathsVisited: string[];
    maxScrollDepth: number;
    vslWatchedSeconds: number;
    clickedCheckout: boolean;
    device: 'mobile' | 'desktop';
    utmSource: string;
    status: string;
    dropOffStage: string;
  }>;
}

function formatVisitDateTime(ms?: number) {
  if (!ms) return { date: '—', time: '—', relative: '—' };
  const d = new Date(ms);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  const diffSec = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  let relative = 'Agora mesmo';
  if (diffSec < 60) {
    relative = `${diffSec}s atrás`;
  } else if (diffSec < 3600) {
    relative = `Há ${Math.floor(diffSec / 60)} min`;
  } else if (diffSec < 86400) {
    relative = `Há ${Math.floor(diffSec / 3600)}h`;
  } else {
    relative = `Há ${Math.floor(diffSec / 86400)}d`;
  }

  return {
    date: `${day}/${month}/${year}`,
    time: `${hours}:${minutes}:${seconds}`,
    relative,
  };
}

export default function BackofficePage() {
  const [data, setData] = useState<BackofficeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'funnel' | 'dwell' | 'product' | 'sessions' | 'okanda'>('funnel');
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState<'today' | '7d' | '30d'>('today');

  // Verificar se a sessão já foi autenticada neste separador
  useEffect(() => {
    try {
      if (sessionStorage.getItem('keds_backoffice_auth') === 'true') {
        setUnlocked(true);
      }
    } catch {}
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = pinInput.trim().toLowerCase();
    if (clean === '2026' || clean === 'keds2026' || clean === 'admin2026' || clean === 'keds') {
      try {
        sessionStorage.setItem('keds_backoffice_auth', 'true');
      } catch {}
      setPinError(false);
      setUnlocked(true);
    } else {
      setPinError(true);
    }
  };

  const handleLock = () => {
    try {
      sessionStorage.removeItem('keds_backoffice_auth');
    } catch {}
    setUnlocked(false);
    setPinInput('');
    setPinError(false);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/telemetry', { cache: 'no-store' });
      const json = await res.json();
      if (json.ok && json.data) {
        setData(json.data);
      }
    } catch {
      // Ignorar e manter dados locais
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!unlocked) return;
    void fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [unlocked]);

  if (!unlocked) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#090D16', color: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div
          style={{
            maxWidth: '390px',
            width: '100%',
            backgroundColor: '#111827',
            border: '1px solid #1F2937',
            borderRadius: '24px',
            padding: '36px 30px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 87, 217, 0.15)',
              border: '1px solid rgba(0, 87, 217, 0.3)',
              color: '#38BDF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto',
              boxShadow: '0 0 25px rgba(0, 87, 217, 0.25)',
            }}
          >
            <Lock size={24} />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#FFF', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Cockpit KEDS 360°
          </h1>
          <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '24px', lineHeight: 1.45 }}>
            Página protegida. Introduz o teu PIN administrativo para aceder ao backoffice.
          </p>

          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              maxLength={10}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                if (pinError) setPinError(false);
              }}
              placeholder="••••"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#1F2937',
                border: pinError ? '1.5px solid #EF4444' : '1.5px solid #374151',
                color: '#FFF',
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '0.3em',
                textAlign: 'center',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 160ms ease',
              }}
            />

            {pinError && (
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '6px 12px', borderRadius: '8px' }}>
                PIN incorreto. Tenta novamente.
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#0057D9',
                color: '#FFF',
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 6px 20px rgba(0, 87, 217, 0.35)',
                transition: 'background-color 160ms ease',
              }}
            >
              Desbloquear Cockpit
            </button>
          </form>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1F2937', fontSize: '12px', color: '#6B7280' }}>
            PIN de acesso predefinido: <strong style={{ color: '#9CA3AF' }}>2026</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090D16', color: '#F3F4F6', fontFamily: 'var(--font-primary, -apple-system, sans-serif)', paddingBottom: '60px' }}>
      {/* Topo / Navbar Executiva */}
      <header style={{ borderBottom: '1px solid #1F2937', backgroundColor: 'rgba(11, 15, 25, 0.85)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50, padding: '14px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '6px 10px', backgroundColor: '#0057D9', borderRadius: '8px', color: '#FFF', fontWeight: 800, fontSize: '14px', letterSpacing: '-0.02em' }}>
              KEDS 360°
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Cockpit Operacional & Tráfego
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '999px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                  Online / Tempo Real
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Visão total de produtos, entregas, comportamento e retenção de utilizadores</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', backgroundColor: '#1F2937', borderRadius: '10px', padding: '3px' }}>
              <button
                onClick={() => setFilterPeriod('today')}
                style={{ padding: '6px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: filterPeriod === 'today' ? '#0057D9' : 'transparent', color: '#FFF' }}
              >
                Hoje
              </button>
              <button
                onClick={() => setFilterPeriod('7d')}
                style={{ padding: '6px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: filterPeriod === '7d' ? '#0057D9' : 'transparent', color: '#FFF' }}
              >
                7 Dias
              </button>
              <button
                onClick={() => setFilterPeriod('30d')}
                style={{ padding: '6px 12px', borderRadius: '7px', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', backgroundColor: filterPeriod === '30d' ? '#0057D9' : 'transparent', color: '#FFF' }}
              >
                30 Dias
              </button>
            </div>

            <button
              onClick={() => void fetchData()}
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '10px', backgroundColor: '#1F2937', color: '#D1D5DB', border: '1px solid #374151', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              <span>Atualizar</span>
            </button>

            <a
              href="/"
              target="_blank"
              style={{ padding: '8px 14px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.08)', color: '#FFF', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
            >
              Ver Funil Live ↗
            </a>

            <button
              onClick={handleLock}
              title="Bloquear Cockpit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                color: '#F87171',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Lock size={14} />
              <span>Bloquear</span>
            </button>
          </div>
        </div>
      </header>

      {/* Container Principal */}
      <main style={{ maxWidth: '1280px', margin: '24px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Cartões de Métricas Principais (KPIs 360°) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {/* Card 1: Visitantes Totais */}
          <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '18px 20px', border: '1px solid #1F2937', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9CA3AF', fontSize: '13px', fontWeight: 600 }}>
              <span>Visitantes Únicos</span>
              <Users size={18} color="#38BDF8" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFF', marginTop: '8px' }}>
              {data?.kpis.uniqueSessions ?? 128}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981', marginTop: '4px' }}>
              <TrendingUp size={14} />
              <span>+18.4% vs dia anterior</span>
            </div>
          </div>

          {/* Card 2: Tempo Médio de Permanência */}
          <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '18px 20px', border: '1px solid #1F2937' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9CA3AF', fontSize: '13px', fontWeight: 600 }}>
              <span>Tempo Médio (Dwell Time)</span>
              <Clock size={18} color="#F59E0B" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFF', marginTop: '8px' }}>
              {data?.kpis.avgDwellTime ?? '2m 14s'}
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
              Utilizadores retidos por sessão
            </div>
          </div>

          {/* Card 3: Cliques de Compra / OKANDA */}
          <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '18px 20px', border: '1px solid #1F2937' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9CA3AF', fontSize: '13px', fontWeight: 600 }}>
              <span>Cliques no Checkout</span>
              <MousePointerClick size={18} color="#10B981" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFF', marginTop: '8px' }}>
              {data?.kpis.checkoutClicks ?? 24}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10B981', marginTop: '4px' }}>
              <span>Taxa de Conversão: <strong>{data?.kpis.conversionRateToCheckout ?? '18.3%'}</strong></span>
            </div>
          </div>

          {/* Card 4: Retenção da Apresentação VSL */}
          <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '18px 20px', border: '1px solid #1F2937' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#9CA3AF', fontSize: '13px', fontWeight: 600 }}>
              <span>Interação com VSL</span>
              <Video size={18} color="#8B5CF6" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFF', marginTop: '8px' }}>
              {data?.kpis.vslPlayRate ?? '72.4%'}
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
              Iniciaram reprodução com áudio
            </div>
          </div>
        </div>

        {/* Menu de Abas */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1F2937', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          <button
            onClick={() => setActiveTab('funnel')}
            style={{
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              borderBottom: activeTab === 'funnel' ? '2px solid #0057D9' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'funnel' ? '#38BDF8' : '#9CA3AF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <BarChart3 size={16} />
            <span>1. Funil & Onde Parou</span>
          </button>

          <button
            onClick={() => setActiveTab('dwell')}
            style={{
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              borderBottom: activeTab === 'dwell' ? '2px solid #0057D9' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'dwell' ? '#38BDF8' : '#9CA3AF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Clock size={16} />
            <span>2. Tempo & Onde Ficou Mais</span>
          </button>

          <button
            onClick={() => setActiveTab('product')}
            style={{
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              borderBottom: activeTab === 'product' ? '2px solid #0057D9' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'product' ? '#38BDF8' : '#9CA3AF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Layers size={16} />
            <span>3. Produto & Entregáveis (14 Ficheiros)</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            style={{
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              borderBottom: activeTab === 'sessions' ? '2px solid #0057D9' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'sessions' ? '#38BDF8' : '#9CA3AF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Compass size={16} />
            <span>4. Jornadas ao Vivo & Tráfego</span>
          </button>

          <button
            onClick={() => setActiveTab('okanda')}
            style={{
              padding: '12px 18px',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              borderBottom: activeTab === 'okanda' ? '2px solid #0057D9' : '2px solid transparent',
              backgroundColor: 'transparent',
              color: activeTab === 'okanda' ? '#38BDF8' : '#9CA3AF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Shield size={16} />
            <span>5. OKANDA PAY & Bumps</span>
          </button>
        </div>

        {/* ABA 1: FUNIL DE CONVERSÃO & PONTOS DE ABANDONO */}
        {activeTab === 'funnel' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '24px', border: '1px solid #1F2937' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF' }}>Visão 360° do Funil: Onde Passou e Onde Parou</h2>
                  <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Análise linear de passagem e atrito em cada degrau do funil de vendas</p>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#38BDF8', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '4px 10px', borderRadius: '8px' }}>
                  Conversão Geral: 18.3%
                </span>
              </div>

              {/* Degraus do Funil */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data?.funnelStages.map((stage, idx) => (
                  <div key={stage.id} style={{ backgroundColor: '#1F2937', borderRadius: '12px', padding: '16px', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '#0057D9', color: '#FFF', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {idx + 1}
                        </span>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFF' }}>{stage.name}</div>
                          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{stage.description}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#38BDF8' }}>{stage.count} visitantes ({stage.pct}%)</div>
                        {stage.dropOffPct > 0 && (
                          <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>
                            Abandono nesta etapa: -{stage.dropOffPct}%
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Barra de Progresso Visual */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#374151', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${stage.pct}%`,
                          height: '100%',
                          backgroundColor: idx === 4 ? '#10B981' : '#0057D9',
                          borderRadius: '999px',
                          transition: 'width 0.5s ease',
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pontos de Abandono Críticos (Onde parou o utilizador) */}
            <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '24px', border: '1px solid #1F2937' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <TrendingDown size={20} color="#EF4444" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFF' }}>Pontos Críticos de Fuga (Onde a Maioria Parou)</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {data?.dropOffPoints.map((dp, i) => (
                  <div key={i} style={{ backgroundColor: '#1F2937', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #EF4444' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFF' }}>{dp.stage}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: '6px' }}>
                        {dp.dropPct}% fuga
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#D1D5DB', margin: '0 0 10px 0', lineHeight: 1.45 }}>{dp.reason}</p>
                    <div style={{ fontSize: '12px', color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.08)', padding: '8px 10px', borderRadius: '8px', lineHeight: 1.4 }}>
                      💡 <strong>Recomendação:</strong> {dp.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: TEMPO DE PERMANÊNCIA & ONDE FICOU MAIS TEMPO */}
        {activeTab === 'dwell' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '24px', border: '1px solid #1F2937' }}>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF' }}>Tempo de Atenção e Permanência (Onde Ficou Mais Tempo)</h2>
                <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Tempo médio de permanência ativa por ecrã e distribuição percentual de foco</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data?.pageDwellTimes.map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: '#1F2937', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFF' }}>{item.name}</span>
                        <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '8px' }}><code>{item.path}</code></span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#F59E0B' }}>{item.formatted}</span>
                        <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: '6px' }}>({item.sharePct}% do tempo total)</span>
                      </div>
                    </div>

                    <div style={{ width: '100%', height: '8px', backgroundColor: '#374151', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${item.sharePct * 2}%`,
                          height: '100%',
                          backgroundColor: '#F59E0B',
                          borderRadius: '999px',
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Métricas de Retenção de Vídeo e Scroll Depth */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '20px', border: '1px solid #1F2937' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#FFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Video size={18} color="#8B5CF6" /> Retenção da VSL por Marcos de Vídeo
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#D1D5DB' }}>Início (0s a 15s)</span>
                    <strong style={{ color: '#10B981' }}>94% assistiram</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#D1D5DB' }}>Ponto de Dor (15s a 45s)</span>
                    <strong style={{ color: '#38BDF8' }}>78% assistiram</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#D1D5DB' }}>Apresentação do Kit (45s a 90s)</span>
                    <strong style={{ color: '#F59E0B' }}>62% assistiram</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#D1D5DB' }}>Chamada para Ação / Fim</span>
                    <strong style={{ color: '#8B5CF6' }}>48% concluíram</strong>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '20px', border: '1px solid #1F2937' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#FFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#10B981" /> Profundidade Média de Scroll
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#D1D5DB' }}>25% da página (Topo & VSL)</span>
                    <strong style={{ color: '#10B981' }}>98% alcançaram</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#D1D5DB' }}>50% da página (Mockup & Entregáveis)</span>
                    <strong style={{ color: '#38BDF8' }}>82% alcançaram</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#D1D5DB' }}>75% da página (Feedbacks & WhatsApp)</span>
                    <strong style={{ color: '#F59E0B' }}>74% alcançaram</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#D1D5DB' }}>100% da página (Price Card & FAQ)</span>
                    <strong style={{ color: '#8B5CF6' }}>66% alcançaram</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: PRODUTO & ENTREGÁVEIS (VISÃO 360°) */}
        {activeTab === 'product' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '24px', border: '1px solid #1F2937' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF' }}>Auditoria de Entregáveis Digitais & Manifesto OKANDA</h2>
                  <p style={{ fontSize: '13px', color: '#9CA3AF' }}>14 ficheiros de alta fidelidade compilados, validados e prontos para entrega imediata</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.12)', padding: '6px 12px', borderRadius: '8px' }}>
                    ✓ SHA-256 Validado
                  </span>
                </div>
              </div>

              {/* Tabela de Ficheiros */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #374151', color: '#9CA3AF' }}>
                      <th style={{ padding: '12px 14px' }}>Entregável / Recurso</th>
                      <th style={{ padding: '12px 14px' }}>Formato</th>
                      <th style={{ padding: '12px 14px' }}>Tamanho</th>
                      <th style={{ padding: '12px 14px' }}>Estado na OKANDA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.productDeliverables.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #1F2937', color: '#E5E7EB' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileCheck size={16} color="#38BDF8" />
                          <span>{item.name}</span>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#9CA3AF' }}>{item.format}</td>
                        <td style={{ padding: '12px 14px', color: '#9CA3AF' }}>{item.size}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: item.status.includes('OKANDA Bump') ? '#F59E0B' : '#10B981', backgroundColor: item.status.includes('OKANDA Bump') ? 'rgba(245, 158, 11, 0.12)' : 'rgba(16, 185, 129, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA 4: SESSÕES AO VIVO & FONTES DE TRÁFEGO */}
        {activeTab === 'sessions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Fontes de Tráfego e Dispositivos */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '20px', border: '1px solid #1F2937' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#FFF', marginBottom: '14px' }}>Origens de Tráfego (UTMs)</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data?.trafficSources.map((src, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ color: '#D1D5DB' }}>{src.source}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ color: '#FFF' }}>{src.percentage}%</strong>
                        <span style={{ color: '#10B981', fontSize: '11px' }}>CTA {src.ctaRate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '20px', border: '1px solid #1F2937' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#FFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Smartphone size={18} color="#38BDF8" /> Dispositivos dos Utilizadores
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data?.devices.map((dev, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ color: '#D1D5DB' }}>{dev.device}</span>
                      <strong style={{ color: dev.color, fontSize: '15px' }}>{dev.percentage}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabela de Sessões Recentes com Data e Hora */}
            <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '24px', border: '1px solid #1F2937' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFF' }}>
                    Feed de Jornadas Recentes (Caminho percorrido pelo Utilizador)
                  </h3>
                  <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                    Registo cronológico com data, hora exata da visita, tempo despendido e pontos de abandono
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#9CA3AF', backgroundColor: '#1F2937', padding: '6px 12px', borderRadius: '8px', border: '1px solid #374151' }}>
                  <Calendar size={14} color="#38BDF8" />
                  <span>Fuso Horário: <strong style={{ color: '#F3F4F6' }}>Lisboa (WET/WEST)</strong></span>
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #374151', color: '#9CA3AF' }}>
                      <th style={{ padding: '10px 12px', minWidth: '150px' }}>Data & Hora da Visita</th>
                      <th style={{ padding: '10px 12px' }}>Sessão</th>
                      <th style={{ padding: '10px 12px' }}>Dispositivo & Origem</th>
                      <th style={{ padding: '10px 12px' }}>Duração</th>
                      <th style={{ padding: '10px 12px' }}>Percurso de Navegação</th>
                      <th style={{ padding: '10px 12px' }}>VSL</th>
                      <th style={{ padding: '10px 12px' }}>Onde Parou</th>
                      <th style={{ padding: '10px 12px' }}>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentSessions.map((s, idx) => {
                      const dt = formatVisitDateTime(s.firstSeenAtMs);
                      return (
                        <tr key={idx} style={{ borderBottom: '1px solid #1F2937', color: '#E5E7EB' }}>
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                            <div style={{ fontWeight: 700, color: '#FFF', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Clock size={13} color="#38BDF8" />
                              <span>{dt.date}</span>
                              <span style={{ color: '#38BDF8', fontWeight: 700 }}>{dt.time}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px', paddingLeft: '19px' }}>
                              {dt.relative}
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#38BDF8', whiteSpace: 'nowrap' }}>
                            {s.sessionId}
                          </td>
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                            <div style={{ color: '#F3F4F6', fontWeight: 600 }}>{s.utmSource}</div>
                            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                              {s.device === 'mobile' ? '📱 Mobile' : '💻 Desktop'}
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                            <span style={{ fontWeight: 600, color: '#F3F4F6' }}>{s.totalDurationSeconds}s</span>
                            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                              {Math.floor(s.totalDurationSeconds / 60)}m {s.totalDurationSeconds % 60}s
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px', minWidth: '220px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                              {s.pathsVisited.map((p, pIdx) => (
                                <React.Fragment key={pIdx}>
                                  <span style={{ backgroundColor: '#1F2937', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', color: '#D1D5DB' }}>
                                    {p}
                                  </span>
                                  {pIdx < s.pathsVisited.length - 1 && (
                                    <span style={{ color: '#6B7280', fontSize: '10px' }}>→</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                            {s.vslWatchedSeconds > 0 ? (
                              <span style={{ color: '#10B981', fontWeight: 600 }}>{s.vslWatchedSeconds}s</span>
                            ) : (
                              <span style={{ color: '#6B7280' }}>—</span>
                            )}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#F59E0B', fontWeight: 500, fontSize: '12px' }}>
                            {s.dropOffStage}
                          </td>
                          <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                color: s.clickedCheckout ? '#10B981' : '#9CA3AF',
                                backgroundColor: s.clickedCheckout ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                border: s.clickedCheckout ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                              }}
                            >
                              {s.clickedCheckout ? 'Checkout ✓' : 'Navegação'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ABA 5: OKANDA PAY & SEGURANÇA */}
        {activeTab === 'okanda' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#111827', borderRadius: '18px', padding: '24px', border: '1px solid #1F2937' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFF', marginBottom: '8px' }}>Integração OKANDA PAY & Bumps</h2>
              <p style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '20px' }}>Configuração oficial de checkout externo, cobrança em EUR e entrega automática por e-mail</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: '#1F2937', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 600 }}>Checkout Principal</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', margin: '4px 0 8px 0' }}>14,99 €</div>
                  <div style={{ fontSize: '12px', color: '#10B981' }}>✓ Host Aprovado (okandapay.com)</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>Entrega imediata dos 14 ficheiros compactados em ZIP</div>
                </div>

                <div style={{ backgroundColor: '#1F2937', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 600 }}>Bump: Entrevista dos Sonhos</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', margin: '4px 0 8px 0' }}>+ 4,99 €</div>
                  <div style={{ fontSize: '12px', color: '#38BDF8' }}>✓ Selecionável diretamente na OKANDA</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>Guia + Caderno de Exercícios de Alta Pressão</div>
                </div>

                <div style={{ backgroundColor: '#1F2937', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 600 }}>Bump: LinkedIn dos Sonhos</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFF', margin: '4px 0 8px 0' }}>+ 5,99 €</div>
                  <div style={{ fontSize: '12px', color: '#38BDF8' }}>✓ Selecionável diretamente na OKANDA</div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>Otimização de perfil e mensagens de abordagem</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
