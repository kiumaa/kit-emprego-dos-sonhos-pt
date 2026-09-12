# Revisão técnica e de âmbito

## Base e limites
Revisão por leitura do GitHub em `b75d31a223ca6b624b56723a4c1b90dc52efe76e`, branch `main`. Não é uma auditoria de segurança exaustiva, revisão jurídica, avaliação visual do site renderizado ou reprodução dos testes anunciados pelo Antigravity. `localhost:3002` refere-se à máquina onde o servidor foi iniciado; não foi acedido nesta revisão.

## Conclusão
Há uma base reutilizável de interface, conteúdos e motor de quiz. O percurso CV → resultado, a VSL, a recolha de email e a compra da página de resultado continuam a conter simulações. O relatório de implementação não deve ser interpretado como prova de funcionamento ponta a ponta.

## Achados confirmados

### P0 — O formulário de CV não envia o CV para análise
`src/app/analisar-cv/page.tsx`, função `handleSubmit`: guarda apenas origem, função, vaga e data em sessionStorage e navega para processamento. Não envia o ficheiro nem o texto à API. Corrigir a ligação antes de anunciar a análise gratuita como operacional.

### P0 — A API de CV não extrai nem analisa o conteúdo real
`src/app/api/diagnostics/cv/route.ts`: substitui o texto pelo nome do ficheiro e devolve o mesmo conjunto de recomendações. Não chama um fornecedor de IA nem um analisador de documentos. O comentário "preview" não constitui uma barreira de produção.

### P0 — Resultado de exemplo apresentado quando não há resultado
`src/app/resultado/[id]/page.tsx`: se não encontra o resultado em sessionStorage, calcula um quiz com respostas predefinidas. Não existe neste caminho uma barreira explícita que limite esse fallback a demonstração. A origem é sempre mostrada como questionário. Um CV pode, por isso, acabar numa página de resultado do quiz predefinido, sem que o CV tenha sido enviado.
Correção: contrato discriminado `source: 'cv' | 'quiz'`; ausência de sessão gera estado de diagnóstico não encontrado/expirado, nunca um perfil fabricado.

### P1 — O processamento é uma sequência de temporizadores
`src/app/diagnostico/em-processamento/page.tsx`: setTimeout a 1200, 2400 e 3600 ms, sem aguardar trabalho de análise. Substituir por estados reais da tarefa. O quiz pode navegar imediatamente após cálculo validado, sem teatro de processamento.

### P1 — A VSL ainda não é vídeo
Na página de resultado existe um `div` com PlayCircle e texto, sem `<video>`. Inserir leitor real, pré-visualização muda, reinício com som no clique, fallback manual e legenda/transcrição quando disponíveis.

### P1 — A compra da página de resultado não redireciona
O callback de `OfferPanel` chama `alert(...)`. A versão live do adaptador `src/server/commerce/okanda-adapter.ts` continua a lançar `INTEGRATION_NOT_CONFIGURED`, mesmo com credenciais. O modo predefinido é demo. No novo âmbito, substituir esta dependência por um link HTTPS de checkout real e configurado; não construir comércio local.

### P1 — O envio do plano por email é simulado
`onSavePlan` faz `console.log` dos dados e espera 800 ms. Não é uma integração de email. Desligar a recolha até existir envio confirmado; nunca indicar sucesso apenas por passar um temporizador. Não registar emails em consola.

### P1 — Produtos completos em pasta pública
O gerador escreve em `public/downloads`. Em Next.js, esta pasta serve ficheiros por URL. Os produtos pagos não devem ser entregues por URLs públicas do próprio funil. Mover os artefactos de entrega para fora de `public`, gerar em pasta excluída do deploy/Git e carregar na OKANDA. Manter apenas amostras explicitamente gratuitas.
Os metadados do GitHub indicavam o repositório como público na consulta. Fontes editoriais e ficheiros pagos publicados nele também ficam expostos. Rever visibilidade e conteúdos antes de continuar; remover um ficheiro de `main` não apaga cópias ou histórico anteriores. Não reescrever histórico nem alterar visibilidade automaticamente sem autorização específica.

### P2 — Tipografia dos documentos não deriva da fonte da aplicação
`src/app/layout.tsx` carrega Manrope; `scripts/generate_deliverables.py` declara Arial repetidamente no OpenXML. Alterar apenas o CSS não redesenha os produtos. Os PDFs/DOCX precisam de um pipeline editorial próprio, com revisão renderizada. O número de páginas não demonstra valor ou qualidade de layout.

### P2 — Âmbito maior do que o pedido atual
A área privada, acessos, encomendas locais, gestão de candidaturas e callbacks de entrega deixam de pertencer ao site. Arquivar o âmbito anterior na documentação; retirar rotas e navegação; preservar os conteúdos para os produtos descarregáveis.

## O que vale a pena conservar
`src/lib/quiz/quiz-engine.ts` valida oito respostas, recusa opções desconhecidas, distingue prioridades de aperfeiçoamentos e não expõe a pontuação numérica como probabilidade. Os tokens e componentes existentes são uma base reutilizável. Isto não dispensa testes do percurso no navegador.

## Fontes do repositório
- Formulário: https://github.com/kiumaa/kit-emprego-dos-sonhos-pt/blob/b75d31a223ca6b624b56723a4c1b90dc52efe76e/src/app/analisar-cv/page.tsx
- API CV: https://github.com/kiumaa/kit-emprego-dos-sonhos-pt/blob/b75d31a223ca6b624b56723a4c1b90dc52efe76e/src/app/api/diagnostics/cv/route.ts
- Processamento: https://github.com/kiumaa/kit-emprego-dos-sonhos-pt/blob/b75d31a223ca6b624b56723a4c1b90dc52efe76e/src/app/diagnostico/em-processamento/page.tsx
- Resultado: https://github.com/kiumaa/kit-emprego-dos-sonhos-pt/blob/b75d31a223ca6b624b56723a4c1b90dc52efe76e/src/app/resultado/%5Bid%5D/page.tsx
- Comércio: https://github.com/kiumaa/kit-emprego-dos-sonhos-pt/blob/b75d31a223ca6b624b56723a4c1b90dc52efe76e/src/server/commerce/okanda-adapter.ts
- Quiz: https://github.com/kiumaa/kit-emprego-dos-sonhos-pt/blob/b75d31a223ca6b624b56723a4c1b90dc52efe76e/src/lib/quiz/quiz-engine.ts
- Fonte web: https://github.com/kiumaa/kit-emprego-dos-sonhos-pt/blob/b75d31a223ca6b624b56723a4c1b90dc52efe76e/src/app/layout.tsx
- Estilos: https://github.com/kiumaa/kit-emprego-dos-sonhos-pt/blob/b75d31a223ca6b624b56723a4c1b90dc52efe76e/src/app/globals.css
- Gerador: https://github.com/kiumaa/kit-emprego-dos-sonhos-pt/blob/b75d31a223ca6b624b56723a4c1b90dc52efe76e/scripts/generate_deliverables.py
- Branch: https://api.github.com/repos/kiumaa/kit-emprego-dos-sonhos-pt/branches/main

Fontes externas técnicas: `docs/FONTES.md`.
