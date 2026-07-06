/** Strip .md / .mdx extension from a content collection entry ID */
export function entrySlug(id: string): string {
  return id.replace(/\.(mdx?)$/, '');
}

/** Format a category slug as a human-readable display name (e.g. `web-performance` → `Web Performance`) */
export function formatCategory(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/** Format a Date as `YYYY{sep}MM{sep}DD` */
export function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd}`;
}

/**
 * Format a Date relative to now ("5 minutes ago", "3 天前").
 * Falls back to the absolute `formatDate` beyond 7 days or for future dates.
 * `localeTag` is a BCP 47 tag (use `t(locale, 'date_format')`).
 */
export function formatRelativeDate(date: Date, localeTag: string): string {
  const diffSec = Math.round((Date.now() - date.getTime()) / 1000);
  if (diffSec < 0) return formatDate(date);
  if (diffSec < 45) {
    return new Intl.RelativeTimeFormat(localeTag, { numeric: 'auto' }).format(0, 'second');
  }
  const rtf = new Intl.RelativeTimeFormat(localeTag, { numeric: 'always' });
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return rtf.format(-diffHr, 'hour');
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return rtf.format(-diffDay, 'day');
  return formatDate(date);
}

/**
 * Parse a content collection entry ID into its base slug and optional lang suffix.
 *
 * Convention:
 *   `my-article.md`       → { slug: 'my-article', lang: null }   (lang from frontmatter)
 *   `my-article.zh-tw.md` → { slug: 'my-article', lang: 'zh-tw' } (lang from filename)
 *
 * The `lang` field in frontmatter is ignored for translated files (those with a lang suffix).
 */
// IDs no longer carry the .md extension (generateId strips it), so match at end-of-string.
const LOCALE_SUFFIX_RE = /\.([a-z]{2}(?:-[a-z]{2,4})?)$/i;

export function parseArticleId(id: string): { slug: string; lang: string | null } {
  const match = id.match(LOCALE_SUFFIX_RE);
  if (match) {
    const lang = match[1].toLowerCase();
    const slug = id.slice(0, id.length - match[0].length);
    return { slug, lang };
  }
  return { slug: entrySlug(id), lang: null };
}
