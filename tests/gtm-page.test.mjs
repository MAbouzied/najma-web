import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [homeHtml, contactHtml, enContactHtml, goHtml, adminLayout] = await Promise.all([
  readFile(new URL('../dist/client/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/client/contact/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/client/en/contact/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/client/go/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../src/layouts/AdminLayout.astro', import.meta.url), 'utf8'),
]);

const GA_ID = 'G-KKSXRY8MSN';
const ADS_ID = 'AW-18495815386';
const CONVERSION_SEND_TO = 'AW-18495815386/DmRmCIfvx5QdENr9vvNE';

test('loads the Google tag and Ads config on public pages', () => {
  for (const html of [homeHtml, contactHtml, enContactHtml, goHtml]) {
    assert.match(html, /name="gtm-container-id"/);
    assert.match(html, new RegExp(`content="${GA_ID}"`));
    assert.match(html, /name="google-ads-id"/);
    assert.match(html, new RegExp(`content="${ADS_ID}"`));
    assert.match(html, /googletagmanager\.com\/gtag\/js\?id=/);
    assert.match(html, new RegExp(`const gtmId = "${GA_ID}"`));
    assert.match(html, /gtag\('config', gtmId\)/);
    assert.match(html, /gtag\('config', configIds\[i\]\)/);
    assert.match(html, new RegExp(`const configIds = \\["${ADS_ID}"\\]`));
  }
  assert.doesNotMatch(homeHtml, /googletagmanager\.com\/ns\.html\?id=/);
  assert.match(homeHtml, /const conversionSendTo = ""/);
  assert.match(goHtml, /const conversionSendTo = ""/);
});

test('fires the contact conversion only on the contact pages', () => {
  for (const html of [contactHtml, enContactHtml]) {
    assert.match(html, /gtag\('event', 'conversion', \{ send_to: conversionSendTo \}\)/);
    assert.match(html, new RegExp(`const conversionSendTo = "${CONVERSION_SEND_TO}"`));
  }
  for (const html of [homeHtml, goHtml]) {
    assert.doesNotMatch(html, new RegExp(`const conversionSendTo = "${CONVERSION_SEND_TO}"`));
  }
});

test('keeps the Google tag off admin chrome pages', () => {
  assert.doesNotMatch(adminLayout, /Gtm|gtag\/js|google-ads-id|AW-18495815386/);
});

test('marks header and floating contact buttons for GTM events', () => {
  assert.match(
    homeHtml,
    /data-gtm-event="contact_whatsapp"[^>]*data-gtm-location="header"|data-gtm-location="header"[^>]*data-gtm-event="contact_whatsapp"/,
  );
  assert.match(
    homeHtml,
    /data-gtm-event="contact_call"[^>]*data-gtm-location="header"|data-gtm-location="header"[^>]*data-gtm-event="contact_call"/,
  );
  assert.match(
    homeHtml,
    /data-gtm-event="contact_whatsapp"[^>]*data-gtm-location="floating"|data-gtm-location="floating"[^>]*data-gtm-event="contact_whatsapp"/,
  );
  assert.match(
    homeHtml,
    /data-gtm-event="contact_call"[^>]*data-gtm-location="floating"|data-gtm-location="floating"[^>]*data-gtm-event="contact_call"/,
  );
});

test('routes CTA booking through the customer form and tracks calls', () => {
  assert.match(homeHtml, /href="\/book\/"/);
  assert.match(
    homeHtml,
    /data-gtm-event="contact_call"[^>]*data-gtm-location="cta"|data-gtm-location="cta"[^>]*data-gtm-event="contact_call"/,
  );
});

test('marks contact page methods and form submit for GTM events', () => {
  assert.match(contactHtml, /data-gtm-event="contact_call"/);
  assert.match(contactHtml, /data-gtm-event="contact_whatsapp"/);
  assert.match(contactHtml, /data-gtm-event="contact_email"/);
  assert.match(
    contactHtml,
    /<form[^>]*data-gtm-event="contact_form_submit"[^>]*data-gtm-location="contact_form"|<form[^>]*data-gtm-location="contact_form"[^>]*data-gtm-event="contact_form_submit"/,
  );
});

test('marks go page contact buttons for GTM events', () => {
  assert.match(
    goHtml,
    /data-gtm-event="contact_whatsapp"[^>]*data-gtm-location="go"|data-gtm-location="go"[^>]*data-gtm-event="contact_whatsapp"/,
  );
  assert.match(
    goHtml,
    /data-gtm-event="contact_call"[^>]*data-gtm-location="go"|data-gtm-location="go"[^>]*data-gtm-event="contact_call"/,
  );
});
