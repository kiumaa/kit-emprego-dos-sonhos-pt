# Mapa de ecrãs e comportamento

A lista programática está em `contracts/routes.json`. Todas as páginas têm layout responsivo, estados vazios/erro/carregamento e as mesmas fundações de design. Não criar rotas de edição de CV.

## 1. Entrada `/`
Cabeçalho com marca, “Conhecer o kit” e “Entrar”. H1: “Antes da próxima candidatura, descobre o que podes melhorar.” Texto: análise de CV ou diagnóstico rápido. CTA azul “Analisar o meu CV”; alternativa “Não tenho o CV comigo — fazer o quiz”. Nota “Gratuito. Sem cartão. Não é uma candidatura a uma oferta de emprego.”

Primeiro scroll: explicar CV/quiz/resultado com três passos sem numerais decorativos gigantes; amostra identificada de prioridade útil; secção breve do kit; perguntas frequentes; footer. Não ocupar a primeira dobra com testemunhos, bandeiras ou números de vendas.

## 2. Analisador `/analisar-cv`
H1: “O que pode ficar mais claro no teu CV?” Campo PDF/DOCX e limites. Tabs “Enviar ficheiro” / “Colar texto”. Função pretendida e descrição de vaga opcionais, sem exigir os dois. Aviso de dados pessoais antes do envio; link para privacidade e explicação do uso de IA. CTA “Analisar o meu CV”. Alternativa quiz sempre visível.

Estados: ficheiro escolhido, tipo inválido, demasiado grande, protegido/digitalizado, texto insuficiente, limite atingido, erro do serviço. Mensagens oferecem correção ou quiz; nunca produzem um resultado genérico como se tivesse havido análise.

## 3. Quiz `/quiz`
Uma pergunta por ecrã, contador de 1 a 8 e voltar. Contexto preservado apenas na sessão. Opções radio clicáveis em toda a área, seleção por teclado, botão continuar. Na última pergunta: “Ver o meu resultado”. Pontuação interna determina orientações, não uma nota de empregabilidade. Não mostrar respostas do quiz a ferramentas de tracking.

## 4. Resultado `/resultado/[id]`
Primeiro bloco: origem (“Com base no teu CV” / “Com base nas tuas respostas”), resumo, pontos fortes, até três prioridades, ação gratuita e nota de limites. Resultado com acesso por sessão/conta, não apenas por ID difícil de adivinhar. Sem indexação, sem cache partilhada.

Segundo bloco: “Guarda o teu próximo passo.” Email obrigatório apenas para envio, nome opcional, marketing separado. Recusar/ignorar o formulário mantém a oferta disponível.

Terceiro bloco: “Agora tens um ponto de partida. Vamos preparar a candidatura.” VSL com imagem representativa, legendas/transcrição, CTA e preço visíveis independentemente da reprodução. Benefícios ajustam-se à origem; conteúdos/condições são iguais para todos.

Quarto bloco: amostras do kit, inclusões e exclusões, preço final configurado, prazo aprovado, FAQ e “Obter o kit na OKANDA”. Respeitar redução de movimento e manter acessível sem vídeo. Não rebaixar diagnósticos favoráveis para justificar a venda.

## 5. Oferta direta `/kit`
Mesma oferta, conteúdos, preço e VSL do resultado, sem alegar que analisámos o visitante. Hero: “Prepara a tua próxima candidatura sem começar do zero.” Demonstração de guia, modelos e organização, não de um editor online.

## 6. Retorno `/obrigado`
“Estamos a confirmar o pagamento” enquanto falta confirmação legítima. Se pago, artigos e acesso; se pendente, estado e instrução; se falhou/cancelado, retomar apenas checkout legítimo; se sem contexto, procurar compra mediante email verificado. Nunca confiar em `paid=true` ou numa URL de sucesso.

## 7. Área privada
`/area`: continuar lição, uma tarefa recomendada, progresso e recursos recentes. `/area/biblioteca`: categorias e formatos; não mostrar 50 cards vazios. `/area/modelos-cv`: pré-visualização estática, instruções, descarregar DOCX e PDF de exemplo. Não há campos para preencher currículo.

`/area/licoes/[slug]`: leitura, exemplo, tarefa e concluir. `/area/mensagens`: filtro por contexto, copiar e descarregar pack; manter placeholders humanos reconhecíveis. `/area/plano`: dias/tarefas reais, sem promessa de emprego em sete dias. `/area/candidaturas`: lista responsiva, criar/editar registo, estado, próximo passo, CSV. Formulários do tracker nunca compõem um CV.

`/area/entrevista` e `/area/linkedin`: conteúdos só para artigo adquirido. Área bloqueada mostra descrição honesta e caminho comercial real se existir; sem botões de compra quebrados. `/area/conta`: artigos, período de acesso, recuperar dados, pedidos de privacidade, marketing opt-in/out independente.

## 8. Operação e legal
`/admin` minimalista: pesquisar encomenda, estado verificado, direitos concedidos, reprocessar operações autorizadas com auditoria. Não listar CVs nem permitir fingir pagamento. Downloads privados e decisões administrativas sempre auditados.

Páginas legais com identidade real; desenvolvimento usa aviso de rascunho e impede publicação. Apoio com canal confirmado, sem número/e-mail fictícios. Em toda a aplicação: 404, indisponibilidade e sessão expirada com um caminho de recuperação.
