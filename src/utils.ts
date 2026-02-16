/** Strip .md / .mdx extension from a content collection entry ID */
export function entrySlug(id: string): string {
  return id.replace(/\.(mdx?)$/, '');
}
