import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ORIGIN,
  isIndexableRoute,
  loadAllPages,
  parseJsonLd,
} from './helpers/seo-routes.mjs';

const pages = await loadAllPages();
const indexable = pages.filter((p) => isIndexableRoute(p.route));

test('every indexable page has parseable JSON-LD', () => {
  for (const { route, html } of indexable) {
    const doc = parseJsonLd(html);
    assert.ok(doc, route);
    assert.equal(doc['@context'], 'https://schema.org');
    assert.ok(Array.isArray(doc['@graph']));
  }
});

test('schema language, page URL, and locale-specific FAQ IDs are correct', () => {
  for (const { route, html, locale } of indexable) {
    const graph = parseJsonLd(html)['@graph'];
    const page = graph.find((n) =>
      ['WebPage', 'AboutPage', 'ContactPage'].includes(n['@type']),
    );
    assert.ok(page, route);
    assert.equal(page.inLanguage, locale === 'en' ? 'en-US' : 'ar-SA');
    assert.equal(page.url, `${ORIGIN}${route}`, route);

    const faq = graph.find((n) => n['@type'] === 'FAQPage');
    if (faq) {
      if (locale === 'en') {
        assert.match(faq['@id'], /\/en\/#faq$/);
        assert.match(faq.name, /Frequently asked questions/i);
        assert.doesNotMatch(JSON.stringify(faq), /الأسئلة الشائعة/);
      } else {
        assert.match(faq['@id'], /\/#faq$/);
        assert.match(faq.name, /الأسئلة الشائعة/);
      }
    }

    const country = JSON.stringify(graph);
    if (locale === 'en') {
      assert.match(country, /Saudi Arabia/);
      assert.doesNotMatch(country, /المملكة العربية السعودية/);
    } else {
      assert.match(country, /المملكة العربية السعودية/);
    }
  }
});

test('service, package, and offer details expose Service and Offer entities', () => {
  const servicePages = [
    pages.find((p) => p.route === '/services/massage-relaxation/'),
    pages.find((p) => p.route === '/en/services/massage-relaxation/'),
  ];
  const pricedPages = [
    pages.find((p) => p.route === '/packages/luxury/'),
    pages.find((p) => p.route === '/en/packages/luxury/'),
    pages.find((p) => p.route === '/offers/signature/'),
    pages.find((p) => p.route === '/en/offers/signature/'),
  ];

  for (const page of servicePages) {
    const graph = parseJsonLd(page.html)['@graph'];
    const service = graph.find((n) => n['@type'] === 'Service');
    assert.ok(service, page.route);
    assert.ok(service.name);
    assert.ok(service.url.includes(page.route));
    // PDF prices treatments inside offers/packages only — no standalone SAR Offer.
    assert.equal(graph.find((n) => n['@type'] === 'Offer'), undefined);
    if (page.locale === 'en') {
      assert.match(service.url, /\/en\//);
      assert.doesNotMatch(service.name, /[\u0600-\u06FF]/);
    }
  }

  for (const page of pricedPages) {
    const graph = parseJsonLd(page.html)['@graph'];
    const service = graph.find((n) => n['@type'] === 'Service');
    const offer = graph.find((n) => n['@type'] === 'Offer');
    assert.ok(service, page.route);
    assert.ok(offer, page.route);
    assert.ok(service.name);
    assert.ok(service.url.includes(page.route));
    assert.equal(offer.priceCurrency, 'SAR');
    assert.match(String(offer.price), /^\d+$/);
    if (page.locale === 'en') {
      assert.match(service.url, /\/en\//);
      assert.doesNotMatch(service.name, /[\u0600-\u06FF]/);
    }
  }
});

test('does not invent reviews or ratings', () => {
  for (const { route, html } of indexable) {
    const structured = JSON.stringify(parseJsonLd(html));
    assert.doesNotMatch(structured, /"@type":"(?:Review|AggregateRating)"/, route);
  }
});

test('English catalogs use English names and English URLs', () => {
  const enHome = pages.find((p) => p.route === '/en/');
  const daySpa = parseJsonLd(enHome.html)['@graph'].find((n) => n['@type'] === 'DaySpa');
  assert.equal(daySpa['@id'], `${ORIGIN}/#business`);
  const catalogs = [].concat(daySpa.hasOfferCatalog);
  assert.ok(catalogs.some((c) => c.name === 'Nagm Spa Services'));
  assert.ok(catalogs.some((c) => c.name === 'Nagm Spa Packages'));
  assert.ok(catalogs.some((c) => c.name === 'Nagm Spa Special Offers'));
  for (const catalog of catalogs) {
    for (const item of catalog.itemListElement) {
      assert.match(item.url, /\/en\//);
      assert.match(item['@id'], /\/en\/(?:services|packages|offers)\/[^/#]+\/#offer$/);
      assert.match(item.itemOffered['@id'], /\/en\/(?:services|packages|offers)\/[^/#]+\/#service$/);
      assert.doesNotMatch(item.itemOffered.name, /[\u0600-\u06FF]/);
    }
  }
});

test('Arabic and English DaySpa share one locale-neutral business id', () => {
  const arHome = pages.find((p) => p.route === '/');
  const enHome = pages.find((p) => p.route === '/en/');
  const arBusiness = parseJsonLd(arHome.html)['@graph'].find((n) => n['@type'] === 'DaySpa');
  const enBusiness = parseJsonLd(enHome.html)['@graph'].find((n) => n['@type'] === 'DaySpa');
  assert.equal(arBusiness['@id'], `${ORIGIN}/#business`);
  assert.equal(enBusiness['@id'], `${ORIGIN}/#business`);
});
