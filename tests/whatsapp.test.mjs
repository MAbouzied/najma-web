import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WHATSAPP_PHONE,
  WHATSAPP_PHONE_DISPLAY,
  buildPackageBookingUrl,
  buildServiceBookingUrl,
  buildWhatsAppUrl,
} from '../src/lib/whatsapp.ts';

test('uses the unified WhatsApp phone number', () => {
  assert.equal(WHATSAPP_PHONE, '966542030018');
  assert.equal(WHATSAPP_PHONE_DISPLAY, '+966542030018');
});

test('builds WhatsApp booking links with item names', () => {
  const serviceUrl = buildServiceBookingUrl('مساج استرخاء');
  assert.match(serviceUrl, /phone=966542030018/);
  assert.match(serviceUrl, /%D9%85%D8%B3%D8%A7%D8%AC/);

  const packageUrl = buildPackageBookingUrl('باقة العرسان');
  assert.match(packageUrl, /phone=966542030018/);
  assert.match(packageUrl, /%D8%A8%D8%A7%D9%82%D8%A9/);

  assert.match(buildWhatsAppUrl(), /phone=966542030018/);
});
