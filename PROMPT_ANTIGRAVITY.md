# Pedido inicial para o Antigravity

Vamos desenvolver o **Kit Emprego dos Sonhos — Portugal** com base neste repositório. Quero um produto profissional, clean, moderno e coerente, com o cuidado visual associado ao estilo Apple, mas identidade própria. Todas as páginas, ferramentas, conteúdos, recursos descarregáveis, emails e criativos devem seguir o mesmo design system.

**Decisão final: NÃO desenvolver um editor de CV na plataforma.** Mantemos o analisador gratuito e os modelos de CV descarregáveis. Não reintroduzas um editor com outro nome.

Lê primeiro `AGENTS.md`, `docs/00_DECISOES.md`, `config/`, `docs/01_PRODUTO.md`, `design/`, `docs/04_ARQUITETURA.md` e `docs/05_OKANDA.md`. Os textos utilizáveis estão em `content/`. Não os substituas por lorem ipsum, promessas exageradas ou uma landing page genérica.

O funil é: anúncio → CV ou quiz → resultado útil → convite opcional para guardar o plano por email → oferta com VSL na mesma página → checkout OKANDA com Entrevista dos Sonhos e LinkedIn dos Sonhos como bumps → acesso ao kit. Deve existir também uma página pública do produto para compra direta.

A área do comprador inclui um percurso de conteúdos, progresso, biblioteca de ficheiros, modelos de CV para descarregar, cartas, mensagens, checklists, prompts e gestor simples de candidaturas. Os conteúdos dos bumps têm direitos de acesso separados. A recusa de marketing não impede o uso gratuito nem a compra.

1. Inspeciona o workspace. Cria `docs/IMPLEMENTATION_PLAN.md`, identifica o que já existe e o que falta. Não apagues nem sobrescrevas ficheiros existentes.
2. Confirma o stack proposto e as versões estáveis atuais. Implementa primeiro o design system e uma página `/design-system` protegida em preview, com os componentes, estados e uma amostra de recurso impresso.
3. Implementa o quiz real e os resultados usando `content/quiz/quiz.json` e a lógica de referência. Constrói o percurso completo mobile-first. Faz capturas de ecrã e revê tipografia, margens, contraste e consistência.
4. Implementa as restantes páginas, a área do comprador e os produtos a partir dos conteúdos-fonte. Gera os recursos PDF/DOCX através de um processo centralizado: não os desenhes como um projeto independente da aplicação. Os documentos são modelos estáticos; isto não é um editor online.
5. Liga autenticação, persistência, email, armazenamento privado e análise por IA através dos adaptadores especificados. Usa mocks apenas em local/preview identificado. Mostra indisponibilidade honesta quando faltar uma integração real.
6. Liga a OKANDA apenas com documentação real: os tipos deste repositório são contratos internos, não parâmetros oficiais. Nunca desbloqueies uma compra pela query string de retorno. Valida confirmação no servidor, idempotência, montante, moeda, produtos e direitos de acesso.
7. Produz os criativos individualmente e o material de apoio à VSL a partir dos textos e do design system. Não inventes testemunhos, logótipos de clientes ou uma interface de edição de CV.
8. Executa `python3 qa/check_spec.py`, acrescenta testes de aplicação e cumpre `qa/ACCEPTANCE.md`. Regista resultados reais, pendências e capturas em `docs/STATUS.md`.

Os bloqueios externos não devem impedir design, conteúdo, quiz e testes locais. Não publiques, não atives checkout real e não prometas condições comerciais que ainda estão marcadas como pendentes. Não concluas que o produto está pronto apenas porque a build passou.

Para GitHub, existe `scripts/create-github-repo.sh`, destinado a `kiumaa/kit-emprego-dos-sonhos-pt` privado. Revê-o e usa-o só depois de `gh auth status` confirmar a conta certa; não mostres tokens no chat. Em repositório já existente, não executes a criação: trabalha por branches e commits, sem force push.

Começa agora pelo plano e pela implementação da base visual e do quiz. Não voltes a propor o editor de CV nem uma reformulação do negócio antes de executar.
