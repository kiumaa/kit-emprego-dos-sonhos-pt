# Plano de Implementação — Kit Emprego dos Sonhos (Portugal)

**Versão:** 2.0  
**Data:** 12/09/2026  
**Repositório remoto:** `https://github.com/kiumaa/kit-emprego-dos-sonhos-pt.git` (branch `main`)

---

## 1. Diagnóstico do Workspace Atual

### O que já existe e foi validado (100% nos testes de especificação):
- **Especificações e Regras:** `AGENTS.md`, `COMECAR_AQUI.md`, `PROMPT_ANTIGRAVITY.md`, `docs/00_DECISOES.md` a `docs/12_FONTES.md`.
- **Restrição mandatória:** **NÃO construir editor de CV**, nem resume builder, canvas ou formulário de composição de currículos. Modelos são ficheiros estáticos descarregáveis.
- **Tokens de Design e Estilo:** `design/tokens.json`, `design/tokens.css`, `design/DESIGN_SYSTEM.md`, `design/COMPONENTS.md`. Tipografia Manrope, superfícies `#FFFFFF` e `#F5F5F7`, destaque azul `#0057D9`.
- **Conteúdos Editoriais:** `content/quiz/quiz.json`, `content/kit/`, `content/marketing/`, `content/templates/`.
- **Contratos e Schemas:** `contracts/domain.d.ts`, `contracts/routes.json`, `contracts/internal-api.json`, `contracts/analysis-output.schema.json`.
- **Motores de Referência e QA:** `reference/quiz_engine.py`, `reference/analysis_validation.py`, `qa/check_spec.py` (23 testes automatizados aprovados).

### O que falta implementar:
1. **Fundação da Aplicação Web:** Inicialização do Next.js 15 (App Router) com TypeScript, tipografia Manrope nativa, e tokens CSS partilhados.
2. **Design System & Catálogo (`/design-system`):** Biblioteca de componentes partilhados (`Button`, `ChoiceGroup`, `ProgressStepper`, `InsightCard`, `ResultSummary`, etc.) e página interna de pré-visualização protegida.
3. **Motor do Quiz & Percurso Funcional (`/quiz` e `/resultado/[id]`):** Implementação em TypeScript fiel a `reference/quiz_engine.py`, testes unitários dos 4096 cenários, fluxo mobile-first com cálculo de faixas e prioridades de autorrelato.
4. **Páginas Comerciais & Landing:** `/`, `/kit`, `/analisar-cv`, apresentação editorial com VSL e disclaimer de autorrelato.
5. **Biblioteca & Área do Membro (`/area`):** Descarregamento de ficheiros estáticos (sem editor de CV), visualização de lições e gestor de candidaturas tabular/cards.
6. **Adaptadores de Integração:** OKANDA, Clerk, Drizzle/Postgres, Email e IA com modo `demo` explícito e falha fechada em produção quando não configurados.

---

## 2. Fases de Execução Verificáveis

### Fase 1: Fundação Técnica (E01)
- Criar `package.json` com dependências estáveis e auditadas: Next.js 15, React 19, TypeScript, Vitest (testes unitários rápidos).
- Configurar `tsconfig.json` com path aliases (`@/*`).
- Configurar estilos globais em `src/app/globals.css` importando e aplicando os tokens de `design/tokens.css` com fonte Manrope via `next/font/google`.
- Configurar layout raiz `src/app/layout.tsx` com metadados semânticos em `pt-PT` e cabeçalhos de segurança básicos.

### Fase 2: Design System e Catálogo Interno (E02)
- Construir primitivas de UI em `src/components/ui/`:
  - `Button`: Variantes `primary`, `secondary`, `ghost`, `destructive`; estados default, hover, focus, disabled, loading (preservando largura do texto).
  - `ChoiceGroup`: Seleção única acessível para o quiz, suporte para navegação por teclado (radiogroup nativo acessível).
  - `ProgressStepper`: Indicador de progresso real (ex.: "Pergunta 3 de 8"), sem promessas de empregabilidade.
  - `TextField` e `TextArea`: Labels persistentes, descrições, estados de erro acessíveis (`aria-invalid`).
  - `InsightCard`: Cartões de diagnóstico com variante semântica (positivo, a trabalhar, neutro), indicação clara de fonte (autorrelato) e evidência.
  - `ResultSummary`: Cabeçalho do relatório com faixa de diagnóstico e disclaimer legal visível.
  - `LeadCapture`: Formulário opcional para envio do plano por email, com checkbox de marketing separada e desmarcada.
  - `OfferPanel`: Apresentação comercial do Kit e bumps com dados diretos de `config/offer.json`.
  - `ResourceTile`: Miniaturas de recursos descarregáveis com indicação de formato (DOCX, PDF, CSV).
- Criar a página `/design-system` (apenas acessível em desenvolvimento ou preview protegido) demonstrando todos os componentes, estados interativos, variações mobile/desktop e uma amostra de ficha impressa A4.

### Fase 3: Motor do Quiz & Fluxo do Diagnóstico (E03)
- Portar `reference/quiz_engine.py` para TypeScript em `src/lib/quiz/quiz-engine.ts`:
  - Validação estrita das 8 perguntas obrigatórias.
  - Rejeição de respostas desconhecidas ou inválidas.
  - Cálculo de pontuação interna (0 a 18) nas 6 dimensões avaliadas (CV, adaptação, evidência, organização, mensagem, revisão).
  - Determinação das 3 prioridades por ordem crescente de pontos com desempate determinístico.
  - Diferenciação entre primeiro passo (`score < 2`) e refinamento (`score >= 2`).
  - Atribuição da faixa de preparação (`base`, `consolidar`, `afinar`).
- Criar suite de testes em TypeScript (`src/lib/quiz/__tests__/quiz-engine.test.ts`) validando:
  - Todas as 4096 combinações de respostas.
  - Isolamento do contexto (Q1 e Q2 não afetam a pontuação).
  - Rejeição de entradas incompletas ou adulteradas.
- Construir as páginas:
  - `/quiz`: Ecrã interativo passo-a-passo, mobile-first, com botão "Voltar", indicador de pergunta, opção de rever respostas.
  - `/resultado/[id]`: Apresentação honesta do relatório antes de qualquer pedido de email ou oferta comercial, seguida do convite opcional para guardar o plano e da secção editorial com VSL.

### Fases Seguintes (Roadmap KEDS)
- **Fase 4 (E04 & E05):** Páginas comerciais complementares (`/`, `/kit`) e biblioteca de ficheiros estáticos descarregáveis.
- **Fase 5 (E06):** Área privada `/area` com gestor simples de candidaturas (exportação CSV sem injeção de fórmulas) e leitor de lições.
- **Fase 6 (E07 & E08):** Analisador de CV com jobs assíncronos e adaptador de checkout OKANDA (falha fechada sem documentação real).

---

## 3. Critérios de Aceitação & Verificação Imediata
1. **Zero editor de CV:** Nenhuma interface de edição ou composição de currículo criada.
2. **Paridade Matemática:** 100% de concordância entre `quiz-engine.ts` e `reference/quiz_engine.py`.
3. **Consistência Visual:** Página `/design-system` reflete fielmente os tokens de `design/tokens.json`.
4. **Mobile First:** Ecrãs testados em viewports 360px, 390px, 768px e 1280px sem cortes nem overflow.
5. **Higiene Git:** Commits organizados, sem segredos ou dados pessoais.
