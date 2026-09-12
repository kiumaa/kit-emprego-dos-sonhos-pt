# Relatório de validação do pacote

Data: 12/09/2026 · versão 2.0 · âmbito: especificação, conteúdo e código de referência.

## Executado
- `python3 -B qa/check_spec.py`: **23 testes passaram**.
- O teste exaustivo percorreu as **4 096 combinações** das seis perguntas pontuadas; as duas perguntas de contexto foram testadas separadamente quanto à neutralidade da pontuação.
- Os testes incluem respostas inválidas/incompletas, desempates, resultados favoráveis, fontes dos recursos, remoção do editor, contratos de evidência e ausência de comparação com vaga não fornecida.
- Tokens JSON/CSS comparados e três pares principais de contraste de texto verificados acima de 4,5:1.
- Todos os JSON e a sintaxe Python foram analisados sem erro.
- Schema de análise Draft 2020-12 e fixture válida verificados com `jsonschema` no ambiente de preparação. O validador normal do pacote usa apenas Python standard library.
- `bash -n scripts/create-github-repo.sh`: sintaxe válida.
- `bash scripts/create-github-repo.sh --dry-run`: operação privada proposta corretamente, sem alterações ou chamadas de criação.

## Não executado / não entregue como concluído
Aplicação frontend/backend, teste real de modelo de IA, resistência real do parser a ficheiros maliciosos, testes de browser/acessibilidade, renderização final de PDF/DOCX, produção de anúncios/vídeo, pagamento OKANDA, envio de email, revisão jurídica ou criação de repositório remoto.

A fixture de prompt injection é um caso de teste a executar na integração real. Ter o caso escrito não prova resistência do modelo. Os testes locais validam contratos e invariantes, não a aplicação ainda por desenvolver.

O script de criação GitHub não foi executado com `--apply`. Credenciais não foram solicitadas, lidas ou incluídas. Nenhum ficheiro de fontes foi incluído.

## Integridade
`MANIFEST.json` regista o hash SHA-256 e o tamanho de cada ficheiro entregue, exceto o próprio manifesto. Verificar com `python3 scripts/verify_manifest.py`. O manifesto identifica a entrega inicial; atualizá-lo intencionalmente para uma nova distribuição, sem confundir alterações de desenvolvimento com corrupção.
