# Refatorar o projeto existente: KEDS v3 — funil + produtos entregues pela OKANDA

Trabalha no repositório `kiumaa/kit-emprego-dos-sonhos-pt`. Não recries o projeto de raiz. Esta instrução é uma nova decisão do responsável e substitui as partes dos documentos anteriores que exigem área de membros, gestor de candidaturas online, autenticação do comprador, entrega própria e Manrope. Continua proibido construir um editor de CV.

## 1. Antes de alterar código
Inspeciona o repositório e o estado de Git. A revisão fornecida foi feita em `b75d31a223ca6b624b56723a4c1b90dc52efe76e`; não sobrescrevas alterações posteriores. Cria a branch `refactor/funil-okanda-satoshi` ou reutiliza-a se já existir, preservando trabalho local. Não publiques nem atives pagamentos sem aprovação.
Lê `docs/AUDITORIA.md`, o presente prompt, `design/DIRECAO_VISUAL_PRODUTOS.md` e `qa/ACEITACAO.md` deste pacote.
Atualiza AGENTS.md, GEMINI.md, regras de agentes, COMECAR_AQUI.md, decisões, contratos, features, offer, release gates, manifestos e documentação de execução para refletirem o NOVO âmbito. Identifica o âmbito v2 como histórico, não como uma segunda fonte de requisitos ativos. Não abras um conflito artificial entre esta decisão e os documentos antigos.

## 2. Produto e percurso obrigatórios
O site serve exclusivamente para captar interesse, produzir diagnóstico real, apresentar uma oferta e encaminhar para checkout.
Percurso: página inicial → analisar CV OU quiz de 8 perguntas → resultado resumido → botão âncora para a apresentação → VSL e oferta na mesma página → link direto para OKANDA PAY.
A OKANDA é responsável por checkout, bumps, pagamento, confirmação e entrega dos ficheiros. Não há área de membros no site. Não construir login, conta, recuperação de acesso, acompanhamento do comprador, biblioteca privada, DRM, subscrições, editor de CV ou sistema próprio de encomendas/entitlements.
Conservar a página `/kit` para compra direta, reutilizando a mesma secção de oferta, VSL, preço e link externo. Nessa página não inventar diagnóstico personalizado.

## 3. Corrigir o percurso de diagnóstico antes de o anunciar como funcional
- `src/app/analisar-cv/page.tsx`: enviar efetivamente o ficheiro/texto e contexto para a API, com estados reais de envio, erro e cancelamento.
- `src/app/api/diagnostics/cv/route.ts`: remover extração pelo nome do ficheiro e recomendações fixas. Implementar leitura verdadeira de PDF/DOCX com dependências seguras e compatíveis. Validar tipo real, limites de tamanho/texto/páginas, ficheiros vazios ou protegidos, descompressão excessiva e timeouts. Um PDF imagem ilegível deve oferecer colar texto/quiz, não uma análise inventada. OCR não é requisito desta versão.
- Ligar análise no servidor a fornecedor configurado, validar a saída com o schema e devolver evidência textual para observações importantes. Tratar CV e descrição da vaga como dados não confiáveis, nunca como instruções. Um filtro de duas frases não é proteção suficiente contra prompt injection.
- Sem fornecedor/chave real: devolver indisponibilidade explícita e oferecer quiz. Nunca apresentar uma demonstração como análise live; nunca fazer chamadas de IA com segredos no cliente.
- `src/app/diagnostico/em-processamento/page.tsx`: estados ligados à operação, sem temporizadores que finjam leitura. Não atrasar o quiz artificialmente.
- `src/app/resultado/[id]/page.tsx`: remover `fallbackAnswers` em rotas públicas. Carregar o resultado verdadeiro e distinguir `source: 'cv'` de `source: 'quiz'`.
- Usar sessão anónima temporária com autorização adequada para o próprio resultado. Preferir resposta derivada mínima em sessionStorage para o mesmo separador, com validação/expiração; não guardar o CV bruto no navegador ou URL. Se usar armazenamento no servidor, exigir token/sessão que autorize o resultado, TTL curto, IDs não previsíveis e sem cache público. Não construir contas para isto.
- Ausência/expiração gera estado honesto com botão para recomeçar. Não mostrar dados fictícios.
- CVs bons podem receber feedback favorável. Não forçar 3 defeitos, uma nota baixa ou um perfil alarmista para vender. O quiz é autorrelato, não análise documental nem avaliação psicométrica.
- Não enviar nome, email, texto de CV, nome do ficheiro ou observações pessoais para pixels/analytics. Minimizar retenção e atualizar informação de privacidade ao comportamento real.

