import { NextRequest, NextResponse } from 'next/server';
import { randomInt } from 'node:crypto';
import { setPendingOtp, signPendingOtp } from '@/server/auth/otp-store';

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
    const isProd =
      process.env.NODE_ENV === 'production' &&
      !process.env.CLERK_SECRET_KEY &&
      !process.env.RESEND_API_KEY &&
      process.env.ENABLE_DEV_OTP !== 'true';
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

    // Se tivermos fornecedor Resend configurado, enviamos o email real
    if (process.env.RESEND_API_KEY) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Kit Emprego dos Sonhos <onboarding@resend.dev>';
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [email],
            subject: `O teu código de acesso: ${code} — Kit Emprego dos Sonhos`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; color: #1D1D1F;">
                <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #1D1D1F;">Acesso ao Kit Emprego dos Sonhos</h2>
                <p style="font-size: 15px; line-height: 1.5; color: #51515A;">Utiliza o código abaixo para acederes aos teus produtos e ferramentas:</p>
                <div style="margin: 24px 0; padding: 20px; background-color: #F5F5F7; border-radius: 12px; text-align: center;">
                  <span style="font-size: 32px; font-weight: 800; letter-spacing: 0.2em; color: #0057D9;">${code}</span>
                </div>
                <p style="font-size: 13px; color: #86868B; line-height: 1.4;">Este código expira em 10 minutos. Se não fizeste este pedido, podes ignorar esta mensagem com segurança.</p>
              </div>
            `,
          }),
        });
      } catch (err) {
        console.error('Erro ao enviar email via Resend:', err);
      }
    }

    // Em desenvolvimento ou ambiente de teste, devolvemos devCode para testes imediatos
    const devCode = process.env.NODE_ENV !== 'production' || process.env.ENABLE_DEV_OTP === 'true' ? code : undefined;

    const response = NextResponse.json({
      ok: true,
      message: 'Código de verificação gerado.',
      expiresInSeconds: 600,
      devCode,
    });

    const pendingToken = signPendingOtp(email, code, expiresAt);
    const isHttps = request.url.startsWith('https://');
    response.cookies.set({
      name: 'keds_pending_otp',
      value: pendingToken,
      httpOnly: true,
      sameSite: 'lax',
      secure: isHttps,
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ ok: false, error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
