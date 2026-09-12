import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getPendingOtp, deletePendingOtp } from '@/server/auth/otp-store';
import { signSessionPayload } from '@/server/auth/session';
import { store } from '@/server/db/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const code = typeof body.code === 'string' ? body.code.trim() : '';

    if (!email || !code) {
      return NextResponse.json({ ok: false, error: 'MISSING_FIELDS' }, { status: 400 });
    }

    const pending = getPendingOtp(email);
    if (!pending) {
      return NextResponse.json({ ok: false, error: 'CODE_EXPIRED_OR_NOT_FOUND' }, { status: 400 });
    }

    if (Date.now() > pending.expiresAt) {
      deletePendingOtp(email);
      return NextResponse.json({ ok: false, error: 'CODE_EXPIRED' }, { status: 400 });
    }

    if (pending.attempts >= 5) {
      deletePendingOtp(email);
      return NextResponse.json({ ok: false, error: 'TOO_MANY_ATTEMPTS' }, { status: 429 });
    }

    if (pending.code !== code) {
      pending.attempts += 1;
      return NextResponse.json({ ok: false, error: 'INVALID_CODE', attemptsLeft: 5 - pending.attempts }, { status: 400 });
    }

    // Código válido! Consumir OTP
    deletePendingOtp(email);

    // Subject determinístico ou gerado
    const subject = `usr_${randomUUID().slice(0, 12)}`;
    const claimedCount = store.claimEntitlements(email, subject);

    const token = signSessionPayload(subject, email);
    const response = NextResponse.json({
      ok: true,
      subject,
      email,
      claimedCount,
    });

    response.cookies.set({
      name: 'keds_session',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
