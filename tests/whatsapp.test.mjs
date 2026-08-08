import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PHONE_TEL_HREF,
  WHATSAPP_PHONE,
  WHATSAPP_PHONE_DISPLAY,
  buildBookingUrl,
  buildCallHref,
  buildOfferBookingUrl,
  buildPackageBookingUrl,
  buildServiceBookingUrl,
  buildWhatsAppUrl,
} from '../src/lib/whatsapp.ts';

test('uses the unified WhatsApp phone number', () => {
  assert.equal(WHATSAPP_PHONE, '966579777407');
  assert.equal(WHATSAPP_PHONE_DISPLAY, '+966579777407');
  assert.equal(PHONE_TEL_HREF, 'tel:+966579777407');
  assert.equal(buildCallHref(), 'tel:+966579777407');
});

test('routes booking links through the customer form with item names', () => {
  const serviceUrl = buildServiceBookingUrl('مساج استرخاء');
  assert.match(serviceUrl, /^\/book\/\?department=service/);
  assert.match(serviceUrl, /%D9%85%D8%B3%D8%A7%D8%AC/);

  const packageUrl = buildPackageBookingUrl('باقة العرسان');
  assert.match(packageUrl, /^\/book\/\?department=package/);
  assert.match(packageUrl, /%D8%A8%D8%A7%D9%82%D8%A9/);

  const offerUrl = buildOfferBookingUrl('عرض التعافي');
  assert.match(offerUrl, /^\/book\/\?department=offer/);
  assert.equal(new URL(offerUrl, 'https://nagmspa.com').searchParams.get('item'), 'عرض التعافي');

  assert.equal(buildBookingUrl('ar'), '/book/');
  assert.equal(buildBookingUrl('en'), '/en/book/');

  assert.match(buildWhatsAppUrl(), /phone=966579777407/);
});
