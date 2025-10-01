import { NextResponse } from 'next/server';

// Local debug only: returns whether a Finnhub API key is configured and a masked snippet.
// DO NOT deploy this endpoint to production as it exposes key presence information.
export async function GET() {
  const serverKey = process.env.FINNHUB_API_KEY;
  const publicKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  const key = serverKey ?? publicKey ?? null;

  const masked = key
    ? (key.length > 6 ? `${key.slice(0, 3)}...${key.slice(-3)}` : '***')
    : null;

  return NextResponse.json({ configured: Boolean(key), source: serverKey ? 'FINNHUB_API_KEY' : publicKey ? 'NEXT_PUBLIC_FINNHUB_API_KEY' : null, masked });
}
