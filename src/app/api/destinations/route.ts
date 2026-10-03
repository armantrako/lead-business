import { NextRequest, NextResponse } from 'next/server';
import { COUNTRIES, DESTINATIONS, getDestinationsByCountry } from '@/data/destinations';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const country = searchParams.get('country');

  if (country) {
    const destinations = getDestinationsByCountry(country);
    return NextResponse.json({
      country,
      count: destinations.length,
      destinations,
    });
  }

  // Calculate destination count per country
  const countriesWithCounts = COUNTRIES.map((c) => ({
    ...c,
    destinationsCount: DESTINATIONS.filter(
      (d) => d.country.toLowerCase() === c.name.toLowerCase()
    ).length,
  }));

  return NextResponse.json({
    countries: countriesWithCounts,
    totalDestinations: DESTINATIONS.length,
  });
}
