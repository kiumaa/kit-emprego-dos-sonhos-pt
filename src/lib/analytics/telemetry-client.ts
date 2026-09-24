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
    let sid = localStorage.getItem('keds_telemetry_sid') || sessionStorage.getItem('keds_telemetry_sid');
    if (!sid) {
      sid = 'sess_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
      try { localStorage.setItem('keds_telemetry_sid', sid); } catch {}
      try { sessionStorage.setItem('keds_telemetry_sid', sid); } catch {}
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

function normalizeSource(src: string): string {
  const s = src.toLowerCase().trim();
  if (s === 'an') return 'Meta Audience Network';
  if (s === 'ig') return 'Instagram Ads';
  if (s === 'fb') return 'Facebook Ads';
  if (s === 'msg') return 'Messenger';
  return src;
}

function detectTrafficSource(): string {
  if (typeof window === 'undefined') return 'direto';

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get('utm_source');
    const fbclid = urlParams.get('fbclid');
    const gclid = urlParams.get('gclid');

    if (fromUrl) {
      const normalized = normalizeSource(fromUrl);
      try {
        sessionStorage.setItem('keds_marketing_source', normalized);
        localStorage.setItem('keds_marketing_source', normalized);
      } catch {}
      return normalized;
    }

    if (fbclid) {
      const metaSource = 'Meta Ads';
      try {
        sessionStorage.setItem('keds_marketing_source', metaSource);
        localStorage.setItem('keds_marketing_source', metaSource);
      } catch {}
      return metaSource;
    }

    if (gclid) {
      const googleSource = 'Google Ads';
      try {
        sessionStorage.setItem('keds_marketing_source', googleSource);
        localStorage.setItem('keds_marketing_source', googleSource);
      } catch {}
      return googleSource;
    }

    // Verificar se já temos guardado de visita anterior nesta sessão
    const savedSource =
      sessionStorage.getItem('keds_marketing_source') ||
      localStorage.getItem('keds_marketing_source');
    if (savedSource) return savedSource;

    // Verificar em keds_marketing_params
    const rawMarketing = sessionStorage.getItem('keds_marketing_params');
    if (rawMarketing) {
      const parsed = JSON.parse(rawMarketing);
      if (parsed.utm_source) return normalizeSource(parsed.utm_source);
      if (parsed.fbclid) return 'Meta Ads';
    }

    // Verificar referrer externo
    if (document.referrer) {
      const refLower = document.referrer.toLowerCase();
      if (refLower.includes('instagram.com') || refLower.includes('com.instagram.android')) return 'Instagram';
      if (refLower.includes('facebook.com') || refLower.includes('com.facebook')) return 'Facebook';
      if (refLower.includes('google.')) return 'Google Search';
      if (refLower.includes('tiktok.com') || refLower.includes('com.zhiliaoapp.musically')) return 'TikTok';
      if (refLower.includes('linkedin.com')) return 'LinkedIn';

      try {
        const refUrl = new URL(document.referrer);
        const host = refUrl.hostname.toLowerCase();
        if (!host.includes(window.location.hostname)) {
          return host.replace(/^www\./, '');
        }
      } catch {}
    }
  } catch {}

  return 'direto';
}

function sendBeaconEvent(eventName: string, extraData: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const dwellSeconds = pageEntryTime > 0 ? Math.round((now - pageEntryTime) / 1000) : 0;
  const sessionId = getSessionId();
  const utmSource = detectTrafficSource();

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

  const jsonStr = JSON.stringify(payload);

  // Primário: fetch com keepalive (suporte universal e sem falhas em webviews do Instagram/Facebook)
  if (typeof fetch === 'function') {
    void fetch('/api/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonStr,
      keepalive: true,
    }).catch(() => {
      // Fallback secundário para sendBeacon
      try {
        if (navigator.sendBeacon) {
          const blob = new Blob([jsonStr], { type: 'application/json' });
          navigator.sendBeacon('/api/telemetry', blob);
        }
      } catch {}
    });
  } else if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      navigator.sendBeacon('/api/telemetry', blob);
    } catch {}
  }
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
