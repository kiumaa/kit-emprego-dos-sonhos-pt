'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Send, Mail } from 'lucide-react';
import mensagensData from '@content/kit/mensagens.json';

export default function MessagesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const letterTemplates = [
    {
      id: 'carta-1',
      title: 'Carta de Apresentação — Transição ou Nova Área',
      description: 'Estrutura para destacar competências transferíveis de funções anteriores.',
      content: `Exmo.(a) Senhor(a) [Nome do Responsável ou Departamento de Recrutamento],\n\nEscrevo para apresentar a minha candidatura à função de [Função] na [Nome da Empresa], conforme anunciado em [Plataforma/Data].\n\nAo longo do meu percurso profissional em [Área Anterior], desenvolvi competências sólidas em [Competência 1], [Competência 2] e [Competência 3]. No meu último projeto/função, fui responsável por [exemplo concreto de tarefa ou resultado], demonstrando capacidade de adaptação e rigor na execução.\n\nA oportunidade na [Nome da Empresa] destaca-se pelo [motivo específico de interesse na empresa]. Acredito que a minha capacidade de [contributo principal] trará valor imediato à equipa.\n\nAgradeço a atenção dedicada à análise do meu currículo em anexo e fico disponível para uma conversa de apresentação.\n\nCom os melhores cumprimentos,\n[O Teu Nome]\n[O Teu Telefone] · [O Teu Email]`,
    },
    {
      id: 'carta-2',
      title: 'Carta de Apresentação — Experiência Direta na Função',
      description: 'Estrutura direta para quem já possui trabalho na mesma área e quer demonstrar continuidade.',
      content: `Exmo.(a) Senhor(a) [Nome do Destinatário],\n\nCom [X] anos de experiência em [Área Profissional], envio o meu currículo para a oportunidade de [Nome da Função] na [Nome da Empresa].\n\nNas minhas funções mais recentes em [Empresa Anterior], liderei/participei em [atividade principal], onde alcancei [resultado concreto, ex.: redução de tempo de resposta, melhoria de processo ou entrega de projeto]. Conheço bem os desafios operacionais do setor e domino ferramentas como [Ferramenta 1] e [Ferramenta 2].\n\nAcompanho os projetos da [Nome da Empresa] e identifico-me com a vossa aposta em [valor ou projeto da empresa].\n\nFico ao vosso inteiro dispor para detalhar a minha experiência numa entrevista.\n\nAtenciosamente,\n[O Teu Nome]\n[Contactos]`,
    },
    {
      id: 'carta-3',
      title: 'Carta de Apresentação — Primeiro Emprego ou Estágio',
      description: 'Foco na formação académica, projetos realizados e vontade de aprendizagem prática.',
      content: `Exmo.(a) Senhor(a) [Responsável pelo Recrutamento],\n\nConcluí recentemente a minha formação em [Curso/Área] na [Instituição de Ensino] e gostaria de submeter a minha candidatura para a vaga de [Função/Estágio] na [Nome da Empresa].\n\nDurante o meu percurso académico, desenvolvi projetos práticos em [tema de projeto relevante], onde pude aplicar conhecimentos em [técnica ou ferramenta] e colaborar em equipa para atingir prazos exigentes.\n\nProcuro iniciar o meu percurso profissional numa organização estruturada como a [Nome da Empresa], onde possa contribuir com dedicação e rápida capacidade de aprendizagem.\n\nAgradeço a consideração e subscrevo-me com consideração,\n[O Teu Nome]`,
    },
  ];

  return (
    <div style={{ maxWidth: '900px', marginInline: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <div>
        <span style={{ fontSize: 'var(--type-small)', color: 'var(--color-accent)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase' }}>
          Modelos Copiáveis
        </span>
        <h1 style={{ fontSize: 'var(--type-h1-mobile)', marginTop: 'var(--space-1)' }}>
          Mensagens de Contacto & Estruturas de Cartas
        </h1>
        <p className="secondary" style={{ marginTop: 'var(--space-2)', fontSize: 'var(--type-body)' }}>
          Copia os modelos e preenche os campos entre parênteses retos com dados reais do teu percurso.
        </p>
      </div>

      {/* Secção 1: Cartas de Apresentação */}
      <section>
        <h2 style={{ fontSize: 'var(--type-h2-mobile)', marginBottom: 'var(--space-4)' }}>
          Estruturas de Carta de Apresentação
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {letterTemplates.map((letter) => (
            <div
              key={letter.id}
              style={{
                backgroundColor: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-card)',
                padding: 'var(--space-6)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--type-h3)' }}>{letter.title}</h3>
                  <p className="secondary" style={{ fontSize: 'var(--type-small)', marginTop: '2px' }}>
                    {letter.description}
                  </p>
                </div>
                <Button
                  onClick={() => handleCopy(letter.id, letter.content)}
                  variant={copiedId === letter.id ? 'primary' : 'secondary'}
                  style={{ height: '38px', fontSize: 'var(--type-small)', flexShrink: 0 }}
                >
                  {copiedId === letter.id ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedId === letter.id ? 'Copiado!' : 'Copiar texto'}</span>
                </Button>
              </div>

              <pre
                style={{
                  backgroundColor: 'var(--color-surface)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-control)',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  color: 'var(--color-text)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {letter.content}
              </pre>
            </div>
          ))}
        </div>
      </section>

      {/* Secção 2: Mensagens Rápidas */}
      <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--type-h2-mobile)', marginBottom: 'var(--space-4)' }}>
          Mensagens Rápidas de Candidatura & Acompanhamento
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-4)' }}>
          {mensagensData.messages.map((item: { id: string; title: string; subject: string; body: string }) => {
            const itemId = `msg-${item.id}`;
            return (
              <div
                key={itemId}
                style={{
                  backgroundColor: 'var(--color-surface-raised)',
                  borderRadius: 'var(--radius-control)',
                  padding: 'var(--space-5)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--space-3)',
                }}
              >
                <div>
                  <strong style={{ fontSize: 'var(--type-body)', color: 'var(--color-text)' }}>
                    {item.title}
                  </strong>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                    Assunto: <em>{item.subject}</em>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: 1.5, marginTop: 'var(--space-2)', whiteSpace: 'pre-wrap' }}>
                    {item.body}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 'var(--space-2)' }}>
                  <Button
                    onClick={() => handleCopy(itemId, `Assunto: ${item.subject}\n\n${item.body}`)}
                    variant={copiedId === itemId ? 'primary' : 'ghost'}
                    style={{ height: '34px', fontSize: '13px' }}
                  >
                    {copiedId === itemId ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedId === itemId ? 'Copiado!' : 'Copiar'}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
