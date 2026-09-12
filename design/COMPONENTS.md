# Inventário de componentes

| Família | Variantes necessárias | Regras |
|---|---|---|
| Button | primary, secondary, ghost, destructive | default, hover, focus, disabled, loading; texto não muda de largura no loading |
| TextField / TextArea | curto, email, multiline | label sempre visível, descrição, erro, limite de caracteres |
| ChoiceGroup | single choice do quiz | radio nativo, teclado, seleção inequívoca, estado obrigatório |
| UploadField | ficheiro, extração, erro | limites visíveis, mudar/remover ficheiro; fallback texto/quiz |
| ProgressStepper | quiz, percurso de conteúdo | progresso real, sem confundir com probabilidade de emprego |
| Insight | positivo, a trabalhar, não avaliável | fonte e evidência; observação + ação; sem nota inventada |
| ResultSummary | CV, quiz | títulos explicitam a origem; disclaimer legível |
| LeadCapture | envio do plano | email pedido, nome opcional, marketing opt-in separado e vazio |
| VideoPanel | poster, a tocar, indisponível | play explícito, legendas, transcrição e CTA fora do vídeo |
| OfferPanel | kit, complementar | preço vem da configuração; prazo e conteúdos claros; sem preço riscado falso |
| ResourceTile | PDF, DOCX, CSV, texto | amostra, formato, versão, download; autorização no servidor |
| LessonLayout | leitura, exercício | navegação, progresso, alternativa de copiar e descarregar |
| ApplicationList | vazio, lista, mobile | adicionar, editar registo, arquivar, exportar; não é um editor de CV |
| ConsentPanel | cookies | aceitar, rejeitar, personalizar; sem assimetria de legibilidade |
| EmptyState / ErrorState | domínio específico | uma explicação e uma ação útil, sem ilustração obrigatória |
| Toast / InlineFeedback | informação, sucesso, erro | `aria-live` moderado; não esconder erros críticos num toast |

A página interna `/design-system` demonstra todos os estados com dados fictícios. Deve estar disponível apenas em ambiente de desenvolvimento ou preview protegido. Não a indexar nem tornar uma porta de acesso aos recursos pagos.

Emails HTML devem usar estilos compilados compatíveis com o canal; não depender de que todos os clientes suportem CSS variables. PDF e DOCX usam as mesmas decisões visuais convertidas em estilos nativos. Nunca rasterizar texto útil para contornar paginação.
