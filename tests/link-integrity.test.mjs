import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import {
  DIST,
  isBlogRoute,
  isIndexableRoute,
  loadAllPages,
  routeToDistPath,
} from './helpers/seo-routes.mjs';

const pages = await loadAllPages();

function internalLinks(html) {
  return [...html.matchAll(/\b(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)].map((m) => m[1]);
}

function fragments(html) {
  return [...html.matchAll(/\bhref="(#[^"]+)"/g)].map((m) => m[1].slice(1));
}

async function isExactFile(relativePath) {
  try {
    const info = await stat(join(DIST, relativePath));
    return info.isFile();
  } catch {
    return false;
  }
}

async function pathExists(pathname) {
  const trimmed = pathname.replace(/\/+$/, '');
  const asRoute = pathname.endsWith('/') || pathname === '/' ? pathname : `${pathname}/`;
  const candidates = [
    routeToDistPath(asRoute === '//' ? '/' : asRoute),
    `${trimmed.replace(/^\//, '')}.html`,
    `${trimmed.replace(/^\//, '')}/index.html`,
    pathname.replace(/^\//, ''),
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (await isExactFile(candidate)) return true;
  }
  return false;
}

test('root-relative links resolve to built assets or pages', async () => {
  const missing = new Set();
  for (const { html } of pages) {
    for (const href of internalLinks(html)) {
      if (href.startsWith('/api/')) continue;
      // Blog routes are SSR + Cloudflare cache; they are not written to dist/client.
      if (isBlogRoute(href.endsWith('/') || href === '/' ? href : `${href}/`) || href === '/blogs') {
        continue;
      }
      if (!(await pathExists(href))) missing.add(href);
    }
  }
  assert.deepEqual([...missing].sort(), []);
});

test('navigation never produces malformed /en/en/ paths', () => {
  for (const { route, html } of pages) {
    assert.doesNotMatch(html, /href="\/en\/en\//, route);
  }
});

test('English primary nav links remain under /en/', () => {
  const enPaths = ['/en/', '/en/about/', '/en/services/', '/en/packages/', '/en/offers/', '/en/contact/'];
  for (const page of pages.filter((p) => p.locale === 'en' && p.html.includes('data-site-header'))) {
    const header = page.html.match(/data-site-header[\s\S]*?<\/header>/)?.[0] ?? '';
    for (const href of enPaths) {
      assert.match(
        header,
        new RegExp(`href="${href.replaceAll('/', '\\/')}"`),
        `${page.route} missing ${href}`,
      );
    }
    assert.match(header, /hreflang="ar"/, `${page.route} missing Arabic language switch`);
  }
});

test('every indexable detail page is reachable from its collection index', () => {
  const collections = [
    { index: '/services/', prefix: '/services/' },
    { index: '/en/services/', prefix: '/en/services/' },
    { index: '/packages/', prefix: '/packages/' },
    { index: '/en/packages/', prefix: '/en/packages/' },
    { index: '/offers/', prefix: '/offers/' },
    { index: '/en/offers/', prefix: '/en/offers/' },
  ];

  for (const { index, prefix } of collections) {
    const indexPage = pages.find((p) => p.route === index);
    const details = pages.filter(
      (p) => p.route.startsWith(prefix) && p.route !== index && isIndexableRoute(p.route),
    );
    for (const detail of details) {
      assert.match(indexPage.html, new RegExp(`href="${detail.route.replaceAll('/', '\\/')}"`));
    }
  }
});

test('external new-tab links include noopener noreferrer', () => {
  for (const { route, html } of pages) {
    const unsafe = [
      ...html.matchAll(/<a[^>]+target="_blank"[^>]*>/g),
    ].filter((m) => !/rel="[^"]*noopener[^"]*noreferrer[^"]*"/.test(m[0]));
    assert.equal(unsafe.length, 0, `${route} has unsafe target=_blank links`);
  }
});

test('in-page fragments referenced from the same document exist', () => {
  for (const { route, html } of pages) {
    for (const id of fragments(html)) {
      assert.ok(
        html.includes(`id="${id}"`) || html.includes(`name="${id}"`),
        `missing fragment #${id} on ${route}`,
      );
    }
  }
});
