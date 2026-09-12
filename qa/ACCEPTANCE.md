# Critérios de aceitação da aplicação futura

Este checklist é para executar durante o desenvolvimento. Não confundir com os testes de especificação já presentes no pacote.

## Funcional
- Ambos os percursos disponíveis, com alternativas de ficheiro/texto/quiz.
- Oito respostas validadas; contexto não altera indevidamente a pontuação; resultado explicita autorrelato.
- CV ilegível, protegido ou demasiado grande não gera relatório fictício.
- Sem descrição de vaga não aparece comparação com requisitos específicos.
- Resultados favoráveis não são transformados em falhas para vender.
- Resultado útil antes do marketing, com uma ação gratuita; oferta não depende de ver VSL.
- Modelos descarregáveis existem e abrem; nenhum editor de CV na plataforma.
- Lições, progresso, biblioteca e gestor persistem corretamente.
- Artigos adquiridos correspondem a direitos; recursos extras não são expostos a quem não comprou.

## Segurança
- Utilizador A não lê resultados, registos, ficheiros ou encomendas de B.
- ID opaco não é autorização; links de recuperação expiram e não permitem replay de autenticação.
- CV/vaga com prompt injection não muda as regras nem aciona ferramentas.
- Parser tolera documentos corrompidos, zip bomb, macros e timeout sem execução.
- HTML, URLs e CSV são tratados contra injeção; dados de CV não vão para logs/analytics.
- Segredos apenas no ambiente correto; sem CVs reais no Git.
- Live rejeita adaptadores não configurados e não aceita mocks como confirmação.

## Comércio
- Confirmar estados OKANDA, assinatura, ambiente, moeda, montante, artigos e referência real.
- Retorno falso `paid=true` não dá acesso.
- Duplicado/replay e eventos concorrentes não duplicam encomendas, direitos ou emails.
- Kit sem bump; cada bump isolado com kit; ambos; abandono; falha; pendente; reembolso parcial e total.
- Email de compra verificado antes de associar conta; não confiar em email fornecido pelo browser.
- Testar MB WAY no checkout concreto e regresso mobile; não anunciar método sem prova.

## Visual e acessibilidade
- 360/390/768/1280/1440px sem overflow, cortes ou ações inacessíveis.
- Navegação por teclado, foco, labels, erros, radios, contraste, movimento reduzido.
- Mesmos tokens em páginas públicas, privadas, recursos, emails e anúncios.
- VSL com legendas/transcrição, sem autoplay com som nem CTA bloqueado.
- PDF/DOCX finais revistos visualmente página a página e editáveis quando anunciado.
- Criativos individuais; copy legível e sem interfaces/funcionalidades inexistentes.
- Sem lorem ipsum, reviews fictícias, contadores falsos ou preços divergentes.

## Operação
- Consentir/revogar marketing testado; recusa não retira acesso ao kit.
- Eliminação de originais, textos, resultados, backups/filas documentada e testada conforme política.
- Apoio, termos, privacidade e condições reais; gates aprovados antes de deploy público.
- Registar evidência por teste, commit e ambiente. Uma build sem erros não é prova de qualidade visual nem de integração de pagamentos.
