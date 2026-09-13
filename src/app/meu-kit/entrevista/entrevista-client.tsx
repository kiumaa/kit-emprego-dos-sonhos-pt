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
  HelpCircle,
  TrendingUp,
  DollarSign,
  Download,
  AlertTriangle,
  Lightbulb,
  FileText,
} from 'lucide-react';

interface QuestionBankItem {
  id: string;
  category: 'Comportamental' | 'Liderança' | 'Competências' | 'Motivação & Condições';
  question: string;
  recruiterGoal: string;
  tip: string;
  exampleSTAR: {
    situacao: string;
    tarefa: string;
    acao: string;
    resultado: string;
  };
}

const QUESTIONS: QuestionBankItem[] = [
  // 1. Comportamentais & Pressão
  {
    id: 'q1',
    category: 'Comportamental',
    question: 'Conta-me sobre uma situação difícil ou de elevada pressão que tiveste de gerir.',
    recruiterGoal: 'Avaliar equilíbrio emocional, discernimento e capacidade de focar na resolução sem entrar em pânico.',
    tip: 'Explica o contexto rapidamente e dedica 70% do tempo à tua intervenção direta e ao método de organização.',
    exampleSTAR: {
      situacao: 'Na minha função anterior, perdemos um elemento da equipa a duas semanas do fecho de faturação trimestral.',
      tarefa: 'Assumi a reconciliação das contas pendentes sem deixar atrasar os fechos diários da minha carteira.',
      acao: 'Reuni com a coordenação, redistribuí tarefas críticas e criei uma folha de controlo diário com blocos de trabalho de 2 horas.',
      resultado: 'O fecho foi entregue 1 dia antes do prazo limite, sem faturas em atraso, e o modelo de controlo foi adotado pela equipa.',
    },
  },
  {
    id: 'q2',
    category: 'Comportamental',
    question: 'Dá um exemplo de um erro que tenhas cometido no trabalho e como lidaste com isso.',
    recruiterGoal: 'Verificar maturidade, humildade, assunção imediata de responsabilidade e capacidade de aprendizagem.',
    tip: 'Nunca digas que nunca erraste. Escolhe um erro operacional real, assume-o com clareza e foca-te na correção e na prevenção futura.',
    exampleSTAR: {
      situacao: 'Num envio massivo de propostas comerciais, esqueci-me de atualizar a data de validade num lote de 15 clientes.',
      tarefa: 'Tinha de corrigir a situação antes que gerasse ambiguidades contratuais ou reclamações.',
      acao: 'Assumi imediatamente o erro com a minha chefia, redigi uma errata transparente a cada cliente e criei um checklist de revisão pré-envio.',
      resultado: 'Todos os clientes compreenderam a correção sem atritos e o checklist passou a ser obrigatório em todos os envios da empresa.',
    },
  },
  {
    id: 'q3',
    category: 'Comportamental',
    question: 'Como geres momentos em que tens múltiplos prazos concorrentes e urgentes?',
    recruiterGoal: 'Medir competências de priorização, comunicação com stakeholders e gestão do tempo.',
    tip: 'Destaca ferramentas de organização (ex.: Matriz de Eisenhower, Trello, Excel) e como alinhas expectativas antes de rebentar prazos.',
    exampleSTAR: {
      situacao: 'Tinha 3 relatórios de auditoria para entregar na mesma semana em que fomos solicitados para uma reunião de emergência.',
      tarefa: 'Precisava de garantir a conformidade dos relatórios sem descurar o apoio à ocorrência urgente.',
      acao: 'Classifiquei as tarefas por impacto financeiro, comuniquei aos responsáveis as datas realistas de entrega e foquei-me em blocos ininterruptos.',
      resultado: 'Entreguei os dois relatórios mais críticos no prazo e o terceiro com 24 horas de desfasamento previamente acordado, sem penalizações.',
    },
  },
  {
    id: 'q4',
    category: 'Comportamental',
    question: 'O que fazes quando te é atribuída uma tarefa para a qual te falta informação?',
    recruiterGoal: 'Avaliar iniciativa autónoma versus risco de tomar decisões precipitadas sem validação.',
    tip: 'Demonstra que primeiro pesquisas e formulas perguntas estruturadas, em vez de interromper colegas repetidamente.',
    exampleSTAR: {
      situacao: 'Fui solicitado a configurar um fluxo novo no software de gestão sem ter recebido o manual de procedimentos.',
      tarefa: 'Tinha de colocar o fluxo operacional em 48 horas para não atrasar o departamento de compras.',
      acao: 'Consultei os registos de fluxos semelhantes, elaborei um rascunho com 3 dúvidas concretas e pedi uma reunião de 10 minutos com o coordenador.',
      resultado: 'Concluí a configuração no prazo e elaborei o guia passo a passo que serviu para formações futuras na equipa.',
    },
  },

  // 2. Liderança & Relacionamento
  {
    id: 'q5',
    category: 'Liderança',
    question: 'Como lidas com um desacordo ou conflito com um colega de trabalho?',
    recruiterGoal: 'Avaliar inteligência emocional, foco em objetivos corporativos e comunicação não violenta.',
    tip: 'Evita culpabilizar a outra pessoa. Mostra diálogo em privado, foco nos dados e na satisfação do cliente final.',
    exampleSTAR: {
      situacao: 'Havia divergência sobre qual o procedimento a adotar no atendimento a reclamações complexas de clientes.',
      tarefa: 'Precisávamos de unificar a resposta ao cliente para evitar inconsistências no serviço.',
      acao: 'Convidei o colega para uma conversa direta e privada, ouvi o ponto de vista dele e comparámos os tempos reais de resposta.',
      resultado: 'Criámos em conjunto um fluxo simples que reduziu o tempo de espera em 20% e reforçou a colaboração mútua.',
    },
  },
  {
    id: 'q6',
    category: 'Liderança',
    question: 'Descreve uma situação em que tiveste de motivar outros colegas para um objetivo exigente.',
    recruiterGoal: 'Testar influência positiva, espírito de equipa e liderança informal mesmo sem cargo de chefia.',
    tip: 'Explica como deste o exemplo pessoal e dividiste metas grandes em vitórias intermédias alcançáveis.',
    exampleSTAR: {
      situacao: 'A equipa estava desmotivada com a migração de base de dados que exigia conferência manual de 2.000 registos.',
      tarefa: 'Tínhamos de concluir a validação em 5 dias sem comprometer a rotina diária de atendimento.',
      acao: 'Propus dividir a meta em lotes diários de 100 registos por pessoa e criei uma tabela visual partilhada para acompanhar o progresso.',
      resultado: 'A equipa terminou a conferência meio dia antes do prazo previsto com 100% de precisão nos dados.',
    },
  },
  {
    id: 'q7',
    category: 'Liderança',
    question: 'Como geres um cliente ou parceiro comercial insatisfeito e hostil?',
    recruiterGoal: 'Medir empatia, escuta ativa, resiliência e foco na resolução prática sem reatividade defensiva.',
    tip: 'Escuta primeiro sem interromper, valida a preocupação legítima do interlocutor e propõe ações com datas vinculativas.',
    exampleSTAR: {
      situacao: 'Um cliente empresarial ligou muito irritado devido a um atraso de 48 horas numa encomenda prioritária.',
      tarefa: 'Tinha de conter a insatisfação, evitar o cancelamento do contrato anual e regularizar a entrega.',
      acao: 'Escutei com calma todas as preocupações, confirmei com o armazém a localização exata da mercadoria e garanti transporte expresso às nossas custas.',
      resultado: 'O cliente recebeu a encomenda no próprio dia e renovou o contrato de fornecimento no trimestre seguinte.',
    },
  },
  {
    id: 'q8',
    category: 'Liderança',
    question: 'Conta-me sobre um feedback crítico que recebeste e como o integraste.',
    recruiterGoal: 'Verificar se o candidato aceita críticas construtivas com maturidade ou com ressentimento.',
    tip: 'Mostra que agradeceste o feedback, pediste exemplos concretos e ajustaste a tua rotina com resultados visíveis.',
    exampleSTAR: {
      situacao: 'Na minha primeira avaliação de desempenho, a chefia indicou que os meus relatórios eram excessivamente detalhados para a administração.',
      tarefa: 'Tinha de adaptar a minha comunicação escrita para um formato executivo de tomada de decisão rápida.',
      acao: 'Pedi modelos de referência, passei a incluir um resumo executivo com 3 pontos chave no topo de cada documento e tabelas sintéticas.',
      resultado: 'Na avaliação seguinte, a clareza e rapidez de leitura dos relatórios foram apontadas como um dos meus pontos mais fortes.',
    },
  },

  // 3. Competências & Resolução de Problemas
  {
    id: 'q9',
    category: 'Competências',
    question: 'Dá um exemplo de uma melhoria de processo ou ideia tua que tenha gerado resultados.',
    recruiterGoal: 'Identificar espírito de melhoria contínua, iniciativa prática e capacidade de implementação.',
    tip: 'Mesmo pequenas melhorias contam (ex.: automatizar uma folha de cálculo, organizar arquivo, reescrever um modelo de email).',
    exampleSTAR: {
      situacao: 'O processo de emissão de declarações para clientes demorava 25 minutos por documento devido a preenchimento manual.',
      tarefa: 'Identifiquei que podíamos poupar tempo da equipa se criássemos um modelo automatizado.',
      acao: 'Desenvolvi um ficheiro em Excel com fórmulas de preenchimento automático interligado à base de dados de clientes.',
      resultado: 'O tempo de emissão baixou de 25 minutos para menos de 4 minutos por pedido, libertando cerca de 6 horas semanais.',
    },
  },
  {
    id: 'q10',
    category: 'Competências',
    question: 'Como tomas uma decisão importante quando tens recursos ou tempo muito limitados?',
    recruiterGoal: 'Avaliar sentido prático, análise de risco e capacidade de agir em vez de ficar paralisado pela dúvida.',
    tip: 'Explica os teus critérios de decisão: segurança, satisfação do cliente e impacto financeiro direto.',
    exampleSTAR: {
      situacao: 'A poucas horas de um evento com parceiros, o fornecedor de áudio cancelou por avaria técnica.',
      tarefa: 'Tínhamos de garantir equipamento substituto dentro do orçamento restante de 300 euros.',
      acao: 'Contactei imediatamente duas entidades locais parceiras, negociei o aluguer direto de um sistema alternativo e fiz o transporte pessoalmente.',
      resultado: 'O evento iniciou à hora marcada sem falhas e com custos 15% inferiores ao teto orçamentado.',
    },
  },
  {
    id: 'q11',
    category: 'Competências',
    question: 'Como aprendes e dominas uma nova ferramenta ou tecnologia exigida para o cargo?',
    recruiterGoal: 'Medir agilidade de aprendizagem, autonomia e vontade de evolução contínua.',
    tip: 'Dá um exemplo concreto de um software que aprendeste recentemente (ex.: ERP, Power BI, HubSpot, Jira).',
    exampleSTAR: {
      situacao: 'A empresa decidiu migrar toda a gestão de tarefas para o software Jira em menos de um mês.',
      tarefa: 'Como nunca tinha utilizado a ferramenta, precisava de me tornar autónomo rapidamente.',
      acao: 'Dediquei 45 minutos diários fora do horário a tutoriais oficiais, configurei um projeto de teste pessoal e tirei dúvidas com a equipa de IT.',
      resultado: 'Em duas semanas estava totalmente adaptado e ajudei a criar as diretrizes de utilização para o departamento.',
    },
  },
  {
    id: 'q12',
    category: 'Competências',
    question: 'Conta-me uma ocasião em que tiveste de convencer alguém a aceitar a tua proposta.',
    recruiterGoal: 'Testar persuasão lógica, apresentação fundamentada e respeito pela perspetiva do outro.',
    tip: 'Mostra que usaste números, dados reais e benefícios para a empresa, e não imposição de autoridade.',
    exampleSTAR: {
      situacao: 'A administração hesitava em alterar o horário de atendimento aos sábados devido a receio de perda de vendas.',
      tarefa: 'Precisava de demonstrar que o volume de clientes não justificava os custos fixos de abertura.',
      acao: 'Analisei os dados de faturação dos últimos 6 meses, montei um gráfico comparativo e apresentei uma alternativa de reforço às sextas-feiras.',
      resultado: 'A administração aprovou a mudança, poupando 400 euros mensais em energia e horas extraordinárias sem queda de vendas.',
    },
  },

  // 4. Motivação, Empresa & Negociação Salarial
  {
    id: 'q13',
    category: 'Motivação & Condições',
    question: 'Fale-me sobre si e porque está a considerar uma mudança de percurso profissional.',
    recruiterGoal: 'Avaliar síntese, clareza na narrativa de carreira e motivação intrínseca (sem falar mal do empregador anterior).',
    tip: 'Estrutura em 3 partes: de onde vens (passado), o que dominas (presente) e porque é que esta vaga faz sentido para o teu próximo passo (futuro).',
    exampleSTAR: {
      situacao: 'Desenvolvi o meu percurso em funções de apoio administrativo e operações ao longo de 4 anos em PMEs sólidas.',
      tarefa: 'Cheguei a um ponto de estabilização onde procuro projetos de maior dimensão e com equipas multidisciplinares.',
      acao: 'Tenho vindo a investir em competências de gestão de dados e ferramentas digitais para assumir maior impacto operacional.',
      resultado: 'A oportunidade na vossa empresa enquadra-se exatamente nesta direção, permitindo aplicar o meu rigor com autonomia.',
    },
  },
  {
    id: 'q14',
    category: 'Motivação & Condições',
    question: 'Porque quer trabalhar especificamente na nossa empresa e não noutra?',
    recruiterGoal: 'Verificar se o candidato fez o trabalho de casa sobre a empresa em Portugal ou se está a mandar respostas genéricas.',
    tip: 'Menciona projetos reais da empresa, cultura de serviço ou expansão recente que tenhas pesquisado no LinkedIn ou no site institucional.',
    exampleSTAR: {
      situacao: 'Acompanho o crescimento da vossa empresa no mercado português e a recente aposta na digitalização dos serviços.',
      tarefa: 'Procuro uma organização onde a eficiência e a atenção ao cliente sejam prioridades reais e mensuradas.',
      acao: 'Pesquisei a vossa abordagem de suporte e percebi que a minha experiência de resolução no primeiro contacto tem alinhamento total.',
      resultado: 'Posso integrar-me com curva de aprendizagem muito curta e acrescentar produtividade logo no primeiro mês.',
    },
  },
  {
    id: 'q15',
    category: 'Motivação & Condições',
    question: 'Qual é a sua expectativa salarial para esta função em Portugal?',
    recruiterGoal: 'Verificar se as expectativas estão alinhadas com o orçamento da vaga e avaliar maturidade na negociação de condições.',
    tip: 'Apresenta um intervalo de Salário Bruto Anual (a 14 meses) e demonstra abertura para analisar o pacote global (refeição, seguros, regime híbrido).',
    exampleSTAR: {
      situacao: 'A negociação salarial em Portugal deve sempre considerar o regime legal de 14 meses e benefícios flexíveis.',
      tarefa: 'Dar uma resposta profissional sem fixar um valor rígido que feche portas ou que me desvalorize.',
      acao: 'Referi o intervalo de mercado para a função com base na minha experiência e perguntei pela estrutura do pacote de benefícios.',
      resultado: 'Consegui alinhar expectativas de forma transparente: "Tenho como referência 22.000 EUR a 25.000 EUR brutos anuais."',
    },
  },
  {
    id: 'q16',
    category: 'Motivação & Condições',
    question: 'Onde se vê profissionalmente daqui a 2 a 3 anos?',
    recruiterGoal: 'Testar estabilidade, ambição saudável e vontade de crescer dentro da empresa sem pretensões irrealistas.',
    tip: 'Foca-te em consolidação, domínio pleno das responsabilidades e capacidade de assumir novos desafios e mentoria na organização.',
    exampleSTAR: {
      situacao: 'O meu objetivo prioritário a médio prazo é consolidar uma posição de referência técnica e de confiança.',
      tarefa: 'Quero dominar todas as especificidades do negócio da empresa no primeiro ano de integração.',
      acao: 'Pretendo aprofundar competências de liderança de projetos e contribuir para a otimização dos fluxos operacionais da área.',
      resultado: 'Vejo-me a gerir projetos com autonomia plena e a apoiar a integração de futuros novos membros na equipa.',
    },
  },
];

