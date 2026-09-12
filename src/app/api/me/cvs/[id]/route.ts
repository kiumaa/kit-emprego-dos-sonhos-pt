import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedSession } from '@/server/auth/session';
import { store } from '@/server/db/store';
import { canReadExisting } from '@/server/access/access-policy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const session = await getVerifiedSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  const kitEnt = store.getEntitlementForProduct(session.subject, 'kit');
  if (!kitEnt) {
    return NextResponse.json(
      { ok: false, error: 'PRODUCT_NOT_PURCHASED', message: 'Acesso ao Kit não encontrado.' },
      { status: 403 }
    );
  }

  // Verifica permissão de leitura
  const canRead = canReadExisting({
    entitlement: {
      id: kitEnt.id,
      subject: kitEnt.authSubject,
      status: kitEnt.status,
      used: kitEnt.activationsUsed,
      max: kitEnt.maxActivations,
      windowHours: kitEnt.windowHours,
      accessExpiresAtMs: kitEnt.accessExpiresAtMs,
    },
    subject: session.subject,
    nowMs: Date.now(),
  });

  if (!canRead) {
    return NextResponse.json({ ok: false, error: 'FORBIDDEN' }, { status: 403 });
  }

  const activeWindow = store.getActiveWindow(kitEnt.id);
  let draft = store.getCVDraft(params.id, session.subject);

  // Se não existir, criar rascunho inicial
  if (!draft) {
    const initialDoc = {
      schemaVersion: 1,
      template: 'essencial',
      personal: {
        name: '',
        email: session.email,
        phone: '',
        city: '',
        targetRole: '',
        photoAssetId: null,
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
    };
    draft = store.saveCVDraft(params.id, session.subject, kitEnt.id, initialDoc);
  }

  return NextResponse.json({
    ok: true,
    draft,
    activeWindow: activeWindow
      ? {
          id: activeWindow.id,
          expiresAtMs: activeWindow.expiresAtMs,
        }
      : null,
  });
}

export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const session = await getVerifiedSession();
    if (!session) {
      return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
    }

    const kitEnt = store.getEntitlementForProduct(session.subject, 'kit');
    if (!kitEnt || kitEnt.status !== 'active') {
      return NextResponse.json({ ok: false, error: 'FORBIDDEN' }, { status: 403 });
    }

    // Verificar se existe uma janela de trabalho ativa
    const activeWindow = store.getActiveWindow(kitEnt.id);
    if (!activeWindow) {
      return NextResponse.json(
        {
          ok: false,
          error: 'NO_ACTIVE_WORK_WINDOW',
          message: 'Não tens uma sessão de trabalho ativa. Inicia uma sessão no teu painel para editar.',
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { document, expectedVersion } = body;

    if (!document || typeof document !== 'object' || document.schemaVersion !== 1) {
      return NextResponse.json({ ok: false, error: 'INVALID_DOCUMENT_SCHEMA' }, { status: 400 });
    }

    // Validação mínima de segurança
    if (!['essencial', 'moderno'].includes(document.template)) {
      document.template = 'essencial';
    }

    const saved = store.saveCVDraft(
      params.id,
      session.subject,
      kitEnt.id,
      document,
      expectedVersion
    );

    return NextResponse.json({
      ok: true,
      version: saved.version,
      updatedAtMs: saved.updatedAtMs,
    });
  } catch (err: any) {
    if (err.message === 'VERSION_CONFLICT') {
      return NextResponse.json(
        { ok: false, error: 'VERSION_CONFLICT', message: 'O documento foi alterado noutra aba.' },
        { status: 409 }
      );
    }
    return NextResponse.json({ ok: false, error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
