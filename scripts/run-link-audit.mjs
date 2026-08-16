/**
 * Optional deep link audit (internal + optional external).
 *
 * Prefer `npm run test:browser` for PR regression coverage.
 * This script no longer writes into tracked seo-baseline/ files.
 *
 * Usage:
 *   npm run preview:built   # in another terminal, after build
 *   npm run audit:links
 *
 * Env:
 *   LINK_AUDIT_BASE          default http://127.0.0.1:4323
 *   LINK_AUDIT_EXTERNAL=1    also HTTP-check social/maps/external URLs
 *   LINK_AUDIT_OUT           override output path (default test-results/...)
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = (process.env.LINK_AUDIT_BASE || 'http://127.0.0.1:4323').replace(/\/$/, '');
const CHECK_EXTERNAL = process.env.LINK_AUDIT_EXTERNAL === '1';
const EXPECTED_PHONE = '966579777407';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT =
  process.env.LINK_AUDIT_OUT ||
  join(ROOT, 'test-results', 'link-audit', 'link-audit-results.json');

function joinUrl(base, path) {
  if (!path) return base;
  if (/^(https?:|tel:|mailto:)/.test(path)) return path;
  if (path.startsWith('//')) return `https:${path}`;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function stripHash(href) {
  const i = href.indexOf('#');
  return i === -1 ? href : href.slice(0, i);
}

function getSearchParam(href, key) {
  try {
    return new URL(href).searchParams.get(key) || '';
  } catch {
    return '';
  }
}

function classify(href) {
  if (!href) return 'skip';
  if (href.startsWith('tel:')) return 'tel';
  if (href.includes('api.whatsapp.com') || href.includes('wa.me/')) return 'whatsapp';
  if (
    /instagram\.com|snapchat\.com|facebook\.com|tiktok\.com|twitter\.com|x\.com|youtube\.com/.test(
      href,
    )
  ) {
    return 'social';
  }
  if (/google\.com\/maps|maps\.google|maps\.app\.goo\.gl/.test(href)) return 'maps';
  if (href.startsWith(BASE) || href.startsWith('/')) return 'internal';
  if (href.startsWith('http')) return 'external';
  return 'other';
}

async function checkHttp(request, url) {
  try {
    const resp = await request.get(url, { maxRedirects: 10, timeout: 25_000 });
    return { status: resp.status(), ok: resp.status() >= 200 && resp.status() < 400, error: null };
  } catch (error) {
    return { status: 0, ok: false, error: String(error.message || error).slice(0, 160) };
  }
}

const serviceSlugs = [
  'swedish-massage',
  'thai-massage',
  'hot-stone-massage',
  'cupping',
  'massage-relaxation',
  'shiatsu',
  'hot-oil-massage',
  'star-spa-massage',
  'moroccan-bath',
  'royal-bath',
  'steam-session',
  'manicure-pedicure',
  'body-scrub',
];
const packageSlugs = ['groom', 'luxury', 'gift'];
const offerSlugs = [
  'recovery',
  'relaxation',
  'signature',
  'care',
  'elegance',
  'prosperity',
  'royal',
  'golden',
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const request = context.request;

  const pageResults = [];
  const linkResults = [];
  const seenPages = new Set();
  const seenLinks = new Set();

  const seedPages = [
    '/',
    '/about/',
    '/services/',
    '/offers/',
    '/packages/',
    '/blogs/',
    '/contact/',
    '/go/',
    '/form/',
    '/book/',
    '/en/',
    '/en/about/',
    '/en/services/',
    '/en/offers/',
    '/en/packages/',
    '/en/contact/',
    '/en/go/',
    '/en/form/',
    '/en/book/',
    '/robots.txt',
    '/sitemap-index.xml',
  ];
  for (const slug of serviceSlugs) seedPages.push(`/services/${slug}/`, `/en/services/${slug}/`);
  for (const slug of packageSlugs) seedPages.push(`/packages/${slug}/`, `/en/packages/${slug}/`);
  for (const slug of offerSlugs) seedPages.push(`/offers/${slug}/`, `/en/offers/${slug}/`);

  console.log(`Auditing ${BASE} (external HTTP checks: ${CHECK_EXTERNAL ? 'on' : 'off'})`);
  for (const path of seedPages) {
    const full = joinUrl(BASE, path);
    if (seenPages.has(full)) continue;
    seenPages.add(full);
    const check = await checkHttp(request, full);
    pageResults.push({
      type: 'internal-page',
      link: path,
      status: check.status || check.error || 0,
      pass: check.ok,
      note: check.ok ? 'OK' : check.error || `HTTP ${check.status}`,
    });
    process.stdout.write(check.ok ? '.' : 'F');
  }
  console.log(`\nPages: ${pageResults.filter((r) => r.pass).length}/${pageResults.length}`);

  const crawlPages = [
    '/',
    '/en/',
    '/services/',
    '/en/services/',
    '/offers/',
    '/packages/',
    '/contact/',
    '/go/',
    '/about/',
    '/blogs/',
  ];

  const collected = [];
  for (const path of crawlPages) {
    await page.goto(joinUrl(BASE, path), { waitUntil: 'domcontentloaded', timeout: 45_000 });
    const anchors = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href]')).map((a) => ({
        href: a.href,
        text: (a.getAttribute('aria-label') || a.textContent || '')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 100),
      })),
    );
    for (const anchor of anchors) {
      const abs = stripHash(anchor.href);
      const type = classify(abs);
      if (type === 'skip') continue;
      const key = `${type}|${abs}`;
      if (seenLinks.has(key)) continue;
      seenLinks.add(key);
      collected.push({ href: abs, text: anchor.text, type, source: path });
    }
  }

  for (const item of collected) {
    const { href, text, type, source } = item;

    if (type === 'tel') {
      const pass = href === `tel:+${EXPECTED_PHONE}` || href === `tel:${EXPECTED_PHONE}`;
      linkResults.push({
        type,
        link: href,
        label: text,
        source,
        pass,
        note: pass ? 'correct phone' : `expected tel:+${EXPECTED_PHONE}`,
      });
      continue;
    }

    if (type === 'whatsapp') {
      let phone = getSearchParam(href, 'phone');
      if (!phone && href.includes('wa.me/')) phone = href.split('wa.me/')[1]?.split(/[?#]/)[0] || '';
      const message = getSearchParam(href, 'text');
      const phoneOk = phone === EXPECTED_PHONE;
      linkResults.push({
        type,
        link: href,
        label: text,
        source,
        pass: phoneOk && message.length > 0,
        note: phoneOk ? 'phone + message OK' : `phone=${phone || 'missing'}`,
      });
      continue;
    }

    if (type === 'social' || type === 'maps' || type === 'external') {
      if (!CHECK_EXTERNAL) {
        // Shape-only validation keeps PR/local runs deterministic.
        const pass =
          type === 'maps'
            ? /maps\.app\.goo\.gl|google\.com\/maps/.test(href)
            : href.startsWith('https://');
        linkResults.push({
          type,
          link: href,
          label: text,
          source,
          pass,
          note: pass ? 'shape OK (HTTP skipped)' : 'invalid URL shape',
          skippedHttp: true,
        });
        continue;
      }

      const check = await checkHttp(request, href);
      const knownBrand =
        href === 'https://www.instagram.com/nagmspa/' ||
        href === 'https://www.snapchat.com/add/nagmspa' ||
        /maps\.app\.goo\.gl|google\.com\/maps/.test(href);
      linkResults.push({
        type,
        link: href,
        label: text,
        source,
        pass: check.ok || knownBrand,
        note: check.ok
          ? 'reachable'
          : knownBrand
            ? `brand URL tolerated (${check.error || check.status})`
            : check.error || `HTTP ${check.status}`,
      });
      continue;
    }

    if (type === 'internal') {
      const path = href.startsWith(BASE) ? href.slice(BASE.length) || '/' : href;
      if (
        path.startsWith('/assets/') ||
        path.startsWith('/api/') ||
        path.startsWith('/admin') ||
        path.startsWith('/_') ||
        path.startsWith('/login')
      ) {
        continue;
      }
      const check = await checkHttp(request, href);
      linkResults.push({
        type: 'internal-link',
        link: path,
        label: text,
        source,
        pass: check.ok,
        note: check.ok ? 'OK' : check.error || `HTTP ${check.status}`,
      });
    }
  }

  const summary = {
    pages: {
      total: pageResults.length,
      passed: pageResults.filter((r) => r.pass).length,
      failed: pageResults.filter((r) => !r.pass).length,
    },
    links: {
      total: linkResults.length,
      passed: linkResults.filter((r) => r.pass).length,
      failed: linkResults.filter((r) => !r.pass).length,
    },
    externalHttp: CHECK_EXTERNAL,
  };

  const report = {
    base: BASE,
    generatedAt: new Date().toISOString(),
    summary,
    pageResults,
    linkResults,
    failures: {
      pages: pageResults.filter((r) => !r.pass),
      links: linkResults.filter((r) => !r.pass),
    },
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`Wrote untracked report: ${OUT}`);
  console.log(JSON.stringify(summary, null, 2));

  await browser.close();

  if (summary.pages.failed || summary.links.failed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
