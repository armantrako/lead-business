/**
 * Website Verification Engine
 * 
 * Strict multi-step verification to determine whether a business has an official website.
 * Rule: A business is a valid lead ONLY if verified to NOT have an official website.
 * 
 * Exclusions:
 * - If Google Places has a website field -> EXCLUDE
 * - If secondary web search discovers an official website -> EXCLUDE
 * - If verification is uncertain -> EXCLUDE
 * - OTAs, social networks, directories, and portals DO NOT count as an official website.
 */

// List of domains that are OTAs, social networks, directories, portals, or aggregators.
// Presence on these platforms does NOT count as having an official website.
const DIRECTORY_AND_OTA_DOMAINS = [
  // OTAs & Booking engines
  'booking.com',
  'tripadvisor.com',
  'tripadvisor.',
  'airbnb.com',
  'airbnb.',
  'expedia.com',
  'expedia.',
  'hotels.com',
  'agoda.com',
  'trivago.',
  'kayak.',
  'skyscanner.',
  'hostelworld.com',
  'hrs.de',
  'hrs.com',
  'holidaycheck.',
  'bergfex.',
  'outdooractive.',
  'komoot.',
  'viamichelin.',
  'e-domizil.',
  'casamundo.',
  'interhome.',
  'fewo-direkt.de',
  'ab-in-den-urlaub.de',
  'vrbo.com',
  'trip.com',
  'priceline.com',
  'travelocity.com',
  'orbitz.com',
  'bedandbreakfast.com',
  'ferienwohnungen.de',
  'alpenverein.at',
  'alpenverein.de',
  'sac-cas.ch',

  // Restaurant portals & Food aggregators
  'restaurantguru.com',
  'opentable.',
  'thefork.',
  'resy.com',
  'quandoo.',
  'tableonline.',
  'menue.at',
  'speisekarte.de',
  'falstaff.com',
  'falstaff.',
  'gaultmillau.',
  'michelin.com',
  'lieferando.de',
  'wolt.com',
  'glovoapp.com',
  'korpa.ba',
  'donesi.com',
  'just-eat.',
  'ubereats.com',

  // Social Networks & Content platforms
  'facebook.com',
  'fb.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'tiktok.com',
  'youtube.com',
  'linkedin.com',
  'pinterest.com',
  'threads.net',
  'vk.com',

  // Maps & Search Engines
  'google.com',
  'google.',
  'maps.google.',
  'bing.com',
  'apple.com',
  'yahoo.com',
  'duckduckgo.com',
  'mapquest.com',
  'openstreetmap.org',
  'waze.com',

  // Business Directories & Yellow pages
  'yelp.com',
  'foursquare.com',
  'yellowpages.',
  'zlatnestranice.',
  'moj-restoran.',
  'moja-delatnost.',
  'privredni-imenik.',
  'navidiku.rs',
  'wanderlog.com',
  'gelbeseiten.de',
  'dasoertliche.de',
  'telefonbuch.de',
  'pagesjaunes.fr',
  'paginegialle.it',
  'herold.at',
  'firmenabc.at',
  'search.ch',
  'local.ch',
  'tel.search.ch',
  'kompass.com',
  'cylex.',
  'infobel.com',
  '11880.com',
  'hotfrog.',
  'tuugo.',
  'misterwhat.',
  'cityseeker.com',
  'cybo.com',
  'firmendb.de',
  'staedte-info.net',
  'webwiki.',
  'findex.ba',
  'akta.ba',
  'companywall.',
  'bizi.si',
  'fininfo.hr',

  // Generic Hotel Domain Aggregators
  'ba-hotel.com',
  'hotel-in-',
  'alps-hotels.com',
  'bosnia-herzegovina.info',
  'serbia-hotels.com',
  'croatia-hotel.org',
  'montenegro-hotels.org',
  'slovenia-hotels.org',
  'austria-hotels.org',
  'swiss-hotels.org',
  'hotelivodic.com',
];

/**
 * Checks whether a given URL hostname belongs to an OTA, directory, or social media platform.
 */
function isDirectoryOrOta(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  for (const domain of DIRECTORY_AND_OTA_DOMAINS) {
    if (domain.endsWith('.')) {
      if (lower.includes(domain)) return true;
    } else {
      if (lower === domain || lower.endsWith('.' + domain) || lower.includes(domain)) {
        return true;
      }
    }
  }

  // Also check if domain has known destination portal patterns
  if (lower.startsWith('visit') || lower.startsWith('tourismus') || lower.startsWith('tourisme')) {
    return true;
  }

  return false;
}

