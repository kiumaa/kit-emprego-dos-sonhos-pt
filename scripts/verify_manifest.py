"""Verify delivered files without disclosing secrets or modifying the package."""
from pathlib import Path
import hashlib
import json
import sys
ROOT = Path(__file__).resolve().parents[1]

def verify() -> list[str]:
    manifest = json.loads((ROOT / 'MANIFEST.json').read_text(encoding='utf-8'))
    errors = []
    seen = set()
    for entry in manifest['files']:
        relative = Path(entry['path'])
        if relative.is_absolute() or '..' in relative.parts or str(relative) in seen:
            errors.append('Caminho inválido no manifesto: ' + str(relative)); continue
        seen.add(str(relative))
        path = ROOT / relative
        if path.is_symlink() or not path.is_file():
            errors.append('Ficheiro em falta ou ligação simbólica: ' + str(relative)); continue
        data = path.read_bytes()
        if len(data) != entry['bytes'] or hashlib.sha256(data).hexdigest() != entry['sha256']:
            errors.append('Conteúdo alterado: ' + str(relative))
    return errors

if __name__ == '__main__':
    failures = verify()
    if failures:
        print('\n'.join(failures)); sys.exit(1)
    print('Manifesto verificado: todos os ficheiros entregues estão intactos.')
