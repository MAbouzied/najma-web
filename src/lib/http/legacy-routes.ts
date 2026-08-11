export type LegacyRouteResult =
  | { kind: 'redirect'; destination: string }
  | { kind: 'gone' }
  | null;

/**
 * Safely decode a URI pathname. Returns the original string on bad encoding.
 */
function safeDecode(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

/**
 * Strip trailing slash for consistent matching (but preserve bare `/`).
 */
function normalize(pathname: string): string {
  const decoded = safeDecode(pathname);
  return decoded.length > 1 && decoded.endsWith('/')
    ? decoded.slice(0, -1)
    : decoded;
}

// ─── Explicit page mappings (decoded, no trailing slash) ────────────

const PAGE_REDIRECTS = new Map<string, string>([
  ['/home', '/'],
  ['/المدونة', '/blogs/'],
  ['/الخدمات', '/services/'],
  ['/خدمات', '/services/'],
  ['/العروض', '/offers/'],
]);

// ─── WooCommerce product → offer slug mapping ───────────────────────

const PRODUCT_REDIRECTS = new Map<string, string>([
  ['عرض-الفخامة', '/offers/elegance/'],
  ['نجم-سبا-سجنتشر', '/offers/signature/'],
]);

// ─── Known spam slugs (tags, categories, standalone pages) ──────────

const SPAM_TAG_SLUGS = new Set([
  'bet',
  'sky247-betting',
  'most-bet',
  'royalwin-apk',
  'fairplay-betting',
  '1-win-game',
  '1-win-bet',
  'gugo-bet-login',
  'best-coins-for-staking',
]);

const SPAM_CATEGORY_SLUGS = new Set([
  'mono-brand',
  '1xbet-kr',
  'sat-bet-582',
  'galactic-wins-casino-review-592',
]);

const SPAM_PAGE_SLUGS = new Set([
  'partycasino-app-195',
  'royal-vegas-login-nz-832',
  'galactic-wins-bonus-code-629',
  'galactic-wins-casino-review-48',
  'gratogana-juegos-en-vivo-427',
  'ltqnyt-lhdyth-lhkr-1xbet-ltfh-wslyb-lhmy',
  'exploring-the-history-of-1xbet-login-systems',
  'kak-ispolzovat-mobilnuiu-versiiu-1xbet-ofitsialnyi-sait-aktualnaia-ssylka',
  'join-now-and-start-fulfilling-eritrean-singles-today',
  'many-fabulous-and-almost-gay-hostels-in-bay-area',
  'find-china-dating-girls-your-key-to-a-fulfilling-relationship',
  'top-australian-free-e-wallet-casinos-for-hassle-free-gaming',
  'meet-local-grannies-looking-for-sex',
]);

// ─── Routes that must never be intercepted ──────────────────────────

const PASSTHROUGH_PREFIXES = [
  '/services/',
  '/offers/',
  '/packages/',
  '/en/',
  '/blogs/',
  '/book/',
  '/go/',
  '/api/',
  '/admin/',
  '/login',
  '/_astro/',
] as const;

const PASSTHROUGH_EXACT = new Set(['/', '/about', '/contact', '/services', '/offers', '/packages', '/en', '/blogs', '/book', '/go', '/login']);

function isPassthrough(normalized: string): boolean {
  if (PASSTHROUGH_EXACT.has(normalized)) return true;
  for (const prefix of PASSTHROUGH_PREFIXES) {
    if (normalized.startsWith(prefix)) return true;
  }
  return false;
}

// ─── Public resolver ────────────────────────────────────────────────

/**
 * Classify a legacy WordPress pathname.
 * Returns `null` for current-site paths that should be handled normally.
 */
export function resolveLegacyRoute(pathname: string): LegacyRouteResult {
  const norm = normalize(pathname);

  if (isPassthrough(norm)) return null;

  // 1. Explicit page redirects
  const pageTarget = PAGE_REDIRECTS.get(norm);
  if (pageTarget) return { kind: 'redirect', destination: pageTarget };

  // 2. /product/... routes
  const productMatch = norm.match(/^\/product(?:\/(.*))?$/);
  if (productMatch) {
    const slug = productMatch[1] ?? '';
    if (slug) {
      const mapped = PRODUCT_REDIRECTS.get(slug);
      if (mapped) return { kind: 'redirect', destination: mapped };
    }
    return { kind: 'redirect', destination: '/offers/' };
  }

  // 3. /product-category/...
  if (norm === '/product-category' || norm.startsWith('/product-category/')) {
    return { kind: 'redirect', destination: '/offers/' };
  }

  // 4. /tag/... — check for spam first, then fallback to blogs
  const tagMatch = norm.match(/^\/tag\/(.+)$/);
  if (tagMatch) {
    if (SPAM_TAG_SLUGS.has(tagMatch[1])) return { kind: 'gone' };
    return { kind: 'redirect', destination: '/blogs/' };
  }
  if (norm === '/tag') {
    return { kind: 'redirect', destination: '/blogs/' };
  }

  // 5. /category/... — check for spam first, then fallback to blogs
  const catMatch = norm.match(/^\/category\/(.+)$/);
  if (catMatch) {
    if (SPAM_CATEGORY_SLUGS.has(catMatch[1])) return { kind: 'gone' };
    return { kind: 'redirect', destination: '/blogs/' };
  }
  if (norm === '/category') {
    return { kind: 'redirect', destination: '/blogs/' };
  }

  // 6. /author/...
  if (norm === '/author' || norm.startsWith('/author/')) {
    return { kind: 'redirect', destination: '/' };
  }

  // 7. Known spam standalone pages
  const topSlug = norm.slice(1); // strip leading /
  if (SPAM_PAGE_SLUGS.has(topSlug)) return { kind: 'gone' };

  return null;
}
