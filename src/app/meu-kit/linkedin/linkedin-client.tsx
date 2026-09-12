'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Share2,
  ArrowLeft,
  Copy,
  Check,
  Sparkles,
  Send,
  UserCheck,
  Briefcase,
} from 'lucide-react';

export function LinkedinClient() {
  const router = useRouter();
  const [role, setRole] = useState('Gestor de Contas / Atendimento');
  const [sector, setSector] = useState('Serviços & Retalho');
  const [valueProp, setValueProp] = useState('Foco em retenção de clientes e resolução ágil');
  const [keywords, setKeywords] = useState('CRM | Excel | Negociação');

  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/me/entitlements')
      .then((res) => {
        if (res.status === 401) router.replace('/acesso?produto=linkedin');
        return res.json();
      })
      .then((data) => {
        if (data?.ok) {
          const linkedin = data.entitlements?.find((e: any) => e.productKey === 'linkedin');
          if (!linkedin) {
            router.replace('/meu-kit');
          }
        }
      })
      .catch(() => {});
  }, [router]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generatedHeadline = `${role} | ${sector} • ${valueProp} | ${keywords}`;

  const messageConnectionNote = `Olá [Nome], acompanho o trabalho da [Empresa] em Portugal. Sou profissional na área de ${role} e gostaria de acompanhar as vossas partilhas e atualizações. Um abraço!`;

  const messageOpenJob = `Olá [Nome], espero que se encontre bem. Vi a oportunidade em aberto para [Nome da Função] na [Empresa]. Tenho experiência sólida em ${sector} e identifico-me muito com o vosso projeto. O meu currículo atualizado está disponível e teria muito gosto em conversar brevemente. Muito obrigado!`;

  const messageDirectHiringManager = `Olá [Nome], vi o crescimento recente da vossa equipa na [Empresa]. Tenho desenvolvido projetos com foco em ${valueProp} no setor de ${sector}. Caso faça sentido para as vossas necessidades presentes ou futuras, teria muito gosto em trocar impressões. Cumprimentos!`;

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '90vh', padding: '30px 16px' }}>
      <div className="container-wide" style={{ maxWidth: '980px', margin: '0 auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/meu-kit" className="btn-secondary" style={{ height: '38px', padding: '0 12px', fontSize: '13px', gap: '6px' }}>
              <ArrowLeft size={16} /> Voltar ao painel
            </Link>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
              LinkedIn dos Sonhos — Perfil & Abordagem
            </h1>
          </div>
        </div>

        {/* Bloco 1: Construtor de Título Profissional */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '28px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284C7', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
            <Sparkles size={18} />
            Construtor de Título de Alto Impacto (Headline)
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            O título é o elemento que mais influencia se os recrutadores clicam no teu perfil quando pesquisam em Portugal.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Função / Cargo Principal</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Setor / Especialidade</label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Proposta de Valor / Resultado</label>
              <input
                type="text"
                value={valueProp}
                onChange={(e) => setValueProp(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Palavras-chave de Pesquisa</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Resultado Gerado com Botão Copiar */}
          <div
            style={{
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: '#F0F9FF',
              border: '1px solid #BAE6FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase' }}>
                Resultado recomendado para colar no teu LinkedIn:
              </span>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#0369A1', marginTop: '4px' }}>
                {generatedHeadline}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(generatedHeadline, 'headline')}
              className="btn-primary"
              style={{ height: '38px', padding: '0 16px', fontSize: '13px', gap: '6px' }}
            >
              {copiedId === 'headline' ? <Check size={14} /> : <Copy size={14} />}
              {copiedId === 'headline' ? 'Copiado!' : 'Copiar Título'}
            </button>
          </div>
        </div>

        {/* Bloco 2: Mensagens Diretas de Abordagem */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284C7', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
            <Send size={18} />
            Modelos de Mensagem de Contacto Direto
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
            Mensagens curtas, educadas e profissionais para contactares recrutadores e responsáveis de contratação.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Mensagem 1 */}
            <div style={{ padding: '18px', borderRadius: '10px', backgroundColor: '#FAFAFA', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                  1. Pedido de Conexão com Nota Personalizada (Até 300 caracteres)
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(messageConnectionNote, 'msg-note')}
                  className="btn-secondary"
                  style={{ height: '32px', padding: '0 12px', fontSize: '12px', gap: '4px' }}
                >
                  {copiedId === 'msg-note' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedId === 'msg-note' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}>
                {messageConnectionNote}
              </p>
            </div>

            {/* Mensagem 2 */}
            <div style={{ padding: '18px', borderRadius: '10px', backgroundColor: '#FAFAFA', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                  2. Abordagem ao Recrutador após Candidatura a Vaga Ativa
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(messageOpenJob, 'msg-job')}
                  className="btn-secondary"
                  style={{ height: '32px', padding: '0 12px', fontSize: '12px', gap: '4px' }}
                >
                  {copiedId === 'msg-job' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedId === 'msg-job' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}>
                {messageOpenJob}
              </p>
            </div>

            {/* Mensagem 3 */}
            <div style={{ padding: '18px', borderRadius: '10px', backgroundColor: '#FAFAFA', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                  3. Candidatura Espontânea a Responsável de Departamento
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(messageDirectHiringManager, 'msg-direct')}
                  className="btn-secondary"
                  style={{ height: '32px', padding: '0 12px', fontSize: '12px', gap: '4px' }}
                >
                  {copiedId === 'msg-direct' ? <Check size={12} /> : <Copy size={12} />}
                  {copiedId === 'msg-direct' ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}>
                {messageDirectHiringManager}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
