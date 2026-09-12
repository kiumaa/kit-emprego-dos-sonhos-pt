import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getValidatedCheckoutUrl, getFunnelConfig } from '../funnel-config';

describe('Funnel Config & OKANDA Checkout Validation', () => {
  const originalEnv = process.env.NEXT_PUBLIC_OKANDA_CHECKOUT_URL;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_OKANDA_CHECKOUT_URL;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NEXT_PUBLIC_OKANDA_CHECKOUT_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_OKANDA_CHECKOUT_URL;
    }
  });

  it('provides funnel configuration with VSL anchor and OKANDA host constraints', () => {
    const config = getFunnelConfig();
    expect(config.vsl.anchor).toBe('apresentacao');
    expect(config.checkout.provider).toBe('okanda');
    expect(config.checkout.allowedHosts).toContain('okandapay.com');
  });

  it('rejects unconfigured or empty checkout URL honestly', () => {
    process.env.NEXT_PUBLIC_OKANDA_CHECKOUT_URL = '';
    const res = getValidatedCheckoutUrl();
    expect(res.isConfigured).toBe(false);
    expect(res.url).toBeNull();
    expect(res.error).toContain('ainda não está configurado');
  });

  it('rejects non-HTTPS URLs for security', () => {
    process.env.NEXT_PUBLIC_OKANDA_CHECKOUT_URL = 'http://okandapay.com/pay/keds-principal';
    const res = getValidatedCheckoutUrl();
    expect(res.isConfigured).toBe(false);
    expect(res.url).toBeNull();
    expect(res.error).toContain('HTTPS');
  });

  it('rejects unauthorized or arbitrary domains (no open redirects / fake checkouts)', () => {
    process.env.NEXT_PUBLIC_OKANDA_CHECKOUT_URL = 'https://fake-checkout.com/pay';
    const res = getValidatedCheckoutUrl();
    expect(res.isConfigured).toBe(false);
    expect(res.url).toBeNull();
    expect(res.error).toContain('não pertence à lista de hosts aprovados');
  });

  it('accepts valid https URL on okandapay.com host', () => {
    process.env.NEXT_PUBLIC_OKANDA_CHECKOUT_URL = 'https://okandapay.com/pay/keds-principal-pt';
    const res = getValidatedCheckoutUrl();
    expect(res.isConfigured).toBe(true);
    expect(res.url).toBe('https://okandapay.com/pay/keds-principal-pt');
    expect(res.error).toBeUndefined();
  });

  it('accepts valid subdomain of okandapay.com', () => {
    process.env.NEXT_PUBLIC_OKANDA_CHECKOUT_URL = 'https://checkout.okandapay.com/pay/keds';
    const res = getValidatedCheckoutUrl();
    expect(res.isConfigured).toBe(true);
    expect(res.url).toBe('https://checkout.okandapay.com/pay/keds');
  });
});
