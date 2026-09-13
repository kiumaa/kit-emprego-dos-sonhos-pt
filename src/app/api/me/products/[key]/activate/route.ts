import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedSession } from '@/server/auth/session';
import { store } from '@/server/db/store';
import { AccessError } from '@/server/access/access-policy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ key: string }> }
) {
  try {
    const params = await props.params;
    const key = params.key;

    if (!['kit', 'entrevista', 'linkedin'].includes(key)) {
      return NextResponse.json({ ok: false, error: 'INVALID_PRODUCT_KEY' }, { status: 400 });
    }

    const session = await getVerifiedSession();
    if (!session) {
      return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const requestId = typeof body.requestId === 'string' ? body.requestId.trim() : '';

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId)) {
      return NextResponse.json({ ok: false, error: 'INVALID_REQUEST_ID' }, { status: 400 });
    }

    // Procura o entitlement do utilizador para este produto
    const entitlement = await store.getEntitlementForProductAsync(session.subject, key as 'kit' | 'entrevista' | 'linkedin');
    if (!entitlement) {
      return NextResponse.json(
        {
          ok: false,
          error: 'PRODUCT_NOT_PURCHASED',
          message: `Não foi encontrado acesso ativo para o produto "${key}".`,
        },
        { status: 403 }
      );
    }

    const result = await store.openWorkWindowAsync(entitlement.id, session.subject, requestId);

    return NextResponse.json({
      ok: true,
      productKey: key,
      outcome: result.outcome,
      window: {
        id: result.window.id,
        ordinal: result.window.ordinal,
        startsAtMs: result.window.startedAtMs,
        expiresAtMs: result.window.expiresAtMs,
      },
      activationsUsed: result.activationsUsed,
      remainingActivations: result.remaining,
    });
  } catch (err: unknown) {
    if (err instanceof AccessError) {
      const isLimit = err.code === 'ACTIVATION_LIMIT_REACHED';
      const isAuth = err.code === 'FORBIDDEN' || err.code === 'ENTITLEMENT_INACTIVE';
      return NextResponse.json(
        { ok: false, error: err.code },
        { status: isLimit ? 429 : isAuth ? 403 : 400 }
      );
    }
    return NextResponse.json({ ok: false, error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
