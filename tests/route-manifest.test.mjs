import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import {
  DIST,
  OFFER_SLUGS,
  PACKAGE_SLUGS,
  SERVICE_SLUGS,
  expectedPrerenderedRoutes,
  expectedRoutes,
  loadAllPages,
  routeToDistPath,
} from './helpers/seo-routes.mjs';

const pages = await loadAllPages();
const allPagesIncludingStatus = await loadAllPages({ includeStatus: true });
const generated = pages.map((p) => p.route);
const expectedStatic = expectedPrerenderedRoutes();

test('generates the complete Arabic and English prerendered route set', () => {
  // 64 bilingual routes — blog listing/articles are SSR and not written to dist/client
  assert.equal(expectedStatic.length, 64);
  assert.equal(expectedRoutes().length, 64);
  assert.deepEqual(generated, expectedStatic);
  assert.ok(allPagesIncludingStatus.some((page) => page.route === '/404/'));
});

test('emits a branded 404.html used by Astro status routes', async () => {
  await access(join(DIST, '404.html'));
});

test('Cloudflare assets leave unmatched navigations to the Worker (SSR-safe)', async () => {
  // "404-page" intercepts Sec-Fetch-Mode: navigate before the Worker, breaking /blogs/ etc.
  const wrangler = JSON.parse(await readFile(join(DIST, '..', 'server', 'wrangler.json'), 'utf8'));
  assert.equal(wrangler.assets?.not_found_handling, 'none');
  assert.equal(wrangler.assets?.run_worker_first, true);
});

test('root wrangler.toml runs the Worker before assets for legacy redirects', async () => {
  const toml = await readFile(join(process.cwd(), 'wrangler.toml'), 'utf8');
  assert.match(toml, /not_found_handling\s*=\s*"none"/);
  assert.match(toml, /run_worker_first\s*=\s*true/);
});

test('includes exact service, package, and offer slugs in both locales', () => {
  for (const slug of SERVICE_SLUGS) {
    assert.ok(generated.includes(`/services/${slug}/`));
    assert.ok(generated.includes(`/en/services/${slug}/`));
  }
  for (const slug of PACKAGE_SLUGS) {
    assert.ok(generated.includes(`/packages/${slug}/`));
    assert.ok(generated.includes(`/en/packages/${slug}/`));
  }
  for (const slug of OFFER_SLUGS) {
    assert.ok(generated.includes(`/offers/${slug}/`));
    assert.ok(generated.includes(`/en/offers/${slug}/`));
  }
});

test('every bilingual Arabic route has an English counterpart and vice versa', () => {
  for (const route of expectedStatic) {
    if (route.startsWith('/en/')) {
      const ar = route.slice(3);
      assert.ok(generated.includes(ar), `missing Arabic counterpart for ${route}`);
    } else {
      const en = route === '/' ? '/en/' : `/en${route}`;
      assert.ok(generated.includes(en), `missing English counterpart for ${route}`);
    }
  }
});

test('does not emit unexpected HTML pages outside the prerendered manifest', () => {
  const unexpected = generated.filter(
    (route) => !expectedStatic.includes(route) && route !== '/404/',
  );
  assert.deepEqual(unexpected, []);
});

test('unknown dynamic routes are not prerendered', async () => {
  for (const missing of [
    'services/does-not-exist/index.html',
    'en/services/does-not-exist/index.html',
    'packages/does-not-exist/index.html',
    'offers/does-not-exist/index.html',
    'en/offers/retired-offer/index.html',
    'blogs/index.html',
    'blogs/does-not-exist/index.html',
  ]) {
    await assert.rejects(() => access(join(DIST, missing)));
  }
});

test('every expected prerendered route maps to a built HTML file', async () => {
  for (const route of expectedStatic) {
    await access(join(DIST, routeToDistPath(route)));
  }
});
