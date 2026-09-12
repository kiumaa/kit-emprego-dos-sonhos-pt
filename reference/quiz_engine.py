"""Reference implementation; port behaviour to TypeScript for the application."""
from __future__ import annotations
import json
from pathlib import Path
from typing import Any

SPEC_PATH = Path(__file__).resolve().parents[1] / 'content/quiz/quiz.json'

def evaluate_quiz(answers: dict[str, str], spec: dict[str, Any] | None = None) -> dict[str, Any]:
    if spec is None:
        spec = json.loads(SPEC_PATH.read_text(encoding='utf-8'))
    if not isinstance(answers, dict):
        raise ValueError('As respostas devem ser um objeto de escolhas únicas.')
    required = {q['id'] for q in spec['questions']}
    if set(answers) != required:
        raise ValueError('O questionário deve conter exatamente as cinco respostas esperadas.')
    dimensions: dict[str, int] = {}
    context: dict[str, str] = {}
    selected: dict[str, str] = {}
    for question in spec['questions']:
        value = answers[question['id']]
        if not isinstance(value, str):
            raise ValueError('Cada pergunta exige uma escolha única válida.')
        choice = next((o for o in question['options'] if o['id'] == value), None)
        if choice is None:
            raise ValueError('Opção inválida para ' + question['id'])
        selected[question['id']] = choice['label']
        dimension = question['dimension']
        if dimension is None:
            context[question['id']] = value
        else:
            dimensions[dimension] = choice['score']
    total = sum(dimensions.values())
    band = next(b for b in spec['bands'] if b['min'] <= total <= b['max'])
    rank = {name: i for i, name in enumerate(spec['priorityOrder'])}
    ordered = sorted(dimensions, key=lambda name: (dimensions[name], rank[name]))
    priorities = []
    for dimension in ordered[:3]:
        item = spec['recommendations'][dimension]
        is_refinement = dimensions[dimension] >= 2
        question = next(q for q in spec['questions'] if q['dimension'] == dimension)
        priorities.append({
            'dimension': dimension,
            'title': item['title'],
            'action': item['refinement'] if is_refinement else item['action'],
            'kind': 'refinement' if is_refinement else 'first_step',
            'source': 'self_report',
            'evidenceAnswer': selected[question['id']],
            'resourceId': item['resource']
        })
    return {
        'source': 'quiz', 'version': spec['version'],
        'profileId': band['id'], 'title': band['title'], 'summary': band['summary'],
        'internalPreparationScore': total, 'showNumericScore': False,
        'context': context, 'dimensions': dimensions, 'priorities': priorities,
        'disclaimer': spec['disclaimer']
    }
