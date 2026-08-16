import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_SNAP_PIXEL_ID,
  SNAP_EVENTS,
  compactSnapParams,
  contentFromBookingHref,
  contentFromPathname,
  isSnapPixelId,
  parseSnapPrice,
  resolveSnapPixelId,
  snapParamsFromBookingValue,
  trackSnapEvent,
  trackSnapPageView,
} from './snap-pixel.ts';

test('accepts Snap pixel UUIDs and rejects other values', () => {
  assert.equal(isSnapPixelId('7c95dced-8cb1-4a0a-8ad0-b97fa9ff8316'), true);
  assert.equal(isSnapPixelId(' 7C95DCED-8CB1-4A0A-8AD0-B97FA9FF8316 '), true);
  assert.equal(isSnapPixelId('G-KKSXRY8MSN'), false);
  assert.equal(isSnapPixelId('7c95dced8cb14a0a8ad0b97fa9ff8316'), false);
  assert.equal(isSnapPixelId(''), false);
  assert.equal(isSnapPixelId(undefined), false);
});

test('resolveSnapPixelId prefers a valid override and falls back to the site pixel', () => {
  assert.equal(resolveSnapPixelId(undefined), DEFAULT_SNAP_PIXEL_ID);
  assert.equal(resolveSnapPixelId(''), DEFAULT_SNAP_PIXEL_ID);
  assert.equal(
    resolveSnapPixelId('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'),
    'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
  );
});

test('parses numeric SAR prices and ignores menu-only labels', () => {
  assert.equal(parseSnapPrice('199'), 199);
  assert.equal(parseSnapPrice('٢٥٠ ر.س'), 250);
  assert.equal(parseSnapPrice('ضمن العروض'), undefined);
  assert.equal(parseSnapPrice('Via offers'), undefined);
  assert.equal(parseSnapPrice(''), undefined);
});

test('compacts Snap params and drops placeholders', () => {
  assert.deepEqual(
    compactSnapParams({
      price: 199,
      currency: 'SAR',
      item_ids: ['swedish-massage'],
      item_category: 'service',
      number_items: 1,
      user_email: '__INSERT_USER_EMAIL__',
      user_phone_number: '0551234567',
      transaction_id: 'INSERT_TRANSACTION_ID',
    }),
    {
      price: 199,
      currency: 'SAR',
      item_ids: ['swedish-massage'],
      item_category: 'service',
      number_items: 1,
      user_phone_number: '0551234567',
    },
  );
});

test('reads catalog content from public detail paths', () => {
  assert.deepEqual(contentFromPathname('/services/swedish-massage/'), {
    item_ids: ['swedish-massage'],
    item_category: 'service',
  });
  assert.deepEqual(contentFromPathname('/en/packages/luxury/'), {
    item_ids: ['luxury'],
    item_category: 'package',
  });
  assert.deepEqual(contentFromPathname('/offers/royal/'), {
    item_ids: ['royal'],
    item_category: 'offer',
  });
  assert.equal(contentFromPathname('/services/'), null);
  assert.equal(contentFromPathname('/book/'), null);
});

test('reads booking intent from /book query links', () => {
  assert.deepEqual(contentFromBookingHref('/book/?department=service&item=swedish-massage'), {
    item_ids: ['swedish-massage'],
    item_category: 'service',
  });
  assert.deepEqual(
    contentFromBookingHref('https://nagmspa.com/en/book/?department=offer&item=Royal%20Offer'),
    {
      item_ids: ['Royal Offer'],
      item_category: 'offer',
    },
  );
  assert.equal(contentFromBookingHref('/book/'), null);
  assert.equal(contentFromBookingHref('https://api.whatsapp.com/send/?phone=966579777407'), null);
});

test('builds purchase params from a booking select value', () => {
  assert.deepEqual(
    snapParamsFromBookingValue('package:gift', { phone: '0551234567' }),
    {
      item_ids: ['gift'],
      item_category: 'package',
      number_items: 1,
      currency: 'SAR',
      user_phone_number: '0551234567',
    },
  );
});

test('trackSnapEvent sends named events with cleaned params', () => {
  const calls: unknown[][] = [];
  globalThis.window = {
    snaptr(...args: unknown[]) {
      calls.push(args);
    },
  } as Window & typeof globalThis;

  trackSnapEvent(SNAP_EVENTS.viewContent, {
    item_ids: ['thai-massage'],
    item_category: 'service',
    user_email: '',
  });
  trackSnapPageView();

  assert.deepEqual(calls[0], [
    'track',
    'VIEW_CONTENT',
    { item_ids: ['thai-massage'], item_category: 'service' },
  ]);
  assert.deepEqual(calls[1], ['track', 'PAGE_VIEW']);
  delete (globalThis as { window?: unknown }).window;
});

test('trackSnapEvent is a no-op without snaptr', () => {
  assert.doesNotThrow(() => trackSnapEvent(SNAP_EVENTS.purchase));
});
