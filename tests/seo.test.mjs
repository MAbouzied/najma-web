import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readDist = (path) => readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const [homeHtml, aboutHtml, contactHtml, robotsText, llmsText] = await Promise.all([
  readDist('index.html'),
  readDist('about/index.html'),
  readDist('contact/index.html'),
  readDist('robots.txt'),
  readDist('llms.txt'),
]);

const parseJsonLd = (html) => {
  const match = html.match(/<script type="application\/ld\+json" data-structured-data>([\s\S]*?)<\/script>/);
  assert.ok(match, 'expected a structured-data script');
  return JSON.parse(match[1]);
};

test('renders complete canonical and social metadata on every page', () => {
  for (const html of [homeHtml, aboutHtml, contactHtml]) {
    assert.match(html, /<link rel="canonical" href="[^"]+">/);
    assert.match(html, /<meta property="og:locale" content="ar_SA">/);
    assert.match(html, /<meta property="og:title" content="[^"]+">/);
    assert.match(html, /<meta property="og:description" content="[^"]+">/);
    assert.match(html, /<meta property="og:image" content="https:\/\/nagmspa\.com\/assets\/og\/nagm-spa-share\.jpg">/);
    assert.match(html, /<meta property="og:image:width" content="1200">/);
    assert.match(html, /<meta property="og:image:height" content="630">/);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
    assert.match(html, /<meta name="twitter:image" content="https:\/\/nagmspa\.com\/assets\/og\/nagm-spa-share\.jpg">/);
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

  assert.equal(daySpa.hasOfferCatalog.itemListElement.length, 9);
  for (const offer of daySpa.hasOfferCatalog.itemListElement) {
    assert.equal(offer['@type'], 'Offer');
    assert.equal(offer.priceCurrency, 'SAR');
    assert.equal(offer.itemOffered['@type'], 'Service');
    assert.match(offer.itemOffered.provider['@id'], /#business$/);
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
    assert.match(structuredData, /"telephone":"\+966542030018"/);
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

test('serves crawl and LLM discovery files without placeholder origins', () => {
  assert.match(robotsText, /^User-agent: \*/);
  assert.match(robotsText, /Allow: \//);
  assert.match(robotsText, /Sitemap: https:\/\/nagmspa\.com\/sitemap-index\.xml/);
  assert.doesNotMatch(robotsText, /localhost|example\.com/);

  assert.match(llmsText, /^# نجم سبا/);
  assert.match(llmsText, /## الصفحات الرئيسية/);
  assert.match(llmsText, /\[من نحن\]\(https:\/\/nagmspa\.com\/about\/\)/);
  assert.match(llmsText, /\[الأسئلة الشائعة\]\(https:\/\/nagmspa\.com\/#faq\)/);
  assert.doesNotMatch(llmsText, /localhost|example\.com/);
});