const STRATEGIC_QUESTIONS_FOR_INTERVIEWER = [
  {
    category: 'Objetivos & Sucesso',
    question: 'Quais são as três principais prioridades ou desafios que a pessoa que assumir esta função terá nos primeiros 90 dias?',
    why: 'Demonstra foco imediato em resultados e ajuda-te a saber exatamente como serás avaliado.',
  },
  {
    category: 'Dinâmica de Equipa',
    question: 'Como está estruturada a equipa com quem vou colaborar mais diretamente e qual o estilo de comunicação mais habitual?',
    why: 'Permite antecipar a dinâmica do dia a dia e se existe suporte ou autonomia plena.',
  },
  {
    category: 'Cultura & Oportunidades',
    question: 'O que é que os colaboradores que têm maior sucesso nesta empresa costumam ter em comum?',
    why: 'O entrevistador revela valores culturais implícitos que não aparecem nos anúncios formais.',
  },
  {
    category: 'Próximos Passos',
    question: 'Quais são os próximos passos previstos no vosso processo de recrutamento e quando poderei ter um ponto de situação?',
    why: 'Define expectativas transparentes de calendário sem parecer ansioso ou invasivo.',
  },
];

export function EntrevistaClient() {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionBankItem>(QUESTIONS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Assistente STAR personalizado
  const [customS, setCustomS] = useState('');
  const [customT, setCustomT] = useState('');
  const [customA, setCustomA] = useState('');
  const [customR, setCustomR] = useState('');

  // Calculador Salarial
  const [salaryInput, setSalaryInput] = useState('24000');
  const [mealAllowancePerDay, setMealAllowancePerDay] = useState('9.60');

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

  const filteredQuestions = activeCategory === 'Todas'
    ? QUESTIONS
    : QUESTIONS.filter((q) => q.category === activeCategory);

  // Análise em tempo real do rascunho STAR do utilizador
  const totalStarWords = `${customS} ${customT} ${customA} ${customR}`.trim().split(/\s+/).filter(Boolean).length;
  const hasFirstPerson = /(eu fiz|eu decidi|eu criei|eu liderei|eu contactei|eu organizei|eu elaborei|minha responsabilidade)/i.test(`${customA} ${customT}`);
  const hasMetrics = /\d+(%|\+|€|EUR| dias| clientes| horas)/i.test(customR);

  // Cálculo salarial a 14 meses
  const grossAnnual = parseFloat(salaryInput) || 0;
  const monthlyBase = grossAnnual > 0 ? (grossAnnual / 14).toFixed(2) : '0.00';
  const monthlyMeal = (parseFloat(mealAllowancePerDay) || 0) * 22;

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '90vh', padding: '30px 16px' }}>
      <div className="container-wide" style={{ maxWidth: '1040px', margin: '0 auto' }}>
        {/* Barra de cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/meu-kit"
              className="btn-secondary"
              style={{ height: '38px', padding: '0 12px', fontSize: '13px', gap: '6px' }}
            >
              <ArrowLeft size={16} /> Voltar ao painel
            </Link>
            <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text)' }}>
              Simulador de Entrevista STAR & Negociação
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#059669',
                backgroundColor: '#ECFDF5',
                padding: '4px 12px',
                borderRadius: '20px',
                border: '1px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle2 size={14} /> Acelerador Ativo
            </span>
          </div>
        </div>

        {/* Banner de Enquadramento */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>
            <BookOpen size={18} />
            Metodologia Oficial KEDS para Entrevistas em Portugal
          </div>
          <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.6, margin: 0 }}>
            Uma boa resposta a uma pergunta comportamental dura entre <strong>90 e 120 segundos</strong>.
            Usa a estrutura <strong>STAR</strong> para guiar a narrativa: contextualiza a Situação (15s), clarifica a Tarefa (15s), detalha a tua Ação na 1ª pessoa (60s) e quantifica o Resultado real (20s).
          </p>
        </div>

        {/* Filtros de Categoria */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {['Todas', 'Comportamental', 'Liderança', 'Competências', 'Motivação & Condições'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: activeCategory === cat ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                backgroundColor: activeCategory === cat ? '#EFF6FF' : '#FFFFFF',
                color: activeCategory === cat ? 'var(--color-accent)' : 'var(--color-text)',
                fontWeight: activeCategory === cat ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Layout Grid: Lista de Perguntas (Esquerda) + Detalhe e Construtor STAR (Direita) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          {/* Coluna 1: Banco das 16 Perguntas */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              padding: '18px',
              maxHeight: '680px',
              overflowY: 'auto',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>
              Perguntas Reais de Recrutadores ({filteredQuestions.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredQuestions.map((q, idx) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedQuestion(q)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: selectedQuestion.id === q.id ? '1.5px solid var(--color-accent)' : '1px solid #F3F4F6',
                    backgroundColor: selectedQuestion.id === q.id ? '#F0F7FF' : '#FAFAFA',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '2px' }}>
                      {q.category} #{idx + 1}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: selectedQuestion.id === q.id ? 700 : 500, color: 'var(--color-text)', lineHeight: 1.4 }}>
                      {q.question}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: selectedQuestion.id === q.id ? 'var(--color-accent)' : '#9CA3AF', flexShrink: 0, marginTop: '2px' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Coluna 2: Análise da Pergunta Selecionada & Resposta Modelo */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--color-border)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Pergunta Selecionada
              </div>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.4 }}>
                "{selectedQuestion.question}"
              </h2>
            </div>

            {/* O que o recrutador está a avaliar */}
            <div style={{ backgroundColor: '#F9FAFB', padding: '14px', borderRadius: '10px', borderLeft: '3px solid #6B7280' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <HelpCircle size={13} /> Intenção do Entrevistador
              </div>
              <p style={{ fontSize: '13px', color: '#1F2937', margin: 0, lineHeight: 1.5 }}>
                {selectedQuestion.recruiterGoal}
              </p>
            </div>

            {/* Resposta STAR de Referência */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text)' }}>
                  Resposta Modelo Estruturada (STAR)
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `[Situação]: ${selectedQuestion.exampleSTAR.situacao}\n[Tarefa]: ${selectedQuestion.exampleSTAR.tarefa}\n[Ação]: ${selectedQuestion.exampleSTAR.acao}\n[Resultado]: ${selectedQuestion.exampleSTAR.resultado}`,
                      'model'
                    )
                  }
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
                  {copiedSection === 'model' ? <Check size={14} /> : <Copy size={14} />}
                  {copiedSection === 'model' ? 'Copiado!' : 'Copiar Resposta'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0369A1' }}>[S] SITUAÇÃO: </span>
                  <span style={{ fontSize: '13px', color: '#334155' }}>{selectedQuestion.exampleSTAR.situacao}</span>
                </div>
                <div style={{ backgroundColor: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569' }}>[T] TAREFA: </span>
                  <span style={{ fontSize: '13px', color: '#334155' }}>{selectedQuestion.exampleSTAR.tarefa}</span>
                </div>
                <div style={{ backgroundColor: '#EFF6FF', padding: '10px 12px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#1D4ED8' }}>[A] AÇÃO (O teu papel): </span>
                  <span style={{ fontSize: '13px', color: '#1E3A8A' }}>{selectedQuestion.exampleSTAR.acao}</span>
                </div>
                <div style={{ backgroundColor: '#ECFDF5', padding: '10px 12px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#047857' }}>[R] RESULTADO: </span>
                  <span style={{ fontSize: '13px', color: '#065F46' }}>{selectedQuestion.exampleSTAR.resultado}</span>
                </div>
              </div>
            </div>

            {/* Dica Prática */}
            <div style={{ backgroundColor: '#FFFBEB', padding: '12px', borderRadius: '8px', border: '1px solid #FDE68A', display: 'flex', gap: '8px' }}>
              <Lightbulb size={16} style={{ color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '12px', color: '#92400E', lineHeight: 1.4 }}>
                <strong>Dica de Formulação:</strong> {selectedQuestion.tip}
              </span>
            </div>
          </div>
        </div>

        {/* Bloco 3: Assistente Interativo de Resposta STAR Própria */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '28px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text)' }}>
                Construtor do Teu Caso STAR Personalizado
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                Prepara os teus próprios exemplos reais para responderes com naturalidade sem hesitar.
              </p>
            </div>

            {/* Indicadores do Coach */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  backgroundColor: hasFirstPerson ? '#ECFDF5' : '#F3F4F6',
                  color: hasFirstPerson ? '#059669' : '#6B7280',
                }}
              >
                {hasFirstPerson ? '✓ Foco na 1ª Pessoa ("Eu")' : '⚠️ Usa "Eu fiz" em vez de "Nós"'}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  backgroundColor: hasMetrics ? '#ECFDF5' : '#F3F4F6',
                  color: hasMetrics ? '#059669' : '#6B7280',
                }}
              >
                {hasMetrics ? '✓ Métrica Detetada no Resultado' : '⚠️ Inclui um número/métrica'}
              </span>
              <span style={{ fontSize: '11px', color: '#6B7280', padding: '4px 8px' }}>
                {totalStarWords} palavras (~{Math.round((totalStarWords / 130) * 60)} seg.)
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0369A1', marginBottom: '4px' }}>
                1. Situação (O Contexto Inicial)
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Na empresa X, tínhamos um problema com o prazo de entrega das faturas..."
                value={customS}
                onChange={(e) => setCustomS(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                2. Tarefa (A Tua Responsabilidade Direta)
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Fui encarregado de desenhar um fluxo para reduzir erros sem custos adicionais..."
                value={customT}
                onChange={(e) => setCustomT(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1D4ED8', marginBottom: '4px' }}>
                3. Ação (O Que Fizeste Concretamente — 70% do foco)
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Reuni com o fornecedor, criei uma folha em Excel com validações automáticas..."
                value={customA}
                onChange={(e) => setCustomA(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#047857', marginBottom: '4px' }}>
                4. Resultado (O Desfecho Real & Aprendizagem)
              </label>
              <textarea
                rows={3}
                placeholder="Ex: Reduzi o tempo de processamento em 25% e eliminei queixas de clientes..."
                value={customR}
                onChange={(e) => setCustomR(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                const dossier = `RESPOSTA STAR PREPARADA:\n\n[SITUAÇÃO]\n${customS || '(Por preencher)'}\n\n[TAREFA]\n${customT || '(Por preencher)'}\n\n[AÇÃO]\n${customA || '(Por preencher)'}\n\n[RESULTADO]\n${customR || '(Por preencher)'}`;
                handleCopy(dossier, 'custom');
              }}
              className="btn-primary"
              style={{ height: '38px', padding: '0 16px', fontSize: '13px', gap: '6px' }}
            >
              {copiedSection === 'custom' ? <Check size={16} /> : <Copy size={16} />}
              {copiedSection === 'custom' ? 'Dossiê STAR Copiado!' : 'Copiar Dossiê STAR Formatado'}
            </button>
          </div>
        </div>

        {/* Bloco 4: Calculador e Guia Salarial em Portugal (14 Meses) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '28px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
            <DollarSign size={18} />
            Guia de Negociação Salarial em Portugal (Regime de 14 Meses)
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            Em Portugal, os valores de remuneração são negociados na base de <strong>Salário Bruto Anual a 14 meses</strong> (12 meses de trabalho + subsídio de férias + subsídio de Natal) acrescido de subsídio de alimentação.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Salário Bruto Anual Alvo (€)
                </label>
                <input
                  type="number"
                  step="500"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Subsídio de Alimentação Diário em Cartão (€/dia — isento até 10,20 €)
                </label>
                <input
                  type="number"
                  step="0.10"
                  value={mealAllowancePerDay}
                  onChange={(e) => setMealAllowancePerDay(e.target.value)}
                  style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Caixa de Conversão */}
            <div style={{ backgroundColor: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0', padding: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '8px' }}>
                Estrutura Mensal Estimada
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#374151' }}>Vencimento Base Mensal (x14):</span>
                <strong style={{ color: '#166534' }}>{monthlyBase} € / mês</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                <span style={{ color: '#374151' }}>Subsídio Refeição Líquido (~22 dias):</span>
                <strong style={{ color: '#166534' }}>+{monthlyMeal.toFixed(2)} € / mês</strong>
              </div>
              <div style={{ borderTop: '1px solid #86EFAC', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                <span style={{ fontWeight: 700, color: '#166534' }}>Valor Bruto Global Mensal:</span>
                <strong style={{ fontWeight: 800, color: '#166534' }}>{(parseFloat(monthlyBase) + monthlyMeal).toFixed(2)} €</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '10px' }}>
                * Nota: As retenções de IRS e Segurança Social (11%) incidem sobre o vencimento base. O subsídio em cartão até 10,20 € é isento.
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 5: 10 Perguntas Estratégicas para o Candidato Fazer */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--color-border)',
            padding: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', fontWeight: 700, fontSize: '14px', marginBottom: '6px' }}>
            <Sparkles size={18} />
            Perguntas Estratégicas para Fazer ao Entrevistador
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
            Quando no final da entrevista perguntam: "Tem alguma dúvida para nós?", nunca digas "Não, ficou tudo claro". Faz uma destas perguntas para demonstrar visão e interesse genuíno:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {STRATEGIC_QUESTIONS_FOR_INTERVIEWER.map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#FAFAFA',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {item.category}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.4 }}>
                    "{item.question}"
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#6B7280', fontStyle: 'italic', borderTop: '1px solid #F3F4F6', paddingTop: '6px' }}>
                  Porquê: {item.why}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
