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

