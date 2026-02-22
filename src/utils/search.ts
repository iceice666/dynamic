export function stripTrailingHashtagTagLine(body: string): string {
  const withoutTrailingWhitespace = body.replace(/\s+$/g, '');
  const lines = withoutTrailingWhitespace.split(/\r?\n/);

  let lastIndex = lines.length - 1;
  while (lastIndex >= 0 && lines[lastIndex]!.trim() === '') lastIndex--;
  if (lastIndex < 0) return '';

  const lastLine = lines[lastIndex]!.trim();
  if (!/^(#\w+\s*)+$/.test(lastLine)) return lines.join('\n');

  lines.splice(lastIndex, 1);
  while (lines.length > 0 && lines[lines.length - 1]!.trim() === '') lines.pop();
  return lines.join('\n');
}

export function getPostPreviewMarkdown(body: string): string {
  const cleaned = stripTrailingHashtagTagLine(body).trim();
  if (!cleaned) return '';

  const blankLineMatch = cleaned.match(/\r?\n\s*\r?\n/);
  let preview = blankLineMatch?.index != null ? cleaned.slice(0, blankLineMatch.index) : cleaned;

  if (preview.length > 500) preview = `${preview.slice(0, 500).trimEnd()}...`;
  return preview;
}
