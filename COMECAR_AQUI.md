# Começar aqui

## O que fazer agora
Extrair o ZIP e abrir **a pasta `kit-emprego-dos-sonhos-pt` inteira** no Antigravity. O diretório contém ficheiros ocultos de regras e configuração. Não abrir apenas um documento isolado.

O primeiro pedido ao agente está em `PROMPT_ANTIGRAVITY.md`. Não é necessário reescrever a ideia: o produto, o percurso, os textos e a direção visual já estão estruturados.

## Ordem de leitura do agente
`AGENTS.md` → `docs/00_DECISOES.md` → `config/features.json` → `docs/01_PRODUTO.md` → `design/DESIGN_SYSTEM.md` → `design/SCREEN_SPEC.md` → `docs/04_ARQUITETURA.md` → `docs/05_OKANDA.md` → `docs/09_EXECUCAO.md`.

## Resultado esperado da primeira sessão
- Plano de implementação gravado no repositório e lista de integrações ainda não configuradas.
- Aplicação base com design system partilhado, página interna de componentes e navegação.
- Percurso completo de quiz com resultados calculados e identificados como autorrelato.
- Shell das páginas restantes, com conteúdo deste pacote, sem checkout falso ou análise simulada apresentada como real.

O modo de demonstração é apenas local/preview protegido e tem identificação explícita. A publicação comercial depende dos bloqueios de `config/release-gates.json`.

## GitHub
O nome proposto é `kiumaa/kit-emprego-dos-sonhos-pt`, com visibilidade **privada**. O script `scripts/create-github-repo.sh` permite rever a operação sem executar. A opção `--apply` cria e publica apenas depois de autenticação local e verificações. Não substitui nem apaga repositórios existentes.

O GitHub torna o código e a documentação partilháveis por commits. Não é coedição em tempo real nem sincroniza automaticamente alterações locais: o Antigravity tem de fazer commit e push. Depois, a ligação do GitHub usada nesta conversa tem de ter acesso ao novo repositório.

## O que não é necessário decidir para iniciar o trabalho
O agente pode começar layout, conteúdos, quiz, área demonstrativa e testes sem credenciais reais. Não deve bloquear todo o trabalho à espera da OKANDA.

## O que é necessário antes de vender
Preço final e prazo de acesso aprovados; entidade vendedora e apoio; políticas revistas; produtos finais gerados e testados; integração OKANDA validada; prestadores de autenticação, email, armazenamento e IA configurados; conservação e eliminação de dados comprovadas.
