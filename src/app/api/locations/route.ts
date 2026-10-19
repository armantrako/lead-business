import { NextResponse } from 'next/server';
import { SUPPORTED_COUNTRIES } from '@/data/locations';
import { CATEGORY_OPTIONS } from '@/types';
import { INSTAGRAM_BUSINESSES } from '@/data/instagramBusinesses';

export async function GET() {
  return NextResponse.json({
    success: true,
    countries: SUPPORTED_COUNTRIES,
    categories: CATEGORY_OPTIONS,
    totalActiveObjects: INSTAGRAM_BUSINESSES.length,
  });
}
