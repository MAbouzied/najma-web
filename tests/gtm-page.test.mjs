import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [homeHtml, contactHtml, goHtml] = await Promise.all([
  readFile(new URL('../dist/client/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/client/contact/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/client/go/index.html', import.meta.url), 'utf8'),
]);

test('boots GA4 gtag with the configured measurement id', () => {
  assert.match(homeHtml, /name="gtm-container-id"[^>]*content="G-KKSXRY8MSN"/);
  assert.match(homeHtml, /const gtmId = "G-KKSXRY8MSN"/);
  assert.match(homeHtml, /window\.dataLayer/);
  assert.match(homeHtml, /googletagmanager\.com\/gtag\/js\?id=' \+ gtmId/);
  assert.match(homeHtml, /gtag\('config', gtmId\)/);
  assert.doesNotMatch(homeHtml, /googletagmanager\.com\/ns\.html\?id=/);
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
