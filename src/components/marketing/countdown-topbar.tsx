'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Clock } from 'lucide-react';
import './countdown-topbar.css';

const STORAGE_KEY = 'keds_offer_countdown_end';
const DEFAULT_DURATION_SECONDS = 15 * 60; // 15 minutos

const HIDDEN_PREFIXES = [
  '/backoffice',
  '/admin',
  '/meu-kit',
  '/obrigado',
  '/acesso',
  '/termos',
  '/privacidade',
  '/cookies',
  '/apoio',
  '/design-system',
  '/api',
];

export const CountdownTopbar: React.FC = () => {
  const pathname = usePathname();
  // Estado inicial estável para evitar mismatch na hidratação SSR (14m 59s)
  const [remaining, setRemaining] = useState<number>(14 * 60 + 59);
  const [mounted, setMounted] = useState<boolean>(false);

  // Inicializar cronómetro com base em timestamp persistente no localStorage
  useEffect(() => {
    setMounted(true);

    const getStoredTarget = (): number => {
      const now = Date.now();
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const target = parseInt(stored, 10);
          if (!isNaN(target) && target > now) {
            return target;
          }
        }
        // Se não existir ou expirou, define novo ciclo de 15 minutos
        const newTarget = now + DEFAULT_DURATION_SECONDS * 1000;
        localStorage.setItem(STORAGE_KEY, String(newTarget));
        return newTarget;
      } catch {
        return now + DEFAULT_DURATION_SECONDS * 1000;
      }
    };

    let targetTimestamp = getStoredTarget();

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.floor((targetTimestamp - now) / 1000);

      if (diff <= 0) {
        // Renova suavemente para manter a contagem ativa em sessões
        const nextTarget = now + 10 * 60 * 1000;
        targetTimestamp = nextTarget;
        try {
          localStorage.setItem(STORAGE_KEY, String(nextTarget));
        } catch {}
        setRemaining(10 * 60);
      } else {
        setRemaining(diff);
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Navegação suave ao clicar na barra de oferta
  const handleCtaClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const offerTarget =
        document.getElementById('oferta') ||
        document.getElementById('apresentacao');

      if (offerTarget) {
        e.preventDefault();
        offerTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (typeof window !== 'undefined') {
          window.history.pushState(null, '', '#oferta');
        }
      }
    },
    []
  );

  // Não renderizar em rotas privadas, administrativas ou de apoio
  if (pathname && HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return (
    <aside
      className="keds-countdown-topbar"
      role="region"
      aria-label="Aviso de Oferta Limitada com Contagem Decrescente"
    >
      <a
        href="/kit#oferta"
        onClick={handleCtaClick}
        className="keds-countdown-topbar__inner"
        aria-label="Oferta Limitada com contagem decrescente"
      >
        {/* Elemento Único e Unificado */}
        <div className="keds-countdown-topbar__unified-pill">
          <span className="keds-countdown-topbar__unified-badge">
            <span className="keds-countdown-topbar__pulse-dot" aria-hidden="true" />
            Oferta Limitada
          </span>
          <span
            className="keds-countdown-topbar__unified-timer"
            aria-live="polite"
            aria-atomic="true"
          >
            <Clock size={13} style={{ color: '#DC2626' }} aria-hidden="true" />
            <span>{formattedMinutes}:{formattedSeconds}</span>
          </span>
        </div>
      </a>
    </aside>
  );
};
