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
