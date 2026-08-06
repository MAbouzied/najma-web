import assert from 'node:assert/strict';
import test from 'node:test';
import { ui } from '../src/i18n/ui.ts';
import {
  ORIGIN,
  attr,
  loadAllPages,
} from './helpers/seo-routes.mjs';

const pages = await loadAllPages();

test('translation keys exist in both Arabic and English with non-empty values', () => {
  const arKeys = Object.keys(ui.ar).sort();
  const enKeys = Object.keys(ui.en).sort();
  assert.deepEqual(enKeys, arKeys);
  for (const key of arKeys) {
    assert.ok(ui.ar[key].trim(), `empty ar.${key}`);
    assert.ok(ui.en[key].trim(), `empty en.${key}`);
  }
});

test('every page emits reciprocal hreflang alternates', () => {
  for (const { route, html, locale } of pages) {
    const links = [
      ...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/g),
    ].map((m) => ({ lang: m[1], href: m[2] }));
    const byLang = Object.fromEntries(links.map((l) => [l.lang, l.href]));
    const isBlog = route === '/blogs/' || route.startsWith('/blogs/');

    if (isBlog) {
      assert.equal(links.length, 2, route);
      assert.ok(byLang.ar && byLang['x-default'] && !byLang.en, route);
      assert.equal(byLang.ar, `${ORIGIN}${route}`);
      assert.equal(byLang['x-default'], byLang.ar);
      assert.equal(byLang.ar, attr(html, /<link rel="canonical" href="([^"]+)">/));
      continue;
    }

    assert.equal(links.length, 3, route);
    assert.ok(byLang.ar && byLang.en && byLang['x-default'], route);

    const arPath = locale === 'en' ? route.replace(/^\/en/, '') || '/' : route;
    const enPath = locale === 'en' ? route : route === '/' ? '/en/' : `/en${route}`;

    assert.equal(byLang.ar, `${ORIGIN}${arPath}`);
    assert.equal(byLang.en, `${ORIGIN}${enPath}`);
    assert.equal(byLang['x-default'], byLang.ar);
    assert.equal(byLang[locale === 'en' ? 'en' : 'ar'], attr(html, /<link rel="canonical" href="([^"]+)">/));
  }
});

test('documents use correct lang and dir', () => {
  for (const { route, html, locale } of pages) {
    if (locale === 'en') {
      assert.match(html, /<html lang="en" dir="ltr">/, route);
    } else {
      assert.match(html, /<html lang="ar" dir="rtl">/, route);
    }
  }
});

test('English contact form and breadcrumbs are localized', async () => {
  const enContact = pages.find((p) => p.route === '/en/contact/');
  assert.ok(enContact);
  assert.match(enContact.html, /aria-label="Breadcrumb"/);
  assert.match(enContact.html, /dir="ltr"/);
  assert.match(enContact.html, /Send Your Message|Message Us/);
  assert.match(enContact.html, /Send via WhatsApp/);
  assert.doesNotMatch(enContact.html, /aria-label="مسار التنقل"/);
  assert.doesNotMatch(enContact.html, /إرسال عبر واتساب/);
});

test('English pages avoid unintended Arabic UI chrome', () => {
  for (const { route, html } of pages.filter((p) => p.locale === 'en')) {
    assert.doesNotMatch(html, /aria-label="مسار التنقل"/, route);
    assert.doesNotMatch(html, /بيانات الترخيص الرسمية/, route);
    assert.match(html, /Official Licensing Information|Commercial Register|Nagm Spa/);
  }
});
