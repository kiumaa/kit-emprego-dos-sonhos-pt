#!/usr/bin/env bash
# Cria apenas um repositório novo e privado, a partir do pacote inicial validado.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTE="kiumaa/kit-emprego-dos-sonhos-pt"
MODE="${1:---dry-run}"
if [[ "$MODE" != "--dry-run" && "$MODE" != "--apply" ]]; then
  echo "Uso: bash scripts/create-github-repo.sh [--dry-run|--apply]" >&2; exit 2
fi
if [[ "$MODE" == "--dry-run" ]]; then
  printf 'Sem alterações. Operação proposta:\n  Origem: %s\n  Repositório: %s\n  Visibilidade: privada\n' "$ROOT" "$REMOTE"
  echo 'Verificar conta kiumaa, integridade e identidade Git; criar commit inicial; executar:'
  printf '  gh repo create %s --private --source="%s" --remote=origin --push\n' "$REMOTE" "$ROOT"
  echo 'Para executar, depois de autenticação local: bash scripts/create-github-repo.sh --apply'
  exit 0
fi
for tool in git gh python3; do
  command -v "$tool" >/dev/null 2>&1 || { echo "Falta $tool. Instala-o e autentica localmente antes de continuar." >&2; exit 1; }
done
cd "$ROOT"
# Recusar trabalho pré-existente, incluindo um .git herdado de pasta superior.
if git rev-parse --show-toplevel >/dev/null 2>&1; then
  echo 'Esta pasta já pertence a um repositório Git. Não será modificada por este script.' >&2
  echo 'Usa o fluxo normal de branches/commits, preservando o trabalho existente.' >&2; exit 1
fi
gh auth status >/dev/null 2>&1 || { echo 'Autentica localmente com gh auth login. Não partilhes tokens.' >&2; exit 1; }
LOGIN="$(gh api user --jq .login)"
if [[ "$LOGIN" != "kiumaa" ]]; then
  echo 'A conta autenticada não é kiumaa. Operação cancelada.' >&2; exit 1
fi
if ! git config --get user.name >/dev/null || ! git config --get user.email >/dev/null; then
  echo 'Configura a tua identidade Git (user.name e user.email) antes do commit. Nada foi criado.' >&2; exit 1
fi
python3 -B scripts/verify_manifest.py
python3 -B qa/check_spec.py
# A criação remota falhará com segurança se o nome já existir. Nunca substituir ou apagar.
git init -b main
python3 -B - <<'PYSTAGE'
import json, subprocess
from pathlib import Path
root=Path.cwd()
data=json.loads((root/'MANIFEST.json').read_text(encoding='utf-8'))
paths=[entry['path'] for entry in data['files']] + ['MANIFEST.json']
# Apenas os ficheiros conhecidos e verificados do pacote, nunca uploads ou .env locais.
subprocess.run(['git','add','--',*paths],check=True)
PYSTAGE
git commit -m "docs: pacote inicial KEDS Portugal sem editor de CV"
if ! gh repo create "$REMOTE" --private --source="$ROOT" --remote=origin --push; then
  echo 'Não foi possível concluir criação/publicação remota. O commit local foi preservado.' >&2
  echo 'Inspeciona git status e git remote -v. Não apagues nem forces um repositório existente.' >&2
  exit 1
fi
printf 'Criado e publicado: https://github.com/%s\n' "$REMOTE"
echo 'Confirma visibilidade privada e acesso da ligação/app do ChatGPT ao novo repositório.'
