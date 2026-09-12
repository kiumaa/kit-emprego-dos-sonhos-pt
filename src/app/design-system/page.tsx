'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChoiceGroup } from '@/components/ui/choice-group';
import { ProgressStepper } from '@/components/ui/progress-stepper';
import { TextField, TextArea } from '@/components/ui/text-field';
import { InsightCard } from '@/components/ui/insight-card';
import { ResultSummary } from '@/components/ui/result-summary';
import { LeadCapture } from '@/components/ui/lead-capture';
import { OfferPanel } from '@/components/ui/offer-panel';
import { ResourceTile } from '@/components/ui/resource-tile';

export default function DesignSystemPage() {
  const [selectedRadio, setSelectedRadio] = useState('opcao-1');
  const [textVal, setTextVal] = useState('Exemplo de texto digitado');
  const [btnLoading, setBtnLoading] = useState(false);

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', padding: 'var(--space-12) 0' }}>
      <div className="container">
        <header style={{ marginBottom: 'var(--space-10)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)' }}>
          <div style={{ display: 'inline-flex', padding: '4px 12px', backgroundColor: 'var(--color-accent-soft)', color: 'var(--color-accent)', borderRadius: 'var(--radius-pill)', fontSize: 'var(--type-small)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
            Ambiente Interno de Desenvolvimento · Tokens v2.0
          </div>
          <h1>Design System — Kit Emprego dos Sonhos</h1>
          <p className="secondary" style={{ marginTop: 'var(--space-2)', maxWidth: 'var(--layout-reading)' }}>
            Inventário e catálogo visual de componentes, variantes, estados interativos e amostra de recurso impresso A4.
          </p>
        </header>

        {/* 1. Tokens de Cores e Tipografia */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>1. Paleta de Cores e Superfícies</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
            {[
              { name: 'Background (#FFFFFF)', bg: 'var(--color-background)', border: '1px solid var(--color-border)', text: 'var(--color-text)' },
              { name: 'Surface (#F5F5F7)', bg: 'var(--color-surface)', border: '1px solid var(--color-border)', text: 'var(--color-text)' },
              { name: 'Text (#1D1D1F)', bg: 'var(--color-text)', border: 'none', text: 'var(--color-background)' },
              { name: 'Text Secondary (#51515A)', bg: 'var(--color-text-secondary)', border: 'none', text: 'var(--color-background)' },
              { name: 'Accent (#0057D9)', bg: 'var(--color-accent)', border: 'none', text: 'var(--color-on-accent)' },
              { name: 'Accent Soft (#EDF3FF)', bg: 'var(--color-accent-soft)', border: '1px solid var(--color-border)', text: 'var(--color-accent)' },
              { name: 'Success (#216E45)', bg: 'var(--color-success)', border: 'none', text: '#FFFFFF' },
              { name: 'Warning (#805B00)', bg: 'var(--color-warning)', border: 'none', text: '#FFFFFF' },
              { name: 'Danger (#B42318)', bg: 'var(--color-danger)', border: 'none', text: '#FFFFFF' },
            ].map((c, i) => (
              <div key={i} style={{ borderRadius: 'var(--radius-control)', overflow: 'hidden', border: c.border }}>
                <div style={{ height: '70px', backgroundColor: c.bg }} />
                <div style={{ padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--color-surface)', fontSize: '13px', fontWeight: '500' }}>
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Botões e Estados */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>2. Família de Botões e Estados</h2>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="primary">Primary Default</Button>
            <Button variant="secondary">Secondary Default</Button>
            <Button variant="ghost">Ghost Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="primary" disabled>Primary Disabled</Button>
            <Button
              variant="primary"
              isLoading={btnLoading}
              onClick={() => {
                setBtnLoading(true);
                setTimeout(() => setBtnLoading(false), 2000);
              }}
            >
              {btnLoading ? 'A carregar...' : 'Testar Loading (2s)'}
            </Button>
          </div>
        </section>

        {/* 3. Inputs e Formulários */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>3. Campos de Texto e Estados</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
            <TextField
              label="Campo Normal com Descrição"
              description="Instrução auxiliar com texto secundário."
              placeholder="Escreve algo aqui..."
              value={textVal}
              onChange={(e) => setTextVal(e.target.value)}
              maxLength={50}
            />
            <TextField
              label="Campo com Erro Acessível"
              value="email-invalido"
              error="Por favor introduz um formato de email válido."
              readOnly
            />
            <TextArea
              label="Área de Texto (Multiline)"
              description="Para notas, cartas ou mensagens de candidatura."
              placeholder="Descreve o teu percurso..."
              rows={3}
              maxLength={200}
            />
          </div>
        </section>

        {/* 4. Escolha Única (Quiz ChoiceGroup) e ProgressStepper */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>4. Seleção Única (Quiz) e Barra de Progresso Real</h2>
          <div style={{ maxWidth: 'var(--layout-form)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <ProgressStepper currentStep={3} totalSteps={8} />

            <ChoiceGroup
              name="exemplo-pergunta"
              legend="Como preparas o CV para cada oportunidade?"
              selectedValue={selectedRadio}
              onChange={setSelectedRadio}
              options={[
                { id: 'opcao-1', label: 'Uso o mesmo documento sem alterações', description: 'Documento genérico enviado para todas as vagas' },
                { id: 'opcao-2', label: 'Faço pequenas alterações pontuais', description: 'Ajuste de título ou dados de contacto' },
                { id: 'opcao-3', label: 'Revejo os requisitos e ajusto o destaque', description: 'Seleção das experiências mais relevantes para a função' },
              ]}
            />
          </div>
        </section>

        {/* 5. Cartões de Diagnóstico (InsightCard & ResultSummary) */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>5. Diagnóstico Honesto de Autorrelato (Sem Notas ATS)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 'var(--layout-reading)' }}>
            <ResultSummary
              title="Consolidar a candidatura"
              summary="Pelas tuas respostas, já tens parte da preparação feita. O próximo passo é tornar o processo mais consistente e orientar os exemplos aos requisitos das vagas."
              disclaimer="Este resultado baseia-se nas tuas respostas ao questionário. Não analisámos um documento nem calculamos probabilidades de emprego."
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <InsightCard
                title="Ligar o percurso à oportunidade"
                action="Escolhe três requisitos de uma vaga e escreve um exemplo verdadeiro para cada um."
                kind="first_step"
                source="Autorrelato do questionário"
                evidenceAnswer="Faço pequenas alterações pontuais"
              />
              <InsightCard
                title="Mostrar exemplos concretos"
                action="Revê se cada resultado referido tem contexto e corresponde ao teu contributo real."
                kind="refinement"
                source="Autorrelato do questionário"
                evidenceAnswer="Explico o meu papel e o que fiz em cada exemplo"
              />
            </div>
          </div>
        </section>

        {/* 6. Lead Capture & Oferta Comercial */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>6. Envio do Plano e Painel de Oferta do Kit</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-8)', alignItems: 'start' }}>
            <LeadCapture
              onSavePlan={async (data) => {
                console.log('Plano guardado (demo):', data);
                await new Promise((r) => setTimeout(r, 1000));
              }}
            />

            <OfferPanel />
          </div>
        </section>

        {/* 7. Recursos Estáticos Descarregáveis */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>7. Recursos Estáticos Descarregáveis (Sem Editor de CV)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
            <ResourceTile
              title="Modelo CV Essencial"
              description="Estrutura limpa e hierárquica para Word/DOCX. Edição 100% externa."
              format="DOCX"
              version="2.0"
              onDownload={() => alert('Download do modelo DOCX estático.')}
            />
            <ResourceTile
              title="Modelo CV Moderno"
              description="Design equilibrado e contemporâneo com destaque para projetos e competências."
              format="DOCX"
              version="2.0"
              onDownload={() => alert('Download do modelo DOCX estático.')}
            />
            <ResourceTile
              title="Organizador de Candidaturas"
              description="Tabela formatada em CSV compatível com Excel, Numbers e Google Sheets."
              format="CSV"
              version="2.0"
              onDownload={() => alert('Download do ficheiro CSV.')}
            />
            <ResourceTile
              title="Checklist Pré-Envio"
              description="Guia prático de revisão ponto a ponto antes de submeter cada candidatura."
              format="PDF"
              version="2.0"
              isLocked
            />
          </div>
        </section>

        {/* 8. Amostra de Layout Impresso A4 */}
        <section style={{ marginBottom: 'var(--space-12)' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>8. Amostra Editorial de Ficha Impressa A4</h2>
          <div
            style={{
              width: '100%',
              maxWidth: '595px',
              minHeight: '842px',
              marginInline: 'auto',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-overlay)',
              borderRadius: 'var(--radius-control)',
              border: '1px solid var(--color-border)',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-primary)',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--color-text)', paddingBottom: '16px', marginBottom: '24px' }}>
                <span style={{ fontWeight: '700', fontSize: '18px', letterSpacing: '-0.02em' }}>KIT EMPREGO DOS SONHOS</span>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>PORTUGAL · RECURSO A4</span>
              </div>

              <h1 style={{ fontSize: '28px', lineHeight: 1.2, marginBottom: '16px' }}>Plano de Ação para 7 Dias</h1>
              <p style={{ fontSize: '15px', lineHeight: 1.5, color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                Este guia organiza o teu processo de candidatura em passos diários curtos e objetivos.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { dia: 'Dia 1', foco: 'Definir o objetivo e perfil', detalhe: 'Escolhe 1 a 2 funções-alvo e reúne 3 ofertas de referência.' },
                  { dia: 'Dia 2', foco: 'Atualizar a estrutura do CV', detalhe: 'Preenche contactos, resumo objetivo e a experiência mais recente.' },
                  { dia: 'Dia 3', foco: 'Evidência e contexto', detalhe: 'Substitui listas genéricas de tarefas por 2 exemplos concretos de contributo.' },
                ].map((item, idx) => (
                  <div key={idx} style={{ padding: '12px 16px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', borderLeft: '3px solid var(--color-accent)' }}>
                    <strong style={{ fontSize: '14px', color: 'var(--color-accent)' }}>{item.dia}: {item.foco}</strong>
                    <p style={{ fontSize: '13px', margin: '4px 0 0 0', color: 'var(--color-text)' }}>{item.detalhe}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              <span>Kit Emprego dos Sonhos · Uso Pessoal</span>
              <span>Página 1 de 1</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
