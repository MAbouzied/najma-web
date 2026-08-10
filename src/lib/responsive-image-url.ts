const DEFAULT_WIDTHS = [480, 768, 1200, 1600] as const;

/** Build a srcset for Sanity CDN (or other w= query) image URLs. */
export function buildWidthSrcset(
  src: string,
  widths: readonly number[] = DEFAULT_WIDTHS,
  maxWidth?: number,
): string | undefined {
  if (!src.trim()) return undefined;

  let base: URL;
  try {
    base = new URL(src, 'https://nagmspa.com');
  } catch {
    return undefined;
  }

  // Local UI rasters use Astro Image/Picture. Only Sanity CDN URLs need runtime srcset.
  if (!base.hostname.endsWith('cdn.sanity.io')) return undefined;

  const capped = typeof maxWidth === 'number' && maxWidth > 0
    ? widths.filter((width) => width <= maxWidth)
    : [...widths];
  if (capped.length === 0) return undefined;

  return capped
    .map((width) => {
      const url = new URL(base.href);
      url.searchParams.set('w', String(width));
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'max');
      return `${url.href} ${width}w`;
    })
    .join(', ');
}
