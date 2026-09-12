# Verificação isolada do controlador de VSL

## Ambiente e limites
Data: 12 de setembro de 2026. Chromium headless instalado no ambiente, via Playwright Python.
Plugin Browser não disponível nesta sessão. A navegação HTTP local foi bloqueada pela política do ambiente (`ERR_BLOCKED_BY_ADMINISTRATOR`). A amostra foi por isso carregada com `page.set_content`, com vídeo de teste em data URI e o MESMO controlador JavaScript compilado. Não se trata do site do repositório nem de um deploy.

Controlador compilado com TypeScript `--strict --target ES2020 --module ES2020 --lib ES2020,DOM`. Wrapper TSX passou em verificação sintática com `transpileModule`; NÃO foi feito typecheck integrado com React/Next nem build da aplicação original.

Viewports inspecionados: 1280 × 900 e 390 × 844. Fonte de teste: fallback Arial; Satoshi não foi descarregada/carregada aqui. Screenshots revistos visualmente, sem overflow observado nestes dois tamanhos. Vídeo de teste não faz parte da entrega de produto nem representa a VSL final.

## Resultados

| Verificação | Resultado |
|---|---|
| Preview automática sem som | PASSOU |
| Clique reinicia em 0 e ativa som | PASSOU |
| Controlos nativos e sem loop após ativar som | PASSOU |
| Pausa fora da zona visível | PASSOU |
| Não retoma som automaticamente ao regressar | PASSOU |
| Pausa manual da preview respeitada | PASSOU |
| Sem erros JavaScript no percurso normal | PASSOU |
| Movimento reduzido impede preview automática | PASSOU |
| Layout 390px sem overflow horizontal | PASSOU |
| Tecla Enter inicia som e reprodução | PASSOU |
| Bloqueio simulado de autoplay oferece início manual | PASSOU |
| Recuperação manual de bloqueio de autoplay | PASSOU |
| Media inválido produz estado de erro | PASSOU |
| Cleanup remove callbacks | PASSOU |

## Ainda por executar no Antigravity
Integração e typecheck do wrapper React na aplicação real; Safari/iOS e Android; vídeo final; URL em CDN/HTTP e CORS de legendas; legendas e transcrição; comportamento de economia de dados em dispositivo real; transições de separador no navegador real; fonte Satoshi carregada; percurso CV/quiz real; pagamentos e entregas OKANDA. O teste de media inválido não equivale a verificar todas as falhas de HTTP/CDN.

A inexistência de fonte é tratada no wrapper TSX por renderização condicional, mas esse estado NÃO foi executado num runtime React nesta sessão. Não apresentar os 14 testes como validação de toda a plataforma.
