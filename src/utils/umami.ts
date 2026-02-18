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
