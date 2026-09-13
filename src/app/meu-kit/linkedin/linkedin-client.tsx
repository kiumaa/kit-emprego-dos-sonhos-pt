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
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Camera,
  Layers,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

interface OutreachMessage {
  id: string;
  title: string;
  scenario: string;
  template: string;
  charCountApprox: number;
}

const OUTREACH_VAULT: OutreachMessage[] = [
  {
    id: 'msg-recruiter-1',
    title: 'Recrutador de Agência / Consultora (Hays, Michael Page, etc.)',
    scenario: 'Para contactar consultores especializados na tua área de trabalho em Portugal.',
    template: 'Olá [Nome], espero que se encontre bem. Acompanho o seu trabalho de recrutamento no setor de [Setor/Área] em Portugal. Sou profissional na área de [Função/Cargo], com experiência recente em [1 Competência Chave] e [2 Competência Chave]. Gostaria de me colocar à sua disposição para eventuais processos que acompanhe na região de [Cidade/Região]. Muito obrigado pela atenção e votos de continuação de uma excelente semana!',
    charCountApprox: 420,
  },
  {
    id: 'msg-hiring-manager-1',
    title: 'Diretor / Hiring Manager da Tua Área (Sem Vaga Aberta)',
    scenario: 'Abordagem cirúrgica e respeitosa ao responsável pelo departamento que te interessa.',
    template: 'Olá [Nome], vi com grande interesse a recente expansão da equipa da [Nome da Empresa] em Portugal. Desenvolvo projetos em [Tua Função] com foco em [Teu Principal Impacto, ex: otimização de fluxos operacionais e redução de pendências]. Sei que o seu tempo é valioso; gostava apenas de lhe deixar o meu contacto caso venham a necessitar de reforço nessa área a curto ou médio prazo. Cumprimentos e votos de sucesso!',
    charCountApprox: 440,
  },
  {
    id: 'msg-job-followup-1',
    title: 'Follow-up Após Submissão de Candidatura Formal',
    scenario: 'Para enviar ao recrutador ou hiring manager 48h a 72h após te teres candidatado.',
    template: 'Olá [Nome], submeti recentemente a minha candidatura para a oportunidade de [Nome da Função] na [Nome da Empresa]. Como tenho um percurso muito alinhado com [1 Requisito Crítico da Vaga], achei pertinente deixar-lhe uma breve saudação por aqui para confirmar que o meu dossiê foi devidamente rececionado. Estou disponível para qualquer esclarecimento complementar. Muito obrigado!',
    charCountApprox: 420,
  },
  {
    id: 'msg-coffee-1',
    title: 'Pedido de Conversa Exploratória ("Café Virtual")',
    scenario: 'Para profissionais seniores ou colegas da área com vista a colher perspetivas.',
    template: 'Olá [Nome], tenho acompanhado as suas partilhas e admiro o seu percurso em [Área de Especialização]. Estou neste momento a reorientar a minha carreira para [Nova Área/Objetivo] e teria imenso gosto em trocar 15 minutos de impressões consigo (virtualmente) sobre o panorama atual do mercado em Portugal, se a sua disponibilidade o permitir. Muito obrigado pela inspiração!',
    charCountApprox: 410,
  },
  {
    id: 'msg-alumni-1',
    title: 'Contacto com Antigo Aluno da Mesma Instituição (Alumni)',
    scenario: 'Aproveitar a ligação à mesma universidade ou instituto politécnico.',
    template: 'Olá [Nome], reparei que também estudaste na [Nome da Universidade/Instituto]! Como estou atualmente a acompanhar o crescimento da [Empresa onde ele trabalha] no setor de [Setor], gostava de manter contacto por aqui e acompanhar os teus projetos. Um abraço e continuação de bom trabalho!',
    charCountApprox: 310,
  },
  {
    id: 'msg-future-peer-1',
    title: 'Pedido de Informação a um Futuro Colega de Equipa',
    scenario: 'Saber como é o ambiente de trabalho real antes de aceitar uma proposta.',
    template: 'Olá [Nome], vi que fazes parte da equipa de [Departamento] na [Empresa]. Estou a participar num processo de seleção para [Função] e gostava muito de ter a tua perspetiva geral sobre o ambiente de trabalho e a dinâmica da equipa no dia a dia. Se tiveres 5 minutos para trocar duas palavras, seria uma excelente ajuda. Muito obrigado!',
    charCountApprox: 360,
  },
  {
    id: 'msg-feed-comment-1',
    title: 'Resposta a Publicação de Contratação no Feed',
    scenario: 'Quando um gestor publica diretamente no feed que a equipa está a contratar.',
    template: 'Olá [Nome], vi a sua partilha sobre a abertura da posição de [Cargo] na [Empresa]. O perfil enquadra-se no trabalho que tenho vindo a desenvolver em [Tua Área], nomeadamente em [Exemplo Concreto]. Enviei agora a minha candidatura formal e tomo a liberdade de lhe enviar o meu perfil por aqui. Muito obrigado pela partilha!',
    charCountApprox: 350,
  },
  {
    id: 'msg-post-interview-1',
    title: 'Agradecimento Pós-Entrevista de Emprego',
    scenario: 'Para enviar no prazo de 24 horas após a realização da entrevista.',
    template: 'Olá [Nome], gostaria de lhe agradecer a conversa que tivemos hoje sobre a oportunidade de [Função] na [Empresa]. Gostei particularmente de conhecer [Tema Concreto Discutido na Conversa]. Fiquei ainda mais motivado/a para poder contribuir para a vossa equipa. Fico a aguardar os vossos próximos passos. Melhores cumprimentos!',
    charCountApprox: 340,
  },
  {
    id: 'msg-dormant-network-1',
    title: 'Reativação de Contacto Profissional Adormecido',
    scenario: 'Para retomar diálogo com antigo colega, cliente ou parceiro de confiança.',
    template: 'Olá [Nome], espero que esteja tudo a correr bem contigo! Já lá vai algum tempo desde que colaborámos em [Contexto/Projeto]. Tenho acompanhado as tuas atualizações e vi o teu progresso na [Empresa Atual]. Da minha parte, estou atualmente a analisar novos passos profissionais na área de [Área]. Seria um gosto falar contigo e saber das novidades quando tiveres oportunidade. Um abraço!',
    charCountApprox: 420,
  },
  {
    id: 'msg-talent-pool-1',
    title: 'Manter Contacto Após Processo Sem Seleção Imediata',
    scenario: 'Quando não foste selecionado mas queres manter a porta aberta para futuras vagas.',
    template: 'Olá [Nome], agradeço a informação sobre o desfecho do processo para [Função]. Embora desta vez não tenha sido possível avançar, fiquei com uma excelente impressão da [Empresa] e do vosso profissionalismo. Gostaria muito de manter o contacto consigo para futuras oportunidades que se enquadrem no meu perfil em [Área]. Votos de sucesso para a nova contratação!',
    charCountApprox: 390,
  },
];

