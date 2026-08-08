import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ORIGIN = 'https://najma-web.mohamed-abouzied.workers.dev';
export const DIST = fileURLToPath(new URL('../../dist/client/', import.meta.url));

export const SERVICE_SLUGS = [
  'massage-relaxation',
  'hot-oil-massage',
  'foot-massage',
  'shiatsu',
  'thai-massage',
  'sports-massage',
  'star-spa-massage',
  'moroccan-bath',
  'moroccan-bath-clay',
  'manicure-pedicure',
];
export const PACKAGE_SLUGS = ['wedding', 'luxury', 'gift'];
export const OFFER_SLUGS = [
  'exterior-wash',
  'interior-wash',
  'engine-cleaning',
  'body-polishing',
];

/** Published mock blog slugs (Arabic-only surface). Keep in sync with mock-posts.ts. */
export const BLOG_SLUGS = [
  'dalil-anwaa-almasaj-hafr-albatin',
  'hammam-maghribi-madha-tatawaqqa',
  'fawaid-almasaj-alistirkha',
  'masaj-riyadi-mata-yufid',
  'inah-baad-aljalsa',
  'awwal-ziyara-li-nagm-spa',
];

export function isBlogRoute(route) {
  return route === '/blogs/' || route.startsWith('/blogs/');
}

/** Prerendered HTML routes (blog is SSR + Cloudflare cache, so excluded). */
export function expectedPrerenderedRoutes() {
  const staticAr = [
    '/',
    '/about/',
    '/contact/',
    '/book/',
    '/go/',
    '/services/',
    '/packages/',
    '/offers/',
  ];
  const staticEn = staticAr.map((p) => (p === '/' ? '/en/' : `/en${p}`));
  const details = [];
  for (const slug of SERVICE_SLUGS) {
    details.push(`/services/${slug}/`, `/en/services/${slug}/`);
  }
  for (const slug of PACKAGE_SLUGS) {
    details.push(`/packages/${slug}/`, `/en/packages/${slug}/`);
  }
  for (const slug of OFFER_SLUGS) {
    details.push(`/offers/${slug}/`, `/en/offers/${slug}/`);
  }
  return [...staticAr, ...staticEn, ...details].sort();
}

/** Indexable routes including SSR blog URLs injected into the sitemap via customPages. */
export function expectedRoutes() {
  const blogRoutes = ['/blogs/', ...BLOG_SLUGS.map((slug) => `/blogs/${slug}/`)];
  return [...expectedPrerenderedRoutes(), ...blogRoutes].sort();
}

export function isUtilityRoute(route) {
  return (
    route === '/book/' ||
    route === '/en/book/' ||
    route === '/go/' ||
    route === '/en/go/'
  );
}

export function isIndexableRoute(route) {
  return !isUtilityRoute(route);
}

export function routeToDistPath(route) {
  if (route === '/') return 'index.html';
  return `${route.replace(/^\//, '')}index.html`;
}

export async function walkHtml(dir = DIST, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) await walkHtml(p, out);
    else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/** Normalize both `about/index.html` and `about.html` into `/about/`. */
export function routeFromFile(file) {
  const rel = relative(DIST, file).replaceAll('\\', '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) {
    return `/${rel.slice(0, -'index.html'.length)}`;
  }
  if (rel.endsWith('.html')) {
    return `/${rel.slice(0, -'.html'.length)}/`;
  }
  throw new Error(`Unrecognized HTML path: ${rel}`);
}

export function attr(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

export function parseJsonLd(html) {
  const match = html.match(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (!match) return null;
  return JSON.parse(match[1]);
}

export function h1Text(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : null;
}

function assertWellFormedXml(xml, label) {
  if (!xml.trimStart().startsWith('<?xml')) {
    throw new Error(`${label} is missing an XML declaration`);
  }
  if (xml.includes('<sitemapindex') && !xml.includes('</sitemapindex>')) {
    throw new Error(`${label} sitemapindex is not closed`);
  }
  if (xml.includes('<urlset') && !xml.includes('</urlset>')) {
    throw new Error(`${label} urlset is not closed`);
  }
}

function parseUrlEntries(xml, label) {
  assertWellFormedXml(xml, label);
  if (!xml.includes('<urlset')) {
    throw new Error(`${label} is not a urlset sitemap`);
  }

  const entries = [];
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const body = block[1];
    const loc = body.match(/<loc>([^<]+)<\/loc>/)?.[1];
    if (!loc) {
      throw new Error(`${label} contains a <url> without <loc>`);
    }

    const alternates = {};
    for (const link of body.matchAll(/<xhtml:link\b([^>]*?)\s*\/?>/g)) {
      const attrs = link[1];
      const hreflang = attrs.match(/\bhreflang="([^"]+)"/)?.[1];
      const href = attrs.match(/\bhref="([^"]+)"/)?.[1];
      if (!hreflang || !href) {
        throw new Error(`${label} has an incomplete xhtml:link for ${loc}`);
      }
      alternates[hreflang] = href;
    }

    entries.push({ loc, alternates });
  }

  if (entries.length === 0) {
    throw new Error(`${label} has no <url> entries`);
  }

  return entries;
}

export async function loadSitemapEntries() {
  const index = await readFile(join(DIST, 'sitemap-index.xml'), 'utf8');
  assertWellFormedXml(index, 'sitemap-index.xml');
  if (!index.includes('<sitemapindex') || !index.includes('</sitemapindex>')) {
    throw new Error('sitemap-index.xml is not a sitemap index');
  }

  const childRefs = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (childRefs.length === 0) {
    throw new Error('sitemap-index.xml has no child sitemap locs');
  }

  const entries = [];
  for (const ref of childRefs) {
    const name = ref.split('/').pop();
    const xml = await readFile(join(DIST, name), 'utf8');
    entries.push(...parseUrlEntries(xml, name));
  }
  return entries;
}

export async function loadSitemapUrls() {
  return (await loadSitemapEntries()).map((entry) => entry.loc);
}

export async function loadAllPages() {
  const files = await walkHtml();
  const pages = [];
  for (const file of files) {
    const route = routeFromFile(file);
    const html = await readFile(file, 'utf8');
    pages.push({
      route,
      locale: route === '/en' || route === '/en/' || route.startsWith('/en/') ? 'en' : 'ar',
      html,
      file,
    });
  }
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}
