/** Turn a post title into a URL-safe slug, preserving non-Latin letters (e.g. CJK). */
export function slugify(input: string): string {
  const slug = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
  return slug || 'untitled';
}
