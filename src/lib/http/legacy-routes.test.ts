import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveLegacyRoute, type LegacyRouteResult } from './legacy-routes.ts';

function expectRedirect(pathname: string, destination: string) {
  const result = resolveLegacyRoute(pathname);
  assert.deepEqual(result, { kind: 'redirect', destination }, `${pathname} → ${destination}`);
}

function expectGone(pathname: string) {
  const result = resolveLegacyRoute(pathname);
  assert.equal(result.kind, 'gone', `${pathname} should be gone`);
}

function expectPassthrough(pathname: string) {
  const result = resolveLegacyRoute(pathname);
  assert.equal(result, null, `${pathname} should pass through`);
}

// ─── Valid legacy spa page redirects ────────────────────────────────

describe('explicit page redirects', () => {
  it('/home/ → /', () => expectRedirect('/home/', '/'));
  it('/home (no trailing slash) → /', () => expectRedirect('/home', '/'));

  it('/المدونة/ → /blogs/', () => expectRedirect('/%D8%A7%D9%84%D9%85%D8%AF%D9%88%D9%86%D8%A9/', '/blogs/'));
  it('/المدونة (decoded) → /blogs/', () => expectRedirect('/المدونة/', '/blogs/'));
  it('/المدونة (no trailing slash) → /blogs/', () => expectRedirect('/المدونة', '/blogs/'));

  it('/الخدمات/ → /services/', () => expectRedirect('/%D8%A7%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA/', '/services/'));
  it('/الخدمات (decoded) → /services/', () => expectRedirect('/الخدمات/', '/services/'));

  it('/خدمات/ → /services/', () => expectRedirect('/%D8%AE%D8%AF%D9%85%D8%A7%D8%AA/', '/services/'));
  it('/خدمات (decoded) → /services/', () => expectRedirect('/خدمات/', '/services/'));

  it('/العروض/ → /offers/', () => expectRedirect('/%D8%A7%D9%84%D8%B9%D8%B1%D9%88%D8%B6/', '/offers/'));
  it('/العروض (decoded) → /offers/', () => expectRedirect('/العروض/', '/offers/'));
});

// ─── WooCommerce product redirects ──────────────────────────────────

describe('WooCommerce product redirects', () => {
  it('/product/عرض-الفخامة/ → /offers/elegance/', () =>
    expectRedirect('/product/%D8%B9%D8%B1%D8%B6-%D8%A7%D9%84%D9%81%D8%AE%D8%A7%D9%85%D8%A9/', '/offers/elegance/'));

  it('/product/عرض-الفخامة (decoded) → /offers/elegance/', () =>
    expectRedirect('/product/عرض-الفخامة/', '/offers/elegance/'));

  it('/product/نجم-سبا-سجنتشر/ → /offers/signature/', () =>
    expectRedirect('/product/%D9%86%D8%AC%D9%85-%D8%B3%D8%A8%D8%A7-%D8%B3%D8%AC%D9%86%D8%AA%D8%B4%D8%B1/', '/offers/signature/'));

  it('/product/نجم-سبا-سجنتشر (decoded) → /offers/signature/', () =>
    expectRedirect('/product/نجم-سبا-سجنتشر/', '/offers/signature/'));
});

// ─── Route-family fallbacks ─────────────────────────────────────────

describe('route-family fallbacks', () => {
  it('/product/unknown-product/ → /offers/', () =>
    expectRedirect('/product/unknown-product/', '/offers/'));

  it('/product/anything → /offers/', () =>
    expectRedirect('/product/anything', '/offers/'));

  it('/product-category/عروض/ → /offers/', () =>
    expectRedirect('/product-category/%D8%B9%D8%B1%D9%88%D8%B6/', '/offers/'));

  it('/product-category/random/ → /offers/', () =>
    expectRedirect('/product-category/random/', '/offers/'));

  it('/author/admin/ → /', () =>
    expectRedirect('/author/admin/', '/'));

  it('/author/nagmspa/ → /', () =>
    expectRedirect('/author/nagmspa/', '/'));
});

// ─── Spam / hacked URLs → 410 Gone ─────────────────────────────────

describe('spam URLs return 410 gone', () => {
  const spamTags = [
    '/tag/bet/',
    '/tag/sky247-betting/',
    '/tag/most-bet/',
    '/tag/royalwin-apk/',
    '/tag/fairplay-betting/',
    '/tag/1-win-game/',
    '/tag/1-win-bet/',
    '/tag/gugo-bet-login/',
    '/tag/best-coins-for-staking/',
  ];

  const spamCategories = [
    '/category/mono-brand/',
    '/category/1xbet-kr/',
    '/category/sat-bet-582/',
    '/category/galactic-wins-casino-review-592/',
  ];

  const spamPages = [
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
  ];

  for (const path of [...spamTags, ...spamCategories, ...spamPages]) {
    it(`${path} → gone`, () => expectGone(path));
  }

  it('spam tag without trailing slash → gone', () => expectGone('/tag/bet'));
  it('spam page without trailing slash → gone', () =>
    expectGone('/partycasino-app-195'));
});

// ─── Non-spam tag/category fallback ─────────────────────────────────

describe('non-spam tag/category fallback to /blogs/', () => {
  it('/tag/unknown-tag/ → /blogs/', () =>
    expectRedirect('/tag/unknown-tag/', '/blogs/'));

  it('/category/unknown-cat/ → /blogs/', () =>
    expectRedirect('/category/unknown-cat/', '/blogs/'));
});

// ─── Passthrough: current routes must not be intercepted ────────────

describe('current routes pass through', () => {
  const currentRoutes = [
    '/',
    '/about/',
    '/contact/',
    '/services/',
    '/services/swedish-massage/',
    '/offers/',
    '/offers/elegance/',
    '/offers/signature/',
    '/packages/',
    '/packages/groom/',
    '/en/',
    '/en/about/',
    '/en/services/',
    '/en/offers/',
    '/blogs/',
    '/blogs/dalil-anwaa-almasaj-hafr-albatin/',
    '/book/',
    '/go/',
    '/api/customers',
    '/api/auth/callback',
    '/admin/',
    '/admin/create',
    '/login',
    '/_astro/something.js',
  ];

  for (const path of currentRoutes) {
    it(`${path} passes through`, () => expectPassthrough(path));
  }
});

// ─── Edge cases ─────────────────────────────────────────────────────

describe('edge cases', () => {
  it('unknown path passes through', () =>
    expectPassthrough('/totally-random-path/'));

  it('redirect target is not itself a legacy source', () => {
    const result = resolveLegacyRoute('/home/');
    assert.ok(result);
    assert.equal(result.kind, 'redirect');
    const again = resolveLegacyRoute(result.destination);
    assert.equal(again, null, 'redirect destination must not trigger another legacy rule');
  });

  it('malformed percent encoding passes through without error', () => {
    const result = resolveLegacyRoute('/%ZZ%invalid/');
    assert.ok(result === null || result.kind === 'gone' || result.kind === 'redirect');
  });

  it('/product/ bare path (no slug) → /offers/', () =>
    expectRedirect('/product/', '/offers/'));

  it('/product (no trailing slash, no slug) → /offers/', () =>
    expectRedirect('/product', '/offers/'));
});