## 4. Resultado resumido + oferta na MESMA página
Ordem de secções:
1. Marca discreta e indicação Portugal.
2. Título do resultado, resumo de 2–3 frases, origem da avaliação e até 3 prioridades justificadas.
3. Uma ação gratuita concreta e útil. O kit pago serve para executar e aprofundar, não para revelar um diagnóstico prometido como grátis.
4. CTA âncora: `Ver como preparar a minha candidatura`, destino `#apresentacao`.
5. Transição: `Já tens um ponto de partida. Agora, prepara a próxima candidatura.`
6. VSL real, seguida de apresentação dos recursos, pré-visualizações fiéis, preço, entrega pela OKANDA, FAQ, apoio e condições.
7. CTA de compra: `Quero o Kit Emprego dos Sonhos` → link OKANDA real e validado.
A área útil do diagnóstico deve ser concisa, sem dezenas de cartões, sem esconder o resultado atrás de email. Não ocultar o preço ou botão de compra até ao fim do vídeo. Captura opcional de email pode existir fora do caminho principal, mas fica desligada até haver fornecedor real e consentimento separado para marketing. Remover `console.log` de contactos e sucessos simulados.

## 5. VSL: implementar já; o ficheiro final será carregado depois
Usar `implementation/VslPlayer.tsx` e `vsl-controller.ts` deste pacote como base adaptável, mantendo o comportamento.
- Elemento HTML video com playsInline e metadados. Ao entrar suficientemente no ecrã, tentar pré-visualização automática SEM SOM.
- Mostrar botão legível `Ativar som e ver desde o início`. Mostrar "Pré-visualização sem som" apenas se estiver efetivamente a reproduzir.
- No clique/tecla do botão, dentro do mesmo gesto do utilizador: pausar, definir currentTime=0, desativar mute, retirar loop de preview e chamar play. Sem await de rede ou temporizador antes de play.
- Som só após interação explícita. Depois do clique, apresentar controlos reais de pausa, reprodução, som, progresso e ecrã completo. Não usar barra de progresso falsa.
- Tratar a Promise de play e bloqueio de autoplay; oferecer reprodução manual quando necessário.
- Respeitar movimento reduzido/economia de dados. Permitir pausar a preview. Pausar quando fora do ecrã ou separador oculto, sem retomar som automaticamente.
- Legendas PT-PT e transcrição quando a VSL existir. Preservar proporção 16:9 sem cortar demonstrações.
- Configurar src/poster/captions em ficheiro único. Enquanto src estiver vazio, não mostrar falso player ou afirmar que está a reproduzir; estado honesto de preparação e oferta acessível. Não inventar a VSL.
- Adicionar os testes no React real e em Safari/iOS; a QA do controlador isolado não valida a aplicação completa.

## 6. Compra externa e remoção de âmbito
Criar uma única fonte de configuração para o link de checkout. Todos os botões de compra usam esse link em HTTPS e host exato aprovado (`okandapay.com`/host oficial efetivamente confirmado). Sem URL fornecida por parâmetros do visitante, redirecionamento aberto, alertas de sucesso ou URLs inventadas. Se não estiver configurado, o CTA não deve aparentar compra funcional e o lançamento comercial fica bloqueado.
Não são necessários API key, webhook ou pedido de criação de encomenda no site apenas para navegar para um checkout existente. Não contar `checkout_click` como compra. Medição de compra só com mecanismo de confirmação real suportado pela OKANDA; não é bloqueio do funil básico.
Os bumps Entrevista e LinkedIn são escolhidos na OKANDA, opcionais e não pré-selecionados. Não duplicar seleção de bumps no site. Preço e conteúdos da oferta base têm de corresponder ao checkout; valores atuais são 14,90 €, 4,90 € e 5,90 €, sujeitos à confirmação comercial.
Retirar `/area/**`, `/entrar`, `/admin`, gestão local de utilizadores/encomendas/candidaturas e APIs correspondentes do âmbito publicado. Não apagar dados reais de compradores ou integrações partilhadas sem inventário. Definir 404/410 ou encaminhamento neutro para rotas antigas; não simular pagamento em `/obrigado` por query string.
Remover navegação, emails, VSL e condições que prometem acesso à plataforma, progresso de lições, biblioteca privada, 12 meses de área de membros ou gestor online. Preservar os conteúdos como materiais descarregáveis. Atualizar regras de livre resolução/entrega conforme a oferta real, sem inventar exceções ou aprovações legais.

