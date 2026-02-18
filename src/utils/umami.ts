export interface UmamiStats {
  pageviews: number;
  visitors: number;
}

/** Format a raw count to a human-readable string (e.g. 1200 → "1.2K") */
export function formatCount(n: number, locale: string = 'en'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(n);
}

/**
 * Fetch stats from the /api/wuw proxy.
 * @param path  optional URL path to filter by; omit for site-wide stats
 * @returns     stats, or null if the request failed / Umami is not configured
 */
export async function fetchUmamiStats(path?: string): Promise<UmamiStats | null> {
  try {
    const apiPath = path ? `/api/wuw?path=${encodeURIComponent(path)}` : '/api/wuw';
    const res = await fetch(apiPath);
    if (!res.ok) throw new Error('non-ok');
    const data: UmamiStats = await res.json();
    return data;
  } catch {
    return null;
  }
}
