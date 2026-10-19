export type BusinessCategory =
  | 'all'
  | 'hair_barber'
  | 'beauty_nails'
  | 'car_dealership'
  | 'auto_detailing'
  | 'fast_food'
  | 'restaurants_cafes'
  | 'gym_fitness'
  | 'boutique_fashion'
  | 'flowers_gifts'
  | 'other_local';

export interface CategoryOption {
  id: BusinessCategory;
  name: string;
  icon: string;
}

export const CATEGORY_OPTIONS: CategoryOption[] = [
  { id: 'all', name: 'Sve kategorije', icon: '🌐' },
  { id: 'hair_barber', name: 'Frizerski saloni i barbershops', icon: '✂️' },
  { id: 'beauty_nails', name: 'Beauty saloni, kozmetički saloni, nokti i trepavice', icon: '💅' },
  { id: 'car_dealership', name: 'Autosaloni i prodaja polovnih automobila', icon: '🚗' },
  { id: 'auto_detailing', name: 'Auto detailing, autopraonice i auto-centri', icon: '🧼' },
  { id: 'fast_food', name: 'Fast food restorani, burgeri, pizzerije i roštiljnice', icon: '🍔' },
  { id: 'restaurants_cafes', name: 'Restorani, kafići i slastičarne', icon: '☕' },
  { id: 'gym_fitness', name: 'Teretane, fitness centri i personalni treneri', icon: '🏋️' },
  { id: 'boutique_fashion', name: 'Butici, prodavnice odjeće i obuće', icon: '👗' },
  { id: 'flowers_gifts', name: 'Cvjećare i poklon-prodavnice', icon: '💐' },
  { id: 'other_local', name: 'Drugi slični lokalni biznisi za reklamne vizuale', icon: '🏢' },
];

export interface InstagramBusiness {
  id: string;
  name: string;
  instagramUrl: string;
  username: string;
  followersCount: number;
  category: BusinessCategory;
  country: string;
  city: string;
  isBusiness: boolean;
  hoursAgoLastPost: number;
  isActive: boolean;
  notes?: string;
}

export interface ClientVisibleLead {
  id: string;
  name: string;
  instagramUrl: string;
}

export interface SearchAudit {
  totalObjectsInSystem?: number;
  totalScanned: number;
  matchedCategory?: number;
  matchedLocation?: number;
  qualifiedMinFollowers?: number;
  qualifiedActive24h?: number;
  excludedDuplicates?: number;
  returnedCount?: number;
  // Legacy fields for backward compatibility
  excludedWithExistingWebsite: number;
  excludedNoPhone: number;
  excludedDistant: number;
  excludedUncertainOrFoundViaSearch: number;
  verifiedCount: number;
}

export interface SearchResponse {
  success: boolean;
  leads: ClientVisibleLead[] | VerifiedLead[];
  audit: SearchAudit;
  totalQualified?: number;
  totalActiveObjectsInSystem?: number;
  searchTimestamp?: string;
  isCached?: boolean;
  message?: string;
  error?: string;
  errorCode?: 'MISSING_API_KEY' | 'QUOTA_EXCEEDED' | 'INVALID_KEY' | 'NO_RESULTS' | 'API_ERROR';
}

// ==========================================
// LEGACY COMPATIBILITY TYPES
// ==========================================
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