## 7. Produtos entregues pela OKANDA
Manter os conteúdos-fonte e produzir três entregas independentes:
- Kit principal: guia com as 10 lições, dois modelos CV editáveis e exemplos, três cartas, dez mensagens, checklists, 25 prompts, plano de sete dias e organizador em ficheiro.
- Bump Entrevista dos Sonhos: manual + workbook STAR + perguntas e exercícios.
- Bump LinkedIn dos Sonhos: manual + exercícios de perfil e networking.
Não inserir os bumps pagos no ZIP principal. Não esvaziar o conteúdo ao remover a área privada.
Gerar artefactos finais em pasta local privada/excluída do Git e do deploy; não em `public/downloads`. A pasta pública contém só previews aprovados e amostras realmente gratuitas. Rever a exposição dos conteúdos num repositório público e comunicar ao responsável, sem mudar visibilidade/regravar histórico sem autorização.
Preparar manifesto de ficheiros, versões, tamanhos e SHA-256 para upload na OKANDA; testar principal isolado, cada bump e ambos. Não declarar entrega concluída sem compra e acesso verificados na OKANDA.

## 8. Design system Satoshi e produtos
Seguir `design/DIRECAO_VISUAL_PRODUTOS.md` e aplicar patch aos tokens existentes, sem criar um sistema visual paralelo.
Substituir Manrope por Satoshi em interface, produtos editoriais, capas, anúncios novos e legendas gráficas. Não usar import inexistente de Satoshi em next/font/google. Obter a fonte pelo canal oficial Fontshare e respeitar a licença; não incluir binários de fonte no ZIP para compradores/repositório público. Prever fallback e testar carregamento real, pesos e acentos PT-PT.
Manter #FFFFFF, #1D1D1F, #51515A, #F5F5F7 e #0057D9. Botões consistentes, espaçamento generoso, foco visível, texto legível, radius e sombras moderados. Não inventar outra paleta para os bumps.
Referência: flyers aprovados, com profissionais africanos, contextos naturais e bandeira de Portugal discreta. Usar a linguagem, não encolher um anúncio inteiro para uma capa nem conservar texto rasterizado da fonte antiga. Não usar slogans em todos os objetos, números falsos ou dezenas de mockups. As fotografias não são testemunhos de clientes.
Os CVs finais destinados a candidaturas não levam logótipo do kit, bandeira ou publicidade. A família editorial mantém a identidade nas capas dos manuais e previews. DOCX precisa de fallback documentado quando o comprador não tem Satoshi; não embutir a fonte editável sem permissão nem prometer renderização universal.

## 9. Critérios de conclusão
Executar typecheck, testes e build. Testar percursos reais CV/quiz, indisponibilidade e sessão expirada; âncora; autoplay mudo; reinício com som; pausa e retoma; vídeo ausente/404; checkout real; formulários sem falsos sucessos; páginas sem downloads pagos públicos.
Testar 360, 390, 768, 1280 e 1440 px. Renderizar todos os PDFs/DOCX, verificar texto fora das margens, acentos, paginação, conteúdo e legibilidade das capas em miniatura. Verificar a fonte efetivamente renderizada, não só declarada no CSS.
Entregar relatório com commit/branch, alterações, testes executados, capturas desktop/mobile e dos documentos, pendências reais de integração e localização dos artefactos de upload. HTTP 200 ou build verde não equivalem a funcionalidade ponta a ponta. Não afirmar "100% completo" perante simulações, conteúdo em falta ou testes não executados.
