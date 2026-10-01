import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const PIXEL_ID = '1603479088224230';

const [homeHtml, contactHtml, adminLayout] = await Promise.all([
  readFile(new URL('../dist/client/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/client/contact/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../src/layouts/AdminLayout.astro', import.meta.url), 'utf8'),
]);

test('embeds Meta Pixel init and PageView on public pages', () => {
  for (const html of [homeHtml, contactHtml]) {
    assert.match(html, /name="meta-pixel-id"/);
    assert.match(html, new RegExp(`content="${PIXEL_ID}"`));
    assert.match(html, /https:\/\/connect\.facebook\.net\/en_US\/fbevents\.js/);
    assert.match(html, new RegExp(`const metaPixelId = "${PIXEL_ID}"`));
    assert.match(html, /window\.fbq\('init', metaPixelId\)/);
    assert.match(html, /window\.fbq\('track', 'PageView'\)/);
    assert.match(
      html,
      new RegExp(`https://www\\.facebook\\.com/tr\\?id=${PIXEL_ID}&amp;ev=PageView&amp;noscript=1`),
    );
  }
});

test('keeps Meta Pixel off admin chrome pages', () => {
  assert.doesNotMatch(adminLayout, /MetaPixel|meta-pixel-id|fbevents\.js|fbq\(/);
});
