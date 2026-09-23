'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getValidatedCheckoutUrl } from '@/lib/funnel-config';
import { trackInitiateCheckout } from '@/lib/analytics/meta-tracking';
import { appendTrackingToUrl } from '@/lib/analytics/utm-tracker';

export const StickyMobileCta: React.FC = () => {
  const checkout = getValidatedCheckoutUrl();
  const [visible, setVisible] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(checkout.url);

  useEffect(() => {
    if (checkout.url) {
      setCheckoutUrl(appendTrackingToUrl(checkout.url));
    }

    const handleScroll = () => {
      // Mostrar apenas após 350px de scroll
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [checkout.url]);

  if (!checkout.isConfigured || !checkout.url || !visible) {
    return null;
  }

  return (
    <aside
      aria-label="Barra de compra rápida"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.08)',
        padding: '10px 16px max(10px, env(safe-area-inset-bottom, 10px)) 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="mobile-sticky-bar"
    >
      <a
        href={checkoutUrl || checkout.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => {
          const target = appendTrackingToUrl(checkout.url) || checkout.url || '#';
          e.currentTarget.href = target;
          trackInitiateCheckout('kit', 14.99);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '480px',
          height: '48px',
          backgroundColor: 'var(--color-accent)',
          color: 'var(--color-on-accent)',
          borderRadius: '12px',
          padding: '0 16px',
          fontSize: '14px',
          fontWeight: 700,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(0, 87, 217, 0.28)',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Quero o Kit Completo</span>
          <span style={{ opacity: 0.85, fontWeight: 500, fontSize: '13px' }}>— 14,99 €</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', backgroundColor: 'rgba(255,255,255,0.2)', padding: '3px 8px', borderRadius: '6px' }}>
          <span>MB WAY</span>
          <ArrowRight size={14} aria-hidden="true" />
        </span>
      </a>

      <style jsx global>{`
        @media (min-width: 769px) {
          .mobile-sticky-bar {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  );
};
