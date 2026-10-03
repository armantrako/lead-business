import { SearchResponse } from '@/types';

interface CacheEntry {
  timestamp: number;
  data: SearchResponse;
}

const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const memoryCache = new Map<string, CacheEntry>();

export function getCachedSearch(key: string): SearchResponse | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
  if (isExpired) {
    memoryCache.delete(key);
    return null;
  }
  return { ...entry.data, isCached: true };
}

export function setCachedSearch(key: string, data: SearchResponse): void {
  // Only cache successful searches
  if (data.success) {
    memoryCache.set(key, {
      timestamp: Date.now(),
      data,
    });
  }
}

export function clearCache(): void {
  memoryCache.clear();
}
