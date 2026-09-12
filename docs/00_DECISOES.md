# Decisões e autoridade

## Confirmado pelo responsável
Nome: Kit Emprego dos Sonhos — Portugal. Desenvolvimento dos produtos e das páginas no Antigravity. Design profissional, clean, moderno, com inspiração de qualidade Apple e consistente em todos os elementos. Duas entradas gratuitas: análise de CV e quiz. Resultado seguido de oferta com VSL. Checkout na OKANDA; bumps no checkout. Pacote ZIP e intenção de partilhar trabalho por repositório GitHub.

**Decisão KEDS v3 (12/09/2026): Funil de Diagnóstico + VSL + Entrega OKANDA**
- O site serve exclusivamente para captar interesse, produzir diagnóstico real, apresentar uma oferta com VSL na mesma página e encaminhar para checkout externo OKANDA PAY.
- A OKANDA é responsável pelo checkout, bumps (Entrevista 4,90 € e LinkedIn 5,90 €), pagamento, confirmação e entrega dos produtos descarregáveis por email.
- O âmbito anterior v2 (área de membros, autenticação do comprador, biblioteca privada online, gestor de candidaturas web e entrega de encomendas no site) fica arquivado como histórico e desativado da versão publicada.
- Continua rigorosamente proibido construir editor de CV, canvas ou exportação personalizada.
- Satoshi substitui Manrope na linguagem tipográfica do sistema de design.
- Todos os produtos pagos são gerados em pastas locais privadas (`dist/deliverables/`), ficando estritamente excluídos de `public/downloads`.
- Corrigidos os pontos críticos de auditoria: leitura real de ficheiros no servidor, sem IA simulada, sem temporizadores artificiais e sem resultados de fallback fabricados.

**Decisão de Redesign e Conversão Visual KEDS v3.1 (12/09/2026): Estética Editorial Apple, Mobile-First e Logótipo Oficial**
- Instalação do logótipo oficial do Emprego dos Sonhos como assinatura visual central e exclusiva.
- Remoção total de headers e menus tradicionais de SaaS; topo das páginas passa a apresentar exclusivamente o logótipo oficial com margens generosas e botão voltar opcional nas páginas de diagnóstico.
- Footer mínimo e institucional mobile-first (Termos, Privacidade, Cookies, Apoio e menção à segurança OKANDA PAY), sem colunas pesadas nem links técnicos.
- Escala tipográfica refinada para mobile-first (H1 30–36px, H2 24–28px, botões 48–52px, margens de 20px).
- Homepage reduzida ao essencial com foco imediato nas duas opções gratuitas (CV vs Quiz), fotografia humana realista e sem cards de funcionalidades SaaS.
- Analisador de CV com tabs limpas e campos secundários em disclosure recolhido ("Queres uma análise mais contextualizada?").
- Quiz minimalista contínuo de 8 perguntas com barra de progresso fina e opções de toque grandes.
- Página de resultado reestruturada em Parte A (Diagnóstico conciso + 3 prioridades + 1 ação gratuita útil) e Parte B (Ponte para a venda com scroll suave para `#apresentacao`).
- Protagonismo total da VSL (16:9 de largura total mobile, autoplay muted em viewport e overlay claro "🔊 Ativar som e ver desde o início").
- Oferta apresentada visualmente com mockup editorial dos produtos, preço único de 14,90 €, agrupamento em 4 pilares e nota informativa sobre os bumps da OKANDA.
- Landing page de vendas direta em `/kit` com estrutura de alta conversão.
- Substituição do formulário simulado de `/apoio` por canal real de suporte por email e neutralização de `/obrigado` para entrega por email pela OKANDA.

## Defaults de implementação, sem necessidade de bloquear o arranque
- Manrope, branco, grafite, cinzas neutros, azul discreto; tema claro único no lançamento.
- Site e área privada no mesmo projeto. Conteúdo estruturado e tokens partilhados.
- Stack proposto: Next.js App Router + TypeScript, base PostgreSQL/Neon, Drizzle, autenticação Clerk, alojamento Vercel. Validar versões/licenças; qualquer substituição fica documentada.
- Dois modelos de CV base e dois bumps ativos na especificação. Terceiro pack extra desativado.
- Um resultado sem nota ATS, entregue no navegador antes do opt-in promocional.
- Nome de repo proposto `kiumaa/kit-emprego-dos-sonhos-pt`; privado.

## Ainda não aprovado para venda
Os valores 14,90 €, 4,90 € e 5,90 € são preços de teste. Prazo de acesso proposto: 12 meses, sem renovação automática, com uso pessoal dos ficheiros descarregados após esse prazo. É uma proposta de configuração, não uma promessa publicada. Não usar “vitalício”.

Faltam aprovação comercial/fiscal, entidade vendedora, contactos de apoio, contrato real OKANDA, condições de dados dos fornecedores, política de conservação e revisão jurídica. Estas pendências bloqueiam publicação/transações reais, não o desenvolvimento.

## Procedimento de alteração
Modificar configuração e conteúdos, atualizar changelog, adicionar testes e anexar comparação visual quando houver impacto em design. Nunca manter dois preços, duas promessas ou duas versões de tokens concorrentes. Não reabrir o âmbito do editor sem instrução expressa futura do responsável.
