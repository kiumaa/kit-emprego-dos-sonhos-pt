import { NextResponse } from 'next/server';
import { generateSanitizedCsv } from '@/lib/tracker/csv-export';
import { ApplicationRecord } from '@contracts/domain';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const records = (body.applications || []) as ApplicationRecord[];

    const csvContent = generateSanitizedCsv(records);

    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="candidaturas-keds.csv"',
        'Cache-Control': 'no-store, private',
      },
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro ao exportar registos.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
