import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  hashField,
  formatUserData,
  sendMetaConversionEvent,
} from '../meta-conversions';

describe('Meta Conversions API (CAPI)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('hashField', () => {
    it('normaliza com trim e minúsculas antes de calcular sha256', () => {
      const email = '  Test.User@Example.COM  ';
      const hashed = hashField(email);
      // sha256('test.user@example.com')
      expect(hashed).toBe('a97d7a4513204a9cc7cb2f11d72d41a59b18d1ba633d22e58d53c625518f5203');
    });

    it('não altera se já for um hash sha256 de 64 caracteres', () => {
      const existingHash = 'a97d7a4513204a9cc7cb2f11d72d41a59b18d1ba633d22e58d53c625518f5203';
      expect(hashField(existingHash)).toBe(existingHash);
    });

    it('retorna undefined para entradas vazias ou inválidas', () => {
      expect(hashField('')).toBeUndefined();
      expect(hashField('   ')).toBeUndefined();
      expect(hashField(undefined)).toBeUndefined();
    });
  });

  describe('formatUserData', () => {
    it('estrutura corretamente os campos PII com hash e os campos técnicos diretos', () => {
      const formatted = formatUserData({
        email: 'candidato@emprego.pt',
        clientIpAddress: '192.168.1.1',
        clientUserAgent: 'Mozilla/5.0',
        fbp: 'fb.1.123456789.987654321',
        fbc: 'fb.1.123456789.clickid',
      });

      expect(formatted.em).toBeDefined();
      expect(Array.isArray(formatted.em)).toBe(true);
      expect((formatted.em as string[])[0]).toHaveLength(64);
      expect(formatted.client_ip_address).toBe('192.168.1.1');
      expect(formatted.client_user_agent).toBe('Mozilla/5.0');
      expect(formatted.fbp).toBe('fb.1.123456789.987654321');
      expect(formatted.fbc).toBe('fb.1.123456789.clickid');
    });
  });

  describe('sendMetaConversionEvent', () => {
    it('faz POST para o endpoint v22.0 da Meta com token e payload estruturado', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          events_received: 1,
          fbtrace_id: 'trace_12345',
        }),
      });
      global.fetch = mockFetch;

      const res = await sendMetaConversionEvent(
        {
          eventName: 'Purchase',
          eventId: 'sale_okanda_999',
          eventSourceUrl: 'https://kit-emprego-dos-sonhos.pt/obrigado',
          userData: {
            email: 'comprador@teste.com',
          },
          customData: {
            value: 14.99,
            currency: 'EUR',
            order_id: 'sale_okanda_999',
          },
        },
        { testEventCode: 'TEST1234' }
      );

      expect(res.success).toBe(true);
      expect(res.eventsReceived).toBe(1);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [calledUrl, calledOptions] = mockFetch.mock.calls[0];
      expect(calledUrl).toContain('https://graph.facebook.com/v22.0/2355977538561849/events');
      expect(calledUrl).toContain('access_token=');

      const body = JSON.parse(calledOptions.body);
      expect(body.test_event_code).toBe('TEST1234');
      expect(body.data[0].event_name).toBe('Purchase');
      expect(body.data[0].event_id).toBe('sale_okanda_999');
      expect(body.data[0].custom_data.value).toBe(14.99);
      expect(body.data[0].custom_data.currency).toBe('EUR');
    });

    it('retorna success: false com a mensagem da Meta se o status não for 200', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({
          error: {
            message: 'Invalid access token',
            fbtrace_id: 'err_trace_99',
          },
        }),
      });

      const res = await sendMetaConversionEvent({
        eventName: 'Lead',
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe('Invalid access token');
      expect(res.fbtraceId).toBe('err_trace_99');
    });
  });
});
