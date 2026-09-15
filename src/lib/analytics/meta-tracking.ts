/**
 * Utilitário de rastreio de eventos da Meta com deduplicação automática
 * entre o Meta Pixel (Navegador) e a Meta Conversions API (Servidor).
 */

export interface MetaClientUserData {
  email?: string;
  phone?: string;
  externalId?: string;
}

export interface MetaClientCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  content_type?: string;
  order_id?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

/**
 * Gera um identificador único de evento para deduplicação entre Pixel e CAPI.
 */
export function generateEventId(prefix = 'evt'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Dispara um evento sincronizado para o Meta Pixel e para a Conversions API via servidor.
 */
export function trackMetaEvent(
  eventName: string,
  customData?: MetaClientCustomData,
  userData?: MetaClientUserData,
  existingEventId?: string
): string {
  const eventId = existingEventId || generateEventId(eventName.toLowerCase());

  // 1. Rastreio no Navegador (Meta Pixel)
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    try {
      window.fbq('track', eventName, customData || {}, { eventID: eventId });
    } catch {
      // Ignorar erros do browser pixel
    }
  }

  // 2. Rastreio no Servidor (Conversions API via rota de proxy)
  if (typeof window !== 'undefined') {
    try {
      const payload = {
        eventName,
        eventId,
        eventSourceUrl: window.location.href,
        customData,
        userData,
      };

      const body = JSON.stringify(payload);

      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/events', blob);
      } else {
        fetch('/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Falha silenciosa em background
    }
  }

  return eventId;
}

/**
 * Rastreia clique em botão de compra / avanço para checkout da OKANDA.
 */
export function trackInitiateCheckout(
  productKey: 'kit' | 'entrevista' | 'linkedin' = 'kit',
  value = 14.99,
  currency = 'EUR'
): string {
  const productNameMap: Record<string, string> = {
    kit: 'Kit Emprego dos Sonhos',
    entrevista: 'Acelerador Entrevista dos Sonhos',
    linkedin: 'Acelerador LinkedIn dos Sonhos',
  };

  return trackMetaEvent('InitiateCheckout', {
    content_name: productNameMap[productKey] || productKey,
    content_category: 'Recrutamento e Carreira',
    content_ids: [productKey],
    content_type: 'product',
    value,
    currency,
  });
}

/**
 * Rastreia conclusão de diagnóstico (Quiz ou Análise de CV).
 */
export function trackLead(source: 'quiz' | 'cv', diagnosticId?: string): string {
  return trackMetaEvent('Lead', {
    content_name: source === 'cv' ? 'Diagnóstico Análise de CV' : 'Diagnóstico Quiz',
    content_category: 'Diagnóstico Gratuito',
    content_ids: diagnosticId ? [diagnosticId] : [source],
  });
}

/**
 * Rastreia visualização de conteúdo relevante (ex: página do produto ou resultado do diagnóstico).
 */
export function trackViewContent(contentName: string, contentId?: string, value?: number): string {
  return trackMetaEvent('ViewContent', {
    content_name: contentName,
    content_ids: contentId ? [contentId] : undefined,
    value,
    currency: value ? 'EUR' : undefined,
  });
}
