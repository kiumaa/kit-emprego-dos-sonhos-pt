import { NextRequest, NextResponse } from 'next/server';
import { randomInt } from 'node:crypto';
import { setPendingOtp } from '@/server/auth/otp-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'INVALID_EMAIL' }, { status: 400 });
    }

    // Em modo produção sem fornecedor de email / Clerk configurado, reportamos estado pendente
    const isProd = process.env.NODE_ENV === 'production' && !process.env.CLERK_SECRET_KEY && !process.env.RESEND_API_KEY;
    if (isProd) {
      return NextResponse.json(
        {
          ok: false,
          error: 'EMAIL_PROVIDER_PENDING',
          message: 'O fornecedor de envio de código por email (Clerk/Resend) ainda não está configurado.',
        },
        { status: 503 }
      );
    }

    // Gerar código numérico de 6 dígitos
    const code = String(randomInt(100000, 999999));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos

    setPendingOtp(email, code, expiresAt);

    // Em desenvolvimento ou ambiente de teste, devolvemos devCode para testes imediatos
    const devCode = process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEV_OTP === 'true' ? code : undefined;

    return NextResponse.json({
      ok: true,
      message: 'Código de verificação gerado.',
      expiresInSeconds: 600,
      devCode,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
