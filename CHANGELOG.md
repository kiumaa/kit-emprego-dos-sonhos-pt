# Histórico
## 2.0 — 12/09/2026
- Pacote único de arranque para produtos, páginas, recursos, anúncios e VSL.
- Editor de CV e exportação personalizada removidos por decisão explícita.
- Analisador gratuito, quiz, modelos descarregáveis e gestor de candidaturas mantidos.
- Design system único, tokens reutilizáveis e critérios de consistência transversal.
- Conteúdo editorial, contratos, lógica de referência do quiz e verificações locais acrescentados.
- Documentação v1 não incorporada para evitar requisitos contraditórios.

## 3.0 — 12/09/2026 (Refatoração KEDS v3: Funil + Entrega OKANDA)
- Substituição dos requisitos de área de membros, login, DRM, acompanhamento do comprador, gestor online e checkout local por funil de conversão direto.
- Percurso unificado: Analisador de CV / Quiz → Resultado resumido com 3 prioridades e 1 ação gratuita útil → Botão âncora (#apresentacao) → VSL e Oferta na mesma página → Checkout externo OKANDA PAY.
- Proibição estrita de editor de CV mantida e reforçada.
- Auditoria P0 e P1 corrigida: parsing autêntico de PDF/DOCX (`pdf-parse`, `mammoth`), limites de 5 MiB e magic bytes; motor de IA com isolamento de prompt injection e fail-closed (`IA_NAO_CONFIGURADA`) sem dados simulados; remoção de temporizadores falsos; remoção de respostas predefinidas (`fallbackAnswers`).
- VSL interativa implementada com pré-visualização automática e muda, botão "Ativar som e ver desde o início" (reinicia no segundo 0 sem mute no mesmo gesto), controlos reais e modo honesto de preparação.
- Todos os botões de compra usam link único validado para checkout oficial na OKANDA (`okandapay.com`).
- Tipografia Satoshi implementada via Fontshare CDN em substituição da Manrope, com fallback seguro para todo o sistema visual.
- Isolamento estrito de entregáveis pagos: remoção de ficheiros pagos de `public/downloads/`; empacotamento em 3 ZIPs independentes em `dist/deliverables/` com manifesto criptográfico SHA-256 (`MANIFEST_OKANDA.json`).
- Qualidade e testes: 25/25 testes Vitest aprovados, typecheck com 0 erros e build de produção Next.js 15 compilado com sucesso.

## 3.1 — 12/09/2026 (Revisão Visual e Comercial Profunda: Estética Editorial, Mobile First e Logótipo Oficial)
- Logótipo oficial instalado em `public/images/logo.png` e componente unificado `BrandLogo`.
- Eliminação de menus tradicionais de navegação SaaS; cabeçalho com apenas o logótipo oficial e botão voltar opcional.
- Rodapé institucional mínimo com 4 links essenciais e selo de segurança OKANDA PAY.
- Tipografia mobile-first refinada em Satoshi (H1 30–36px, H2 24–28px, botões 48–52px e margens de 20px).
- Homepage reduzida ao essencial: Hero focado em duas escolhas imediatas (CV vs Quiz), fotografia humana de apoio e secção direta de escolha.
- Analisador de CV com tabs limpas e campos contextuais em disclosure opcional.
- Quiz ultra-minimalista, contínuo e rápido com opções táteis confortáveis.
- Página de resultado reestruturada: Parte A (Diagnóstico conciso com 3 prioridades e 1 ação gratuita útil) e Parte B (Ponte com scroll para VSL).
- VSL protagonista em ecrã 16:9 de largura total mobile com overlay de som.
- Oferta comercial com mockup editorial de produtos, preço 14,90 €, agrupamento em 4 pilares e nota informativa sobre bumps.
- Landing page de vendas direta em `/kit`.
- Remoção de formulário simulado em `/apoio` e neutralização pós-venda em `/obrigado`.

## 3.2 — 12/09/2026 (Refinamento Comercial, Vertical Story VSL 9:16, Quiz de 5 Perguntas e Preço 14,99 €)
- **Homepage Focada Exclusivamente no Hero**: Remoção definitiva da secção secundária inferior ("sem rodeios, ação imediata"); a primeira página concentra 100% da atenção nas duas opções de diagnóstico gratuito.
- **Logótipo com Maior Destaque**: Aumento da altura do logótipo da marca (`--brand-logo-height`: 56px em desktop, 48px em mobile).
- **Linha de Confiança Atualizada**: Texto do Hero alterado para `Gratuito · Sem compromisso · 100% Confidencial`.
- **Rodapé Simplificado**: Nome da marca atualizado para `Emprego dos Sonhos` (sem sufixo "/ Portugal").
- **Eliminação Completa de Ícones de Estrelas / IA**: Remoção de todos os ícones `Sparkles` do projeto e substituição por ícones semânticos adequados (`Layers`, `FileSearch`).
- **Leitor de Apresentação em Vídeo Vertical (Story 9:16)**: Implementação do formato vertical estilo story/reels (9:16), com barras de segmento tipo story no topo, botão de destaque pulsante `Sem som · Toca para ouvir` (reproduz desde o início com som) e barra de controlos integrada.
- **Quiz Otimizado para 5 Perguntas**: Fluxo do utilizador reduzido para 5 perguntas diretas e de alto impacto (`q1`, `q3`, `q4`, `q5`, `q7`), com preenchimento determinístico de respostas de linha de base nas dimensões secundárias ao submeter, mantendo 100% de compatibilidade com os contratos de avaliação.
- **Preço Atualizado para 14,99 €**: Atualização do valor da oferta principal para 14,99 € com a frase `pagamento único` posicionada verticalmente abaixo do preço em todos os blocos de conversão.
## 3.3 — 12/09/2026 (Correção de Margens do Cabeçalho, Ocultação Visual do Skip Link e Apresentação de Análise de CV)
- **Ocultação do Skip Link Visível**: O texto de acessibilidade `Saltar para o conteúdo principal` foi configurado com estilização dedicada em `src/app/globals.css`, ficando 100% invisível para a navegação normal e ativando-se apenas sob foco de teclado (`:focus-visible`).
- **Margens e Espaçamento do Cabeçalho**: Definição da classe `.container` no CSS e injeção de margens explícitas (`paddingInline: clamp(20px, 4vw, 36px)`) no wrapper do `Header`, eliminando o problema onde o logótipo e o botão "Novo teste" tocavam nos extremos da janela.
- **Página de Resultado Específica para Análise de CV**: A página `/resultado/[id]` agora distingue diagnósticos provenientes do CV (`source: 'cv'`) de diagnósticos do Quiz:
  - Badge dedicada: `Diagnóstico do teu Currículo`.
  - Exibição contextual da função pretendida do candidato (`Candidatura para: ...`).
  - Apresentação dos excertos concretos observados no CV do candidato em cada prioridade.
  - Ação imediata gratuita com botão direto para descarregar o modelo Word/DOCX.
  - Botão de navegação superior adaptativo (`Nova análise` apontando para `/analisar-cv`).
## 3.4 — 12/09/2026 (Destaque do Logótipo na Homepage e Quiz, Centralização e Responsividade Mobile)
- **Destaque do Logótipo na Página Inicial**:
  - Aumento expressivo da escala do logótipo no cabeçalho da homepage (altura de 88 px em desktop e 64 px em mobile, com ~194 px de largura máxima), conferindo autoridade visual imediata e captura da atenção do lead ao entrar.
  - Espaçamento vertical generoso e harmonioso (`paddingTop: clamp(26px, 4vw, 38px)` e `paddingBottom: clamp(18px, 3vw, 26px)`).
- **Logótipo Ampliado no Quiz**:
  - Substituição da altura fixa reduzida (32 px) pela classe responsiva `.brand-logo-quiz` (52 px em desktop e 44 px em mobile, com ~100–115 px de largura), proporcionando equilíbrio visual com o botão "Cancelar"/"Anterior".
- **Centralização Aperfeiçoada e Responsividade Mobile**:
  - Eliminação de gutters duplicados: remoção de preenchimentos laterais redundantes em `<main>` que comprimiam os ecrãs mobile contra o `.container-reading` e os cards internos.
  - Unificação de calhas responsivas nos seletores `.container`, `.container-reading`, `.container-wide` e `.container-form` com `padding-inline: clamp(16px, 4vw, 24px)` e `margin-inline: auto`.
  - Otimização do preenchimento interno dos cartões em ecrãs estreitos (360–390 px) em todas as rotas (`/`, `/quiz`, `/analisar-cv`, `/resultado/[id]`, `/kit`, `/apoio`, `/obrigado`, `/termos`, `/privacidade`, `/cookies`).
