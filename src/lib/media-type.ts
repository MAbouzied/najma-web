/** Infer a common image MIME type from a URL path (ignores query strings). */
export function mimeTypeFromUrl(url: string): string | undefined {
  const path = url.split(/[?#]/u)[0]?.toLowerCase() ?? '';
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.webp')) return 'image/webp';
  if (path.endsWith('.gif')) return 'image/gif';
  if (path.endsWith('.avif')) return 'image/avif';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  return undefined;
}
