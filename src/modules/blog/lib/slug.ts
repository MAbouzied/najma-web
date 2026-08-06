const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidBlogSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length >= 3 && slug.length <= 96;
}

export function assertValidBlogSlug(slug: string): void {
  if (!isValidBlogSlug(slug)) {
    throw new Error(
      `Invalid blog slug "${slug}". Use lowercase kebab-case (3–96 characters).`,
    );
  }
}

/** Deterministic heading id from Arabic/English text. */
export function headingIdFromText(text: string, used = new Set<string>()): string {
  const base =
    text
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section';

  let candidate = base;
  let index = 2;
  while (used.has(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
}