/**
 * Normalizes text for comparison (removes diacritics, lowercase, removes non-alphanumeric).
 */
function normalizeName(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export interface VerificationResult {
  isVerifiedNoWebsite: boolean;
  reason: string;
  officialWebsiteFound?: string;
  confidence: 'HIGH' | 'UNCERTAIN';
}

/**
 * Performs secondary search verification for candidate businesses that lack a website on Google Places.
 */
export async function verifyNoOfficialWebsite(
  businessName: string,
  destinationName: string,
  countryName: string,
  existingWebsiteFromGoogle?: string | null
): Promise<VerificationResult> {
  // Step 1: Check Google Places website field
  if (existingWebsiteFromGoogle && existingWebsiteFromGoogle.trim().length > 0) {
    return {
      isVerifiedNoWebsite: false,
      reason: `Google Places record contains an official website: ${existingWebsiteFromGoogle}`,
      officialWebsiteFound: existingWebsiteFromGoogle,
      confidence: 'HIGH',
    };
  }

  // Step 2: Perform additional search verification
  // Search query: "${businessName}" "${destinationName}"
  const query = `"${businessName}" ${destinationName} ${countryName}`;
  const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(searchUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept':
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.7',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // If search service is temporarily throttled or erroring, do NOT guess.
      // Strict rule: "If verification is uncertain -> EXCLUDE."
      return {
        isVerifiedNoWebsite: false,
        reason: `Search verification unavailable (HTTP ${response.status}). Excluded for accuracy.`,
        confidence: 'UNCERTAIN',
      };
    }

    const html = await response.text();

    // Extract links from DuckDuckGo HTML results (uddg parameter contains actual target URLs)
    const matches = [...html.matchAll(/uddg=([^&"'>\s]+)/g)];
    const urls = [...new Set(matches.map((m) => decodeURIComponent(m[1])))];

    const normalizedBusiness = normalizeName(businessName);

    // Analyze found URLs
    for (const urlStr of urls.slice(0, 10)) {
      try {
        const parsedUrl = new URL(urlStr);
        const hostname = parsedUrl.hostname.toLowerCase().replace(/^www\./, '');

        // Check if this domain is an OTA, directory, or social network
        if (isDirectoryOrOta(hostname)) {
          // This is a directory/OTA/social link. Does NOT count as official website.
          continue;
        }

        // An independent non-directory domain was found in top search results.
        // Check if this is the business's own website
        const normalizedHost = normalizeName(hostname);
        
        // If domain name or path directly matches key words of the business name
        // e.g. "hotel-lavina.com" matching "Hotel Lavina"
        const businessWords = businessName
          .toLowerCase()
          .split(/[\s\-_]+/)
          .filter((w) => w.length > 3);

        const matchesBusinessWords = businessWords.some(
          (w) => normalizedHost.includes(normalizeName(w))
        );

        if (matchesBusinessWords || normalizedHost.includes(normalizedBusiness)) {
          // Official website discovered!
          return {
            isVerifiedNoWebsite: false,
            reason: `Discovered official website: ${parsedUrl.origin}`,
            officialWebsiteFound: parsedUrl.origin,
            confidence: 'HIGH',
          };
        }

        // If top result is an independent custom domain on top of search for the business name,
        // it is very likely its official domain.
        if (!isDirectoryOrOta(hostname)) {
          return {
            isVerifiedNoWebsite: false,
            reason: `Discovered potential official domain: ${parsedUrl.origin}`,
            officialWebsiteFound: parsedUrl.origin,
            confidence: 'HIGH',
          };
        }
      } catch {
        // Invalid URL format, skip
        continue;
      }
    }

    // If search executed cleanly and ONLY OTAs/directories/social networks were found,
    // or no independent official websites exist:
    return {
      isVerifiedNoWebsite: true,
      reason: 'Verified: No official website discovered via Google Places or web search. Only directory/OTA/social presence found.',
      confidence: 'HIGH',
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // Strict requirement: "If verification is uncertain -> EXCLUDE."
    return {
      isVerifiedNoWebsite: false,
      reason: `Verification check could not be completed safely (${errorMsg}). Business excluded.`,
      confidence: 'UNCERTAIN',
    };
  }
}
