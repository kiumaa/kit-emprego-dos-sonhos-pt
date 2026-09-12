import { NextRequest, NextResponse } from 'next/server';
import { getVerifiedSession } from '@/server/auth/session';
import { store } from '@/server/db/store';
import { generateCvPdf, CVDraftData } from '@/server/pdf/cv-pdf-generator';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
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

    const activeWindow = store.getActiveWindow(kitEnt.id);
    if (!activeWindow) {
      return NextResponse.json(
        {
          ok: false,
          error: 'NO_ACTIVE_WORK_WINDOW',
          message: 'Uma sessão de trabalho ativa é necessária para gerar um novo ficheiro PDF.',
        },
        { status: 403 }
      );
    }

    const draft = store.getCVDraft(params.id, session.subject);
    if (!draft) {
      return NextResponse.json({ ok: false, error: 'DRAFT_NOT_FOUND' }, { status: 404 });
    }

    const doc = draft.document as unknown as CVDraftData;
    const pdfBuffer = generateCvPdf(doc);

    const safeName = (doc.personal?.name || 'curriculo')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_')
      .replace(/_+/g, '_');
    const filename = `cv_${safeName}.pdf`;

    const file = store.saveFile(
      session.subject,
      kitEnt.id,
      filename,
      'application/pdf',
      pdfBuffer,
      draft.version
    );

    return NextResponse.json({
      ok: true,
      fileId: file.id,
      filename: file.filename,
      downloadUrl: `/api/me/files/${file.id}`,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
