# Kit Emprego dos Sonhos — Portugal
## Pacote de arranque para o Antigravity · v2.0 · 12/09/2026

**SEM EDITOR DE CV NA PLATAFORMA.** A última decisão do responsável do projeto prevalece sobre toda a documentação v1: manter o analisador gratuito, o quiz e os modelos de CV descarregáveis; não desenvolver um construtor/editor de currículos nem uma exportação personalizada de CVs no browser.

Este repositório começa como uma especificação executável, conteúdo editorial e sistema de design. **Ainda não é uma aplicação implementada.** A implementação, os ficheiros finais dos produtos, as artes e o vídeo devem ser produzidos a partir deste pacote no Antigravity.

### Começar
1. Ler `COMECAR_AQUI.md` e `AGENTS.md`.
2. Abrir a pasta inteira no Antigravity, incluindo `.agents/`.
3. Colar o conteúdo de `PROMPT_ANTIGRAVITY.md`.
4. Para publicar o pacote num novo repositório privado, seguir `docs/11_GITHUB.md`.

### Produto a construir
Anúncios → análise de CV **ou** quiz → resultado útil → envio opcional do plano por email → oferta com VSL na mesma página → **checkout OKANDA com bumps** → área do comprador.

A área do comprador integra o guia, modelos para descarregar, cartas e mensagens, plano de ação, progresso e gestor simples de candidaturas. Dois complementos: Entrevista dos Sonhos e LinkedIn dos Sonhos. A análise gratuita não volta a ser vendida com outro nome.

### Fonte única de verdade
- `config/`: oferta, funcionalidades, integrações e bloqueios de publicação.
- `design/`: tokens, componentes, ecrãs, documentos e direção dos materiais.
- `content/`: textos do produto, quiz, páginas, anúncios, emails e VSL.
- `contracts/`: contratos internos; **não são endpoints oficiais da OKANDA**.
- `reference/`: lógica de referência do quiz, sem serviço de IA implementado.
- `docs/`: âmbito, arquitetura, segurança, integrações e plano de execução.
- `qa/`: critérios, exemplos fictícios e validador do pacote.
- `scripts/`: criação segura do repositório e validação de integridade.

Validar o pacote: `python3 qa/check_spec.py`.

### Estado da entrega
Conteúdos-fonte: preparados. Direção e tokens de design: definidos como base de implementação. Aplicação, artes finais, ficheiros PDF/DOCX e vídeo: a produzir. Integrações externas e conformidade para venda: por confirmar. Repositório remoto: **não criado nesta sessão**; o script incluído executa essa ação na máquina autenticada do responsável.

Não copiar os documentos v1 para esta pasta: contêm requisitos entretanto revogados. Não colocar CVs reais, leads, credenciais, encomendas ou ficheiros de fontes neste repositório.
