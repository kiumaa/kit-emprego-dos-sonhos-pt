import { describe, it, expect, beforeEach, vi } from 'vitest';
import { appendTrackingToUrl, captureMarketingParams } from '../utm-tracker';

describe('UTM Tracker & Checkout Attribution', () => {
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};
    const mockSessionStorage = {
      getItem: (k: string) => mockStore[k] || null,
      setItem: (k: string, v: string) => {
        mockStore[k] = v;
      },
      clear: () => {
        mockStore = {};
      },
    };

    vi.stubGlobal('sessionStorage', mockSessionStorage);
    vi.stubGlobal('window', {
      location: {
        search: '?utm_source=facebook&utm_campaign=keds_pt&fbclid=fb_clk_123',
      },
      sessionStorage: mockSessionStorage,
    });
  });

  it('captura parâmetros de marketing da URL atual', () => {
    captureMarketingParams();
    expect(mockStore['keds_marketing_params']).toBeDefined();
    const parsed = JSON.parse(mockStore['keds_marketing_params']);
    expect(parsed.utm_source).toBe('facebook');
    expect(parsed.utm_campaign).toBe('keds_pt');
    expect(parsed.fbclid).toBe('fb_clk_123');
  });

  it('anexa parâmetros de marketing da sessão e da URL ao link da OKANDA', () => {
    mockStore['keds_marketing_params'] = JSON.stringify({
      utm_source: 'facebook',
      utm_campaign: 'keds_pt',
      fbclid: 'fb_clk_123',
    });

    const baseUrl = 'https://okandapay.com/checkout/kit-emprego-dos-sonhos-mtz4h7e8?pid=c38e6af8';
    const enriched = appendTrackingToUrl(baseUrl);

    expect(enriched).toBeDefined();
    const parsed = new URL(enriched!);
    expect(parsed.searchParams.get('pid')).toBe('c38e6af8');
    expect(parsed.searchParams.get('utm_source')).toBe('facebook');
    expect(parsed.searchParams.get('utm_campaign')).toBe('keds_pt');
    expect(parsed.searchParams.get('fbclid')).toBe('fb_clk_123');
  });

  it('retorna null se o URL for nulo ou inválido', () => {
    expect(appendTrackingToUrl(null)).toBeNull();
    expect(appendTrackingToUrl('')).toBeNull();
  });
});
