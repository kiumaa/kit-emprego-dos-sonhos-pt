/** Internal domain contracts. These are NOT the official OKANDA API. */
export type ProductId = 'kit-emprego-pt' | 'entrevista' | 'linkedin';
export type EntitlementKey = 'kit' | 'entrevista' | 'linkedin';
export type DiagnosticSource = 'cv' | 'quiz';
export type JobState = 'queued' | 'processing' | 'completed' | 'failed' | 'expired';
export type OrderState = 'pending' | 'paid' | 'failed' | 'cancelled' | 'partially_refunded' | 'refunded' | 'disputed';
export interface Money { currency: 'EUR'; amountMinor: number; }
export interface AuthenticatedActor { userId: string; verifiedEmail: string; }
export interface PurchaseLine { providerLineId: string; productId: ProductId; amountMinor: number; refundedMinor: number; }
export interface VerifiedPayment {
  provider: 'okanda'; eventId: string; orderId: string; reference: string | null;
  state: OrderState; total: Money; lines: PurchaseLine[]; verifiedAt: string;
  customerEmail: string | null;
}
export interface CommerceProvider {
  createCheckout(input: { internalOrderId: string; product: 'kit-emprego-pt'; returnUrl: string }): Promise<{ redirectUrl: string; providerOrderId: string | null }>;
  verifyWebhook(input: { rawBody: Uint8Array; headers: Record<string, string> }): Promise<VerifiedPayment>;
  fetchAuthoritativeState(providerOrderId: string): Promise<VerifiedPayment>;
}
export interface AnalysisProvider {
  analyze(input: { minimizedCvText: string; targetRole?: string; jobDescription?: string; requestId: string }): Promise<unknown>;
}
export interface PrivateStorageProvider {
  putTemporary(input: { bytes: Uint8Array; mime: string; ttlSeconds: number }): Promise<{ objectId: string }>;
  delete(objectId: string): Promise<void>;
  createDownloadUrl(input: { objectId: string; ttlSeconds: number }): Promise<string>;
}
export interface EmailProvider {
  sendTransactional(input: { to: string; templateId: string; variables: Record<string, string>; dedupKey: string }): Promise<{ messageId: string }>;
}
export interface ApplicationRecord {
  id: string; userId: string; company: string; role: string; url: string | null;
  state: 'preparing' | 'sent' | 'interview' | 'offer' | 'closed';
  sentDate: string | null; nextAction: string; nextActionDate: string | null; notes: string;
}
/** No CvEditor, CvBuilder, CV field persistence or personalized export contract. */
