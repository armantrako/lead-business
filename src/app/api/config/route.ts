import { NextResponse } from 'next/server';
import { INSTAGRAM_BUSINESSES } from '@/data/instagramBusinesses';

export async function GET() {
  const hasGoogleKey = Boolean(
    process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY
  );

  return NextResponse.json({
    hasApiKey: hasGoogleKey,
    totalActiveObjects: INSTAGRAM_BUSINESSES.length,
    service: 'Instagram & Facebook Ads Lead Finder',
    version: '2.0.0',
    minFollowersThreshold: 5000,
    freshnessHours: 24,
  });
}
