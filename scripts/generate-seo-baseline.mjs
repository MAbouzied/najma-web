import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist', 'client');
const ORIGIN = 'https://nagmspa.com';

const SERVICE_SLUGS = [
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
const PACKAGE_SLUGS = ['groom', 'luxury', 'gift'];
const OFFER_SLUGS = [
  'recovery',
  'relaxation',
  'signature',
  'care',
  'elegance',
  'prosperity',
  'royal',
  'golden',
];

function expectedRoutes() {
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

async function walkHtml(dir, out = []) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) await walkHtml(p, out);
    else if (ent.name === 'index.html') out.push(p);
  }
  return out;
}

function routeFromFile(file) {
  const rel = relative(DIST, file).replaceAll('\\', '/');
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/\/index\.html$/, '/')}`;
}

function attr(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

function h1(html) {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : null;
}

function schemaTypes(html) {
  const m = html.match(
    /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (!m) return [];
  try {
    const doc = JSON.parse(m[1]);
    const graph = doc['@graph'] || [doc];
    return [
      ...new Set(
        graph
          .map((n) =>
            Array.isArray(n['@type']) ? n['@type'].join(',') : n['@type'],
          )
          .filter(Boolean),
      ),
    ];
  } catch {
    return ['PARSE_ERROR'];
  }
}

function isUtilityRoute(route) {
  return (
    route === '/book/' ||
    route === '/en/book/' ||
    route === '/go/' ||
    route === '/en/go/'
  );
}

const sitemapPath = existsSync(join(DIST, 'sitemap-0.xml'))
  ? join(DIST, 'sitemap-0.xml')
  : join(DIST, 'sitemap-index.xml');
const sitemapText = existsSync(sitemapPath)
  ? await readFile(sitemapPath, 'utf8')
  : '';
let sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (m) => m[1],
);

if (sitemapUrls.some((u) => u.includes('sitemap-0.xml'))) {
  const child = await readFile(join(DIST, 'sitemap-0.xml'), 'utf8');
  sitemapUrls = [...child.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const sitemapPaths = new Set(
  sitemapUrls.map((u) => {
    try {
      const p = new URL(u).pathname;
      return p.endsWith('/') || p.includes('.') ? p : `${p}/`;
    } catch {
      return u;
    }
  }),
);

const files = await walkHtml(DIST);
const generated = files.map(routeFromFile).sort();
const expected = expectedRoutes();
const expectedSet = new Set(expected);
const generatedSet = new Set(generated);

const rows = [];
for (const file of files) {
  const route = routeFromFile(file);
  const html = await readFile(file, 'utf8');
  const locale = route === '/en' || route.startsWith('/en/') ? 'en' : 'ar';
  const title = attr(html, /<title>([^<]*)<\/title>/);
  const description = attr(
    html,
    /<meta name="description" content="([^"]*)">/,
  );
  const canonical = attr(html, /<link rel="canonical" href="([^"]+)">/);
  const robots = attr(html, /<meta name="robots" content="([^"]*)">/);
  const ogUrl = attr(html, /<meta property="og:url" content="([^"]+)">/);
  const hreflang = [
    ...html.matchAll(
      /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g,
    ),
  ].map((m) => ({ lang: m[1], href: m[2] }));

  rows.push({
    route,
    locale,
    status: 200,
    title,
    description,
    canonical,
    robots,
    h1: h1(html),
    schemaTypes: schemaTypes(html),
    inSitemap:
      sitemapPaths.has(route) ||
      sitemapPaths.has(route.replace(/\/$/, '')) ||
      sitemapUrls.some(
        (u) => u.endsWith(route) || u.endsWith(route.replace(/\/$/, '')),
      ),
    ogUrl,
    ogUrlMatchesCanonical: ogUrl === canonical,
    hreflang,
    expected: expectedSet.has(route),
  });
}

rows.sort((a, b) => a.route.localeCompare(b.route));

const missing = expected.filter((r) => !generatedSet.has(r));
const unexpected = generated.filter((r) => !expectedSet.has(r));

const missingCounterparts = [];
for (const r of expected) {
  if (r.startsWith('/en/')) {
    const ar = r.slice(3);
    if (!generatedSet.has(ar)) {
      missingCounterparts.push({ route: r, missingCounterpart: ar });
    }
  } else {
    const en = r === '/' ? '/en/' : `/en${r}`;
    if (!generatedSet.has(en)) {
      missingCounterparts.push({ route: r, missingCounterpart: en });
    }
  }
}

const issues = [];
for (const row of rows) {
  if (!row.title) issues.push({ route: row.route, issue: 'missing title' });
  if (!row.description) {
    issues.push({ route: row.route, issue: 'missing description' });
  }
  if (!row.canonical) {
    issues.push({ route: row.route, issue: 'missing canonical' });
  }
  if (!row.h1) issues.push({ route: row.route, issue: 'missing h1' });
  if (row.canonical && !row.canonical.startsWith('https://')) {
    issues.push({ route: row.route, issue: 'canonical not https' });
  }
  if (!row.ogUrlMatchesCanonical) {
    issues.push({ route: row.route, issue: 'og:url != canonical' });
  }
  const utility = isUtilityRoute(row.route);
  if (utility && row.robots && !row.robots.includes('noindex')) {
    issues.push({
      route: row.route,
      issue: 'utility page should be noindex',
    });
  }
  if (!utility && row.robots && row.robots.includes('noindex')) {
    issues.push({ route: row.route, issue: 'content page is noindex' });
  }
  if (!utility && !row.inSitemap) {
    issues.push({
      route: row.route,
      issue: 'indexable route missing from sitemap',
    });
  }
  if (utility && row.inSitemap) {
    issues.push({
      route: row.route,
      issue: 'noindex candidate present in sitemap',
    });
  }
  if (row.hreflang.length !== 3) {
    issues.push({
      route: row.route,
      issue: `expected 3 hreflang links, found ${row.hreflang.length}`,
    });
  }
}

const titleByLocale = { ar: new Map(), en: new Map() };
for (const row of rows) {
  const map = titleByLocale[row.locale];
  if (!map.has(row.title)) map.set(row.title, []);
  map.get(row.title).push(row.route);
}
const duplicateTitles = [];
for (const locale of ['ar', 'en']) {
  for (const [title, routes] of titleByLocale[locale]) {
    if (routes.length > 1) duplicateTitles.push({ locale, title, routes });
  }
}

const issueCounts = issues.reduce((acc, i) => {
  acc[i.issue] = (acc[i.issue] || 0) + 1;
  return acc;
}, {});

const manifest = {
  generatedAt: new Date().toISOString(),
  origin: ORIGIN,
  counts: {
    expected: expected.length,
    generated: generated.length,
    sitemapUrls: sitemapUrls.length,
    issues: issues.length,
  },
  expectedRoutes: expected,
  generatedRoutes: generated,
  missingRoutes: missing,
  unexpectedRoutes: unexpected,
  missingCounterparts,
  duplicateTitles,
  sitemapUrls,
  issueCounts,
  issues,
  routes: rows,
};

const outDir = join(ROOT, 'seo-baseline');
await mkdir(outDir, { recursive: true });
await writeFile(
  join(outDir, 'route-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

const md = [];
md.push('# SEO Route Manifest Baseline');
md.push('');
md.push(`Generated: ${manifest.generatedAt}`);
md.push(`Origin: ${ORIGIN}`);
md.push('');
md.push('## Summary');
md.push('');
md.push('| Metric | Count |');
md.push('|---|---:|');
md.push(`| Expected routes | ${expected.length} |`);
md.push(`| Generated HTML routes | ${generated.length} |`);
md.push(`| Sitemap URLs | ${sitemapUrls.length} |`);
md.push(`| Missing routes | ${missing.length} |`);
md.push(`| Unexpected routes | ${unexpected.length} |`);
md.push(
  `| Missing bilingual counterparts | ${missingCounterparts.length} |`,
);
md.push(`| Duplicate titles (per locale) | ${duplicateTitles.length} |`);
md.push(`| Detected issues | ${issues.length} |`);
md.push('');

md.push('## Issue counts');
md.push('');
for (const [issue, count] of Object.entries(issueCounts).sort(
  (a, b) => b[1] - a[1],
)) {
  md.push(`- ${issue}: **${count}**`);
}
md.push('');

if (missing.length) {
  md.push('## Missing routes');
  md.push('');
  for (const r of missing) md.push(`- \`${r}\``);
  md.push('');
}
if (unexpected.length) {
  md.push('## Unexpected generated pages');
  md.push('');
  for (const r of unexpected) md.push(`- \`${r}\``);
  md.push('');
}
if (duplicateTitles.length) {
  md.push('## Duplicate titles');
  md.push('');
  for (const d of duplicateTitles) {
    md.push(
      `- **${d.locale}**: "${d.title}" → ${d.routes.map((r) => `\`${r}\``).join(', ')}`,
    );
  }
  md.push('');
}

md.push('## Route matrix');
md.push('');
md.push(
  '| Route | Locale | Robots | Sitemap | Title | H1 | Schema | Canonical |',
);
md.push('|---|---|---|---|---|---|---|---|');
for (const r of rows) {
  const safe = (v) =>
    String(v ?? '—')
      .replaceAll('|', '\\|')
      .replaceAll('\n', ' ')
      .slice(0, 80);
  md.push(
    `| \`${r.route}\` | ${r.locale} | \`${safe(r.robots)}\` | ${r.inSitemap ? 'yes' : 'no'} | ${safe(r.title)} | ${safe(r.h1)} | ${safe(r.schemaTypes.join(', '))} | \`${safe(r.canonical)}\` |`,
  );
}

await writeFile(join(outDir, 'ROUTE-MANIFEST.md'), `${md.join('\n')}\n`);

console.log(
  JSON.stringify(
    {
      counts: manifest.counts,
      missing,
      unexpected,
      missingCounterpartsCount: missingCounterparts.length,
      duplicateTitles: duplicateTitles.length,
      issueCounts,
    },
    null,
    2,
  ),
);
