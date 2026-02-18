/** Strip .md / .mdx extension from a content collection entry ID */
export function entrySlug(id: string): string {
  return id.replace(/\.(mdx?)$/, '');
}

/** Format a Date as `YYYY{sep}MM{sep}DD` */
export function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}/${mm}/${dd}`;
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
const LOCALE_SUFFIX_RE = /\.([a-z]{2}(?:-[a-z]{2,4})?)\.mdx?$/i;

export function parseArticleId(id: string): { slug: string; lang: string | null } {
  const match = id.match(LOCALE_SUFFIX_RE);
  if (match) {
    const lang = match[1].toLowerCase();
    const slug = id.slice(0, id.length - match[0].length);
    return { slug, lang };
  }
  return { slug: entrySlug(id), lang: null };
}
