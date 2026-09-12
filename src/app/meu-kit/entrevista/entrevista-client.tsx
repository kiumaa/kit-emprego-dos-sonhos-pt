'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface QuestionBankItem {
  id: string;
  category: string;
  question: string;
  tip: string;
  exampleSTAR: {
    situacao: string;
    tarefa: string;
    acao: string;
    resultado: string;
  };
}

const QUESTIONS: QuestionBankItem[] = [
  {
    id: 'q1',
    category: 'Comportamental',
    question: 'Conta-me sobre uma situação difícil ou de pressão que tiveste de gerir.',
    tip: 'O recrutador quer avaliar estabilidade emocional, capacidade de priorização e foco na solução.',
    exampleSTAR: {
      situacao: 'Na minha função anterior, perdemos um elemento da equipa a duas semanas da entrega de um relatório anual.',
      tarefa: 'Tive de assumir a análise de dados pendente sem deixar atrasar os fechos diários da minha carteira.',
      acao: 'Reuni com a equipa, redistribuímos tarefas prioritárias e criei uma folha de controlo diário em blocos de 2 horas.',
      resultado: 'O relatório foi entregue no prazo sem erros e o método de controlo passou a ser adotado pela chefia.',
    },
  },
  {
    id: 'q2',
    category: 'Relacionamento',
    question: 'Como lidas com um desacordo ou conflito com um colega de trabalho?',
    tip: 'Evita culpar terceiros. Mostra escuta ativa, foco no objetivo comum e comunicação madura.',
    exampleSTAR: {
      situacao: 'Houve uma divergência sobre qual o procedimento a adotar no atendimento a reclamações urgentes.',
      tarefa: 'Precisávamos de unificar a resposta ao cliente para evitar inconsistências no serviço.',
      acao: 'Convidei o colega para uma conversa direta e privada, ouvi o ponto de vista dele e comparámos os dados reais de tempo de resposta.',
      resultado: 'Criámos juntos um fluxo simples que reduziu o tempo de espera em 20% e fortalecemos a confiança da equipa.',
    },
  },
  {
    id: 'q3',
    category: 'Motivação',
    question: 'Porque queres trabalhar nesta empresa e não noutra?',
    tip: 'Liga a tua experiência e valores a projetos reais da empresa no mercado português.',
    exampleSTAR: {
      situacao: 'Acompanho o crescimento da vossa empresa no setor e a aposta na modernização dos serviços.',
      tarefa: 'Procuro um projeto com rigor e espaço para aplicar a minha experiência de organização e contacto com clientes.',
      acao: 'Pesquisei os vossos padrões de serviço e vi que a minha facilidade em resolver problemas rapidamente se enquadra na vossa dinâmica.',
      resultado: 'Posso integrar-me com autonomia imediata e contribuir para a produtividade da equipa.',
    },
  },
];

export function EntrevistaClient() {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionBankItem>(QUESTIONS[0]);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [customS, setCustomS] = useState('');
  const [customT, setCustomT] = useState('');
  const [customA, setCustomA] = useState('');
  const [customR, setCustomR] = useState('');

  useEffect(() => {
    fetch('/api/me/entitlements')
      .then((res) => {
        if (res.status === 401) router.replace('/acesso?produto=entrevista');
        return res.json();
      })
      .then((data) => {
        if (data?.ok) {
          const entrevista = data.entitlements?.find((e: any) => e.productKey === 'entrevista');
          if (!entrevista) {
            router.replace('/meu-kit');
          }
        }
      })
      .catch(() => {});
  }, [router]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

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
              Entrevista dos Sonhos — Método STAR
            </h1>
          </div>
        </div>

        {/* Intro Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '20px 24px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7E22CE', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
            <BookOpen size={18} />
            A fórmula que convence os recrutadores em Portugal
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
            O método <strong>STAR</strong> (Situação, Tarefa, Ação, Resultado) transforma respostas vagas em exemplos concretos e memoráveis.
            Pratica com as perguntas mais comuns abaixo e constrói a tua resposta à prova de falhas.
          </p>
        </div>

        {/* Layout Grelha */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Coluna Esquerda: Banco de Perguntas */}
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '12px' }}>
              Perguntas Frequentes em Portugal
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedQuestion(q)}
                  style={{
                    padding: '16px',
                    borderRadius: '10px',
                    textAlign: 'left',
                    backgroundColor: selectedQuestion.id === q.id ? '#FFFFFF' : '#FAFAFA',
                    border: selectedQuestion.id === q.id ? '2px solid #7E22CE' : '1px solid var(--color-border)',
                    boxShadow: selectedQuestion.id === q.id ? '0 4px 14px rgba(126, 34, 206, 0.1)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#7E22CE', textTransform: 'uppercase' }}>
                    {q.category}
                  </span>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text)', marginTop: '4px' }}>
                    {q.question}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Coluna Direita: Análise STAR e Resposta */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              padding: '24px',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#7E22CE', textTransform: 'uppercase' }}>
                Pergunta em Análise
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)', marginTop: '4px' }}>
                {selectedQuestion.question}
              </h3>
              <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px', fontStyle: 'italic' }}>
                💡 {selectedQuestion.tip}
              </p>
            </div>

            {/* Exemplo STAR da Pergunta */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '10px' }}>
                Exemplo Modelo Recomendado:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#FAF5FF', borderLeft: '3px solid #7E22CE' }}>
                  <strong>S (Situação):</strong> {selectedQuestion.exampleSTAR.situacao}
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#FAF5FF', borderLeft: '3px solid #7E22CE' }}>
                  <strong>T (Tarefa):</strong> {selectedQuestion.exampleSTAR.tarefa}
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#FAF5FF', borderLeft: '3px solid #7E22CE' }}>
                  <strong>A (Ação):</strong> {selectedQuestion.exampleSTAR.acao}
                </div>
                <div style={{ padding: '10px 12px', borderRadius: '8px', backgroundColor: '#FAF5FF', borderLeft: '3px solid #7E22CE' }}>
                  <strong>R (Resultado):</strong> {selectedQuestion.exampleSTAR.resultado}
                </div>
              </div>
            </div>

            {/* O teu ensaio */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)', marginBottom: '10px' }}>
                Prepara a tua própria resposta:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                <input
                  type="text"
                  placeholder="Situação: O que estava a acontecer?"
                  value={customS}
                  onChange={(e) => setCustomS(e.target.value)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
                <input
                  type="text"
                  placeholder="Tarefa: Qual era a tua responsabilidade?"
                  value={customT}
                  onChange={(e) => setCustomT(e.target.value)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
                <input
                  type="text"
                  placeholder="Ação: Que passos concretos deste para resolver?"
                  value={customA}
                  onChange={(e) => setCustomA(e.target.value)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
                <input
                  type="text"
                  placeholder="Resultado: Qual foi o desfecho positivo alcançado?"
                  value={customR}
                  onChange={(e) => setCustomR(e.target.value)}
                  style={{ height: '38px', padding: '0 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
                />
              </div>

              {(customS || customT || customA || customR) && (
                <button
                  type="button"
                  onClick={() => {
                    const fullText = `${customS} ${customT} ${customA} ${customR}`.trim();
                    handleCopy(fullText, 'custom-speech');
                  }}
                  className="btn-secondary"
                  style={{ height: '36px', padding: '0 14px', fontSize: '13px', gap: '6px' }}
                >
                  {copiedSection === 'custom-speech' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedSection === 'custom-speech' ? 'Copiado!' : 'Copiar resposta completa'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
