import funnelData from '../../config/funnel.json';

export interface CheckoutValidationResult {
  isConfigured: boolean;
  url: string | null;
  error?: string;
}

export function getValidatedCheckoutUrl(): CheckoutValidationResult {
  const envUrl = process.env.NEXT_PUBLIC_OKANDA_CHECKOUT_URL;
  const configuredUrl = envUrl !== undefined ? envUrl : funnelData.checkout.url;

  if (!configuredUrl || typeof configuredUrl !== 'string' || configuredUrl.trim() === '') {
    return {
      isConfigured: false,
      url: null,
      error: 'O link de checkout oficial da OKANDA ainda não está configurado.',
    };
  }

  try {
    const parsed = new URL(configuredUrl.trim());
    if (parsed.protocol !== 'https:') {
      return {
        isConfigured: false,
        url: null,
        error: 'O link de checkout tem de utilizar obrigatoriamente o protocolo HTTPS.',
      };
    }

    const allowedHosts: string[] = funnelData.checkout.allowedHosts || ['okandapay.com'];
    const hostname = parsed.hostname.toLowerCase();
    const isAllowed = allowedHosts.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );

    if (!isAllowed) {
      return {
        isConfigured: false,
        url: null,
        error: `O domínio de checkout (${hostname}) não pertence à lista de hosts aprovados.`,
      };
    }

    return {
      isConfigured: true,
      url: parsed.toString(),
    };
  } catch {
    return {
      isConfigured: false,
      url: null,
      error: 'O formato do URL de checkout é inválido.',
    };
  }
}

export function getFunnelConfig() {
  return funnelData;
}
