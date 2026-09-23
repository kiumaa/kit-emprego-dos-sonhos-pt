'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, MessageSquare, ZoomIn, X, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  badge: string;
  highlight: string;
  keyQuote: string;
  imageSrc: string;
  alt: string;
}

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'sofia',
    name: 'Sofia Almeida',
    role: 'Candidatura a Emprego',
    badge: 'Feedback Verificado',
    highlight: 'CV muito mais claro e profissional',
    keyQuote: '“Já me sinto muito mais confiante para enviar candidaturas agora! Acho mesmo que valeu a pena o investimento.”',
    imageSrc: '/images/social-proof/sofia-almeida.jpg',
    alt: 'Mensagens no WhatsApp de Sofia Almeida a elogiar o Kit Emprego dos Sonhos',
  },
  {
    id: 'marta',
    name: 'Marta Oliveira',
    role: 'Transição Profissional',
    badge: 'Feedback Verificado',
    highlight: 'Fui contactada para uma entrevista! 🎉',
    keyQuote: '“Em apenas duas semanas comecei a receber muito mais visualizações no meu perfil do LinkedIn e fui contactada para uma entrevista!”',
    imageSrc: '/images/social-proof/marta-oliveira.jpg',
    alt: 'Mensagens no WhatsApp de Marta Oliveira sobre convite para entrevista após usar o kit',
  },
  {
    id: 'bruno',
    name: 'Bruno Martins',
    role: 'Procura Ativa',
    badge: 'Feedback Verificado',
    highlight: 'Respostas de várias empresas',
    keyQuote: '“Os modelos de CV são mesmo muito bons, modernos e fáceis de personalizar. Já recebi respostas de várias empresas.”',
    imageSrc: '/images/social-proof/bruno-martins.jpg',
    alt: 'Mensagens no WhatsApp de Bruno Martins a destacar respostas de recrutadores',
  },
  {
    id: 'daniela',
    name: 'Daniela Ferreira',
    role: 'Nova Fase de Carreira',
    badge: 'Feedback Verificado',
    highlight: 'Chamada para uma entrevista! 🎉',
    keyQuote: '“Confesso que no início estava um pouco hesitante... mas decidi arriscar e ainda bem que o fiz! Já fui chamada para uma entrevista!”',
    imageSrc: '/images/social-proof/daniela-ferreira.jpg',
    alt: 'Mensagens no WhatsApp de Daniela Ferreira a confirmar entrevista marcada',
  },
];

export interface SocialProofSectionProps {
  id?: string;
  className?: string;
}

