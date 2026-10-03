import { BusinessType, Destination, SearchAudit, VerifiedLead } from '@/types';
import { verifyNoOfficialWebsite } from './verifier';

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

interface NewPlaceItem {
  id: string;
  displayName?: { text: string; languageCode?: string };
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  rating?: number;
  userRatingCount?: number;
  websiteUri?: string;
  googleMapsUri?: string;
  location?: { latitude: number; longitude: number };
  businessStatus?: string;
}

/**
 * Searches places using Google Places API (New) v1.
 */
async function searchPlacesNew(
  destination: Destination,
  businessType: BusinessType,
  apiKey: string
): Promise<NewPlaceItem[]> {
  const typeQuery = businessType === 'hotels' ? 'hotels in' : 'restaurants in';
  const query = `${typeQuery} ${destination.name}, ${destination.country}`;

  const url = 'https://places.googleapis.com/v1/places:searchText';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.rating,places.userRatingCount,places.websiteUri,places.googleMapsUri,places.location,places.businessStatus',
    },
    body: JSON.stringify({
      textQuery: query,
      maxResultCount: 20,
      locationBias: {
        circle: {
          center: { latitude: destination.lat, longitude: destination.lng },
          radius: destination.radiusMeters,
        },
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `HTTP ${response.status}`;
    if (response.status === 403) {
      throw new GooglePlacesError(
        `Google Places API request denied: ${message}. Check your API key.`,
        'INVALID_KEY'
      );
    }
    if (response.status === 429) {
      throw new GooglePlacesError(
        'Google Places API quota exceeded or rate limit reached.',
        'QUOTA_EXCEEDED'
      );
    }
    throw new GooglePlacesError(`Google Places API error: ${message}`, 'API_ERROR');
  }

  const data = await response.json();
  const places: NewPlaceItem[] = data.places || [];

  // Also query searchNearby for higher density if available
  try {
    const nearbyUrl = 'https://places.googleapis.com/v1/places:searchNearby';
    const nearbyType = businessType === 'hotels' ? ['lodging'] : ['restaurant'];
    const nearbyRes = await fetch(nearbyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.rating,places.userRatingCount,places.websiteUri,places.googleMapsUri,places.location,places.businessStatus',
      },
      body: JSON.stringify({
        includedTypes: nearbyType,
        maxResultCount: 20,
        locationRestriction: {
          circle: {
            center: { latitude: destination.lat, longitude: destination.lng },
            radius: destination.radiusMeters,
          },
        },
      }),
    });

    if (nearbyRes.ok) {
      const nearbyData = await nearbyRes.json();
      const nearbyPlaces: NewPlaceItem[] = nearbyData.places || [];
      const existingIds = new Set(places.map((p) => p.id));
      for (const p of nearbyPlaces) {
        if (!existingIds.has(p.id)) {
          places.push(p);
          existingIds.add(p.id);
        }
      }
    }
  } catch {
    // Proceed with searchText results
  }

  return places;
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
      'Google Places API key is not configured. Please set GOOGLE_PLACES_API_KEY.',
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

  const rawPlaces = await searchPlacesNew(destination, businessType, apiKey);
  audit.totalScanned = rawPlaces.length;

  if (rawPlaces.length === 0) {
    return { leads: [], audit };
  }

  const seenPlaceIds = new Set<string>();
  const seenPhones = new Set<string>();
  const candidateLeads: VerifiedLead[] = [];

  for (const place of rawPlaces) {
    if (!place.id || seenPlaceIds.has(place.id)) {
      continue;
    }
    seenPlaceIds.add(place.id);

    // Business Status check: Skip closed permanently or temporarily
    if (place.businessStatus && place.businessStatus !== 'OPERATIONAL') {
      continue;
    }

    // Geographic verification: Ensure result is actually within destination area
    if (place.location) {
      const distance = calculateDistanceMeters(
        destination.lat,
        destination.lng,
        place.location.latitude,
        place.location.longitude
      );
      // Discard businesses outside of 1.6x destination radius
      if (distance > destination.radiusMeters * 1.6) {
        audit.excludedDistant++;
        continue;
      }
    }

    // Phone validation: "If there is no valid phone number -> exclude the business."
    const phone = place.internationalPhoneNumber || place.nationalPhoneNumber;
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

    // Website check: "If a website exists -> EXCLUDE."
    if (place.websiteUri && place.websiteUri.trim().length > 0) {
      audit.excludedWithExistingWebsite++;
      continue;
    }

    const businessName = place.displayName?.text || 'Business';

    // Polite pacing delay (250ms) to ensure external search providers don't throttle or reset connections
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Step 3: Perform rigorous secondary search verification
    const verification = await verifyNoOfficialWebsite(
      businessName,
      destination.name,
      destination.country,
      place.websiteUri
    );

    if (!verification.isVerifiedNoWebsite || verification.confidence !== 'HIGH') {
      audit.excludedUncertainOrFoundViaSearch++;
      continue;
    }

    // Valid verified lead found!
    const verifiedLead: VerifiedLead = {
      placeId: place.id,
      name: businessName,
      phoneNumber: phone,
      destination: destination.name,
      destinationId: destination.id,
      country: destination.country,
      rating: place.rating ?? 0,
      userRatingsTotal: place.userRatingCount ?? 0,
      googleMapsUrl:
        place.googleMapsUri ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessName)}&query_place_id=${place.id}`,
      address: place.formattedAddress || destination.name,
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
