import { NextRequest, NextResponse } from 'next/server';
import { queryQualifiedInstagramLeads, INSTAGRAM_BUSINESSES } from '@/data/instagramBusinesses';
import { BusinessCategory, ClientVisibleLead, SearchResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category = 'all',
      country = 'all',
      city = 'all',
      excludedIds = [],
      limit = 10,
    } = body as {
      category?: BusinessCategory;
      country?: string;
      city?: string;
      excludedIds?: string[];
      limit?: number;
    };

    // Query qualified leads based on strict criteria:
    // 1. Stvarni poslovni subjekt (isBusiness: true)
    // 2. Više od 5.000 pratitelja (followersCount > 5000)
    // 3. Aktivan profil sa objavom u posljednja 24 sata (hoursAgoLastPost <= 24)
    // 4. Odgovarajuća kategorija
    // 5. Direktan Instagram link
    // 6. Bez ponavljanja (deduplikacija preko excludedIds)
    const result = queryQualifiedInstagramLeads({
      category,
      country,
      city,
      excludedIds,
      limit,
    });

    // Strip internally verified details: User visible payload must contain ONLY name and direct Instagram link
    const clientVisibleLeads: ClientVisibleLead[] = result.leads.map((item) => ({
      id: item.id,
      name: item.name,
      instagramUrl: item.instagramUrl,
    }));

    // Generate accurate localized timestamp
    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('bs-BA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(now);

    let message: string | undefined = undefined;
    if (clientVisibleLeads.length < limit) {
      if (clientVisibleLeads.length === 0) {
        message =
          'Nema novih neprikazanih profila koji ispunjavaju sve tražene uslove (>5.000 pratitelja, objava u posljednja 24 sata) za odabrane filtere. Kriteriji se ne spuštaju automatski.';
      } else {
        message = `Pronađeno je ${clientVisibleLeads.length} profila koji u potpunosti ispunjavaju sve uslove (>5.000 pratitelja, objava u posljednja 24 sata). Preostali profili su već prikazani ili nisu imali objavu unutar 24h. Kriteriji se ne spuštaju automatski.`;
      }
    }

    const responseData: SearchResponse = {
      success: true,
      leads: clientVisibleLeads,
      totalQualified: clientVisibleLeads.length,
      totalActiveObjectsInSystem: INSTAGRAM_BUSINESSES.length,
      searchTimestamp: formattedDate,
      message,
      audit: {
        totalObjectsInSystem: INSTAGRAM_BUSINESSES.length,
        totalScanned: result.totalObjectsScanned,
        matchedCategory: result.auditStats.matchedCategory,
        matchedLocation: result.auditStats.matchedLocation,
        qualifiedMinFollowers: result.auditStats.qualifiedMinFollowers,
        qualifiedActive24h: result.auditStats.qualifiedActive24h,
        excludedDuplicates: result.auditStats.excludedDuplicates,
        returnedCount: clientVisibleLeads.length,
        excludedWithExistingWebsite: 0,
        excludedNoPhone: 0,
        excludedDistant: 0,
        excludedUncertainOrFoundViaSearch: 0,
        verifiedCount: clientVisibleLeads.length,
      },
    };

    return NextResponse.json<SearchResponse>(responseData);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : 'Došlo je do greške prilikom pretrage.';
    return NextResponse.json<SearchResponse>(
      {
        success: false,
        leads: [],
        totalQualified: 0,
        totalActiveObjectsInSystem: INSTAGRAM_BUSINESSES.length,
        searchTimestamp: new Date().toISOString(),
        error: errorMessage,
        audit: {
          totalObjectsInSystem: INSTAGRAM_BUSINESSES.length,
          totalScanned: 0,
          matchedCategory: 0,
          matchedLocation: 0,
          qualifiedMinFollowers: 0,
          qualifiedActive24h: 0,
          excludedDuplicates: 0,
          returnedCount: 0,
          excludedWithExistingWebsite: 0,
          excludedNoPhone: 0,
          excludedDistant: 0,
          excludedUncertainOrFoundViaSearch: 0,
          verifiedCount: 0,
        },
      },
      { status: 500 }
    );
  }
}
