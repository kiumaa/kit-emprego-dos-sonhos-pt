import { cookies, headers } from 'next/headers';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { store } from '@/server/db/store';

export interface VerifiedSession {
  subject: string;
  email: string;
  isMock?: boolean;
}

const SESSION_COOKIE_NAME = 'keds_session';
const SESSION_SECRET = process.env.CLERK_SECRET_KEY || process.env.SESSION_SECRET || 'keds-session-secret-local-development-only';

export function signSessionPayload(subject: string, email: string): string {
  const data = JSON.stringify({ subject, email: email.trim().toLowerCase(), iat: Date.now() });
  const b64Data = Buffer.from(data).toString('base64url');
  const sig = createHmac('sha256', SESSION_SECRET).update(b64Data).digest('base64url');
  return `${b64Data}.${sig}`;
}

export function verifySessionToken(token: string): { subject: string; email: string } | null {
  try {
    const [b64Data, sig] = token.split('.');
    if (!b64Data || !sig) return null;
    const expectedSig = createHmac('sha256', SESSION_SECRET).update(b64Data).digest('base64url');
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
    const payload = JSON.parse(Buffer.from(b64Data, 'base64url').toString('utf-8'));
    if (!payload.subject || !payload.email) return null;
    return { subject: payload.subject, email: payload.email };
  } catch {
    return null;
  }
}

export async function getVerifiedSession(): Promise<VerifiedSession | null> {
  const headerList = await headers();
  // Header explícito de teste / API interna
  const testSubject = headerList.get('x-keds-auth-subject');
  const testEmail = headerList.get('x-keds-auth-email');
  if (testSubject && testEmail) {
    const verified = {
      subject: testSubject.trim(),
      email: testEmail.trim().toLowerCase(),
      isMock: true,
    };
    store.seedTestEntitlementsIfApplicable(verified.email, verified.subject);
    return verified;
  }

  // Cookie assinado
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (sessionCookie?.value) {
    const verified = verifySessionToken(sessionCookie.value);
    if (verified) {
      store.seedTestEntitlementsIfApplicable(verified.email, verified.subject);
      return verified;
    }
  }

  return null;
}
