import path from 'path';

export interface DeliverableResource {
  id: string;
  name: string;
  filename: string;
  description: string;
  category: 'pacote' | 'cv' | 'guias' | 'comunicacao' | 'ferramentas';
  entitlement: 'kit' | 'entrevista' | 'linkedin';
  contentType: string;
  isZip?: boolean;
}

export const DELIVERABLES_CATALOG: DeliverableResource[] = [
  // --- PACOTES COMPLETOS EM ZIP ---
  {
    id: 'kit-principal-zip',
    name: 'Pacote Completo do Kit (14 Ficheiros)',
    filename: 'kit-principal-keds-portugal.zip',
    description: 'Ficheiro compactado ZIP contendo todos os modelos Word, guias PDF, cartas, mensagens e folha de cálculo.',
    category: 'pacote',
    entitlement: 'kit',
    contentType: 'application/zip',
    isZip: true,
  },
  {
    id: 'bump-entrevista-zip',
    name: 'Pacote Completo Entrevista dos Sonhos',
    filename: 'bump-entrevista-dos-sonhos.zip',
    description: 'Guia e workbook completo do método STAR e perguntas comportamentais.',
    category: 'pacote',
    entitlement: 'entrevista',
    contentType: 'application/zip',
    isZip: true,
  },
  {
    id: 'bump-linkedin-zip',
    name: 'Pacote Completo LinkedIn dos Sonhos',
    filename: 'bump-linkedin-dos-sonhos.zip',
    description: 'Guia e workbook para otimização de perfil e mensagens de prospeção em Portugal.',
    category: 'pacote',
    entitlement: 'linkedin',
    contentType: 'application/zip',
    isZip: true,
  },

  // --- MODELOS DE CV (WORD DOCX + PDF REFERÊNCIA) ---
  {
    id: 'cv-essencial-modelo-docx',
    name: 'Modelo CV Essencial (Word)',
    filename: 'cv-essencial-modelo.docx',
    description: 'Estrutura linear tradicional recomendada para máxima compatibilidade com sistemas ATS em Portugal.',
    category: 'cv',
    entitlement: 'kit',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    id: 'cv-essencial-exemplo-docx',
    name: 'CV Essencial — Exemplo Preenchido (Word)',
    filename: 'cv-essencial-exemplo-ficticio.docx',
    description: 'Exemplo prático preenchido com dados reais do mercado para inspiração e referência.',
    category: 'cv',
    entitlement: 'kit',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    id: 'cv-essencial-referencia-pdf',
    name: 'CV Essencial — Referência Visual (PDF)',
    filename: 'cv-essencial-referencia.pdf',
    description: 'Exemplo de formatação final em PDF para conferir o aspeto pretendido.',
    category: 'cv',
    entitlement: 'kit',
    contentType: 'application/pdf',
  },
  {
    id: 'cv-moderno-modelo-docx',
    name: 'Modelo CV Moderno (Word)',
    filename: 'cv-moderno-modelo.docx',
    description: 'Estrutura equilibrada com hierarquia visual elegante e espaço opcional para fotografia.',
    category: 'cv',
    entitlement: 'kit',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    id: 'cv-moderno-exemplo-docx',
    name: 'CV Moderno — Exemplo Preenchido (Word)',
    filename: 'cv-moderno-exemplo-ficticio.docx',
    description: 'Exemplo com redação cuidada e conquistas mensuráveis.',
    category: 'cv',
    entitlement: 'kit',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    id: 'cv-moderno-referencia-pdf',
    name: 'CV Moderno — Referência Visual (PDF)',
    filename: 'cv-moderno-referencia.pdf',
    description: 'Exemplo de visualização em PDF para comparação de espaçamento e tipografia.',
    category: 'cv',
    entitlement: 'kit',
    contentType: 'application/pdf',
  },

  // --- GUIAS E PLANEAMENTO (PDF) ---
  {
    id: 'guia-keds-pdf',
    name: 'Guia Emprego dos Sonhos (10 Lições)',
    filename: 'guia-keds-portugal.pdf',
    description: 'Manual de 9 páginas com 10 lições práticas para o mercado de trabalho português.',
    category: 'guias',
    entitlement: 'kit',
    contentType: 'application/pdf',
  },
  {
    id: 'plano-7-dias-pdf',
    name: 'Plano de Candidatura de 7 Dias',
    filename: 'plano-7-dias-keds.pdf',
    description: 'Roteiro diário passo a passo para organizar e enviar candidaturas de alto impacto.',
    category: 'guias',
    entitlement: 'kit',
    contentType: 'application/pdf',
  },

  // --- COMUNICAÇÃO (CARTAS E MENSAGENS) ---
  {
    id: 'cartas-apresentacao-docx',
    name: '3 Modelos de Carta de Apresentação (Word)',
    filename: 'cartas-de-apresentacao-keds.docx',
    description: 'Três estruturas editáveis: candidatura com anúncio, candidatura espontânea e transição de carreira.',
    category: 'comunicacao',
    entitlement: 'kit',
    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  },
  {
    id: 'cartas-apresentacao-pdf',
    name: '3 Modelos de Carta de Apresentação (PDF)',
    filename: 'cartas-de-apresentacao-keds.pdf',
    description: 'Exemplos completos e orientações de escrita em formato PDF.',
    category: 'comunicacao',
    entitlement: 'kit',
    contentType: 'application/pdf',
  },
  {
    id: 'mensagens-candidatura-pdf',
    name: '10 Mensagens para Recrutadores',
    filename: 'mensagens-de-candidatura-keds.pdf',
    description: 'Guiões curtos e diretos para contacto via email, LinkedIn e seguimento pós-entrevista.',
    category: 'comunicacao',
    entitlement: 'kit',
    contentType: 'application/pdf',
  },

  // --- FERRAMENTAS E APOIO ---
  {
    id: 'checklists-preparacao-pdf',
    name: 'Checklists de Preparação e Validação',
    filename: 'checklists-preparacao-keds.pdf',
    description: '15 pontos críticos para rever antes de submeter qualquer candidatura.',
    category: 'ferramentas',
    entitlement: 'kit',
    contentType: 'application/pdf',
  },
  {
    id: 'prompts-ia-pdf',
    name: '25 Prompts de IA para Candidaturas',
    filename: '25-prompts-ia-keds.pdf',
    description: 'Comandos testados para ChatGPT, Claude e Gemini para extrair palavras-chave e afinar bullets.',
    category: 'ferramentas',
    entitlement: 'kit',
    contentType: 'application/pdf',
  },
  {
    id: 'organizador-candidaturas-csv',
    name: 'Organizador de Candidaturas (Folha de Cálculo CSV)',
    filename: 'organizador-candidaturas.csv',
    description: 'Tabela formatada compatível com Excel, Google Sheets e Numbers para acompanhar envios e respostas.',
    category: 'ferramentas',
    entitlement: 'kit',
    contentType: 'text/csv',
  },

  // --- MATERIAIS DOS BUMPS ---
  {
    id: 'entrevista-guia-workbook-pdf',
    name: 'Manual & Caderno de Exercícios STAR (PDF)',
    filename: 'entrevista-dos-sonhos-guia-workbook.pdf',
    description: 'Guia prático de perguntas difíceis, método STAR e negociação salarial em Portugal.',
    category: 'guias',
    entitlement: 'entrevista',
    contentType: 'application/pdf',
  },
  {
    id: 'linkedin-guia-workbook-pdf',
    name: 'Manual & Caderno de Exercícios LinkedIn (PDF)',
    filename: 'linkedin-dos-sonhos-guia-workbook.pdf',
    description: 'Estratégia completa de perfil magnético, secção Sobre e rotina de prospeção em Portugal.',
    category: 'guias',
    entitlement: 'linkedin',
    contentType: 'application/pdf',
  },
];

export function getDeliverableById(id: string): DeliverableResource | undefined {
  return DELIVERABLES_CATALOG.find((item) => item.id === id);
}

export function getDeliverablesByEntitlement(entitlement: 'kit' | 'entrevista' | 'linkedin'): DeliverableResource[] {
  return DELIVERABLES_CATALOG.filter((item) => item.entitlement === entitlement);
}

export function getDeliverableFilePath(item: DeliverableResource): string {
  const baseDir = path.resolve(process.cwd(), 'dist/deliverables');
  if (item.isZip) {
    return path.join(baseDir, item.filename);
  }
  return path.join(baseDir, 'files', item.filename);
}
