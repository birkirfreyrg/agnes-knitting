/**
 * Cache utility for Strapi data with stale-while-revalidate pattern
 * Serves cached data immediately, then fetches fresh data in the background
 */

interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

const CACHE_PREFIX = 'strapi_cache_';

/**
 * Get cached data if it exists and is still valid
 */
export function getCachedData<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cached) return null;

    const parsed: CachedData<T> = JSON.parse(cached);
    const now = Date.now();
    const age = now - parsed.timestamp;

    // Check if cache is still valid
    if (age < parsed.ttl) {
      return parsed.data;
    }

    // Cache expired, remove it
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    return null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

/**
 * Store data in cache with TTL
 */
export function setCachedData<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
  try {
    const cacheEntry: CachedData<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheEntry));
  } catch (error) {
    console.error('Error writing cache:', error);
    // If localStorage is full, try to clear old entries
    try {
      clearExpiredCache();
      localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        ttl,
      }));
    } catch (retryError) {
      console.error('Failed to write cache after cleanup:', retryError);
    }
  }
}

/**
 * Clear expired cache entries
 */
function clearExpiredCache(): void {
  const now = Date.now();
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const parsed: CachedData<unknown> = JSON.parse(cached);
          const age = now - parsed.timestamp;
          if (age >= parsed.ttl) {
            keysToRemove.push(key);
          }
        }
      } catch {
        // Invalid entry, mark for removal
        keysToRemove.push(key);
      }
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
}

// Track ongoing fetches to avoid duplicate requests
const ongoingFetches = new Map<string, Promise<any>>();

/**
 * Fetch with cache-first strategy (stale-while-revalidate)
 * Returns cached data immediately if available, then fetches fresh data
 * 
 * @param url - API URL to fetch from
 * @param cacheKey - Key to use for caching
 * @param normalizer - Function to normalize the response data
 * @param ttl - Cache TTL in milliseconds (default: 5 minutes)
 * @returns Object with cached data (if available) and a promise for fresh data
 */
export async function fetchWithCache<T, R>(
  url: string,
  cacheKey: string,
  normalizer: (data: T) => R,
  ttl: number = 30  * 60 * 1000 // 30 minutes default
): Promise<{ cached: R | null; fresh: () => Promise<R> }> {
  // Get cached data immediately
  const cached = getCachedData<R>(cacheKey);

  // Check if there's already an ongoing fetch for this key
  let freshPromise = ongoingFetches.get(cacheKey) as Promise<R> | undefined;

  // If no ongoing fetch, create one
  if (!freshPromise) {
    freshPromise = (async (): Promise<R> => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status} ${response.statusText}`);
        }

        const json: T = await response.json();
        const normalized = normalizer(json);

        // Update cache with fresh data
        setCachedData(cacheKey, normalized, ttl);

        // Remove from ongoing fetches
        ongoingFetches.delete(cacheKey);

        return normalized;
      } catch (error) {
        // Remove from ongoing fetches on error
        ongoingFetches.delete(cacheKey);
        
        console.error(`Error fetching ${cacheKey}:`, error);
        // If we have cached data and fetch fails, return cached data as fallback
        if (cached) {
          console.warn(`Using cached data for ${cacheKey} due to fetch error`);
          return cached;
        }
        throw error;
      }
    })();

    // Store the promise so we can reuse it if called multiple times
    ongoingFetches.set(cacheKey, freshPromise);
  }

  // If we have cached data, start fetching fresh in background (but don't await)
  if (cached) {
    // Don't await - let it run in background
    freshPromise.catch(err => {
      console.error('Background fetch failed:', err);
    });
  }

  return {
    cached,
    fresh: () => freshPromise!, // Return the same promise if already fetching
  };
}

/**
 * Clear all Strapi cache entries
 */
export function clearAllCache(): void {
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(CACHE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
}

