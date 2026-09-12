# Funil e quiz

Anúncio → `/analisar-cv` ou `/quiz` → resultado e oferta → checkout OKANDA → confirmação no servidor → área privada. A página `/kit` permite compra direta. A oferta não é um bloqueio para ler o resultado nem o vídeo um bloqueio para comprar.

## Quiz
Oito perguntas de escolha única em `content/quiz/quiz.json`. Q1 e Q2 são contexto, não pontuação. As seis restantes observam preparação do CV, adaptação, evidência, organização, mensagem e revisão. Pontos 0–3 por resposta; total interno 0–18. Não expor como probabilidade de emprego.

Faixas: 0–6 “Preparar a base”; 7–12 “Consolidar a candidatura”; 13–18 “Afinar e acompanhar”. As prioridades são as dimensões com menos pontos, com desempate definido no JSON. Se todas têm 2 ou mais pontos, reconhecer a preparação; apresentar refinamentos e não “falhas graves”.

A opção sobre disponibilidade do CV altera a primeira ação sugerida, não promete que o documento foi analisado. Área profissional não cria estereótipos nem altera preço. Não pedir idade, género, nacionalidade, rendimentos, condição migratória ou situação de saúde.

A referência executável está em `reference/quiz_engine.py`, com testes em `qa/`. Portar para TypeScript preservando o comportamento. Rejeitar perguntas desconhecidas, respostas inválidas ou incompletas; nunca preencher respostas para fabricar um resultado.

## Captura
Resultado completo visível na sessão. “Enviar o meu plano” solicita email e um envio transacional. Uma checkbox separada autoriza conteúdos/ofertas. Guardar evidência da finalidade, versão do texto, data e revogação. Não interpretar entrega do plano, compra ou criação de conta como marketing opt-in.

## Personalização
Sem CV: destacar modelos e lição de estrutura. Dificuldade de organização: plano e tracker. Dificuldade de mensagem: cartas e modelos. Mesmas inclusões, preço e condições. Não enviar dificuldades ou resultado aos pixels de publicidade.

## Limites de atribuição
Identificador aleatório de percurso liga eventos mínimos e checkout quando o contrato permitir. Não pôr email, nome, conteúdo, respostas ou token de acesso em UTM. Acesso a resultados exige autorização, e links de email expiram e são de uso único quando dão acesso à conta.