export const SocialProofSection: React.FC<SocialProofSectionProps> = ({
  id = 'provas-sociais',
  className = '',
}) => {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  // Fechar modal com tecla Escape ou navegar com setas
  useEffect(() => {
    if (activeModalIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveModalIndex((prev) => (prev !== null ? (prev + 1) % TESTIMONIALS.length : null));
      } else if (e.key === 'ArrowLeft') {
        setActiveModalIndex((prev) => (prev !== null ? (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length : null));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalIndex]);

  return (
    <section
      id={id}
      className={`social-proof-section ${className}`}
      style={{
        width: '100%',
        maxWidth: '820px',
        marginInline: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
      }}
      aria-label="Provas Sociais e Testemunhos de Clientes"
    >
      {/* Cabeçalho da Secção de Provas Sociais */}
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#128C7E', // Tom característico de autenticidade / WhatsApp
            backgroundColor: 'rgba(37, 211, 102, 0.12)',
            padding: '5px 14px',
            borderRadius: '999px',
          }}
        >
          <MessageSquare size={13} aria-hidden="true" />
          <span>Feedback Real · Mensagens WhatsApp</span>
        </span>

        <h2
          style={{
            fontSize: 'clamp(22px, 4.5vw, 30px)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            color: 'var(--color-text)',
            marginTop: 'var(--space-2)',
            lineHeight: 1.25,
          }}
        >
          Quem já usou o Kit começou a ter chamadas para entrevistas
        </h2>

        <p
          className="secondary"
          style={{
            fontSize: '15px',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--space-2)',
            maxWidth: '580px',
            marginInline: 'auto',
            lineHeight: 1.5,
          }}
        >
          Mensagens autênticas enviadas por profissionais que estavam com dificuldades em obter retorno e desbloquearam entrevistas no mercado português.
        </p>

        {/* Resumo de Confiança */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: 'var(--space-3)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            <div style={{ display: 'flex', gap: '2px', color: '#F5A623' }}>
              <Star size={12} fill="#F5A623" />
              <Star size={12} fill="#F5A623" />
              <Star size={12} fill="#F5A623" />
              <Star size={12} fill="#F5A623" />
              <Star size={12} fill="#F5A623" />
            </div>
            <span><strong>4.9 / 5</strong> Avaliação Média</span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            <ShieldCheck size={14} color="#128C7E" aria-hidden="true" />
            <span>Feedbacks 100% Verificados</span>
          </div>
        </div>
      </div>

      {/* Grelha de Cartões de Prova Social */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {TESTIMONIALS.map((item, index) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 8px 24px rgba(29, 29, 31, 0.04)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 200ms ease, box-shadow 200ms ease',
            }}
          >
            {/* Topo do Cartão: Identificação e Estrelas */}
            <div
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#128C7E',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={11} color="#128C7E" />
                    <span>{item.badge}</span>
                  </div>
                </div>
              </div>

              {/* 5 Estrelas */}
              <div style={{ display: 'flex', gap: '2px', color: '#F5A623' }}>
                <Star size={12} fill="#F5A623" />
                <Star size={12} fill="#F5A623" />
                <Star size={12} fill="#F5A623" />
                <Star size={12} fill="#F5A623" />
                <Star size={12} fill="#F5A623" />
              </div>
            </div>

            {/* Destaque Curto */}
            <div
              style={{
                padding: '10px 18px',
                backgroundColor: 'rgba(0, 87, 217, 0.04)',
                borderBottom: '1px solid rgba(0, 87, 217, 0.08)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>🎯</span>
              <span>{item.highlight}</span>
            </div>

            {/* Imagem do WhatsApp com Overlay Clicável */}
            <div
              onClick={() => setActiveModalIndex(index)}
              style={{
                position: 'relative',
                cursor: 'pointer',
                backgroundColor: '#075E54', // Tom subtil de fundo WhatsApp
                overflow: 'hidden',
                aspectRatio: '9 / 16',
                maxHeight: '440px',
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveModalIndex(index);
                }
              }}
              aria-label={`Ampliar conversa de WhatsApp com ${item.name}`}
            >
              <img
                src={item.imageSrc}
                alt={item.alt}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  transition: 'transform 260ms ease',
                }}
              />

              {/* Botão Flutuante de Zoom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(29, 29, 31, 0.85)',
                  backdropFilter: 'blur(6px)',
                  color: '#FFFFFF',
                  borderRadius: '999px',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                <ZoomIn size={13} aria-hidden="true" />
                <span>Ampliar conversa</span>
              </div>
            </div>

            {/* Citação em Rodapé do Cartão */}
            <div
              style={{
                padding: '14px 18px',
                backgroundColor: '#FFFFFF',
                borderTop: '1px solid rgba(0, 0, 0, 0.05)',
                fontSize: '13px',
                color: 'var(--color-text)',
                lineHeight: 1.45,
                fontStyle: 'italic',
              }}
            >
              {item.keyQuote}
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Lightbox de Ampliação em Alta Resolução */}
      {activeModalIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Conversa completa com ${TESTIMONIALS[activeModalIndex].name}`}
          onClick={() => setActiveModalIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* Caixa Central do Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '92vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Botão de Fechar */}
            <button
              type="button"
              onClick={() => setActiveModalIndex(null)}
              aria-label="Fechar ampliação"
              style={{
                position: 'absolute',
                top: '-44px',
                right: '0',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 160ms ease',
              }}
            >
              <X size={20} />
            </button>

            {/* Imagem Ampliada */}
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                backgroundColor: '#075E54',
                maxHeight: '82vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={TESTIMONIALS[activeModalIndex].imageSrc}
                alt={TESTIMONIALS[activeModalIndex].alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '82vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Controles de Navegação Anterior / Próximo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '12px',
                paddingInline: '8px',
                color: '#FFFFFF',
                fontSize: '13px',
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveModalIndex(
                    (prev) => (prev !== null ? (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length : 0)
                  )
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <ChevronLeft size={16} />
                <span>Anterior</span>
              </button>

              <span style={{ fontWeight: 600, opacity: 0.85 }}>
                {activeModalIndex + 1} de {TESTIMONIALS.length} · {TESTIMONIALS[activeModalIndex].name}
              </span>

              <button
                type="button"
                onClick={() =>
                  setActiveModalIndex((prev) => (prev !== null ? (prev + 1) % TESTIMONIALS.length : 0))
                }
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                <span>Seguinte</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
