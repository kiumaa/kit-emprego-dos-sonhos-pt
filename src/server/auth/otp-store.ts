import { createHmac, timingSafeEqual } from 'node:crypto';

// Armazenamento em memória de OTPs pendentes (para ambiente local/testes)
const otpStore = new Map<string, { code: string; expiresAt: number; attempts: number }>();

const OTP_SECRET = process.env.CLERK_SECRET_KEY || process.env.SESSION_SECRET || 'keds-otp-secret-salt-cross-lambdas-2026';

export function getPendingOtp(email: string) {
  return otpStore.get(email.trim().toLowerCase());
}

export function setPendingOtp(email: string, code: string, expiresAt: number) {
  otpStore.set(email.trim().toLowerCase(), { code, expiresAt, attempts: 0 });
}

export function deletePendingOtp(email: string) {
  otpStore.delete(email.trim().toLowerCase());
}

// Token assinado sem estado (Cross-Lambda seguro para Vercel Serverless)
export function signPendingOtp(email: string, code: string, expiresAt: number): string {
  const payload = JSON.stringify({ email: email.trim().toLowerCase(), code, expiresAt });
  const b64 = Buffer.from(payload).toString('base64url');
  const sig = createHmac('sha256', OTP_SECRET).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

export function verifyAndDecodePendingOtpToken(token: string): { email: string; code: string; expiresAt: number } | null {
  try {
    const [b64, sig] = token.split('.');
    if (!b64 || !sig) return null;
    const expectedSig = createHmac('sha256', OTP_SECRET).update(b64).digest('base64url');
    if (sig.length !== expectedSig.length) return null;
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
    const data = JSON.parse(Buffer.from(b64, 'base64url').toString('utf-8'));
    if (typeof data !== 'object' || !data.email || !data.code || !data.expiresAt) return null;
    if (Date.now() > data.expiresAt) return null;
    return data;
  } catch {
    return null;
  }
}

export function verifyPendingOtpToken(token: string, email: string, code: string): boolean {
  const data = verifyAndDecodePendingOtpToken(token);
  if (!data) return false;
  if (data.email !== email.trim().toLowerCase()) return false;
  if (data.code.length !== code.length) return false;
  return timingSafeEqual(Buffer.from(data.code), Buffer.from(code));
}
