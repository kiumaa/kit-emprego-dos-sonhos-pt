# Critérios de aceitação v3

## Âmbito
- [ ] Nenhuma rota, link, API ou promessa de área de membros/editor/gestor online na versão publicada.
- [ ] Conteúdos editoriais preservados; principal e bumps separados.
- [ ] Contratos/regras/docs atualizados; requisitos antigos arquivados.
- [ ] Checkout único configurado, sem alertas/mocks; bumps apenas na OKANDA.
- [ ] Sem compra medida por clique ou parâmetro `paid=true`.

## Diagnóstico
- [ ] Upload/texto chegam efetivamente à análise; tipos e limites validados no servidor.
- [ ] Dois CVs diferentes originam observações fundamentadas diferentes quando o conteúdo o justifica.
- [ ] Documento ilegível/inexistente não produz diagnóstico; fallback de colar texto/quiz.
- [ ] Sem IA configurada: estado explícito, nunca relatório fixo disfarçado de live.
- [ ] Quiz valida respostas; resultado é autorrelato e não análise do CV.
- [ ] Resultado ausente/expirado: sem `fallbackAnswers`; sem dados de outra sessão.
- [ ] Sem atrasos, probabilidades, pontuações ATS ou problemas fabricados.
- [ ] Resultado útil antes de email/compra, oferta na mesma página e âncora funcional.
- [ ] Erros tratados sem revelar dados/segredos; sem cache público de resultados.

## VSL
- [ ] Sem fonte: nenhum vídeo falso, CTA de oferta disponível.
- [ ] Fonte existente: preview muda quando visível; início real, não temporizador.
- [ ] Som desligado até clique/tecla explícitos.
- [ ] Preview avançada → botão de som reinicia em 0 e reproduz com som.
- [ ] Nenhum loop após ativar som; pausa/progresso/volume nativos funcionam.
- [ ] Autoplay bloqueado: botão manual visível, sem erro não tratado.
- [ ] Movimento reduzido/economia de dados respeitados; preview pode ser pausada.
- [ ] Saída de viewport/separador pausa; regresso não retoma som sozinho.
- [ ] Ficheiro 404/falha de rede: mensagem/repetição, sem ocultar preço/compra.
- [ ] Legendas reais PT-PT/transcrição e QA Safari/iOS + Chromium/Android.

## Produtos e design
- [ ] Satoshi realmente carregada; fallbacks testados, sem fontes distribuídas no ZIP.
- [ ] Cor, marca, botões, sombras, títulos e margens coerentes em todas as superfícies.
- [ ] 360/390/768/1280/1440 sem overflow; teclado/foco e targets adequados.
- [ ] Todos os PDFs/DOCX renderizados e páginas revistas; sem corte de acentos/texto.
- [ ] Capas legíveis em miniatura; pessoas com proveniência; bandeira discreta, sem endosso oficial.
- [ ] CVs de candidatura sem marca/publicidade; guias e workbooks editorialmente consistentes.
- [ ] Ficheiros pagos ausentes de public/downloads, CDN público e deploy do site.
- [ ] Exposição do repositório e do histórico analisada e comunicada ao responsável.

## OKANDA e lançamento
- [ ] Compra principal sem bump, com cada bump e com ambos; entrega dos ficheiros corretos.
- [ ] Pagamento pendente/falhado não liberta produtos.
- [ ] Preços, formatos, condições e entidade vendedora coerentes.
- [ ] Testado método MB WAY efetivamente disponível no checkout.
- [ ] Captura de email real ou desligada; consentimento promocional não presumido.
- [ ] typecheck/test/build com resultados guardados e sem afirmações de testes não executados.
