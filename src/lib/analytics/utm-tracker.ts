/**
 * Utilitário de captura e propagação de parâmetros de marketing (UTMs e fbclid)
 * para atribuição precisa de campanhas na OKANDA PAY e no Meta Ads.
 */

const UTM_STORAGE_KEY = 'keds_marketing_params';

const TRACKED_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
] as const;

/**
 * Captura parâmetros de query string da página atual e persiste na sessão.
 */
export function captureMarketingParams(): void {
  if (typeof window === 'undefined') return;

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const collected: Record<string, string> = {};

    for (const param of TRACKED_PARAMS) {
      const val = searchParams.get(param);
      if (val) {
        collected[param] = val;
      }
    }

    if (Object.keys(collected).length > 0) {
      const existing = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || '{}');
      const merged = { ...existing, ...collected };
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
    }
  } catch {
    // Falha silenciosa
  }
}

/**
 * Anexa os parâmetros de marketing guardados e atuais ao URL de checkout da OKANDA.
 */
export function appendTrackingToUrl(targetUrl: string | null): string | null {
  if (!targetUrl || typeof targetUrl !== 'string') return null;
  if (typeof window === 'undefined') return targetUrl;

  try {
    const parsed = new URL(targetUrl);
    const stored = JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || '{}');
    const currentParams = new URLSearchParams(window.location.search);

    for (const param of TRACKED_PARAMS) {
      const value = currentParams.get(param) || stored[param];
      if (value && !parsed.searchParams.has(param)) {
        parsed.searchParams.set(param, value);
      }
    }

    return parsed.toString();
  } catch {
    return targetUrl;
  }
}
