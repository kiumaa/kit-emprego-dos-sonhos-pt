'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  AlertCircle,
  Key,
  CreditCard,
  UserCheck,
  FileCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import gatesConfig from '@content/../config/release-gates.json';
import offerConfig from '@content/../config/offer.json';

interface ReleaseGateItem {
  id: string;
  label: string;
  mandatory: boolean;
  status: string;
  evidence: string | null;
}

interface AuditOrder {
  id: string;
  email: string;
  totalEur: string;
  status: 'paid' | 'pending' | 'refunded' | 'failed';
  entitlements: string[];
  createdAt: string;
  reference: string;
  mode: 'demo' | 'live';
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'gates' | 'commerce' | 'access' | 'audit'>('gates');
  const [gates, setGates] = useState<ReleaseGateItem[]>(gatesConfig.gates as ReleaseGateItem[]);
  const [searchEmail, setSearchEmail] = useState('');
  const [manualGrantEmail, setManualGrantEmail] = useState('');
  const [manualEntitlement, setManualEntitlement] = useState<'kit' | 'entrevista' | 'linkedin'>('kit');
  const [grantSuccess, setGrantSuccess] = useState<string | null>(null);

  // Exemplo de encomendas auditáveis
  const [mockOrders, setMockOrders] = useState<AuditOrder[]>([
    {
      id: 'ord-keds-demo-001',
      email: 'cliente.teste@exemplo.pt',
      totalEur: '14,90 €',
      status: 'paid',
      entitlements: ['kit'],
      createdAt: '2026-09-12 01:15',
      reference: 'DEMO-OK-01',
      mode: 'demo',
    },
    {
      id: 'ord-keds-demo-002',
      email: 'utilizador.completo@exemplo.pt',
      totalEur: '25,70 €',
      status: 'paid',
      entitlements: ['kit', 'entrevista', 'linkedin'],
      createdAt: '2026-09-12 02:05',
      reference: 'DEMO-OK-02',
      mode: 'demo',
    },
    {
      id: 'ord-keds-demo-003',
      email: 'pendente.mbway@exemplo.pt',
      totalEur: '14,90 €',
      status: 'pending',
      entitlements: [],
      createdAt: '2026-09-12 02:30',
      reference: 'DEMO-OK-03',
      mode: 'demo',
    },
  ]);