export function LinkedinClient() {
  const router = useRouter();
  const [role, setRole] = useState('Assistente de Operações e Apoio à Gestão');
  const [sector, setSector] = useState('Serviços Empresariais & Logística');
  const [speciality, setSpeciality] = useState('Faturação, Apoio ao Cliente e Rigor Processual');
  const [keywords, setKeywords] = useState('Primavera ERP | Excel Avançado | Resolução de Conflitos');
  const [location, setLocation] = useState('Lisboa, Portugal');
  const [activeFormula, setActiveFormula] = useState<1 | 2 | 3 | 4>(1);

  // Secção Sobre
  const [aboutHook, setAboutHook] = useState('Profissional com 4 anos de percurso dedicado à organização operacional, controlo de faturas e atendimento ao cliente em PMEs em Portugal.');
  const [aboutStory, setAboutStory] = useState('Ao longo do meu percurso, assegurei o acompanhamento diário de clientes e otimizei rotinas de arquivo digital que eliminaram discrepâncias administrativas com a contabilidade externa.');
  const [aboutTools, setAboutTools] = useState('Competências chave: Primavera ERP, Microsoft Excel (VLOOKUP, Tabelas Dinâmicas), Faturação, Atendimento Multicanal e Trabalho em Equipa.');
  const [aboutCta, setAboutCta] = useState('Estou recetivo/a a novas oportunidades de trabalho em regime presencial ou híbrido na Grande Lisboa. Contacto direto: ines.ferreira@email.pt');

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

  // As 4 fórmulas de título comprovadas
  let generatedHeadline = '';
  if (activeFormula === 1) {
    // Fórmula 1: Direta & ATS
    generatedHeadline = `${role} | ${speciality} | ${keywords} | ${location}`;
  } else if (activeFormula === 2) {
    // Fórmula 2: Proposta de Valor
    generatedHeadline = `Ajudo organizações em ${sector} a garantir ${speciality} através de ${keywords} | ${location}`;
  } else if (activeFormula === 3) {
    // Fórmula 3: Transição / Pivô
    generatedHeadline = `${role} em Transição | Foco em ${speciality} com base em ${keywords} | ${location}`;
  } else {
    // Fórmula 4: Liderança & Impacto
    generatedHeadline = `${role} • Especialista em ${speciality} com impacto comprovado em ${sector} | ${keywords}`;
  }

  const fullAboutText = `${aboutHook}\n\n${aboutStory}\n\n${aboutTools}\n\n${aboutCta}`;

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '90vh', padding: '30px 16px' }}>
      <div className="container-wide" style={{ maxWidth: '1040px', margin: '0 auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/meu-kit" className="btn-secondary" style={{ height: '38px', padding: '0 12px', fontSize: '13px', gap: '6px' }}>
              <ArrowLeft size={16} /> Voltar ao painel
            </Link>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
              Otimizador de Perfil LinkedIn dos Sonhos
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#0284C7',
                backgroundColor: '#F0F9FF',
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1px solid #BAE6FD',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={14} /> Acelerador Ativo
            </span>
          </div>
        </div>

        {/* Bloco 1: Construtor de Título com 4 Fórmulas Distintas */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '28px',
            marginBottom: '28px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284C7', fontWeight: 700, fontSize: '15px' }}>
              <Sparkles size={18} />
              Gerador de Título Profissional (Headline) com 4 Fórmulas
            </div>
            <div style={{ fontSize: '12px', color: generatedHeadline.length <= 220 ? '#059669' : '#DC2626' }}>
              {generatedHeadline.length} / 220 carateres recomendados
            </div>
          </div>

          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            O título é o elemento com maior peso no algoritmo do <strong>LinkedIn Recruiter</strong> em Portugal. Escolhe a fórmula mais alinhada com a tua estratégia:
          </p>

          {/* Seletor de Fórmulas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            {[
              { id: 1, title: 'Fórmula 1: Direta & ATS', desc: 'Cargo + Especialidade + Skills + Cidade' },
              { id: 2, title: 'Fórmula 2: Proposta de Valor', desc: 'Ajudo [Setor] a [Resultado] com [Método]' },
              { id: 3, title: 'Fórmula 3: Transição / Pivô', desc: 'Cargo Alvo + Background + Foco Novo' },
              { id: 4, title: 'Fórmula 4: Liderança & Impacto', desc: 'Função Sénior + Anos + Impacto Provado' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFormula(f.id as any)}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  border: activeFormula === f.id ? '2px solid #0284C7' : '1px solid var(--color-border)',
                  backgroundColor: activeFormula === f.id ? '#F0F9FF' : '#FAFAFA',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: activeFormula === f.id ? '#0284C7' : 'var(--color-text)' }}>
                  {f.title}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                  {f.desc}
                </div>
              </button>
            ))}
          </div>

          {/* Inputs dos Componentes */}
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
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Especialidade / Foco Prático</label>
              <input
                type="text"
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Setor / Indústria</label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Competências Chave (separadas por |)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Pré-visualização do Título */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1.5px dashed #CBD5E1',
              borderRadius: '10px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                Resultado Gerado para o Teu Perfil:
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.4 }}>
                {generatedHeadline}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(generatedHeadline, 'headline')}
              className="btn-primary"
              style={{ height: '38px', padding: '0 14px', fontSize: '13px', gap: '6px' }}
            >
              {copiedId === 'headline' ? <Check size={16} /> : <Copy size={16} />}
              {copiedId === 'headline' ? 'Copiado!' : 'Copiar Título'}
            </button>
          </div>
        </div>

        {/* Bloco 2: Construtor da Secção "Sobre" (About) em 4 Fases */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '28px',
            marginBottom: '28px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
            <Layers size={18} />
            Construtor da Secção "Sobre" (About) em 4 Fases
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            No telemóvel, os recrutadores apenas veem as primeiras 3 linhas da secção "Sobre" antes de clicarem em "...ver mais". Cada parágrafo tem uma função estratégica:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0369A1', marginBottom: '4px' }}>
                Fase 1: O Gancho Inicial (Quem sou & Foco)
              </label>
              <textarea
                rows={3}
                value={aboutHook}
                onChange={(e) => setAboutHook(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Fase 2: Percurso com Impacto & Realizações
              </label>
              <textarea
                rows={3}
                value={aboutStory}
                onChange={(e) => setAboutStory(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1D4ED8', marginBottom: '4px' }}>
                Fase 3: Ferramentas & Palavras-Chave de Busca
              </label>
              <textarea
                rows={3}
                value={aboutTools}
                onChange={(e) => setAboutTools(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>
                Fase 4: Próximo Passo & Contacto Direto (CTA)
              </label>
              <textarea
                rows={3}
                value={aboutCta}
                onChange={(e) => setAboutCta(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => handleCopy(fullAboutText, 'about')}
              className="btn-primary"
              style={{ height: '38px', padding: '0 16px', fontSize: '13px', gap: '6px' }}
            >
              {copiedId === 'about' ? <Check size={16} /> : <Copy size={16} />}
              {copiedId === 'about' ? 'Secção "Sobre" Copiada!' : 'Copiar Secção "Sobre" Formatada'}
            </button>
          </div>
        </div>

        {/* Bloco 3: Cofre das 10 Mensagens de Abordagem Direta */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '28px',
            marginBottom: '28px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
            <MessageCircle size={18} />
            Cofre de 10 Mensagens Prontas para Abordagem no LinkedIn
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            Modelos adaptáveis em português formal e contemporâneo de Portugal. Substitui os campos entre parênteses retos antes de enviar.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '16px' }}>
            {OUTREACH_VAULT.map((msg) => (
              <div
                key={msg.id}
                style={{
                  backgroundColor: '#FAFAFA',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 }}>
                      {msg.title}
                    </div>
                    <span style={{ fontSize: '10px', color: '#6B7280', padding: '2px 6px', backgroundColor: '#E5E7EB', borderRadius: '4px', flexShrink: 0 }}>
                      ~{msg.charCountApprox} car.
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>
                    {msg.scenario}
                  </div>
                  <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.5, backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                    {msg.template}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(msg.template, msg.id)}
                  className="btn-secondary"
                  style={{ height: '32px', width: '100%', fontSize: '12px', gap: '6px', justifyContent: 'center' }}
                >
                  {copiedId === msg.id ? <Check size={14} /> : <Copy size={14} />}
                  {copiedId === msg.id ? 'Mensagem Copiada!' : 'Copiar Modelo'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bloco 4: Auditoria Visual de Foto, Banner e Definições */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>
            <Camera size={18} />
            Checklist de Auditoria Visual & Definições do Perfil
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            O impacto visual do teu perfil determina os primeiros 3 segundos de contacto:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                1. Fotografia de Rosto
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                Enquadramento dos ombros para cima (o rosto deve ocupar 60% da imagem). Fundo neutro e iluminação frontal natural.
              </p>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                2. Imagem de Fundo (Banner)
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                Substitui o fundo azul padrão por uma imagem de alta resolução ligada ao teu setor ou com um lema profissional discreto.
              </p>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                3. URL Personalizado
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                Remove os números aleatórios do teu link público no LinkedIn. Mantém apenas <code>/in/nome-apelido</code> para incluir no CV.
              </p>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px' }}>
                4. Modo "Open to Work"
              </div>
              <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.4 }}>
                Se estiveres atualmente empregado, seleciona a opção visível <em>apenas para recrutadores</em> para evitar visibilidade na tua empresa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
