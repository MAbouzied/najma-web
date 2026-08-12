import { expect, test, type APIRequestContext } from '@playwright/test';

/**
 * Fetch a URL without following redirects so we can assert on the raw status
 * and Location header. Playwright's `request` context does not auto-redirect
 * when `maxRedirects: 0` is set.
 */
async function rawFetch(request: APIRequestContext, path: string) {
  return request.get(path, { maxRedirects: 0 });
}

// ─── 301 Redirects ───────────────────────────────────────────────────

const REDIRECT_CASES: [string, string | RegExp][] = [
  // Explicit page redirects
  ['/home/', '/'],
  ['/home', '/'],
  ['/%D8%A7%D9%84%D9%85%D8%AF%D9%88%D9%86%D8%A9/', '/blogs/'],
  ['/%D8%A7%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA/', '/services/'],
  ['/%D8%AE%D8%AF%D9%85%D8%A7%D8%AA/', '/services/'],
  ['/%D8%A7%D9%84%D8%B9%D8%B1%D9%88%D8%B6/', '/offers/'],

  // WooCommerce product redirects
  ['/product/%D8%B9%D8%B1%D8%B6-%D8%A7%D9%84%D9%81%D8%AE%D8%A7%D9%85%D8%A9/', '/offers/elegance/'],
  ['/product/%D9%86%D8%AC%D9%85-%D8%B3%D8%A8%D8%A7-%D8%B3%D8%AC%D9%86%D8%AA%D8%B4%D8%B1/', '/offers/signature/'],

  // Route-family fallbacks
  ['/product/unknown-product/', '/offers/'],
  ['/product/', '/offers/'],
  ['/product', '/offers/'],
  ['/product-category/anything/', '/offers/'],
  ['/author/admin/', '/'],
  ['/author/nagmspa/', '/'],

  // Non-spam tag/category → /blogs/
  ['/tag/some-tag/', '/blogs/'],
  ['/category/some-category/', '/blogs/'],

  // Unmapped old content → home
  ['/old-wordpress-page/', '/'],
  ['/totally-random-path/', '/'],
];

test.describe('legacy 301 redirects', () => {
  for (const [source, expectedDest] of REDIRECT_CASES) {
    test(`${source} → 301 ${expectedDest}`, async ({ request }) => {
      const response = await rawFetch(request, source);
      expect(response.status(), `status for ${source}`).toBe(301);

      const location = response.headers()['location'] ?? '';
      if (typeof expectedDest === 'string') {
        const locationPath = new URL(location, 'http://localhost').pathname;
        expect(locationPath, `Location header for ${source}`).toBe(expectedDest);
      } else {
        expect(location, `Location header for ${source}`).toMatch(expectedDest);
      }
    });
  }

  test('301 redirect preserves query string', async ({ request }) => {
    const response = await rawFetch(request, '/home/?utm_source=google&utm_medium=cpc');
    expect(response.status()).toBe(301);

    const location = response.headers()['location'] ?? '';
    const url = new URL(location, 'http://localhost');
    expect(url.searchParams.get('utm_source')).toBe('google');
    expect(url.searchParams.get('utm_medium')).toBe('cpc');
  });
});

// ─── 410 Gone ────────────────────────────────────────────────────────

const GONE_CASES = [
  '/tag/bet/',
  '/tag/sky247-betting/',
  '/tag/most-bet/',
  '/tag/royalwin-apk/',
  '/tag/fairplay-betting/',
  '/tag/1-win-game/',
  '/tag/1-win-bet/',
  '/tag/gugo-bet-login/',
  '/tag/best-coins-for-staking/',
  '/tag/sat-bet/',
  '/category/mono-brand/',
  '/category/1xbet-kr/',
  '/category/sat-bet-582/',
  '/category/galactic-wins-casino-review-592/',
  '/partycasino-app-195/',
  '/royal-vegas-login-nz-832/',
  '/galactic-wins-bonus-code-629/',
  '/galactic-wins-casino-review-48/',
  '/gratogana-juegos-en-vivo-427/',
  '/ltqnyt-lhdyth-lhkr-1xbet-ltfh-wslyb-lhmy/',
  '/exploring-the-history-of-1xbet-login-systems/',
  '/kak-ispolzovat-mobilnuiu-versiiu-1xbet-ofitsialnyi-sait-aktualnaia-ssylka/',
  '/join-now-and-start-fulfilling-eritrean-singles-today/',
  '/many-fabulous-and-almost-gay-hostels-in-bay-area/',
  '/find-china-dating-girls-your-key-to-a-fulfilling-relationship/',
  '/top-australian-free-e-wallet-casinos-for-hassle-free-gaming/',
  '/meet-local-grannies-looking-for-sex/',
  '/erotic-monkey-assessment-top-erotic-experience-services/',
];

test.describe('spam URLs return 410 Gone', () => {
  for (const path of GONE_CASES) {
    test(`${path} → 410`, async ({ request }) => {
      const response = await rawFetch(request, path);
      expect(response.status(), `status for ${path}`).toBe(410);

      const robotsTag = response.headers()['x-robots-tag'] ?? '';
      expect(robotsTag, 'X-Robots-Tag must deny indexing').toContain('noindex');
      expect(robotsTag).toContain('nofollow');
    });
  }
});

// ─── Current routes are NOT intercepted ──────────────────────────────

const PASSTHROUGH_ROUTES = [
  '/',
  '/about/',
  '/contact/',
  '/services/',
  '/offers/',
  '/packages/',
  '/en/',
  '/blogs/',
];

test.describe('current routes pass through (not redirected)', () => {
  for (const path of PASSTHROUGH_ROUTES) {
    test(`${path} returns 200`, async ({ request }) => {
      const response = await rawFetch(request, path);
      expect(response.status(), `status for ${path}`).toBe(200);
    });
  }
});
