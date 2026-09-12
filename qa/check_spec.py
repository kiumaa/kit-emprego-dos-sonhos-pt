"""Dependency-free checks of the specification package, NOT an app QA claim."""
from __future__ import annotations
import copy
import itertools
import json
from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from reference.quiz_engine import evaluate_quiz
from reference.analysis_validation import validate_report

def load(path):
    return json.loads((ROOT/path).read_text(encoding='utf-8'))

SPEC=load('content/quiz/quiz.json')

def answers_for(scores):
    result={}; iterator=iter(scores)
    for q in SPEC['questions']:
        result[q['id']]=q['options'][0 if q['dimension'] is None else next(iterator)]['id']
    return result

class PackageChecks(unittest.TestCase):
    def test_01_json_parses(self):
        for path in ROOT.rglob('*.json'):
            if 'node_modules' not in path.parts:
                with self.subTest(path=str(path.relative_to(ROOT))): json.loads(path.read_text(encoding='utf-8'))
    def test_02_editor_removed(self):
        features=load('config/features.json')
        for field in ('cvEditor','cvBuilder','personalizedCvExport','directStripeCheckout'):
            self.assertIs(features[field],False)
        for field in ('freeCvAnalyzer','freeQuiz','downloadableCvTemplates'):
            self.assertIs(features[field],True)
        routes=load('contracts/routes.json')['routes']
        self.assertFalse(any('editor' in r['path'] or 'builder' in r['path'] for r in routes))
    def test_03_route_ids_unique(self):
        routes=load('contracts/routes.json')['routes']
        self.assertEqual(len(routes),len({r['id'] for r in routes}))
        self.assertEqual(len(routes),len({r['path'] for r in routes}))
    def test_04_content_inventory(self):
        self.assertEqual(len(load('content/kit/licoes.json')['lessons']),10)
        self.assertEqual(len(load('content/kit/prompts.json')['prompts']),25)
        self.assertEqual(len(load('content/kit/mensagens.json')['messages']),10)
        self.assertEqual(len(load('content/marketing/ads.json')['ads']),6)
        self.assertEqual(len(SPEC['questions']),8)
        for item in load('content/kit/licoes.json')['lessons']:
            p=ROOT/item['source']; self.assertTrue(p.is_file()); self.assertGreater(len(p.read_text().split()),180)
    def test_05_sources_and_entitlements(self):
        for item in load('content/resources.json')['resources']:
            self.assertTrue((ROOT/item['source']).is_file(),item['source'])
            self.assertIn(item['entitlement'],{'kit','entrevista','linkedin'})
            self.assertIn(item['status'],{'source_ready','published'})
            if item['status']=='published': self.assertTrue(item['publishedAssets'])
        for name in ('essencial','moderno'):
            self.assertIs(load('content/templates/cv-'+name+'.json')['onlineEditing'],False)
    def test_06_commercial_gates(self):
        offer=load('config/offer.json')
        self.assertEqual([p['priceMinorProposed'] for p in offer['products']],[1490,490,590])
        gates=load('config/release-gates.json')['gates']
        self.assertTrue(all(g['status'] in {'pending','verified','failed'} for g in gates))
        if any(p['live'] for p in offer['products']):
            self.assertTrue(offer['accessTermsApproved'])
            self.assertTrue(all(g['status']=='verified' and g['evidence'] for g in gates if g['mandatory']))
    def test_07_css_matches_tokens(self):
        import re
        tokens=load('design/tokens.json'); css=(ROOT/'design/tokens.css').read_text()
        for key,value in tokens['color'].items():
            name=re.sub(r'(?<!^)(?=[A-Z])','-',key).lower()
            self.assertIn('--color-'+name+': '+value+';',css)
    def test_08_text_contrast(self):
        colors=load('design/tokens.json')['color']
        def lum(h):
            rgb=[int(h[i:i+2],16)/255 for i in (1,3,5)]
            c=[x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in rgb]
            return sum(x*w for x,w in zip(c,[.2126,.7152,.0722]))
        for a,b in [('text','background'),('textSecondary','surface'),('onAccent','accent')]:
            hi,lo=sorted([lum(colors[a]),lum(colors[b])],reverse=True)
            self.assertGreaterEqual((hi+.05)/(lo+.05),4.5,(a,b))
    def test_09_no_font_files_or_secrets(self):
        for path in ROOT.rglob('*'):
            if not path.is_file() or '.git' in path.parts: continue
            self.assertNotIn(path.suffix.lower(),{'.woff','.woff2','.ttf','.otf','.pem','.key'})
            self.assertNotEqual(path.name,'.env')
    def test_10_no_removed_feature_promises(self):
        text=(ROOT/'content/marketing/VSL_HEYGEN.md').read_text().lower()
        for promise in ('edita o teu cv na plataforma','editor de cv incluído','exportação personalizada incluída'):
            self.assertNotIn(promise,text)

