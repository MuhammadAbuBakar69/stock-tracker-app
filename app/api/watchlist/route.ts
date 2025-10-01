import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

/**
 * Simple watchlist API for local/dev use.
 *
 * Endpoints:
 * GET  /api/watchlist?userId=...           -> returns user's watchlist items
 * POST /api/watchlist                      -> body: { userId, symbol, company }
 * DELETE /api/watchlist                    -> body: { userId, symbol }
 *
 * Security note: currently this API trusts the client-provided `userId`.
 * For production you should verify Firebase ID tokens server-side using
 * the Firebase Admin SDK and only accept a verified uid. See TODOs.
 */

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || '';
    if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

    await connectToDatabase();
    const items = await Watchlist.find({ userId }).lean();
    return NextResponse.json({ items });
  } catch (err) {
    console.error('GET /api/watchlist error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, symbol, company } = body || {};
    if (!userId || !symbol || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    await Watchlist.updateOne(
      { userId, symbol: String(symbol).toUpperCase().trim() },
      { $set: { company: String(company).trim(), addedAt: new Date() } },
      { upsert: true }
    );

    // Mongoose `updateOne` returns an object with `upsertedId` when an upsert occurred
  return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/watchlist error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId, symbol } = body || {};
    if (!userId || !symbol) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();
    await Watchlist.deleteOne({ userId, symbol: String(symbol).toUpperCase().trim() });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/watchlist error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
