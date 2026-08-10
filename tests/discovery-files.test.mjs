import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  ORIGIN,
  expectedRoutes,
  isIndexableRoute,
  loadSitemapEntries,
  loadSitemapIndexText,
  loadSitemapUrls,
} from './helpers/seo-routes.mjs';

const robotsText = await readFile(new URL('../dist/client/robots.txt', import.meta.url), 'utf8');
const llmsText = await readFile(new URL('../dist/client/llms.txt', import.meta.url), 'utf8');
const sitemapIndexText = await loadSitemapIndexText();
const sitemapEntries = await loadSitemapEntries();
const sitemapUrls = await loadSitemapUrls();
const indexableCanonicals = expectedRoutes()
  .filter(isIndexableRoute)
  .map((route) => `${ORIGIN}${route}`);

test('sitemap XML is parseable and matches indexable prerendered canonicals exactly', () => {
  assert.ok(sitemapUrls.length > 0);
  assert.deepEqual([...sitemapUrls].sort(), [...indexableCanonicals].sort());
});

test('sitemap index references the live blog sitemap', () => {
  assert.match(sitemapIndexText, /<sitemapindex/);
  assert.match(sitemapIndexText, new RegExp(`${ORIGIN}/sitemap-0\\.xml`));
  assert.match(sitemapIndexText, new RegExp(`${ORIGIN}/sitemap-blog\\.xml`));
});

test('sitemap hreflang alternates are reciprocal between locales', () => {
  const byLoc = new Map(sitemapEntries.map((entry) => [entry.loc, entry]));

  for (const entry of sitemapEntries) {
    const path = new URL(entry.loc).pathname;
    const isBlog = path === '/blogs/' || path.startsWith('/blogs/');

    assert.ok(entry.alternates.ar, `missing ar alternate for ${entry.loc}`);

    if (isBlog) {
      assert.equal(entry.alternates.en, undefined, `blog should not invent en alternate: ${entry.loc}`);
      continue;
    }

    assert.ok(entry.alternates.en, `missing en alternate for ${entry.loc}`);

    const arEntry = byLoc.get(entry.alternates.ar);
    const enEntry = byLoc.get(entry.alternates.en);
    assert.ok(arEntry, `ar alternate missing from sitemap: ${entry.alternates.ar}`);
    assert.ok(enEntry, `en alternate missing from sitemap: ${entry.alternates.en}`);
    assert.equal(arEntry.alternates.en, entry.alternates.en, entry.loc);
    assert.equal(enEntry.alternates.ar, entry.alternates.ar, entry.loc);
  }
});

test('sitemap excludes noindex, booking, go, and API routes', () => {
  for (const url of sitemapUrls) {
    assert.doesNotMatch(url, /\/book\/|\/go\/|\/api\//);
    assert.match(url, /^https:\/\//);
    assert.doesNotMatch(url, /localhost|example\.com|127\.0\.0\.1/);
  }
});

test('robots.txt declares sitemap and blocks API', () => {
  assert.match(robotsText, /^User-agent: \*/m);
  assert.match(robotsText, /^Allow: \//m);
  assert.match(robotsText, /^Disallow: \/api\//m);
  assert.match(robotsText, /^Disallow: \/admin\/?/m);
  assert.match(robotsText, /^Disallow: \/login\/?/m);
  assert.match(robotsText, new RegExp(`Sitemap: ${ORIGIN}/sitemap-index\\.xml`));
});

test('sitemap excludes admin and login routes', () => {
  for (const url of sitemapUrls) {
    assert.doesNotMatch(url, /\/admin(\/|$)|\/login(\/|$)/);
  }
});

test('llms.txt includes major Arabic and English sections without utility routes', () => {
  assert.match(llmsText, /\/services\//);
  assert.match(llmsText, /\/en\/services\//);
  assert.match(llmsText, /\/packages\//);
  assert.match(llmsText, /\/en\/packages\//);
  assert.match(llmsText, /\/offers\//);
  assert.match(llmsText, /\/en\/offers\//);
  assert.match(llmsText, /\/blogs\//);
  assert.doesNotMatch(llmsText, /\/book\//);
  assert.doesNotMatch(llmsText, /\/go\//);
  assert.doesNotMatch(llmsText, /\/api\//);
});
