import assert from 'node:assert/strict';
import test from 'node:test';
import {
  h1Text,
  isIndexableRoute,
  loadAllPages,
} from './helpers/seo-routes.mjs';

const pages = await loadAllPages();
const indexable = pages.filter((p) => isIndexableRoute(p.route));

test('every indexable page has exactly one non-empty H1', () => {
  for (const { route, html } of indexable) {
    const h1Count = (html.match(/<h1\b/gi) || []).length;
    assert.equal(h1Count, 1, route);
    const text = h1Text(html);
    assert.ok(text && text.length > 0, `empty H1 on ${route}`);
  }
});

test('indexable pages expose H2 section structure after the H1', () => {
  for (const { route, html } of indexable) {
    const h1Index = html.search(/<h1\b/i);
    const h2Index = html.search(/<h2\b/i);
    assert.ok(h1Index >= 0, `missing H1 on ${route}`);
    assert.ok(h2Index >= 0, `missing H2 on ${route}`);
    assert.ok(h2Index > h1Index, `H2 should follow H1 on ${route}`);
  }
});

test('locale-correct primary headings on key pages', () => {
  const arHome = pages.find((p) => p.route === '/');
  const enHome = pages.find((p) => p.route === '/en/');
  assert.match(h1Text(arHome.html), /استرخ/);
  assert.match(h1Text(enHome.html), /Relax|Restore|Unwind/i);
  assert.doesNotMatch(h1Text(enHome.html), /[\u0600-\u06FF]/);
});

test('breadcrumb navigation is accessible and locale-aware', () => {
  const arAbout = pages.find((p) => p.route === '/about/');
  const enAbout = pages.find((p) => p.route === '/en/about/');
  assert.match(arAbout.html, /aria-label="مسار التنقل"/);
  assert.match(arAbout.html, /dir="rtl"/);
  assert.match(enAbout.html, /aria-label="Breadcrumb"/);
  assert.match(enAbout.html, /dir="ltr"/);
});

test('contact forms expose labels in the page language', () => {
  const arContact = pages.find((p) => p.route === '/contact/');
  const enContact = pages.find((p) => p.route === '/en/contact/');
  assert.match(arContact.html, /<label[^>]*>[\s\S]*?الاسم|رقم|الجوال|الرسالة/);
  assert.match(enContact.html, /<label[^>]*>[\s\S]*?(Name|Phone|Message|Email)/i);
});

test('split-media and section headings use locale-aware logical alignment', () => {
  const arAbout = pages.find((p) => p.route === '/about/');
  const enAbout = pages.find((p) => p.route === '/en/about/');

  assert.doesNotMatch(enAbout.html, /items-start text-right/);
  assert.doesNotMatch(enAbout.html, /\btext-right\b/);

  const enMission = enAbout.html.match(/data-split-media[\s\S]*?<\/section>/)?.[0] ?? '';
  const arMission = arAbout.html.match(/data-split-media[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.match(enMission, /dir="ltr"/);
  assert.match(enMission, /text-start/);
  assert.match(arMission, /dir="rtl"/);
  assert.match(arMission, /text-start/);
});

test('centered home sections keep intentional text-center alignment', () => {
  const enHome = pages.find((p) => p.route === '/en/');
  assert.match(enHome.html, /items-center text-center/);
  assert.match(enHome.html, /data-home-intro-shell[\s\S]*?text-center/);
});
