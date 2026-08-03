import assert from 'node:assert/strict';
import test from 'node:test';
import {
  GTM_CONTAINER_ID,
  GTM_EVENTS,
  isGaMeasurementId,
  isGtmContainerConfigured,
  isGtmContainerId,
  pushGtmEvent,
  resolveContactEvent,
  gtmContactAttrs,
} from '../src/lib/gtm.ts';

test('uses the configured GA4 measurement id', () => {
  assert.equal(GTM_CONTAINER_ID, 'G-KKSXRY8MSN');
  assert.equal(isGaMeasurementId, true);
  assert.equal(isGtmContainerId, false);
  assert.equal(isGtmContainerConfigured, true);
});

test('exposes contact and form event names', () => {
  assert.equal(GTM_EVENTS.whatsapp, 'contact_whatsapp');
  assert.equal(GTM_EVENTS.call, 'contact_call');
  assert.equal(GTM_EVENTS.email, 'contact_email');
  assert.equal(GTM_EVENTS.formSubmit, 'contact_form_submit');
});

test('resolves contact event names from hrefs', () => {
  assert.equal(resolveContactEvent('tel:+966542030018'), 'contact_call');
  assert.equal(resolveContactEvent('mailto:info@nagmspa.com'), 'contact_email');
  assert.equal(
    resolveContactEvent('https://api.whatsapp.com/send/?phone=966542030018'),
    'contact_whatsapp',
  );
  assert.equal(resolveContactEvent('https://wa.me/966542030018'), 'contact_whatsapp');
  assert.equal(resolveContactEvent('/services/'), null);
  assert.equal(resolveContactEvent('#branches'), null);
});

test('builds data attributes for contact tracking', () => {
  assert.deepEqual(gtmContactAttrs('contact_whatsapp', 'header'), {
    'data-gtm-event': 'contact_whatsapp',
    'data-gtm-location': 'header',
  });
});

test('pushGtmEvent writes to window.dataLayer when available', () => {
  const dataLayer = [];
  globalThis.window = { dataLayer };

  pushGtmEvent('contact_whatsapp', { location: 'floating' });

  assert.equal(dataLayer.length, 1);
  assert.deepEqual(dataLayer[0], {
    event: 'contact_whatsapp',
    location: 'floating',
  });

  delete globalThis.window;
});

test('pushGtmEvent also forwards events to gtag when available', () => {
  const dataLayer = [];
  const gtagCalls = [];
  globalThis.window = {
    dataLayer,
    gtag(...args) {
      gtagCalls.push(args);
    },
  };

  pushGtmEvent('contact_call', {
    location: 'header',
    eventCallback: () => {},
    eventTimeout: 150,
  });

  assert.equal(dataLayer.length, 1);
  assert.equal(gtagCalls.length, 1);
  assert.equal(gtagCalls[0][0], 'event');
  assert.equal(gtagCalls[0][1], 'contact_call');
  assert.equal(gtagCalls[0][2].location, 'header');
  assert.equal(typeof gtagCalls[0][2].event_callback, 'function');
  assert.equal(gtagCalls[0][2].event_timeout, 150);

  delete globalThis.window;
});

test('pushGtmEvent is a no-op without a browser dataLayer', () => {
  assert.doesNotThrow(() => pushGtmEvent('contact_call', { location: 'footer' }));
});
