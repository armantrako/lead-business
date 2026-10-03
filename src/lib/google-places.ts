import { BusinessType, Destination, SearchAudit, VerifiedLead } from '@/types';
import { verifyNoOfficialWebsite } from './verifier';

interface RawPlaceSummary {
  place_id: string;
  name: string;
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
  business_status?: string;
  rating?: number;
  user_ratings_total?: number;
  vicinity?: string;
}

interface PlaceDetailsResult {
  place_id: string;
  name: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  url?: string;
  formatted_address?: string;
  business_status?: string;
  geometry?: {
    location?: {
      lat: number;
      lng: number;
    };
  };
}

export class GooglePlacesError extends Error {
  code: 'MISSING_API_KEY' | 'QUOTA_EXCEEDED' | 'INVALID_KEY' | 'API_ERROR';
  constructor(message: string, code: 'MISSING_API_KEY' | 'QUOTA_EXCEEDED' | 'INVALID_KEY' | 'API_ERROR') {
    super(message);
    this.code = code;
  }
}

/**
 * Calculates Haversine distance in meters between two lat/lng points.
 */
function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Normalizes phone numbers to standard international or digits-only for deduplication.
 */
function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Searches for real businesses using Google Places API and performs strict website verification.
 */
export async function searchAndVerifyLeads(
  destination: Destination,
  businessType: BusinessType,
  apiKeyOverride?: string
): Promise<{ leads: VerifiedLead[]; audit: SearchAudit }> {
  const apiKey =
    apiKeyOverride ||
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    throw new GooglePlacesError(
      'Google Places API key is not configured. Please add GOOGLE_PLACES_API_KEY to your .env.local file.',
      'MISSING_API_KEY'
    );
  }

  const audit: SearchAudit = {
    totalScanned: 0,
    excludedWithExistingWebsite: 0,
    excludedNoPhone: 0,
    excludedDistant: 0,
    excludedUncertainOrFoundViaSearch: 0,
    verifiedCount: 0,
  };

  // Google Places Place Type
  const googleType = businessType === 'hotels' ? 'lodging' : 'restaurant';
  const keyword = businessType === 'hotels' ? 'hotel OR resort OR pansion' : 'restaurant OR gostionica OR konoba';

  // 1. Fetch nearby places restricted to destination coordinates and radius
  const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${destination.lat},${destination.lng}&radius=${destination.radiusMeters}&type=${googleType}&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`;

  const nearbyResponse = await fetch(nearbyUrl);
  if (!nearbyResponse.ok) {
    throw new GooglePlacesError(
      `Google Places API request failed with status ${nearbyResponse.status}`,
      'API_ERROR'
    );
  }

  const nearbyData = await nearbyResponse.json();

  if (nearbyData.status === 'OVER_QUERY_LIMIT' || nearbyData.status === 'RESOURCE_EXHAUSTED') {
    throw new GooglePlacesError(
      'Google Places API quota exceeded or query limit reached. Please check your Google Cloud quota and billing.',
      'QUOTA_EXCEEDED'
    );
  }

  if (nearbyData.status === 'REQUEST_DENIED') {
    throw new GooglePlacesError(
      `Google Places request denied: ${nearbyData.error_message || 'Please check your API key and permissions.'}`,
      'INVALID_KEY'
    );
  }

  const rawResults: RawPlaceSummary[] = nearbyData.results || [];
  audit.totalScanned = rawResults.length;

  if (rawResults.length === 0) {
    return { leads: [], audit };
  }

  // Deduplication maps
  const seenPlaceIds = new Set<string>();
  const seenPhones = new Set<string>();
  const candidateLeads: VerifiedLead[] = [];

  // Limit processing batch to control latency while finding up to 30 leads
  const placesToInspect = rawResults.slice(0, 40);

  for (const item of placesToInspect) {
    if (!item.place_id || seenPlaceIds.has(item.place_id)) {
      continue;
    }
    seenPlaceIds.add(item.place_id);

    // Business Status check: Skip closed permanently/temporarily
    if (item.business_status && item.business_status !== 'OPERATIONAL') {
      continue;
    }

    // Geographic verification: Ensure result is actually within destination area
    if (item.geometry?.location) {
      const distance = calculateDistanceMeters(
        destination.lat,
        destination.lng,
        item.geometry.location.lat,
        item.geometry.location.lng
      );
      // Strict rule: Discard businesses outside of 1.6x destination radius
      if (distance > destination.radiusMeters * 1.6) {
        audit.excludedDistant++;
        continue;
      }
    }

    // 2. Fetch Place Details for exact phone, website, and maps link
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=name,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,url,formatted_address,business_status,geometry&key=${apiKey}`;

    let details: PlaceDetailsResult | null = null;
    try {
      const detailRes = await fetch(detailsUrl);
      const detailData = await detailRes.json();
      if (detailData.status === 'OK' && detailData.result) {
        details = detailData.result;
      }
    } catch {
      continue;
    }

    if (!details) continue;

    // Check phone number: "If there is no valid phone number -> exclude the business."
    const phone =
      details.international_phone_number || details.formatted_phone_number;
    if (!phone || phone.trim().length < 6) {
      audit.excludedNoPhone++;
      continue;
    }

    // Deduplicate by normalized phone number
    const normalizedPhone = normalizePhone(phone);
    if (seenPhones.has(normalizedPhone)) {
      continue;
    }
    seenPhones.add(normalizedPhone);

    // Check Google Places website: "If a website exists -> EXCLUDE."
    if (details.website && details.website.trim().length > 0) {
      audit.excludedWithExistingWebsite++;
      continue;
    }

    // Step 3: Perform rigorous secondary search verification
    const verification = await verifyNoOfficialWebsite(
      details.name,
      destination.name,
      destination.country,
      details.website
    );

    if (!verification.isVerifiedNoWebsite || verification.confidence !== 'HIGH') {
      audit.excludedUncertainOrFoundViaSearch++;
      continue;
    }

    // Valid verified lead found!
    const verifiedLead: VerifiedLead = {
      placeId: details.place_id || item.place_id,
      name: details.name,
      phoneNumber: phone,
      destination: destination.name,
      destinationId: destination.id,
      country: destination.country,
      rating: details.rating ?? item.rating ?? 0,
      userRatingsTotal: details.user_ratings_total ?? item.user_ratings_total ?? 0,
      googleMapsUrl:
        details.url ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.name)}&query_place_id=${item.place_id}`,
      address: details.formatted_address || item.vicinity || destination.name,
      verificationStatus: 'VERIFIED NO OFFICIAL WEBSITE',
      verificationTimestamp: new Date().toISOString(),
    };

    candidateLeads.push(verifiedLead);
    audit.verifiedCount++;

    if (candidateLeads.length >= 30) {
      break;
    }
  }

  // Ranking:
  // 1. Google rating (descending)
  // 2. Number of reviews (descending)
  candidateLeads.sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return b.userRatingsTotal - a.userRatingsTotal;
  });

  return {
    leads: candidateLeads.slice(0, 30),
    audit,
  };
}
