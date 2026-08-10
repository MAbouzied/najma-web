import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ORIGIN,
  attr,
  isBlogRoute,
  isIndexableRoute,
  isUtilityRoute,
  loadAllPages,
} from './helpers/seo-routes.mjs';

const pages = await loadAllPages();
const indexable = pages.filter((p) => isIndexableRoute(p.route));

test('covers all localized prerendered HTML pages', () => {
  // Blog listing/articles are SSR and absent from dist/client HTML snapshots.
  assert.equal(pages.length, 64);
});

test('every page has exactly one title, description, canonical, and robots policy', () => {
  for (const { route, html } of pages) {
    assert.equal((html.match(/<title>/g) || []).length, 1, route);
    assert.equal((html.match(/<meta name="description"/g) || []).length, 1, route);
    assert.equal((html.match(/<link rel="canonical"/g) || []).length, 1, route);
    assert.equal((html.match(/<meta name="robots"/g) || []).length, 1, route);

    const title = attr(html, /<title>([^<]*)<\/title>/);
    const description = attr(html, /<meta name="description" content="([^"]*)">/);
    const canonical = attr(html, /<link rel="canonical" href="([^"]+)">/);
    const robots = attr(html, /<meta name="robots" content="([^"]*)">/);

    assert.ok(title && title.trim(), `blank title on ${route}`);
    assert.ok(description && description.trim(), `blank description on ${route}`);
    assert.doesNotMatch(title, /TODO|placeholder|lorem/i);
    assert.doesNotMatch(description, /TODO|placeholder|lorem/i);
    assert.match(canonical, /^https:\/\//);
    assert.ok(!canonical.includes('?') && !canonical.includes('#'), `dirty canonical on ${route}`);
    assert.equal(canonical, `${ORIGIN}${route === '/' ? '/' : route}`);
    assert.ok(robots);

    const robotsDirectives = robots
      .split(',')
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean);

    if (isUtilityRoute(route)) {
      assert.ok(robotsDirectives.includes('noindex'), `expected noindex on ${route}`);
    } else {
      assert.ok(robotsDirectives.includes('index'), `expected index on ${route}`);
      assert.ok(robotsDirectives.includes('follow'), `expected follow on ${route}`);
      assert.ok(!robotsDirectives.includes('noindex'), `unexpected noindex on ${route}`);
      assert.match(robots, /max-image-preview:large/);
    }
  }
});

test('titles are unique within each locale for indexable pages', () => {
  for (const locale of ['ar', 'en']) {
    const titles = new Map();
    for (const page of indexable.filter((p) => p.locale === locale)) {
      const title = attr(page.html, /<title>([^<]*)<\/title>/);
      if (!titles.has(title)) titles.set(title, []);
      titles.get(title).push(page.route);
    }
    for (const [title, routes] of titles) {
      assert.equal(routes.length, 1, `duplicate ${locale} title "${title}": ${routes.join(', ')}`);
    }
  }
});

test('og:url matches canonical and social metadata is complete', () => {
  for (const { route, html, locale } of pages) {
    const canonical = attr(html, /<link rel="canonical" href="([^"]+)">/);
    const ogUrl = attr(html, /<meta property="og:url" content="([^"]+)">/);
    const ogTitle = attr(html, /<meta property="og:title" content="([^"]*)">/);
    const ogDescription = attr(html, /<meta property="og:description" content="([^"]*)">/);
    const ogImage = attr(html, /<meta property="og:image" content="([^"]+)">/);
    const ogImageAlt = attr(html, /<meta property="og:image:alt" content="([^"]*)">/);
    const twitterCard = attr(html, /<meta name="twitter:card" content="([^"]+)">/);
    const twitterTitle = attr(html, /<meta name="twitter:title" content="([^"]*)">/);
    const twitterDescription = attr(html, /<meta name="twitter:description" content="([^"]*)">/);
    const twitterImage = attr(html, /<meta name="twitter:image" content="([^"]+)">/);
    const twitterImageAlt = attr(html, /<meta name="twitter:image:alt" content="([^"]*)">/);

    assert.equal(ogUrl, canonical, route);
    assert.ok(ogTitle);
    assert.ok(ogDescription);
    assert.ok(ogImageAlt);
    assert.equal(twitterCard, 'summary_large_image');
    assert.ok(twitterTitle);
    assert.ok(twitterDescription);
    assert.equal(twitterImage, ogImage);
    assert.ok(twitterImageAlt);
    assert.match(
      html,
      new RegExp(
        `<meta property="og:locale" content="${locale === 'en' ? 'en_US' : 'ar_SA'}">`,
      ),
    );
    assert.match(html, /<meta property="og:site_name" content="[^"]+">/);

    // Blog routes are SSR and absent from dist/client HTML snapshots.
    if (isBlogRoute(route)) continue;

    assert.match(html, /<meta property="og:type" content="website">/);
    assert.equal(ogImage, `${ORIGIN}/assets/og/nagm-spa-share-1200x630.jpg`);
  }
});
