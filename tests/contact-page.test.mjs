import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const contactHtml = await readFile(
  new URL('../dist/client/contact/index.html', import.meta.url),
  'utf8',
);

test('renders all contact methods from the real website', () => {
  for (const label of ['الهاتف', 'واتساب', 'البريد الإلكتروني', 'ساعات العمل']) {
    assert.match(contactHtml, new RegExp(label));
  }
});

test('does not render legacy phone numbers', () => {
  assert.doesNotMatch(contactHtml, /201007995921/);
  assert.doesNotMatch(contactHtml, /0542030018/);
});

test('renders real phone, call link, and email', () => {
  assert.match(contactHtml, /\+966579777407/);
  assert.match(contactHtml, /tel:\+966579777407/);
  assert.match(contactHtml, /info@nagmspa\.com/);
});

test('renders the single real branch in Al-Musayf', () => {
  assert.match(contactHtml, /حفر الباطن — حي المصيف/);
  assert.match(contactHtml, /٢٤ ساعة/);
});

test('does not render fake branches', () => {
  assert.doesNotMatch(contactHtml, /فرع الرياض/);
  assert.doesNotMatch(contactHtml, /فرع جدة/);
  assert.doesNotMatch(contactHtml, /فرع الخبر/);
  assert.doesNotMatch(contactHtml, /المحمدية/);
});

test('uses committed assets instead of emoji or remote assets', () => {
  assert.doesNotMatch(contactHtml, /📞|✉️|📍/u);
  assert.doesNotMatch(contactHtml, /figma\.com\/api\/mcp\/asset/);
  assert.match(contactHtml, /\/assets\/icons\/phone\.svg/);
  assert.match(contactHtml, /\/assets\/nagm-logo\./);
  assert.match(contactHtml, /\/assets\/contact-cta\./);
});

test('includes navigation and footer', () => {
  for (const label of ['الرئيسية', 'من نحن', 'خدماتنا', 'اتصل بنا']) {
    assert.match(contactHtml, new RegExp(label));
  }
  assert.match(contactHtml, /<h2[^>]*>خدماتنا<\/h2>/);
  assert.match(contactHtml, /<h2[^>]*>تواصل معنا<\/h2>/);
});

test('renders the header and hero as one solid-color section', () => {
  assert.match(contactHtml, /data-hero-shell[^>]*class="[^"]*bg-bg-hero[^"]*"[^>]*>[\s\S]*?<header[\s\S]*?<\/header>[\s\S]*?<section[^>]*data-hero-content/);
  assert.doesNotMatch(contactHtml, /radial-gradient/);
});

test('uses the gold icon variants in the footer contact details', () => {
  assert.match(
    contactHtml,
    /<footer[\s\S]*?\/assets\/icons\/branch-phone\.svg[\s\S]*?\/assets\/icons\/hours\.svg[\s\S]*?<\/footer>/,
  );
});

test('gives the Arabic hero title enough line height to avoid glyph clipping', () => {
  assert.match(contactHtml, /<h1[^>]*data-hero-title[^>]*leading-\[1\.25\][^>]*py-2/);
});

test('wires GTM events on contact methods and the submit form', () => {
  assert.doesNotMatch(contactHtml, /name="gtm-container-id"/);
  assert.doesNotMatch(contactHtml, /gtag\/js\?id=/);
  assert.match(contactHtml, /data-gtm-event="contact_whatsapp"/);
  assert.match(contactHtml, /data-gtm-event="contact_call"/);
  assert.match(contactHtml, /data-gtm-event="contact_email"/);
  assert.match(contactHtml, /data-gtm-event="contact_form_submit"/);
});
