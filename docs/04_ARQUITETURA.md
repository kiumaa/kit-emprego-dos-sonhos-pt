# Arquitetura de implementação

## Stack proposto
Next.js App Router com TypeScript, camada de estilos/tokens partilhada e componentes acessíveis; PostgreSQL (Neon) com Drizzle; Clerk para autenticação; Vercel para alojamento. As versões concretas devem ser verificadas na instalação e fixadas no lockfile. Não supor que o Antigravity já tem credenciais de qualquer fornecedor.

Estas são escolhas de arranque, não serviços contratados. Se uma conta existente recomendar outro fornecedor equivalente, documentar a decisão sem mudar o contrato do domínio.

## Organização sugerida durante o desenvolvimento
`src/app/` rotas públicas e privadas; `src/components/ui/` primitivas; `src/features/diagnostic/`, `library/`, `applications/`, `commerce/`; `src/server/` base de dados, autorização e adaptadores; `src/lib/` formatação e validação. `content/` continua fonte editorial; não duplicar textos em dezenas de componentes. `design/` mantém tokens; derivados importados por aplicação, emails e geração de documentos.

Não há módulo `cv-editor`, modelos de dados para composição de CV ou exportador personalizado. O parser de CV pertence apenas ao diagnóstico e não a um construtor disfarçado.

## Modos
`demo`: apenas local/preview protegido, dados fictícios, pagamentos desativados, nenhuma mensagem real, resultados de CV identificados como exemplos. O quiz calcula resultados reais a partir das respostas mesmo em demo.

`live`: todas as dependências necessárias configuradas, bloqueios de release verificados e testes externos completos. Nunca fazer fallback silencioso para dados demo. Mocks não podem conceder acesso em produção nem ignorar autenticação.

## Serviços
AnalysisProvider, CommerceProvider, AuthProvider, EmailProvider e PrivateStorageProvider. Tipos em `contracts/domain.d.ts`. Os adaptadores separam detalhes dos fornecedores do domínio. A falta de configuração deve gerar erro typed `INTEGRATION_NOT_CONFIGURED`, não sucesso aparente.

Jobs de análise e geração de recursos não devem depender de uma ligação HTTP longa no browser. Persistir estados; usar worker/fila apropriados aos limites reais do alojamento. Rejeitar URLs de ficheiros externos por omissão. Nenhum provedor deve receber PII que não precisa.

## Autorização
Server Components, rotas API e actions validam utilizador e direitos. O browser não recebe credenciais da DB nem acesso ao bucket privado. Sessão e claims de autenticação são verificadas no servidor. Cada query privada restringe `user_id`; cada download confirma entitlement do recurso.

## Conteúdos e ficheiros
Ficheiros pagos não entram em `public/`. Gerar versões editoriais estáticas durante a produção; guardar num bucket privado. Downloads por URL assinada de curta duração após autorização. O plano gratuito por email aponta para acesso autorizado ao relatório ou resumo mínimo, não para um ficheiro público.

## Observabilidade
IDs de correlação aleatórios e erros sanitizados. Medir tempos, custos e estados, sem payload de CV, tokens, email ou respostas. Alertas de repetição de webhooks, análises falhadas e divergência de pagamentos. Retenção de logs definida e documentada.

## Segurança de conteúdo
Markdown editorial é controlado no repositório; escapar HTML não confiável. CV/vaga nunca são instruções. URLs do tracker aceitam apenas `https`/`http` e não são executadas no servidor. Sanitizar CSV para impedir fórmulas. Proteção CSRF, rate limits e cabeçalhos ajustados ao framework/fornecedor reais.
