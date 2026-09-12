# Histórico
## 2.0 — 12/09/2026
- Pacote único de arranque para produtos, páginas, recursos, anúncios e VSL.
- Editor de CV e exportação personalizada removidos por decisão explícita.
- Analisador gratuito, quiz, modelos descarregáveis e gestor de candidaturas mantidos.
- Design system único, tokens reutilizáveis e critérios de consistência transversal.
- Conteúdo editorial, contratos, lógica de referência do quiz e verificações locais acrescentados.
- Documentação v1 não incorporada para evitar requisitos contraditórios.

## 2.0-app — 12/09/2026 (Implementação Integral da Plataforma)
- Plataforma completa em Next.js 15 App Router, React 19, TypeScript e Vanilla CSS sem Tailwind.
- Repositório remoto no GitHub sincronizado em `https://github.com/kiumaa/kit-emprego-dos-sonhos-pt.git`.
- Geração de 15 entregáveis estáticos autênticos (modelos DOCX abertos e editáveis externamente no Word/Docs, e PDFs editoriais A4) sem dependências externas.
- Rotas públicas e comerciais (/analisar-cv, /quiz, /resultado/[id], /kit, /obrigado) com diagnóstico honesto sem notas falsas de ATS.
- Área do membro (/area/*) com leitor completo de 10 lições markdown, biblioteca de recursos, modelos de CV para descarregar, gestor de candidaturas com proteção CWE-1236, plano de 7 dias, bumps de Entrevista e LinkedIn, e centro de privacidade RGPD.
- Painel de Operação e Governação (/admin) para controlo de barreiras de lançamento (release gates), auditoria de encomendas e concessão documentada de suporte.
- API interna completa (/api/diagnostics/*, /api/commerce/*, /api/orders/*, /api/applications/export).
- 100% de testes aprovados: Vitest (11/11), Next.js production build (40/40 páginas estáticas/dinâmicas geradas), e QA Spec (23/23).
