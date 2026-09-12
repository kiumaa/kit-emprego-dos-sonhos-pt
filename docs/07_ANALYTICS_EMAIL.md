# Medição e mensagens

## Eventos mínimos
`landing_view`, `diagnostic_started` (cv/quiz), `diagnostic_completed` (origem, sem resultado), `diagnostic_failed` (código sanitizado), `report_email_requested`, `marketing_opt_in`, `offer_view`, `vsl_play`, `checkout_intent`, `purchase_verified`, `resource_download`, `lesson_completed`, `application_created`.

Eventos comerciais da compra confirmada nascem no servidor. Deduplicar por event_id. Proibir payloads com CV, email, nome, respostas, pontuações, excertos ou dificuldades. Rotas dinâmicas com tokens são sanitizadas. Ferramentas não essenciais só após consentimento válido. Métricas agregadas internas também precisam de fundamento e minimização adequados.

## Funil
Medir separado CV/quiz: início→conclusão, conclusão→pedido do plano, resultado→checkout, checkout→pagamento, compra→primeiro recurso/tarefa, reembolso. Não comparar só custo por lead. AOV = receita de encomendas pagas / encomendas pagas; margem desconta impostos aplicáveis, taxas reais, custos de IA/email, reembolsos e publicidade. Não chamar receita a lucro.

Não existem metas de conversão comprovadas neste pacote. Definir orçamento máximo e critérios de paragem antes da campanha. Não iniciar despesas automaticamente. Segmentar por origem de campanha, não por dados sensíveis ou diagnóstico individual.

## Email
Conteúdos em `content/marketing/emails.json`. Transacionais: plano solicitado, acesso após compra verificada, recuperação. Promocionais: sequência só para opt-in válido e com cancelamento. Cancelamento deve bloquear envios futuros e preservar registo mínimo de supressão conforme política.

Dedup keys em pedidos de envio; rate limits; tokens com expiração, hash no servidor e uso único quando autenticação. Não pôr relatório completo com dados pessoais no assunto ou preview do email. Double opt-in recomendado para marketing e prova de controlo do endereço; configurar conforme revisão jurídica.

Sem domínio de envio validado, os emails ficam em ambiente de testes e não são enviados a pessoas reais. Preencher apoio e identidade reais antes de produção. Para compradores, parar emails que insistem em vender o produto já adquirido, sem conflituar com mensagens transacionais.
