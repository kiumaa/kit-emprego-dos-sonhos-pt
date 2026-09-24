'use client';

/**
 * Cliente de telemetria silenciosa para Backoffice 360°.
 * Regista o tempo de permanência (dwell time), scroll depth e etapas percorridas.
 */

let currentPath = '';
let pageEntryTime = 0;
let maxScroll = 0;
let heartbeatTimer: NodeJS.Timeout | null = null;

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  try {
    let sid = sessionStorage.getItem('keds_telemetry_sid');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      sessionStorage.setItem('keds_telemetry_sid', sid);
    }
    return sid;
  } catch {
    return 'fallback_session';
  }
}

function getDeviceInfo(): 'mobile' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  return window.innerWidth <= 768 ? 'mobile' : 'desktop';
}

function sendBeaconEvent(eventName: string, extraData: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const dwellSeconds = pageEntryTime > 0 ? Math.round((now - pageEntryTime) / 1000) : 0;
  const sessionId = getSessionId();

  let utmSource = 'direto';
  try {
    // 1. Verificar parâmetro utm_source no URL atual
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get('utm_source');
    if (fromUrl) {
      utmSource = fromUrl;
      sessionStorage.setItem('keds_marketing_params', JSON.stringify({ utm_source: fromUrl }));
    } else {
      // 2. Verificar parâmetro salvo em keds_marketing_params ou keds_utm_params
      const rawMarketing = sessionStorage.getItem('keds_marketing_params');
      if (rawMarketing) {
        const parsed = JSON.parse(rawMarketing);
        if (parsed.utm_source) utmSource = parsed.utm_source;
      } else {
        const rawUtm = sessionStorage.getItem('keds_utm_params');
        if (rawUtm) {
          const parsed = JSON.parse(rawUtm);
          if (parsed.utm_source) utmSource = parsed.utm_source;
        } else if (document.referrer) {
          // 3. Referenciador externo real se existir
          const refUrl = new URL(document.referrer);
          const host = refUrl.hostname.toLowerCase();
          if (!host.includes(window.location.hostname)) {
            if (host.includes('instagram.com')) utmSource = 'instagram';
            else if (host.includes('facebook.com')) utmSource = 'facebook';
            else if (host.includes('google.')) utmSource = 'google_search';
            else if (host.includes('linkedin.com')) utmSource = 'linkedin';
            else if (host.includes('tiktok.com')) utmSource = 'tiktok';
            else utmSource = host.replace(/^www\./, '');
          }
        }
      }
    }
  } catch {}

  const payload = {
    sessionId,
    path: currentPath || window.location.pathname,
    eventName,
    timestampMs: now,
    dwellTimeSeconds: dwellSeconds,
    maxScrollDepth: maxScroll,
    device: getDeviceInfo(),
    utm: { source: utmSource },
    ...extraData,
  };

  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/telemetry', blob);
    } else {
      void fetch('/api/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  } catch {}
}

export function initTelemetryTracking() {
  if (typeof window === 'undefined') return;

  currentPath = window.location.pathname;
  pageEntryTime = Date.now();
  maxScroll = 0;

  // Enviar page_view imediato
  sendBeaconEvent('page_view');

  // Monitorizar profundidade de scroll
  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
      if (pct > maxScroll) {
        maxScroll = pct;
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Heartbeat a cada 20 segundos para dwell time fidedigno
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  heartbeatTimer = setInterval(() => {
    sendBeaconEvent('heartbeat');
  }, 20000);

  // Enviar exit no unmount ou fecho de página
  const handleExit = () => {
    sendBeaconEvent('exit');
  };

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      handleExit();
    }
  });

  window.addEventListener('pagehide', handleExit);
}

export function trackCtaClick(ctaName: string) {
  sendBeaconEvent('cta_click', { ctaName });
}

export function trackVslProgress(seconds: number) {
  sendBeaconEvent('vsl_action', { vslProgressSeconds: Math.round(seconds) });
}
