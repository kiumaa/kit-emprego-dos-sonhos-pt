# Dados, privacidade e acesso

## Modelo de domínio a implementar
| Entidade | Campos principais | Regra |
|---|---|---|
| users | id, auth_subject único, email verificado, created_at | autenticação não implica marketing |
| diagnostic_sessions | id aleatório, token_hash, expires_at, user_id opcional | cookie HttpOnly; não é público pelo ID |
| analysis_jobs | id, session_id, status, provider_ref, expires_at | original temporário, sem texto em logs |
| diagnostic_results | id, session_id, source, report_json, expires_at | só sessão/owner; `no-store`, `noindex` |
| leads | id, email, verified_at, requested_report_id | mínimo para envio solicitado |
| consent_events | subject_id, purpose, version, action, timestamp | consentir/revogar; registo auditável |
| orders | id, provider_order_id único, state, currency, total_minor | estado verificado no servidor |
| order_lines | order_id, product_id, amount_minor, refunded_minor | montantes inteiros, nunca float monetário |
| payment_events | provider, external_id único, processed_at, outcome | idempotência; payload mínimo/limitado |
| entitlements | user_id, product_id, order_line_id, start_at, end_at, revoked_at | derivar acesso de compras válidas |
| lesson_progress | user_id, lesson_slug, completed_at | índice único por pessoa/lição |
| applications | id, user_id, company, role, url, state, next_action, dates, notes | autorização por proprietário |
| outbox | id, type, payload mínimo, dedup_key único, state | email após commit, repetível sem duplicar |
| audit_log | actor_id, action, object_id, timestamp | sem CV/email desnecessário |

Índices por user_id e expiração. Foreign keys e constraints de estado/montantes. As sessões anónimas não têm acesso aos conteúdos pagos. Não armazenar campos de currículo para o construir: essa funcionalidade foi removida.

## Conservação — política a aprovar, não promessa pública
Proposta inicial: eliminar original e texto extraído logo após processamento, com teto operacional de 24h incluindo falhas; resultado anónimo expira em 24h; plano guardado tem prazo específico a aprovar; leads promocionais revistos após 180 dias de inatividade; dados de encomendas e faturação segundo deveres legais efetivamente aplicáveis.

Estes valores não estão aprovados. O fornecedor de IA, backups, filas e logs podem ter retenções distintas: inventariar e verificar. Não publicar “eliminamos tudo em 24 horas” antes de o provar no conjunto do sistema. Bloquear análise real enquanto a política não estiver decidida e implementada.

## Informação e escolhas
Informar responsável, finalidade, base jurídica, destinatários/prestadores, transferências, prazos e direitos antes de recolher dados. Consentimento para ofertas separado de entrega do relatório. Não usar checkbox obrigatória de marketing. Aceitar/rejeitar cookies opcionais com clareza semelhante. Base jurídica de tratamentos necessários deve ser avaliada; consentimento não é uma solução universal [S4–S6].

Não enviar CVs, nomes, emails, respostas, excertos, dificuldades ou resultados para Meta Pixel/analytics. Evitar PII em URLs. Não construir audiências a partir de dados de carreira recolhidos no diagnóstico. Desativar session replay em rotas de diagnóstico e área privada.

## Prestadores e países
Confirmar entidade vendedora (Portugal/Angola/outra), estabelecimento, mercados, prestadores, localização de dados e transferências. Não assumir que escolher uma região europeia resolve todas as obrigações. Rever contratos e subprocessadores com apoio competente.

## Direitos e operações
Exportar dados próprios com autenticação reforçada quando adequado; eliminar conta/diagnósticos e conteúdos do tracker quando devido; segregar registos que tenham retenção obrigatória. Permitir revogação de marketing sem eliminar acesso ao produto. Não divulgar existência de conta numa resposta pública de recuperação.

Fontes primárias e notas de revisão em `docs/12_FONTES.md`. Documento de requisitos, não parecer jurídico nem política legal pronta para publicação.
