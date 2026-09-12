import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getPendingOtp, deletePendingOtp, verifyAndDecodePendingOtpToken } from '@/server/auth/otp-store';
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

    const pendingToken = request.cookies.get('keds_pending_otp')?.value;
    const pendingCookieData = pendingToken ? verifyAndDecodePendingOtpToken(pendingToken) : null;
    const pendingMem = getPendingOtp(email);

    let isMatch = false;

    if (pendingCookieData && pendingCookieData.email === email) {
      if (pendingCookieData.code === code) {
        isMatch = true;
      } else {
        return NextResponse.json({ ok: false, error: 'INVALID_CODE', attemptsLeft: 3 }, { status: 400 });
      }
    } else if (pendingMem) {
      if (Date.now() > pendingMem.expiresAt) {
        deletePendingOtp(email);
        return NextResponse.json({ ok: false, error: 'CODE_EXPIRED' }, { status: 400 });
      }
      if (pendingMem.attempts >= 5) {
        deletePendingOtp(email);
        return NextResponse.json({ ok: false, error: 'TOO_MANY_ATTEMPTS' }, { status: 429 });
      }
      if (pendingMem.code !== code) {
        pendingMem.attempts += 1;
        return NextResponse.json({ ok: false, error: 'INVALID_CODE', attemptsLeft: 5 - pendingMem.attempts }, { status: 400 });
      }
      isMatch = true;
    } else {
      return NextResponse.json({ ok: false, error: 'CODE_EXPIRED_OR_NOT_FOUND' }, { status: 400 });
    }

    if (!isMatch) {
      return NextResponse.json({ ok: false, error: 'INVALID_CODE' }, { status: 400 });
    }

    // Código válido! Consumir OTP em memória se existir
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

    const isHttps = request.url.startsWith('https://');

    // Definir cookie de sessão
    response.cookies.set({
      name: 'keds_session',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: isHttps,
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: '/',
    });

    // Limpar cookie de pending OTP
    response.cookies.set({
      name: 'keds_pending_otp',
      value: '',
      httpOnly: true,
      sameSite: 'lax',
      secure: isHttps,
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}

