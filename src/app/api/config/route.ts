import { NextResponse } from 'next/server';

export async function GET() {
  const hasApiKey = Boolean(
    process.env.GOOGLE_PLACES_API_KEY?.trim() ||
    process.env.GOOGLE_MAPS_API_KEY?.trim()
  );

  return NextResponse.json({
    hasApiKey,
    appName: 'Lead Business',
  });
}
