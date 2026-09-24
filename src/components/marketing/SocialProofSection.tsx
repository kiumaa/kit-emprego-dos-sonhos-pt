'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface TestimonialImage {
  id: string;
  name: string;
  src: string;
  alt: string;
}

const TESTIMONIAL_IMAGES: TestimonialImage[] = [
  {
    id: 'sofia',
    name: 'Sofia Almeida',
    src: '/images/social-proof/sofia-almeida.jpg',
    alt: 'Mensagens no WhatsApp de Sofia Almeida sobre o Kit Emprego dos Sonhos',
  },
  {
    id: 'marta',
    name: 'Marta Oliveira',
    src: '/images/social-proof/marta-oliveira.jpg',
    alt: 'Mensagens no WhatsApp de Marta Oliveira sobre convite para entrevista',
  },
  {
    id: 'bruno',
    name: 'Bruno Martins',
    src: '/images/social-proof/bruno-martins.jpg',
    alt: 'Mensagens no WhatsApp de Bruno Martins sobre respostas de várias empresas',
  },
  {
    id: 'daniela',
    name: 'Daniela Ferreira',
    src: '/images/social-proof/daniela-ferreira.jpg',
    alt: 'Mensagens no WhatsApp de Daniela Ferreira sobre chamada para entrevista',
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIAL_IMAGES.length) % TESTIMONIAL_IMAGES.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIAL_IMAGES.length);
  };

  // Suporte para touch swipe em mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    if (diffX > 40) {
      nextSlide();
    } else if (diffX < -40) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  // Navegação por teclado quando o lightbox está aberto
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape' && isLightboxOpen) setIsLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const currentImage = TESTIMONIAL_IMAGES[currentIndex];

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
        alignItems: 'center',
        gap: 'var(--space-4)',
      }}
      aria-label="Provas Sociais e Testemunhos de Clientes"
    >
      {/* Cabeçalho Limpo: Selo "Feedbacks Reais" */}
      <div style={{ textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#128C7E',
            backgroundColor: 'rgba(37, 211, 102, 0.12)',
            padding: '5px 14px',
            borderRadius: '999px',
          }}
        >
          <MessageSquare size={13} aria-hidden="true" />
          <span>Feedbacks Reais</span>
        </span>
      </div>

      {/* Slider Exclusivo de Imagens (Sem cards) */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          marginInline: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Moldura da Imagem em Slide */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setIsLightboxOpen(true)}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '9 / 16',
            borderRadius: '20px',
            overflow: 'hidden',
            backgroundColor: '#075E54',
            border: '1px solid var(--color-border)',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsLightboxOpen(true);
            }
          }}
          aria-label={`Ver imagem ampliada de ${currentImage.name}`}
        >
          <img
            key={currentImage.id}
            src={currentImage.src}
            alt={currentImage.alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              animation: 'fadeIn 200ms ease',
            }}
          />

          {/* Dica discreta de zoom no canto superior */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.85,
            }}
            aria-hidden="true"
          >
            <ZoomIn size={16} />
          </div>
        </div>

        {/* Botão Anterior */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Imagem anterior"
          style={{
            position: 'absolute',
            top: '50%',
            left: '-18px',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
            transition: 'all 160ms ease',
            zIndex: 10,
          }}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Botão Seguinte */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Imagem seguinte"
          style={{
            position: 'absolute',
            top: '50%',
            right: '-18px',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
            transition: 'all 160ms ease',
            zIndex: 10,
          }}
        >
          <ChevronRight size={20} />
        </button>

        {/* Indicadores de Pontos (Dots) e Contador */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '14px',
          }}
        >
          {TESTIMONIAL_IMAGES.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Ir para testemunho ${index + 1} de ${item.name}`}
              style={{
                width: currentIndex === index ? '24px' : '8px',
                height: '8px',
                borderRadius: '999px',
                backgroundColor: currentIndex === index ? 'var(--color-accent)' : 'rgba(0, 0, 0, 0.2)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 200ms ease',
                padding: 0,
              }}
            />
          ))}
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginLeft: '6px' }}>
            {currentIndex + 1} / {TESTIMONIAL_IMAGES.length}
          </span>
        </div>
      </div>

      {/* Modal / Lightbox em Ecrã Inteiro (ao clicar) */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Conversa ampliada com ${currentImage.name}`}
          onClick={() => setIsLightboxOpen(false)}
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
              onClick={() => setIsLightboxOpen(false)}
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
              }}
            >
              <X size={20} />
            </button>

            {/* Imagem em Ecrã Cheio */}
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
                src={currentImage.src}
                alt={currentImage.alt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '82vh',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>

            {/* Navegação no Lightbox */}
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
                onClick={prevSlide}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
                {currentIndex + 1} de {TESTIMONIAL_IMAGES.length} · {currentImage.name}
              </span>

              <button
                type="button"
                onClick={nextSlide}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
