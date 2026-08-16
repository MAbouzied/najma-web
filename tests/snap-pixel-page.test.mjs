import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const PIXEL_ID = '7c95dced-8cb1-4a0a-8ad0-b97fa9ff8316';

const [homeHtml, contactHtml, serviceHtml, adminLayout] = await Promise.all([
  readFile(new URL('../dist/client/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/client/contact/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/client/services/swedish-massage/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../src/layouts/AdminLayout.astro', import.meta.url), 'utf8'),
]);

test('embeds Snap Pixel init and PAGE_VIEW on public pages', () => {
  for (const html of [homeHtml, contactHtml]) {
    assert.match(html, /name="snap-pixel-id"/);
    assert.match(html, new RegExp(`content="${PIXEL_ID}"`));
    assert.match(html, /https:\/\/sc-static\.net\/scevent\.min\.js/);
    assert.match(html, new RegExp(`const snapPixelId = "${PIXEL_ID}"`));
    assert.match(html, /window\.snaptr\('init', snapPixelId/);
    assert.match(html, /window\.snaptr\('track', 'PAGE_VIEW'/);
  }
});

test('fires VIEW_CONTENT on service detail pages', () => {
  assert.match(serviceHtml, /window\.snaptr\('track', 'VIEW_CONTENT'/);
  assert.match(serviceHtml, /swedish-massage/);
});

test('keeps Snap Pixel off admin chrome pages', () => {
  assert.doesNotMatch(adminLayout, /SnapPixel|snap-pixel-id|sc-static\.net|snaptr/);
});
