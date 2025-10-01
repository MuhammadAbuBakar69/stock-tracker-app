import { NextResponse } from 'next/server';

// Debug route stubed out after migrating to Firebase client-side flows.
export async function POST() {
  return NextResponse.json({ ok: false, error: 'Debug sign-up endpoint removed. Use client-side Firebase flows.' }, { status: 410 });
}
