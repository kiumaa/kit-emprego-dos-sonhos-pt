import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { signSessionPayload } from '@/server/auth/session';
import { store, isTestUserEmail } from '@/server/db/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'INVALID_EMAIL', message: 'Por favor introduz um endereço de email válido.' },
        { status: 400 }
      );
    }

    const isTest = isTestUserEmail(email);
    const hasEntitlement = store.hasEntitlementsForEmail(email);

    if (!isTest && !hasEntitlement) {
      return NextResponse.json(
        {
          ok: false,
          error: 'PURCHASE_NOT_FOUND',
          message:
            'Não encontramos nenhuma compra aprovada para este email. Se acabaste de pagar na OKANDA, aguarda alguns instantes ou verifica se usaste outro email na compra.',
        },
        { status: 404 }
      );
    }

    // Gerar subject determinístico para este utilizador manter sempre o mesmo histórico de ficheiros
    const subject = 'usr_' + createHash('sha256').update(email).digest('hex').slice(0, 16);

    // Se for utilizador de teste, semear todos os 3 produtos
    store.seedTestEntitlementsIfApplicable(email, subject);

    // Associar os direitos existentes da OKANDA a este subject
    const claimedCount = store.claimEntitlements(email, subject);

    // Assinar token de sessão de 30 dias
    const token = signSessionPayload(subject, email);

    const response = NextResponse.json({
      ok: true,
      subject,
      email,
      claimedCount,
      redirect: '/meu-kit',
    });

    const isHttps = request.url.startsWith('https://');

    response.cookies.set({
      name: 'keds_session',
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: isHttps,
      maxAge: 30 * 24 * 60 * 60, // 30 dias
      path: '/',
    });

    // Limpar cookie pendente de OTP se existisse
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
    return NextResponse.json({ ok: false, error: 'INTERNAL_ERROR', message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
