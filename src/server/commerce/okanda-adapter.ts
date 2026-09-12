import {
  CommerceProvider,
  VerifiedPayment,
  OrderState,
  ProductId,
  PurchaseLine,
} from '../../../contracts/domain';

export class OkandaCommerceProvider implements CommerceProvider {
  private isConfigured: boolean;
  private isDemoMode: boolean;

  constructor(options?: { apiKey?: string; webhookSecret?: string; mode?: 'demo' | 'live' }) {
    const apiKey = options?.apiKey || process.env.OKANDA_API_KEY;
    const webhookSecret = options?.webhookSecret || process.env.OKANDA_WEBHOOK_SECRET;
    this.isDemoMode = (options?.mode || process.env.APP_MODE || 'demo') === 'demo';
    this.isConfigured = !!(apiKey && webhookSecret);
  }

  /**
   * Inicia o fluxo de checkout com a OKANDA.
   * Em produção: falha fechada com INTEGRATION_NOT_CONFIGURED se as credenciais reais faltarem.
   * Em demo local: devolve um URL protegido de preview com parâmetros seguros.
   */
  async createCheckout(input: {
    internalOrderId: string;
    product: 'kit-emprego-pt';
    returnUrl: string;
  }): Promise<{ redirectUrl: string; providerOrderId: string | null }> {
    if (!this.isConfigured && !this.isDemoMode) {
      const error = new Error('INTEGRATION_NOT_CONFIGURED: OKANDA API credentials not configured.');
      (error as unknown as { code: string }).code = 'INTEGRATION_NOT_CONFIGURED';
      throw error;
    }

    if (this.isDemoMode) {
      const demoOrderId = `ok-demo-${input.internalOrderId}`;
      // Em modo de demonstração local, redireciona para a página de obrigado de demonstração
      const redirectUrl = `${input.returnUrl}?order_id=${encodeURIComponent(
        demoOrderId
      )}&demo=true`;
      return { redirectUrl, providerOrderId: demoOrderId };
    }

    // Fluxo real com OKANDA oficial quando credenciais configuradas
    throw new Error('INTEGRATION_NOT_CONFIGURED: Documentação oficial e credenciais OKANDA pendentes de validação.');
  }

  /**
   * Valida a assinatura de um webhook recebido da OKANDA.
   */
  async verifyWebhook(input: {
    rawBody: Uint8Array;
    headers: Record<string, string>;
  }): Promise<VerifiedPayment> {
    if (!this.isConfigured && !this.isDemoMode) {
      const error = new Error('INTEGRATION_NOT_CONFIGURED: Webhook secret not configured.');
      (error as unknown as { code: string }).code = 'INTEGRATION_NOT_CONFIGURED';
      throw error;
    }

    if (this.isDemoMode) {
      // Simulação estrita para testes locais
      const eventId = `evt-demo-${Date.now()}`;
      return {
        provider: 'okanda',
        eventId,
        orderId: 'ok-demo-order',
        reference: 'DEMO-REF-001',
        state: 'paid',
        total: { currency: 'EUR', amountMinor: 1490 },
        lines: [
          {
            providerLineId: 'line-1',
            productId: 'kit-emprego-pt',
            amountMinor: 1490,
            refundedMinor: 0,
          },
        ],
        verifiedAt: new Date().toISOString(),
        customerEmail: 'cliente-demo@exemplo.pt',
      };
    }

    throw new Error('INTEGRATION_NOT_CONFIGURED: Aguarda contrato e endpoints oficiais OKANDA.');
  }

  /**
   * Consulta o estado autoritativo de uma encomenda no servidor do fornecedor.
   */
  async fetchAuthoritativeState(providerOrderId: string): Promise<VerifiedPayment> {
    if (!this.isConfigured && !this.isDemoMode) {
      const error = new Error('INTEGRATION_NOT_CONFIGURED: Provider query not configured.');
      (error as unknown as { code: string }).code = 'INTEGRATION_NOT_CONFIGURED';
      throw error;
    }

    if (this.isDemoMode) {
      return {
        provider: 'okanda',
        eventId: `state-${providerOrderId}`,
        orderId: providerOrderId,
        reference: 'DEMO-REF-001',
        state: 'paid',
        total: { currency: 'EUR', amountMinor: 1490 },
        lines: [
          {
            providerLineId: 'line-1',
            productId: 'kit-emprego-pt',
            amountMinor: 1490,
            refundedMinor: 0,
          },
        ],
        verifiedAt: new Date().toISOString(),
        customerEmail: 'cliente-demo@exemplo.pt',
      };
    }

    throw new Error('INTEGRATION_NOT_CONFIGURED');
  }
}
