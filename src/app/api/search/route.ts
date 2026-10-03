import { NextRequest, NextResponse } from 'next/server';
import { getDestinationById } from '@/data/destinations';
import { getCachedSearch, setCachedSearch } from '@/lib/cache';
import { GooglePlacesError, searchAndVerifyLeads } from '@/lib/google-places';
import { BusinessType, SearchResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      destinationId,
      businessType,
      apiKeyOverride,
      forceRefresh = false,
    } = body as {
      destinationId?: string;
      businessType?: BusinessType;
      apiKeyOverride?: string;
      forceRefresh?: boolean;
    };

    if (!destinationId) {
      return NextResponse.json<SearchResponse>(
        {
          success: false,
          leads: [],
          audit: {
            totalScanned: 0,
            excludedWithExistingWebsite: 0,
            excludedNoPhone: 0,
            excludedDistant: 0,
            excludedUncertainOrFoundViaSearch: 0,
            verifiedCount: 0,
          },
          error: 'Please select a destination.',
        },
        { status: 400 }
      );
    }

    if (!businessType || (businessType !== 'hotels' && businessType !== 'restaurants')) {
      return NextResponse.json<SearchResponse>(
        {
          success: false,
          leads: [],
          audit: {
            totalScanned: 0,
            excludedWithExistingWebsite: 0,
            excludedNoPhone: 0,
            excludedDistant: 0,
            excludedUncertainOrFoundViaSearch: 0,
            verifiedCount: 0,
          },
          error: 'Please select a valid business type (Hotels or Restaurants).',
        },
        { status: 400 }
      );
    }

    const destination = getDestinationById(destinationId);
    if (!destination) {
      return NextResponse.json<SearchResponse>(
        {
          success: false,
          leads: [],
          audit: {
            totalScanned: 0,
            excludedWithExistingWebsite: 0,
            excludedNoPhone: 0,
            excludedDistant: 0,
            excludedUncertainOrFoundViaSearch: 0,
            verifiedCount: 0,
          },
          error: `Destination with ID "${destinationId}" was not found.`,
        },
        { status: 404 }
      );
    }

    // Check cache
    const cacheKey = `search:${destination.country}:${destination.id}:${businessType}`;
    if (!forceRefresh && !apiKeyOverride) {
      const cached = getCachedSearch(cacheKey);
      if (cached) {
        return NextResponse.json<SearchResponse>(cached);
      }
    }

    // Perform live search and verification
    const { leads, audit } = await searchAndVerifyLeads(
      destination,
      businessType,
      apiKeyOverride
    );

    const responseData: SearchResponse = {
      success: true,
      leads,
      audit,
      isCached: false,
    };

    // Cache the response if successful
    if (!apiKeyOverride) {
      setCachedSearch(cacheKey, responseData);
    }

    return NextResponse.json<SearchResponse>(responseData);
  } catch (err: unknown) {
    if (err instanceof GooglePlacesError) {
      return NextResponse.json<SearchResponse>(
        {
          success: false,
          leads: [],
          audit: {
            totalScanned: 0,
            excludedWithExistingWebsite: 0,
            excludedNoPhone: 0,
            excludedDistant: 0,
            excludedUncertainOrFoundViaSearch: 0,
            verifiedCount: 0,
          },
          error: err.message,
          errorCode: err.code,
        },
        { status: 400 }
      );
    }

    const message = err instanceof Error ? err.message : 'Unknown server error during search';
    return NextResponse.json<SearchResponse>(
      {
        success: false,
        leads: [],
        audit: {
          totalScanned: 0,
          excludedWithExistingWebsite: 0,
          excludedNoPhone: 0,
          excludedDistant: 0,
          excludedUncertainOrFoundViaSearch: 0,
          verifiedCount: 0,
        },
        error: message,
        errorCode: 'API_ERROR',
      },
      { status: 500 }
    );
  }
}
