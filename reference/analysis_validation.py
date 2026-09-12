"""Semantic reference checks, in addition to the published JSON Schema.
This does not call an AI provider or validate legal compliance.
"""
from __future__ import annotations
import re
import unicodedata
from typing import Any

CRITERIA = {'objective', 'text_structure', 'clarity', 'evidence', 'job_relevance'}

def normalized(value: str) -> str:
    return re.sub(r'\s+', ' ', unicodedata.normalize('NFKC', value)).strip()

def validate_report(report: Any, cv_text: str, has_job_description: bool) -> list[str]:
    errors: list[str] = []
    expected = {'source','summary','observations','priorities','limitations'}
    if not isinstance(report, dict) or set(report) != expected:
        return ['Estrutura principal inválida ou campos não permitidos.']
    if report['source'] != 'cv':
        errors.append('Origem inválida.')
    def text_ok(value: Any, limit: int) -> bool:
        return isinstance(value, str) and bool(value.strip()) and 0 < len(value) <= limit
    if not text_ok(report['summary'], 1000): errors.append('Resumo inválido.')
    observations = report['observations']
    if not isinstance(observations, list) or not 1 <= len(observations) <= 5:
        return errors + ['Lista de observações inválida.']
    seen: dict[str, str] = {}
    for item in observations:
        keys = {'criterion','status','evidenceType','evidenceExcerpt','suggestion'}
        if not isinstance(item, dict) or set(item) != keys:
            errors.append('Estrutura de observação inválida.'); continue
        criterion, status = item['criterion'], item['status']
        if not isinstance(criterion,str) or criterion not in CRITERIA or criterion in seen:
            errors.append('Critério inválido ou repetido.'); continue
        if status not in ('strength','improve','not_evaluable'):
            errors.append('Estado inválido.'); continue
        seen[criterion] = status
        if not text_ok(item['suggestion'],800): errors.append('Sugestão inválida.')
        etype, excerpt = item['evidenceType'], item['evidenceExcerpt']
        if etype == 'quote':
            if not text_ok(excerpt,600) or normalized(excerpt) not in normalized(cv_text):
                errors.append('Excerto não comprovado no texto.')
        elif etype == 'absence_in_text':
            if excerpt is not None or status != 'improve': errors.append('Ausência sem qualificação válida.')
            if not isinstance(item['suggestion'],str) or 'texto' not in item['suggestion'].lower():
                errors.append('A ausência deve ser qualificada como observação sobre o texto.')
        elif etype == 'not_available':
            if excerpt is not None or status != 'not_evaluable': errors.append('Estado de informação indisponível inválido.')
        else:
            errors.append('Tipo de evidência inválido.')
        if status == 'not_evaluable' and etype != 'not_available': errors.append('Evidência incompatível com não avaliável.')
        if status == 'strength' and etype != 'quote': errors.append('Ponto forte sem evidência textual.')
        if criterion == 'job_relevance' and not has_job_description and status != 'not_evaluable':
            errors.append('Comparação com vaga sem descrição fornecida.')
    priorities = report['priorities']
    if not isinstance(priorities,list) or len(priorities)>3:
        errors.append('Número/estrutura de prioridades inválido.')
    else:
        used = set()
        for item in priorities:
            if not isinstance(item,dict) or set(item) != {'criterion','title','action'}:
                errors.append('Prioridade inválida.'); continue
            criterion=item['criterion']
            if not isinstance(criterion,str) or criterion not in seen or seen.get(criterion)=='not_evaluable' or criterion in used:
                errors.append('Prioridade sem observação avaliável ou repetida.'); continue
            used.add(criterion)
            if not text_ok(item['title'],120) or not text_ok(item['action'],800): errors.append('Texto de prioridade inválido.')
    limits=report['limitations']
    if not isinstance(limits,list) or not 1<=len(limits)<=6 or any(not text_ok(s,400) for s in limits):
        errors.append('Limitações inválidas.')
    return errors
