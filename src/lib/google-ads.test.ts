import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CONTACT_CONVERSION_SEND_TO,
  DEFAULT_GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  googleTagConfigIds,
  isContactConversionPath,
  isGoogleAdsId,
  trackGoogleAdsConversion,
} from './google-ads.ts';

test('accepts the Google Ads account id', () => {
  assert.equal(isGoogleAdsId(GOOGLE_ADS_ID), true);
  assert.equal(isGoogleAdsId(` ${GOOGLE_ADS_ID} `), true);
  assert.equal(isGoogleAdsId(DEFAULT_GA_MEASUREMENT_ID), false);
  assert.equal(isGoogleAdsId('AW-'), false);
  assert.equal(isGoogleAdsId(''), false);
  assert.equal(isGoogleAdsId(undefined), false);
});

test('treats only the contact pages as the conversion page', () => {
  assert.equal(isContactConversionPath('/contact'), true);
  assert.equal(isContactConversionPath('/contact/'), true);
  assert.equal(isContactConversionPath('/en/contact'), true);
  assert.equal(isContactConversionPath('/en/contact/'), true);
  assert.equal(isContactConversionPath('/contact/?utm=ads'), true);
  assert.equal(isContactConversionPath('/'), false);
  assert.equal(isContactConversionPath('/book/'), false);
  assert.equal(isContactConversionPath('/en/book/'), false);
  assert.equal(isContactConversionPath('/form/'), false);
});

test('adds the Ads config, and the site measurement id when the primary id differs', () => {
  assert.deepEqual(googleTagConfigIds(DEFAULT_GA_MEASUREMENT_ID), [GOOGLE_ADS_ID]);
  assert.deepEqual(googleTagConfigIds('G-OTHER123'), [DEFAULT_GA_MEASUREMENT_ID, GOOGLE_ADS_ID]);
});

test('trackGoogleAdsConversion sends the contact conversion when gtag exists', () => {
  const calls: unknown[][] = [];
  globalThis.window = {
    gtag(...args: unknown[]) {
      calls.push(args);
    },
  };

  trackGoogleAdsConversion();

  assert.deepEqual(calls, [['event', 'conversion', { send_to: CONTACT_CONVERSION_SEND_TO }]]);
  delete globalThis.window;
});

test('trackGoogleAdsConversion is a no-op without gtag', () => {
  globalThis.window = {};
  assert.doesNotThrow(() => trackGoogleAdsConversion());
  delete globalThis.window;
});