  const toggleGateStatus = (id: string) => {
    setGates((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const nextStatus = g.status === 'pending' ? 'verified' : g.status === 'verified' ? 'failed' : 'pending';
        return {
          ...g,
          status: nextStatus,
          evidence: nextStatus === 'verified' ? `Verificado manualmente pelo operador em ${new Date().toLocaleDateString('pt-PT')}` : null,
        };
      })
    );
  };

  const handleManualGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualGrantEmail.includes('@')) return;

    setMockOrders((prev) => [
      {
        id: `audit-manual-${Date.now()}`,
        email: manualGrantEmail,
        totalEur: '0,00 € (Apoio)',
        status: 'paid',
        entitlements: [manualEntitlement],
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reference: `MANUAL-AUDIT-${manualEntitlement.toUpperCase()}`,
        mode: 'demo',
      },
      ...prev,
    ]);

    setGrantSuccess(`Direito [${manualEntitlement}] atribuído com registo de auditoria a ${manualGrantEmail}`);
    setManualGrantEmail('');
    setTimeout(() => setGrantSuccess(null), 4000);
  };

  const filteredOrders = mockOrders.filter(
    (o) => searchEmail.trim() === '' || o.email.toLowerCase().includes(searchEmail.toLowerCase()) || o.id.includes(searchEmail)
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, backgroundColor: 'var(--color-surface)', padding: 'var(--space-8) var(--space-4)' }}>
        <div style={{ maxWidth: '1080px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-accent)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase' }}>
                Painel do Operador
              </span>
              <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-1)' }}>
                Administração & Governação
              </h1>
              <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
                Inspeção de barreiras de lançamento, estado da integração OKANDA e processos auditados de suporte.
              </p>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: '#EDF3FF',
                color: 'var(--color-accent)',
                fontSize: 'var(--type-small)',
                fontWeight: 'var(--weight-semibold)',
                border: '1px solid #D0E1FD',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />
              Ambiente: Pré-visualização / Demonstração Segura
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)', overflowX: 'auto' }}>
            {[
              { id: 'gates', label: 'Barreiras de Lançamento (Release Gates)' },
              { id: 'commerce', label: 'Integração OKANDA' },
              { id: 'access', label: 'Gestão de Acessos & Apoio' },
              { id: 'audit', label: 'Registo de Auditoria' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-control)',
                  border: 'none',
                  backgroundColor: activeTab === tab.id ? 'var(--color-surface-raised)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-accent)' : 'var(--color-text)',
                  fontSize: 'var(--type-small)',
                  fontWeight: activeTab === tab.id ? 'var(--weight-semibold)' : 'var(--weight-regular)',
                  cursor: 'pointer',
                  boxShadow: activeTab === tab.id ? 'var(--shadow-card)' : 'none',
                  transition: 'all 160ms ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: GATES */}
          {activeTab === 'gates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-card)', padding: 'var(--space-6)', border: '1px solid var(--color-border)' }}>
                <h2 style={{ fontSize: 'var(--type-h3)', marginBottom: 'var(--space-2)' }}>
                  Critérios de Aprovação para Publicação Oficial
                </h2>
                <p className="secondary" style={{ fontSize: 'var(--type-small)', marginBottom: 'var(--space-4)' }}>
                  De acordo com <code>config/release-gates.json</code>, todos os critérios obrigatórios têm de estar no estado <strong>verified</strong> com evidência antes de ativar campanhas ou transações reais. Clica num critério para simular auditoria.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {gates.map((g) => {
                    const statusColor =
                      g.status === 'verified'
                        ? 'var(--color-success)'
                        : g.status === 'failed'
                        ? 'var(--color-error)'
                        : 'var(--color-text-secondary)';

                    return (
                      <div
                        key={g.id}
                        onClick={() => toggleGateStatus(g.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: 'var(--space-4)',
                          borderRadius: 'var(--radius-control)',
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          cursor: 'pointer',
                          gap: 'var(--space-4)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          {g.status === 'verified' && <CheckCircle2 size={20} color="var(--color-success)" />}
                          {g.status === 'failed' && <XCircle size={20} color="var(--color-error)" />}
                          {g.status === 'pending' && <Clock size={20} color="var(--color-text-secondary)" />}

                          <div>
                            <strong style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>
                              {g.label}
                            </strong>
                            {g.mandatory && (
                              <span style={{ marginLeft: 'var(--space-2)', fontSize: '11px', padding: '2px 6px', backgroundColor: '#FEECEC', color: 'var(--color-error)', borderRadius: 'var(--radius-pill)', fontWeight: 'var(--weight-bold)' }}>
                                OBRIGATÓRIO
                              </span>
                            )}
                            {g.evidence && (
                              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                                Evidência: {g.evidence}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 'var(--weight-bold)',
                            color: statusColor,
                            textTransform: 'uppercase',
                            flexShrink: 0,
                          }}
                        >
                          {g.status === 'verified' ? 'Aprovado' : g.status === 'failed' ? 'Recusado' : 'Pendente'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OKANDA COMMERCE */}
          {activeTab === 'commerce' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderRadius: 'var(--radius-card)',
                  padding: 'var(--space-6)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <CreditCard size={24} color="var(--color-accent)" />
                  <h2 style={{ fontSize: 'var(--type-h3)' }}>Estado do Checkout & Adaptador OKANDA</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Modo de Operação</span>
                    <h3 style={{ fontSize: 'var(--type-body)', marginTop: '4px' }}>Modo Demonstração (Preview Seguro)</h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      Nenhuma transação real é efetuada. O fluxo de checkout simula o regresso com dados fictícios.
                    </p>
                  </div>

                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Comportamento em Produção</span>
                    <h3 style={{ fontSize: 'var(--type-body)', marginTop: '4px' }}>Falha Fechada (Fail-Closed)</h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      Em <code>APP_MODE=live</code>, o sistema recusa pedidos sem credenciais oficiais OKANDA (rejeita mocks silenciosos).
                    </p>
                  </div>

                  <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-control)', border: '1px solid var(--color-border)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Produtos & Preços Aprovados</span>
                    <h3 style={{ fontSize: 'var(--type-body)', marginTop: '4px' }}>Kit (14,90 €) + Bumps</h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                      Entrevista: 4,90 € | LinkedIn: 5,90 €. Apenas em EUR. Sem descontos inventados.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: 'var(--space-6)',
                    padding: 'var(--space-4) var(--space-5)',
                    backgroundColor: '#FFF8E1',
                    borderRadius: 'var(--radius-control)',
                    border: '1px solid #FFE082',
                    display: 'flex',
                    gap: 'var(--space-3)',
                    alignItems: 'flex-start',
                  }}
                >
                  <AlertCircle size={20} color="#F57F17" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ fontSize: 'var(--type-small)', color: '#5D4037', lineHeight: 1.5 }}>
                    <strong>Aviso de Integração Real:</strong> A OKANDA é o checkout designado. Antes da publicação, o responsável deve facultar a documentação técnica oficial, URLs de checkout definitivos e chaves de assinatura de webhook.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ACCESS & SUPPORT */}
          {activeTab === 'access' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {/* Manual Grant Box */}
              <div style={{ backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-card)', padding: 'var(--space-6)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <UserCheck size={24} color="var(--color-accent)" />
                  <h2 style={{ fontSize: 'var(--type-h3)' }}>Processo de Suporte: Concessão Auditada de Acesso</h2>
                </div>

                <p className="secondary" style={{ fontSize: 'var(--type-small)', marginBottom: 'var(--space-4)' }}>
                  Conforme a especificação, caso um cliente compre com outro email ou necessite de retificação após validação documental pela equipa de apoio, o operador pode associar o direito com registo permanente de auditoria.
                </p>

                {grantSuccess && (
                  <div style={{ padding: 'var(--space-3) var(--space-4)', backgroundColor: '#EBF6EE', color: 'var(--color-success)', borderRadius: 'var(--radius-control)', marginBottom: 'var(--space-4)', fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)' }}>
                    {grantSuccess}
                  </div>
                )}

                <form onSubmit={handleManualGrant} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '520px' }}>
                  <TextField
                    label="Email verificado do cliente"
                    type="email"
                    placeholder="cliente@exemplo.pt"
                    value={manualGrantEmail}
                    onChange={(e) => setManualGrantEmail(e.target.value)}
                    required
                  />

                  <div>
                    <label style={{ display: 'block', fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
                      Direito a atribuir:
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      {[
                        { id: 'kit', label: 'Kit Completo' },
                        { id: 'entrevista', label: 'Bump Entrevista' },
                        { id: 'linkedin', label: 'Bump LinkedIn' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setManualEntitlement(item.id as typeof manualEntitlement)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: 'var(--radius-control)',
                            border: '1px solid var(--color-border)',
                            backgroundColor: manualEntitlement === item.id ? 'var(--color-accent)' : 'var(--color-surface)',
                            color: manualEntitlement === item.id ? 'var(--color-on-accent)' : 'var(--color-text)',
                            fontSize: 'var(--type-small)',
                            fontWeight: 'var(--weight-semibold)',
                            cursor: 'pointer',
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: 'var(--space-2)' }}>
                    <Button type="submit" variant="primary">
                      Registar Concessão no Diário de Auditoria
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div style={{ backgroundColor: 'var(--color-surface-raised)', borderRadius: 'var(--radius-card)', padding: 'var(--space-6)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                  <h2 style={{ fontSize: 'var(--type-h3)' }}>Registo de Encomendas & Auditoria de Acesso</h2>
                  <div style={{ width: '280px' }}>
                    <TextField
                      label=""
                      placeholder="Pesquisar por email ou referência..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--type-small)' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>Referência / ID</th>
                        <th style={{ padding: '10px' }}>Email</th>
                        <th style={{ padding: '10px' }}>Valor</th>
                        <th style={{ padding: '10px' }}>Estado</th>
                        <th style={{ padding: '10px' }}>Direitos</th>
                        <th style={{ padding: '10px' }}>Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((o) => (
                        <tr key={o.id} style={{ borderBottom: '1px solid var(--color-surface)' }}>
                          <td style={{ padding: '12px 10px', fontFamily: 'monospace' }}>{o.reference}</td>
                          <td style={{ padding: '12px 10px' }}>{o.email}</td>
                          <td style={{ padding: '12px 10px', fontWeight: 'var(--weight-semibold)' }}>{o.totalEur}</td>
                          <td style={{ padding: '12px 10px' }}>
                            <span
                              style={{
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-pill)',
                                fontSize: '11px',
                                fontWeight: 'var(--weight-bold)',
                                backgroundColor: o.status === 'paid' ? '#EBF6EE' : '#FFF8E1',
                                color: o.status === 'paid' ? 'var(--color-success)' : '#B78103',
                              }}
                            >
                              {o.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '12px 10px' }}>
                            {o.entitlements.length > 0 ? o.entitlements.join(', ') : 'Nenhum'}
                          </td>
                          <td style={{ padding: '12px 10px', color: 'var(--color-text-secondary)' }}>{o.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
