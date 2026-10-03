export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  type: string;
  description: string;
  lat: number;
  lng: number;
  radiusMeters: number;
}

export interface Country {
  code: string;
  name: string;
  destinationsCount?: number;
}

export type BusinessType = 'hotels' | 'restaurants';

export interface VerifiedLead {
  placeId: string;
  name: string;
  phoneNumber: string;
  destination: string;
  destinationId: string;
  country: string;
  rating: number;
  userRatingsTotal: number;
  googleMapsUrl: string;
  address: string;
  verificationStatus: 'VERIFIED NO OFFICIAL WEBSITE';
  verificationTimestamp: string;
}

export interface SearchAudit {
  totalScanned: number;
  excludedWithExistingWebsite: number;
  excludedNoPhone: number;
  excludedDistant: number;
  excludedUncertainOrFoundViaSearch: number;
  verifiedCount: number;
}

export interface SearchResponse {
  success: boolean;
  leads: VerifiedLead[];
  audit: SearchAudit;
  isCached?: boolean;
  error?: string;
  errorCode?: 'MISSING_API_KEY' | 'QUOTA_EXCEEDED' | 'INVALID_KEY' | 'NO_RESULTS' | 'API_ERROR';
}