class QuizChecks(unittest.TestCase):
    def test_11_all_4096_scored_combinations(self):
        for scores in itertools.product(range(4),repeat=6):
            result=evaluate_quiz(answers_for(scores),SPEC)
            total=sum(scores)
            self.assertEqual(result['internalPreparationScore'],total)
            expected='base' if total<=6 else 'consolidar' if total<=12 else 'afinar'
            self.assertEqual(result['profileId'],expected)
            self.assertEqual(len(result['priorities']),3)
            self.assertFalse(result['showNumericScore'])
    def test_12_context_does_not_change_score(self):
        answers=answers_for([1,2,1,3,1,2])
        expected=evaluate_quiz(answers,SPEC)['internalPreparationScore']
        for q1 in SPEC['questions'][0]['options']:
            for q2 in SPEC['questions'][1]['options']:
                answers.update(q1=q1['id'],q2=q2['id'])
                self.assertEqual(evaluate_quiz(answers,SPEC)['internalPreparationScore'],expected)
    def test_13_incomplete_or_extra_answers_rejected(self):
        answers=answers_for([0]*6)
        del answers['q8']
        with self.assertRaises(ValueError): evaluate_quiz(answers,SPEC)
        answers=answers_for([0]*6); answers['q9']='extra'
        with self.assertRaises(ValueError): evaluate_quiz(answers,SPEC)
    def test_14_invalid_choice_and_type_rejected(self):
        for value in ('inexistente',['lista'],True,None):
            answers=answers_for([0]*6); answers['q3']=value
            with self.assertRaises(ValueError): evaluate_quiz(answers,SPEC)
    def test_15_good_result_keeps_refinements(self):
        result=evaluate_quiz(answers_for([3]*6),SPEC)
        self.assertEqual(result['profileId'],'afinar')
        self.assertTrue(all(p['kind']=='refinement' for p in result['priorities']))
    def test_16_tie_break_is_deterministic(self):
        result=evaluate_quiz(answers_for([0]*6),SPEC)
        self.assertEqual([p['dimension'] for p in result['priorities']],SPEC['priorityOrder'][:3])

class AnalysisContractChecks(unittest.TestCase):
    def setUp(self):
        self.report=load('qa/fixtures/analysis-valid.json')
        self.text=(ROOT/'qa/fixtures/cv-ficticio.txt').read_text(encoding='utf-8')
    def test_17_valid_fixture(self):
        self.assertEqual(validate_report(self.report,self.text,False),[])
    def test_18_unverified_evidence_rejected(self):
        self.report['observations'][0]['evidenceExcerpt']='Aumentei as vendas em 500%.'
        self.assertTrue(validate_report(self.report,self.text,False))
    def test_19_score_fields_rejected(self):
        self.report['ats_score']=100
        self.assertTrue(validate_report(self.report,self.text,False))
    def test_20_job_claim_without_job_rejected(self):
        self.report['observations'][1].update(status='improve',evidenceType='absence_in_text',suggestion='No texto falta um requisito da empresa.')
        self.assertTrue(validate_report(self.report,self.text,False))
    def test_21_invalid_priority_rejected(self):
        self.report['priorities'][0]['criterion']='job_relevance'
        self.assertTrue(validate_report(self.report,self.text,False))
    def test_23_blank_evidence_rejected(self):
        self.report['observations'][0]['evidenceExcerpt']='   '
        self.assertTrue(validate_report(self.report,self.text,False))
    def test_22_too_many_priorities_rejected(self):
        self.report['priorities']=self.report['priorities']*4
        self.assertTrue(validate_report(self.report,self.text,False))

if __name__=='__main__':
    unittest.main(verbosity=2)
