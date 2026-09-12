import { describe, it, expect } from 'vitest';
import { OkandaCommerceProvider } from '../okanda-adapter';

describe('Adaptador de Comércio OKANDA', () => {
  it('falha fechado com INTEGRATION_NOT_CONFIGURED em modo live sem credenciais', async () => {
    const provider = new OkandaCommerceProvider({ mode: 'live' });

    await expect(
      provider.createCheckout({
        internalOrderId: 'ord-123',
        product: 'kit-emprego-pt',
        returnUrl: 'https://exemplo.pt/obrigado',
      })
    ).rejects.toThrow(/INTEGRATION_NOT_CONFIGURED/);

    await expect(
      provider.verifyWebhook({
        rawBody: new Uint8Array(),
        headers: {},
      })
    ).rejects.toThrow(/INTEGRATION_NOT_CONFIGURED/);
  });

  it('permite fluxo de preview controlado em modo demo', async () => {
    const provider = new OkandaCommerceProvider({ mode: 'demo' });

    const checkout = await provider.createCheckout({
      internalOrderId: 'ord-123',
      product: 'kit-emprego-pt',
      returnUrl: 'http://localhost:3002/obrigado',
    });

    expect(checkout.redirectUrl).toContain('order_id=ok-demo-ord-123');
    expect(checkout.redirectUrl).toContain('demo=true');

    const payment = await provider.fetchAuthoritativeState('ok-demo-ord-123');
    expect(payment.state).toBe('paid');
    expect(payment.total.amountMinor).toBe(1490);
    expect(payment.total.currency).toBe('EUR');
    expect(payment.lines[0].productId).toBe('kit-emprego-pt');
  });
});
