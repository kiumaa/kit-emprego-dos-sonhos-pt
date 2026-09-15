import { createHash } from 'node:crypto';

export interface MetaUserData {
  email?: string;
  phone?: string;
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbc?: string;
  fbp?: string;
  externalId?: string;
}

export interface MetaCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  order_id?: string;
  status?: string;
  [key: string]: unknown;
}

export interface MetaEventPayload {
  eventName: string;
  eventId?: string;
  eventTime?: number; // Unix timestamp in seconds
  eventSourceUrl?: string;
  actionSource?: 'website' | 'email' | 'system_generated' | 'other';
  userData?: MetaUserData;
  customData?: MetaCustomData;
}

export interface MetaCapiResponse {
  success: boolean;
  eventsReceived?: number;
  fbtraceId?: string;
  error?: string;
}

const DEFAULT_PIXEL_ID = '2355977538561849';
const DEFAULT_ACCESS_TOKEN =
  'EAAQEKeDduf0BSaFeNe8KzC8M2KZAZCEhhGQKg9ACmCZAmCTejFejNyqIGlZAE3b1DtAE8mGqN7PtAbbrv1jiT24BKODskuskPwMeiHGEffRu1Uya9eqSq1XZCUdtm1VVrCkPVIYGasTIXtyU8LuN4VSHzT8ZCGvCZC3ZBvBJoMXKzDRdNz6viJ9fyftEy1hGbAZDZD';

/**
 * Normaliza e calcula o hash SHA-256 de campos PII (e-mail, telefone, etc.)
 * em conformidade com as diretrizes da Meta.
 */
export function hashField(val?: string): string | undefined {
  if (!val || typeof val !== 'string') return undefined;
  const trimmed = val.trim().toLowerCase();
  if (!trimmed) return undefined;
  // Se já for um hash sha256 válido (64 caracteres hexadecimais), não re-hashear
  if (/^[a-f0-9]{64}$/.test(trimmed)) {
    return trimmed;
  }
  return createHash('sha256').update(trimmed).digest('hex');
}

/**
 * Formata um objeto de utilizador para o padrão da Meta CAPI.
 */
export function formatUserData(userData?: MetaUserData): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (!userData) return result;

  if (userData.email) {
    const hashed = hashField(userData.email);
    if (hashed) result.em = [hashed];
  }

  if (userData.phone) {
    const hashed = hashField(userData.phone);
    if (hashed) result.ph = [hashed];
  }

  if (userData.externalId) {
    const hashed = hashField(userData.externalId);
    if (hashed) result.external_id = [hashed];
  }

  if (userData.clientIpAddress) {
    result.client_ip_address = userData.clientIpAddress;
  }

  if (userData.clientUserAgent) {
    result.client_user_agent = userData.clientUserAgent;
  }

  if (userData.fbc) {
    result.fbc = userData.fbc;
  }

  if (userData.fbp) {
    result.fbp = userData.fbp;
  }

  return result;
}

/**
 * Envia um ou mais eventos para a Meta Conversions API (Graph API v22.0).
 */
export async function sendMetaConversionEvent(
  events: MetaEventPayload | MetaEventPayload[],
  options?: { testEventCode?: string }
): Promise<MetaCapiResponse> {
  const pixelId = process.env.META_PIXEL_ID?.trim() || DEFAULT_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN?.trim() || DEFAULT_ACCESS_TOKEN;
  const testEventCode = options?.testEventCode || process.env.META_TEST_EVENT_CODE?.trim();

  if (!pixelId || !accessToken) {
    return {
      success: false,
      error: 'META_CREDENTIALS_MISSING',
    };
  }

  const rawEvents = Array.isArray(events) ? events : [events];
  const nowSec = Math.floor(Date.now() / 1000);

  const formattedData = rawEvents.map((evt) => ({
    event_name: evt.eventName,
    event_time: evt.eventTime ?? nowSec,
    event_id: evt.eventId,
    event_source_url: evt.eventSourceUrl || 'https://kit-emprego-dos-sonhos.pt',
    action_source: evt.actionSource ?? 'website',
    user_data: formatUserData(evt.userData),
    custom_data: evt.customData,
  }));

  const payload: Record<string, unknown> = {
    data: formattedData,
  };

  if (testEventCode) {
    payload.test_event_code = testEventCode;
  }

  try {
    const url = `https://graph.facebook.com/v22.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(accessToken)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.error?.message || `HTTP ${response.status}`;
      return {
        success: false,
        error: errMsg,
        fbtraceId: data?.error?.fbtrace_id,
      };
    }

    return {
      success: true,
      eventsReceived: data?.events_received,
      fbtraceId: data?.fbtrace_id,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network error';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Disparo não-bloqueante e seguro (sem quebra do fluxo principal em caso de falha de rede).
 */
export function sendMetaConversionEventAsync(
  events: MetaEventPayload | MetaEventPayload[],
  options?: { testEventCode?: string }
): void {
  sendMetaConversionEvent(events, options).catch(() => {
    // Falha silenciosa ou log anónimo sem expor PII
  });
}
