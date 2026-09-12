# Histórico
## 3.4 — 12/09/2026 (Remoção de Elementos Obstrutivos, Badge 'AO VIVO', Autoplay Transparente e Botão Pulse aos 1:13)
- **Remoção de Elementos Solicitados**:
  - Removido texto sobreposto no vídeo ("Prepara a tua próxima candidatura." e "Vê como usar os recursos do kit.").
  - Removido botão central preto ("▶ Ver apresentação").
  - Removida badge duplicada "Apresentação Oficial" no topo da secção.
  - Removido parágrafo "Vê a apresentação oficial de 3 minutos para descobrires a metodologia completa." em `/resultado/[id]`.
- **Badge 'AO VIVO'**: Canto superior atualizado para `● AO VIVO` com ponto pulsante vermelho dinâmico.
- **Autoplay Mudo Transparente & Reinício com Som**: O vídeo corre em autoplay sem som imediato e totalmente desimpedido; clicar em qualquer ponto do vídeo ou na faixa flutuante ("Sem som · Toca para ouvir") desativa o mute, reinicia o vídeo no segundo 0 e entra em modo completo de reprodução com controlos.
- **Botão Pulsante 'EU QUERO ADERIR!' aos 1:13**: Aos 73 segundos (1:13) de vídeo, surge abaixo do reprodutor o botão CTA em pulsação contínua ("EU QUERO ADERIR!"), com ligação direta para o checkout (ou navegação fluida para a oferta).

## 3.3 — 12/09/2026 (Integração da VSL Oficial em Vídeo e Deploy de Produção)
- **VSL Oficial Aplicada**: Ficheiro de vídeo copiado para `public/videos/vsl-keds.mp4` (12 MB, formato vertical 9:16).
- **Configuração do Funil**: `config/funnel.json` atualizado com `"src": "/videos/vsl-keds.mp4"`, ativando o reprodutor real em `/resultado/[id]` e `/kit`.
- **Experiência do Utilizador**: Reprodução com pré-visualização contínua muda em viewport, botão tátil para ativar som e reiniciar no segundo 0, barra de progresso interativa, play/pause, suporte a ecrã inteiro e modo de transição fluida.
- **Deploy em Produção**: Publicado no Vercel com sucesso em `https://kit-emprego-dos-sonhos-pt.vercel.app`, com streaming de vídeo a 100%.

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

## 3.5 — 12/09/2026 (Ajustes Finais: Contrato Coerente de 5 Perguntas, Remoção de Simulações do VSL Player e Rigor Factual)
- **Contrato Oficial de 5 Perguntas no Quiz**:
  - `content/quiz/quiz.json` atualizado para conter exatamente 5 perguntas (`q1`, `q3`, `q4`, `q5`, `q7`), com `q1` puramente contextual e 4 dimensões pontuadas (`cv`, `adaptacao`, `evidencia`, `mensagem`).
  - As dimensões `organizacao` e `revisao` foram completamente retiradas do contrato do quiz, garantindo que dimensões não perguntadas nunca sejam atribuídas ao utilizador como observação ou prioridade.
  - Recalibração determinística das faixas internas para a nova escala de 0–12 pontos: `base` (0–4), `consolidar` (5–8) e `afinar` (9–12).
  - Remoção de `baselineAnswers` (`q2='outra'`, `q6='notas'`, `q8='rapida'`) em `src/app/quiz/page.tsx`, estabelecendo correspondência 1:1 entre perguntas exibidas e avaliadas.
  - Versionamento da chave em `sessionStorage` para `keds_quiz_answers_v2`, com sanitização rigorosa contra chaves desconhecidas ou opções inválidas e migração graciosa de sessões antigas.
  - Validação de integridade estrutural ao recuperar diagnósticos em `src/app/resultado/[id]/page.tsx`, evitando falhas de execução com estados corrompidos.
- **Remoção de Reprodução Simulada no Leitor VSL**:
  - `src/components/marketing/VslPlayer.tsx` e `vsl-player.css` desprovidos de reprodução simulada (`isPlayingSimulated`), progresso falso (25%/45%), buffer inventado (65%), duração estática (3:45), badge "1080p HD" e toast de som.
  - Na ausência de `src`: preservação do enquadramento vertical 9:16 com poster honesto identificado como preparação ("Prepara a tua próxima candidatura. Vê como usar os recursos do kit."), botão útil apontando para a oferta (`#oferta`) e zero barras decorativas de story.
  - Com `src` presente: integração a eventos reais do `HTMLVideoElement` (`currentTime`, `duration`, `buffered`, `play/pause`, `volumechange`), primeiro clique com unmuting e reinício no segundo 0, pausas normais que retomam do tempo atual e suporte a ecrã inteiro nativo.
- **Hierarquia Comercial e Acessibilidade em Mobile**:
  - Na página `/kit`, o bloco de preço (`14,99 € · pagamento único`) e o CTA principal foram antecipados para o Hero antes dos 4 cartões de produtos, acompanhados de resumo compacto em pills dos 14 ficheiros entregues.
  - A grelha detalhada `ProductMockup` foi deslocada para depois da apresentação em vídeo.
  - Em `ProductMockup.tsx`, o badge "Exemplos reais" foi ajustado para "Exemplos preenchidos".
  - Na homepage (`/`), o botão secundário foi encurtado para "Fazer o quiz — sem CV", mantendo 48 px de altura e cabendo em 1 linha limpa a 360 px.
- **Microcopy, Apoio e Credibilidade**:
  - Linha de confiança da homepage atualizada para "Gratuito · Sem cartão · Privacidade" (com link funcional para `/privacidade`), sem prometer ausência de tratamento externo de dados.
  - Rodapé do quiz atualizado para "Diagnóstico gratuito de autorrelato · Kit Emprego dos Sonhos".
  - Em `/apoio`, removida a menção ao prazo de 24–48h e adotada a descrição factual: "Respondemos nos dias úteis por ordem de chegada de cada mensagem."
  - Na FAQ de `/kit`, removida a menção não confirmada a Multibanco, mantendo MB WAY e cartões Visa/Mastercard.
- **Ativação da IA Google Gemini para Análise Real de Currículos**:
  - Chave de API Google Gemini configurada com isolamento de segurança em `.env.local` (ignorado pelo git).
  - Atualização do modelo padrão para `gemini-3.6-flash` em `src/server/diagnostics/ai-analyzer.ts`, com cabeçalho `x-goog-api-key` e normalização defensiva dos campos de resultado (`essential | refinement` e `guide_step | download_sample`).
  - Validação end-to-end do endpoint `/api/diagnostics/cv`: análise ao vivo executada com sucesso, gerando diagnóstico técnico objetivo em pt-PT, sem simulação e sem notas ATS fictícias.
- **Garantia de Qualidade e Conformidade**:
  - 26/26 testes Vitest aprovados (incluindo todas as 256 combinações válidas da escala 0–12).
  - 23/23 testes de especificação Python aprovados em `qa/check_spec.py`.
  - Typecheck sem erros e compilação de produção Next.js 15 concluída com sucesso (16/16 páginas geradas).


