# Checkout OKANDA — contrato de integração a verificar

## Estado
A OKANDA foi escolhida pelo responsável. Não foi fornecida documentação técnica atual nem encontrado um repositório OKANDA acessível na pesquisa desta sessão. **Os tipos presentes neste pacote são contratos internos propostos, não endpoints, headers ou payloads oficiais.** Não preencher URLs fictícios para “fazer funcionar”.

## Dados que faltam antes da ligação real
URL de checkout do kit, IDs reais do produto e dos bumps; suporte a EUR/MB WAY nesse checkout; parâmetros de referência aceites; URLs de retorno suportadas; evento de pagamento, assinatura/autenticação de webhooks, replays e consultas de estado; estrutura das linhas, impostos, reembolsos parciais e chargebacks; política de email do comprador e forma de associar a conta; taxas e responsabilidades da entidade vendedora.

## Percurso seguro
O botão da oferta pede ao nosso servidor uma intenção de compra. O servidor escolhe o produto e preço aprovados, guarda referência opaca e constrói/redireciona para o checkout real permitido. Bumps selecionados no checkout OKANDA; não simular seleções num painel que o fornecedor não recebe.

A página de retorno mostra estado pendente. Apenas uma confirmação legítima no servidor atribui acesso. O adaptador normaliza a resposta do fornecedor e valida assinatura/autenticidade, conta/ambiente, pedido, moeda, montante e artigos. Não confiar em `paid=true`, `email`, preço ou productId recebidos do browser.

Se o fornecedor não suportar metadata/referência opaca, definir conciliação alternativa documentada antes de ir live. Email coincidente não basta para acesso: o cliente prova controlo do email. O contexto de checkout no browser, por si só, não identifica quem ficou com a compra após partilha do URL.

## Idempotência e concessão de direitos
Evento externo tem índice único (provider,eventId). Encomenda externa também é única. Processar registo do evento, estado da encomenda, linhas e direitos numa transação. Duplicado não duplica direitos nem emails. Usar outbox transacional para comunicações posteriores.

Estados normalizados: pending, paid, failed, cancelled, partially_refunded, refunded, disputed. Transições fora de ordem não podem reativar automaticamente uma encomenda reembolsada. Consultar estado autoritativo ou aplicar versão/data quando o contrato suportar.

Cada linha concede o entitlement correspondente. Kit não concede bumps. Reembolso parcial afeta apenas direitos de linhas confirmadas segundo a política aprovada. Não remover direitos de outras compras válidas do mesmo utilizador. Disputa segue o procedimento definido e auditado, não uma decisão improvisada do frontend.

## Prova de pagamento e acesso
O utilizador autentica-se/verifica email, o backend associa a compra verificada e entrega o kit. Em compra noutra conta/email, canal de apoio verifica prova por processo administrativo auditado. Nunca aceitar screenshot de pagamento como confirmação automática.

## Testes bloqueantes
Kit isolado; kit+entrevista; kit+LinkedIn; kit+ambos; pagamento pendente; falha; abandono; retorno antes de webhook; webhook antes de retorno; repetição e replay; assinatura inválida; montante/moeda/artigo errado; mesmo evento simultâneo; reembolso parcial/total; tentativa de acesso a bump não adquirido; fluxo mobile MB WAY e regresso ao navegador.

Não integrar Stripe diretamente nem presumir que o sucesso de MB WAY numa conta Stripe garante a configuração correta da OKANDA para este produto. Mostrar métodos só depois de testados.
