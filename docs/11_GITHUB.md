# Repositório partilhado

## Nome e acesso
Proposta: `kiumaa/kit-emprego-dos-sonhos-pt`, **privado**. O remoto não foi criado nesta sessão: a ligação disponibilizou ações de leitura e este ambiente não tem CLI GitHub autenticada.

O pacote inclui um script para criar e publicar o repositório num ambiente autorizado. Usa comandos documentados do GitHub CLI [S2–S3]. Não pede um token no chat, não faz force push e não substitui um repositório existente.

## Procedimento no computador / Antigravity
1. Extrair a pasta fora de outro repositório Git. Abrir a pasta inteira no Antigravity.
2. Confirmar que Git, Python 3 e GitHub CLI estão instalados. O script não instala software automaticamente.
3. Autenticar localmente com `gh auth login` e verificar `gh auth status`. Nunca copiar tokens para uma conversa ou ficheiro de código.
4. Ter identidade Git configurada (`git config user.name` e `git config user.email`) antes de criar o primeiro commit. Usar a identidade real escolhida pelo responsável; não inventar email.
5. Executar `bash scripts/create-github-repo.sh` para rever a operação sem alterações.
6. Executar `bash scripts/create-github-repo.sh --apply` para criar o repositório privado e publicar os ficheiros do manifesto.

O script recusa uma conta diferente de `kiumaa`, uma pasta já inicializada em Git, um repositório-pai ou alterações de integridade ao pacote inicial. Se já começaste o desenvolvimento, não forces o script: revê os ficheiros, inicializa/publica por fluxo normal autenticado, preservando alterações. Não fazer `git add .` de uma pasta com credenciais ou CVs reais.

Se o nome remoto já existir ou a API recusar a criação, não é substituído. O script pode ter criado o commit local antes dessa falha; inspecionar `git status`/`git remote -v` e recuperar manualmente sem apagar trabalho. Não voltar a executar às cegas.

## Depois de criar
Confirmar no GitHub que a visibilidade é privada e que os ficheiros estão no branch esperado. Dar acesso ao novo repositório à ligação/app usada pelo ChatGPT, se a instalação estiver limitada a repositórios selecionados. Não é necessário tornar o projeto público.

Cada máquina/agente trabalha por branches e publica commits. Fazer pull/rebase com cuidado antes de começar outra alteração. GitHub guarda versões; não é uma sessão de coedição em tempo real nem garante sincronização de alterações ainda não enviadas.

Não guardar CVs, leads, encomendas reais, dados de autenticação ou fontes. Recursos pagos podem estar num bucket privado; o código contém referências autorizadas, não URLs públicas permanentes.

## Proteções recomendadas
Proteger `main`, usar pull requests com testes e revisão visual, permissões mínimas e ambientes preview protegidos. Não afirmar que estas proteções já foram configuradas. Não incluir acesso de terceiros sem autorização.
