# Plano de execução — do pacote à aplicação

Não pedir uma nova definição do negócio antes de começar. Ler o âmbito e registar bloqueios externos, avançando nas partes independentes. Não voltar a introduzir o editor de CV.

| Etapa | Trabalho | Evidência de conclusão |
|---|---|---|
| E01 Fundação | Inspecionar workspace, fixar stack/versões, instalar base, importar conteúdos | build local, lockfile, plano e configuração sem segredos |
| E02 Design system | Tokens, tipografia, componentes e estados, amostra editorial | `/design-system` protegido, capturas desktop/mobile e amostra A4 |
| E03 Quiz | Oito perguntas, estado, validação, lógica e resultado | testes das fronteiras e erros; percurso funcional acessível |
| E04 Páginas comerciais | Entrada, resultado+VSL, oferta direta, FAQ | preços/condições da fonte central, CTA disponível sem ver vídeo |
| E05 Conteúdos e recursos | Biblioteca, lições, geração dos PDF/DOCX/CSV | todos os recursos reais, renderizados e revistos |
| E06 Área privada | Autenticação, progresso, candidaturas e direitos de acesso | dados persistem e utilizador A não lê B |
| E07 Analisador | Upload/texto, parser seguro, jobs, IA, evidência | fixtures, falhas reais, limites e política de dados comprovados |
| E08 OKANDA | Contrato real, checkout, retorno, webhooks, conciliação | compra, bumps, duplicação, falha e reembolso verificados |
| E09 Emails e consentimento | Plano, acesso, recuperação, opt-in e supressão | testes sem PII indevida, consentimento não obrigatório |
| E10 Marketing | Artes individuais, UI real, VSL e legendas | consistência e revisão de direitos/políticas; sem campanhas automáticas |
| E11 Qualidade e publicação | QA, segurança, acessibilidade, legal, métricas | todos os release gates com evidência; deploy autorizado |

## Ordem técnica
Design e quiz não dependem da API OKANDA. Conteúdo e modelos não dependem de IA. Checkout real não pode depender de um mock. A produção visual deve acompanhar as fatias de implementação, não ser uma pintura no fim.

## Branches e commits
`main` como referência estável; branches `feat/design-system`, `feat/quiz`, `feat/member-area`, `feat/cv-analysis`, `feat/okanda`, `content/resources`. Trabalhar por pull requests com testes e capturas. Nunca force push para resolver divergências sem revisão. Atualizar `docs/STATUS.md` no fim de cada etapa.

## Backlog pronto a transformar em issues
| ID | Título | Prioridade | Dependências |
|---|---|---|---|
| KEDS-01 | Arranque do projeto e validação do pacote | P0 | nenhuma |
| KEDS-02 | Sistema visual e componentes partilhados | P0 | 01 |
| KEDS-03 | Quiz, validação e resultado qualificado | P0 | 02 |
| KEDS-04 | Resultado com envio do plano e oferta | P0 | 03 |
| KEDS-05 | Landing direta do kit e conteúdo comercial | P0 | 02 |
| KEDS-06 | Pipeline editorial e modelos estáticos | P0 | 02 |
| KEDS-07 | Conta, biblioteca e progressos | P0 | 06 |
| KEDS-08 | Gestor de candidaturas e CSV seguro | P1 | 07 |
| KEDS-09 | Upload/texto e jobs seguros de análise | P0 | 02 |
| KEDS-10 | Provedor de IA e validação de evidências | P0 | 09, política dados |
| KEDS-11 | Adaptador OKANDA e concessão de acesso | P0 | contrato real, 07 |
| KEDS-12 | Bumps, reembolsos e idempotência | P0 | 11 |
| KEDS-13 | Emails, consentimentos e privacidade | P0 | 04, 07 |
| KEDS-14 | Admin mínimo e auditoria | P1 | 11 |
| KEDS-15 | Seis criativos em dois formatos e VSL | P1 | 05, 06 |
| KEDS-16 | Testes ponta a ponta e revisão visual | P0 | todas as funcionalidades lançadas |
| KEDS-17 | Validação legal/comercial e release | P0 | todos os gates |

As issues não foram criadas remotamente; esta tabela é a fonte para criação posterior. O repositório começa com especificação e conteúdo, não com tarefas marcadas falsamente como concluídas.
