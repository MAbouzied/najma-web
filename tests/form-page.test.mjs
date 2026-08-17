import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const landingSource = await readFile(
  new URL('../src/views/FormLandingPage.astro', import.meta.url),
  'utf8',
);
const actionsSource = await readFile(
  new URL('../src/components/FormActions.astro', import.meta.url),
  'utf8',
);
const formHtml = await readFile(new URL('../dist/client/form/index.html', import.meta.url), 'utf8');

test('form landing uses WhatsApp, call, location, and offers actions', () => {
  assert.match(landingSource, /FormActions/);
  assert.doesNotMatch(landingSource, /ContactForm/);
  assert.match(actionsSource, /data-form-actions/);
  assert.match(actionsSource, /buildGeneralContactUrl/);
  assert.match(actionsSource, /buildCallHref/);
  assert.match(actionsSource, /MAPS_HREF/);
  assert.match(actionsSource, /localePath\('\/offers\/'/);
  assert.doesNotMatch(actionsSource, /buildOffersContactUrl/);
});

test('contact form landing omits chrome and keeps a small breadcrumb title', () => {
  assert.doesNotMatch(formHtml, /data-site-header/);
  assert.doesNotMatch(formHtml, /data-site-footer/);
  assert.doesNotMatch(formHtml, /data-floating-contact/);
  assert.match(formHtml, /data-form-landing-crumb/);
  assert.match(formHtml, /<h1[^>]*>[\s\S]*اتصل بنا[\s\S]*<\/h1>/);
  assert.match(formHtml, /data-form-actions/);
  assert.doesNotMatch(formHtml, /id="contact-form"/);
  assert.match(formHtml, /id="branches"/);
  assert.match(formHtml, /حي المصيف/);
  assert.match(formHtml, /٢٤ ساعة|24/);
  assert.match(formHtml, /dir="ltr"[^>]*>\+?966|dir="ltr">\+966579777407/);
  assert.match(formHtml, /data-language-switcher/);
  assert.doesNotMatch(formHtml, /data-theme-switcher/);
  assert.match(formHtml, /hreflang="en"/);
  assert.doesNotMatch(formHtml, /name="email"/);
  assert.doesNotMatch(formHtml, /name="message"/);
  assert.match(formHtml, /noindex/);
  assert.match(formHtml, /العروض/);
  assert.match(formHtml, /api\.whatsapp\.com|wa\.me/);
  assert.match(formHtml, /tel:\+?966/);
  assert.match(formHtml, /maps\.app\.goo\.gl/);
  assert.match(formHtml, /href="\/offers\/"/);
});
