# Instruções permanentes do projeto — KEDS v3 (Funil + Entrega OKANDA)

## Hierarquia e Âmbito
A última instrução explícita do responsável prevalece. Esta versão (v3.0) substitui e arquiva como histórico os requisitos anteriores de área de membros (`/area/**`), autenticação do comprador (`/entrar`), biblioteca privada online, gestor de candidaturas web e entrega de encomendas no site. `config/funnel.json` e `config/` definem funcionalidades; `design/tokens.json` define o estilo (com Satoshi); `content/` define textos e recursos. Registar alterações em `docs/00_DECISOES.md` e `CHANGELOG.md`.

## Restrições Inequívocas
- **Proibido desenvolver editor de CV**, resume builder, canvas, formulário de composição de currículo ou exportação personalizada. Os modelos DOCX/PDF são ficheiros estáticos para descarregar e editar externamente no Word, Docs ou LibreOffice.
- **Percurso obrigatório do funil**:
  Página inicial → Analisador de CV OU Quiz de 8 perguntas → Resultado resumido e útil → Botão âncora (`#apresentacao`) → VSL e Oferta na mesma página → Checkout externo OKANDA PAY → Entrega dos produtos por email pela OKANDA.
- **Sem área de membros nem comércio local**: Não construir login, registo, recuperação de conta, biblioteca privada, gestor de candidaturas online ou webhook próprio de encomendas. A OKANDA assume checkout, bumps, cobrança e entrega dos ficheiros.
- **Bumps na OKANDA**: Os aceleradores Entrevista dos Sonhos (4,90 €) e LinkedIn dos Sonhos (5,90 €) são opcionais, nunca pré-selecionados e escolhidos diretamente na página de checkout da OKANDA. Não duplicar seleção de bumps no site.
- **Botão de compra único**: Todos os botões de compra apontam para um único URL HTTPS com host aprovado (`okandapay.com`). Se não configurado, o CTA não aparenta compra funcional e o lançamento comercial fica bloqueado.
- **Diagnósticos verdadeiros**: Manter análise de CV e quiz gratuitos com resultados úteis antes da oferta. Sem notas ATS inventadas, sem probabilidades de contratação, sem escassez artificial e sem garantias de emprego.
- **Sem simulações nos diagnósticos**:
  - Análise de CV: leitura de documento real no servidor com validações de tamanho, tipo e limites.
  - Sem fornecedor/chave de IA configurada: devolver indisponibilidade explícita e sugerir o quiz de autorrelato. Nunca disfarçar respostas pré-programadas como análise live.
  - Sem temporizadores artificiais (`setTimeout`) fingindo leitura ou processamento.
  - Sem `fallbackAnswers` ou dados fictícios no resultado: ausência/expiração de sessão gera estado honesto com botão para recomeçar.
- **Ficheiros pagos fora de `public/downloads`**: Os produtos pagos descarregáveis devem ser gerados em pastas locais privadas e excluídas do Git e deploy (`dist/deliverables/`), acompanhados de manifesto SHA-256 para upload na OKANDA. `public/downloads` só contém amostras gratuitas aprovadas.
- **Sistema visual Satoshi**: Tipografia Satoshi (obtida via Fontshare com fallback declarado), fundo `#FFFFFF`, superfície `#F5F5F7`, grafite `#1D1D1F`, secundário `#51515A`, azul `#0057D9`. Botões 48–52 px.
- **Linguagem e conformidade**: PT-PT estrito em toda a experiência. Preços em EUR (`14,90 €`). Sem registo de dados pessoais em consola (`console.log`) ou retenção indevida.
