import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const formHtml = await readFile(new URL('../dist/client/form/index.html', import.meta.url), 'utf8');

test('contact form landing omits chrome and keeps a small breadcrumb title', () => {
  assert.doesNotMatch(formHtml, /data-site-header/);
  assert.doesNotMatch(formHtml, /data-site-footer/);
  assert.doesNotMatch(formHtml, /data-floating-contact/);
  assert.match(formHtml, /data-form-landing-crumb/);
  assert.match(formHtml, /<h1[^>]*>[\s\S]*اتصل بنا[\s\S]*<\/h1>/);
  assert.match(formHtml, /id="contact-form"/);
  assert.match(formHtml, /id="branches"/);
  assert.match(formHtml, /حي المصيف/);
  assert.match(formHtml, /٢٤ ساعة|24/);
  assert.match(formHtml, /dir="ltr"[^>]*>\+?966|dir="ltr">\+966579777407/);
  assert.match(formHtml, /data-language-switcher/);
  assert.match(formHtml, /data-theme-switcher/);
  assert.match(formHtml, /hreflang="en"/);
  assert.doesNotMatch(formHtml, /name="email"/);
  assert.match(formHtml, /name="message"/);
  assert.doesNotMatch(formHtml, /required[^>]*name="message"|name="message"[^>]*required/);
  assert.match(formHtml, /noindex/);
});
