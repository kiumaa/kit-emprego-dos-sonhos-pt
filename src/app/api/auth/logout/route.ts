import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ ok: true, message: 'Sessão terminada.' });
  response.cookies.delete('keds_session');
  return response;
}
