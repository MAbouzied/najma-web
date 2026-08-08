import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readDist = (path) => readFile(new URL(`../dist/client/${path}`, import.meta.url), 'utf8');
const [
  homeHtml,
  aboutHtml,
  contactHtml,
  serviceDetailHtml,
  packageDetailHtml,
  offerIndexHtml,
  offerDetailHtml,
  robotsText,
  llmsText,
  sitemapText,
  enHomeHtml,
  enAboutHtml,
  enContactHtml,
] = await Promise.all([
  readDist('index.html'),
  readDist('about/index.html'),
  readDist('contact/index.html'),
  readDist('services/massage-relaxation/index.html'),
  readDist('packages/luxury/index.html'),
  readDist('offers/index.html'),
  readDist('offers/body-polishing/index.html'),
  readDist('robots.txt'),
  readDist('llms.txt'),
  readDist('sitemap-0.xml'),
  readDist('en/index.html'),
  readDist('en/about/index.html'),
  readDist('en/contact/index.html'),
]);

const parseJsonLd = (html) => {
  const match = html.match(/<script type="application\/ld\+json" data-structured-data>([\s\S]*?)<\/script>/);
  assert.ok(match, 'expected a structured-data script');
  return JSON.parse(match[1]);
};

test('renders complete canonical and social metadata on every page', () => {
  for (const html of [homeHtml, aboutHtml, contactHtml, offerIndexHtml, offerDetailHtml]) {
    assert.match(html, /<link rel="canonical" href="[^"]+">/);
    assert.match(html, /<meta property="og:locale" content="ar_SA">/);
    assert.match(html, /<meta property="og:title" content="[^"]+">/);
    assert.match(html, /<meta property="og:description" content="[^"]+">/);
    assert.match(html, /<meta property="og:image" content="https:\/\/najma-web\.mohamed-abouzied\.workers\.dev\/assets\/og\/nagm-spa-share\.jpg">/);
    assert.match(html, /<meta property="og:image:width" content="1200">/);
    assert.match(html, /<meta property="og:image:height" content="630">/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
    assert.match(html, /<meta name="twitter:image" content="https:\/\/najma-web\.mohamed-abouzied\.workers\.dev\/assets\/og\/nagm-spa-share\.jpg">/);
    assert.match(html, /<meta name="robots" content="index, follow, max-image-preview:large">/);
    assert.match(html, /<link rel="icon" href="\/favicon\.ico" sizes="any">/);
    assert.match(html, /<link rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png">/);
    assert.match(html, /<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>/);
    assert.match(html, /fonts\.googleapis\.com\/css2\?family=Cairo/);
    assert.match(html, /<meta name="astro-view-transitions-enabled" content="true">/);
  }
});

test('links DaySpa, WebSite, and the correct page types', () => {
  const expectedPageTypes = [
    [parseJsonLd(homeHtml), 'WebPage'],
    [parseJsonLd(aboutHtml), 'AboutPage'],
    [parseJsonLd(contactHtml), 'ContactPage'],
  ];

  for (const [document, pageType] of expectedPageTypes) {
    assert.equal(document['@context'], 'https://schema.org');
    assert.ok(document['@graph'].some((node) => node['@type'] === 'DaySpa'));
    assert.ok(document['@graph'].some((node) => node['@type'] === 'WebSite'));
    assert.ok(document['@graph'].some((node) => node['@type'] === pageType));
  }
});

test('marks up visible services and FAQs with verified local details', () => {
  const homeGraph = parseJsonLd(homeHtml)['@graph'];
  const daySpa = homeGraph.find((node) => node['@type'] === 'DaySpa');
  const faqPage = homeGraph.find((node) => node['@type'] === 'FAQPage');
  const catalogs = [].concat(daySpa.hasOfferCatalog);
  const serviceCatalog = catalogs.find((catalog) => catalog.name === 'خدمات نجم سبا');
  const packagesCatalog = catalogs.find((catalog) => catalog.name === 'باقات نجم سبا');
  const offersCatalog = catalogs.find((catalog) => catalog.name === 'عروض العناية بالسيارات');

  assert.ok(serviceCatalog, 'expected services catalog');
  assert.ok(packagesCatalog, 'expected packages catalog');
  assert.ok(offersCatalog, 'expected car care offers catalog');
  assert.equal(serviceCatalog.itemListElement.length, 10);
  assert.equal(packagesCatalog.itemListElement.length, 3);
  assert.equal(offersCatalog.itemListElement.length, 4);

  for (const offer of [...serviceCatalog.itemListElement, ...offersCatalog.itemListElement]) {
    assert.equal(offer['@type'], 'Offer');
    assert.equal(offer.priceCurrency, 'SAR');
    assert.match(String(offer.price), /^\d+$/);
    assert.equal(offer.itemOffered['@type'], 'Service');
    assert.match(offer.itemOffered.provider['@id'], /#business$/);
  }

  for (const offer of offersCatalog.itemListElement) {
    assert.match(offer.url, /\/offers\/[a-z-]+\/$/);
  }

  assert.equal(faqPage.mainEntity.length, 8);
  assert.equal(faqPage.mainEntity[0].name, 'هل يجب الحجز مسبقًا؟');
  assert.match(faqPage.mainEntity[0].acceptedAnswer.text, /نوصي بالحجز المسبق/);

  for (const html of [homeHtml, aboutHtml, contactHtml]) {
    const structuredData = JSON.stringify(parseJsonLd(html));
    assert.doesNotMatch(structuredData, /"@type":"(?:Review|AggregateRating)"/);
  }
});

test('includes verified local business details in structured data', () => {
  for (const html of [homeHtml, aboutHtml, contactHtml]) {
    const structuredData = JSON.stringify(parseJsonLd(html));
    assert.match(structuredData, /"telephone":"\+966579777407"/);
    assert.match(structuredData, /"email":"info@nagmspa\.com"/);
    assert.match(structuredData, /"addressLocality":"حفر الباطن"/);
    assert.match(structuredData, /"geo"/);
    assert.match(structuredData, /"openingHoursSpecification"/);
    assert.match(structuredData, /"sameAs"/);
    assert.match(structuredData, /"hasMap"/);
  }
});

test('adds breadcrumb schema to About and Contact pages', () => {
  for (const html of [aboutHtml, contactHtml]) {
    const graph = parseJsonLd(html)['@graph'];
    const breadcrumb = graph.find((node) => node['@type'] === 'BreadcrumbList');

    assert.equal(breadcrumb.itemListElement.length, 2);
    assert.equal(breadcrumb.itemListElement[0].name, 'الرئيسية');
    assert.equal(breadcrumb.itemListElement[1].position, 2);
  }
});

test('adds nested breadcrumb schema and UI for service and package detail pages', () => {
  const serviceGraph = parseJsonLd(serviceDetailHtml)['@graph'];
  const serviceBreadcrumb = serviceGraph.find((node) => node['@type'] === 'BreadcrumbList');
  assert.equal(serviceBreadcrumb.itemListElement.length, 3);
  assert.equal(serviceBreadcrumb.itemListElement[0].name, 'الرئيسية');
  assert.equal(serviceBreadcrumb.itemListElement[1].name, 'خدماتنا');
  assert.equal(serviceBreadcrumb.itemListElement[2].name, 'مساج الاسترخاء');
  assert.match(serviceDetailHtml, /data-breadcrumbs/);
  assert.doesNotMatch(serviceDetailHtml, /العودة للخدمات/);

  const packageGraph = parseJsonLd(packageDetailHtml)['@graph'];
  const packageBreadcrumb = packageGraph.find((node) => node['@type'] === 'BreadcrumbList');
  assert.equal(packageBreadcrumb.itemListElement.length, 3);
  assert.equal(packageBreadcrumb.itemListElement[0].name, 'الرئيسية');
  assert.equal(packageBreadcrumb.itemListElement[1].name, 'باقاتنا');
  assert.equal(packageBreadcrumb.itemListElement[2].name, 'باقة الرفاهية');
  assert.match(packageDetailHtml, /data-breadcrumbs/);
  assert.doesNotMatch(packageDetailHtml, /العودة للباقات/);

  const offerGraph = parseJsonLd(offerDetailHtml)['@graph'];
  const offerBreadcrumb = offerGraph.find((node) => node['@type'] === 'BreadcrumbList');
  assert.equal(offerBreadcrumb.itemListElement.length, 3);
  assert.equal(offerBreadcrumb.itemListElement[0].name, 'الرئيسية');
  assert.equal(offerBreadcrumb.itemListElement[1].name, 'العروض');
  assert.equal(offerBreadcrumb.itemListElement[2].name, 'تلميع الهيكل');
  assert.match(offerDetailHtml, /data-breadcrumbs/);
  assert.doesNotMatch(offerDetailHtml, /العودة للعروض/);
});

const ORIGIN = 'https://najma-web.mohamed-abouzied.workers.dev';

test('emits hreflang trio (ar, en, x-default) on every Arabic page', () => {
  for (const html of [homeHtml, aboutHtml, contactHtml, offerIndexHtml, offerDetailHtml]) {
    assert.match(html, /<link rel="alternate" hreflang="ar" href="[^"]+">/);
    assert.match(html, /<link rel="alternate" hreflang="en" href="[^"]+">/);
    assert.match(html, /<link rel="alternate" hreflang="x-default" href="[^"]+">/);
  }
});

test('emits hreflang trio on English pages with correct cross-references', () => {
  for (const html of [enHomeHtml, enAboutHtml, enContactHtml]) {
    assert.match(html, /<link rel="alternate" hreflang="ar" href="[^"]+">/);
    assert.match(html, /<link rel="alternate" hreflang="en" href="[^"]+">/);
    assert.match(html, /<link rel="alternate" hreflang="x-default" href="[^"]+">/);
  }

  assert.match(enAboutHtml, new RegExp(`hreflang="ar" href="${ORIGIN}/about/?"`));
  assert.match(enAboutHtml, new RegExp(`hreflang="en" href="${ORIGIN}/en/about/?"`));
  assert.match(enAboutHtml, new RegExp(`hreflang="x-default" href="${ORIGIN}/about/?"`));
});

test('English pages have lang="en" and og:locale en_US', () => {
  for (const html of [enHomeHtml, enAboutHtml, enContactHtml]) {
    assert.match(html, /<html lang="en" dir="ltr">/);
    assert.match(html, /<meta property="og:locale" content="en_US">/);
    assert.match(html, /<meta property="og:locale:alternate" content="ar_SA">/);
  }
});

test('Arabic pages have og:locale ar_SA with en_US alternate', () => {
  for (const html of [homeHtml, aboutHtml, contactHtml]) {
    assert.match(html, /<meta property="og:locale" content="ar_SA">/);
    assert.match(html, /<meta property="og:locale:alternate" content="en_US">/);
  }
});

test('English pages have locale-correct og:site_name and title', () => {
  assert.match(enHomeHtml, /<meta property="og:site_name" content="Nagm Spa">/);
  assert.match(enAboutHtml, /<meta property="og:site_name" content="Nagm Spa">/);
  assert.match(enContactHtml, /<meta property="og:site_name" content="Nagm Spa">/);

  assert.match(enHomeHtml, /Nagm Spa/);
  assert.match(enAboutHtml, /About Us - Nagm Spa/);
  assert.match(enContactHtml, /Contact Us - Nagm Spa/);
});

test('canonical on English pages points to the English URL', () => {
  assert.match(enHomeHtml, new RegExp(`<link rel="canonical" href="${ORIGIN}/en/"`));
  assert.match(enAboutHtml, new RegExp(`<link rel="canonical" href="${ORIGIN}/en/about/"`));
  assert.match(enContactHtml, new RegExp(`<link rel="canonical" href="${ORIGIN}/en/contact/"`));
});

test('sitemap includes English locale URLs', () => {
  assert.match(sitemapText, /\/en\//);
});

test('serves crawl and LLM discovery files without placeholder origins', () => {
  assert.match(robotsText, /^User-agent: \*/);
  assert.match(robotsText, /Allow: \//);
  assert.match(robotsText, /Disallow: \/api\//);
  assert.match(robotsText, /Sitemap: https:\/\/najma-web\.mohamed-abouzied\.workers\.dev\/sitemap-index\.xml/);
  assert.doesNotMatch(robotsText, /localhost|example\.com/);

  assert.match(llmsText, /^# نجم سبا/);
  assert.match(llmsText, /## الصفحات الرئيسية/);
  assert.match(llmsText, /\[من نحن\]\(https:\/\/najma-web\.mohamed-abouzied\.workers\.dev\/about\/\)/);
  assert.match(llmsText, /\[Services\]\(https:\/\/najma-web\.mohamed-abouzied\.workers\.dev\/en\/services\/\)/);
  assert.match(llmsText, /\/#faq/);
  assert.match(llmsText, /\/en\/#faq/);
  assert.match(llmsText, /## العروض/);
  assert.match(llmsText, /\/offers\/body-polishing\//);
  assert.match(llmsText, /\/en\/offers\/body-polishing\//);
  assert.doesNotMatch(llmsText, /localhost|example\.com/);
  assert.doesNotMatch(llmsText, /\/book\/|\/go\/|\/api\//);

  assert.match(sitemapText, /\/offers\//);
  assert.match(sitemapText, /\/offers\/exterior-wash\//);
  assert.match(sitemapText, /\/offers\/engine-cleaning\//);
  assert.match(sitemapText, /\/offers\/body-polishing\//);
  assert.doesNotMatch(sitemapText, /\/book\/|\/go\/|\/api\//);
});

test('marks booking and link-hub pages as noindex', async () => {
  const [bookHtml, enBookHtml, goHtml, enGoHtml] = await Promise.all([
    readDist('book/index.html'),
    readDist('en/book/index.html'),
    readDist('go/index.html'),
    readDist('en/go/index.html'),
  ]);

  for (const html of [bookHtml, enBookHtml, goHtml, enGoHtml]) {
    assert.match(html, /<meta name="robots" content="noindex, follow">/);
  }
});
