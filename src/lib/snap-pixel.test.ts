import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_SNAP_PIXEL_ID, isSnapPixelId, resolveSnapPixelId, trackSnapPageView } from './snap-pixel.ts';

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

test('trackSnapPageView sends PAGE_VIEW through snaptr', () => {
  const calls: unknown[][] = [];
  globalThis.window = {
    snaptr(...args: unknown[]) {
      calls.push(args);
    },
  } as Window & typeof globalThis;

  trackSnapPageView();

  assert.deepEqual(calls, [['track', 'PAGE_VIEW']]);
  delete (globalThis as { window?: unknown }).window;
});

test('trackSnapPageView is a no-op without snaptr', () => {
  assert.doesNotThrow(() => trackSnapPageView());

  globalThis.window = {} as Window & typeof globalThis;
  assert.doesNotThrow(() => trackSnapPageView());
  delete (globalThis as { window?: unknown }).window;
});
