# Coerência nos produtos, emails, anúncios e vídeo

## Produtos descarregáveis
Produzir ficheiros a partir de `content/`, com um pipeline versionado. O conteúdo fonte deve ser o mesmo que aparece na área privada. Não desenhar um PDF paralelo com promessas e nomenclaturas divergentes.

Guia principal e bumps: A4, 18mm de margem, texto 10,5–11pt, títulos 25pt/16pt, contraste alto, índice navegável, rodapé com título curto/versão/página. Secções com respiro, exemplos em caixas discretas, tarefas destacadas por regra lateral azul. Nada de texto esmagado para caber num número arbitrário de páginas. Rever todas as páginas renderizadas.

Modelos de CV: Essencial sem fotografia, uma coluna e estilos nativos; Moderno com espaço opcional para fotografia, removível sem destruir o layout. A fotografia não entra na análise. Sem gráficos de competências ou ícones no lugar dos contactos. Em ambos, preservar leitura e edição externa; não prometer aprovação universal por sistemas de recrutamento. Gerar DOCX em branco, exemplo fictício e PDF de referência. Sem marca do produto no CV final.

Tracker: na app, dados próprios persistidos com controlo de acesso; versão CSV de apoio. Sanitizar células iniciadas por `=`, `+`, `-` ou `@` e tratar delimitadores/aspas antes de exportar. Datas ISO no ficheiro e rótulos PT-PT. Não enviar registos para analytics.

## Emails
Uma coluna, largura 600px, Manrope quando suportada e fallback Arial. Cabeçalho wordmark, uma ação primária, texto simples alternativo, rodapé com identidade e apoio. Email transacional não é uma oportunidade automática para inserir promoções. Subscrição promocional distinta e cancelamento fácil.

## Anúncios
Cada criativo deve ser exportado individualmente. Formatos propostos 1080×1350 (feed), 1080×1920 (story/reels); variantes 1080×1080 apenas quando necessárias. Texto principal legível em telemóvel, margem de segurança, palavra “gratuito” apenas para o diagnóstico. Não indicar que o kit é grátis.

Hero visual: amostras de recursos verdadeiros ou UI real do resultado com etiqueta “Exemplo ilustrativo”. Evitar stock corporativo genérico, rostos artificiais sem contexto, colagens de dez mockups e estatísticas inventadas. Não gerar um ecrã de editor de CV. Usar personagens/fotografia apenas com direitos claros e sem representar clientes/testemunhos reais.

## Vídeo
HeyGen 16:9 para a landing; derivar corte vertical apenas se necessário. Voz PT-PT, apresentação com IA identificada, legendas e transcrição. Alternar apresentador com biblioteca, modelos descarregáveis e gestor de candidaturas. Nunca mostrar dados reais dos visitantes. Uma amostra de documento tem a mesma direção visual do produto final.

## Amostras e documentação visual
O Antigravity deve produzir uma primeira amostra de cada superfície e guardá-las em `artifacts/design/`, com status “conceito” ou “verificado”. Capturas não substituem uma UI implementada. Só usar na venda ficheiros e funcionalidades que existem e foram testados.
