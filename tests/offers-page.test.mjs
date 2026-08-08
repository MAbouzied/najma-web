import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const slugs = ['exterior-wash', 'interior-wash', 'engine-cleaning', 'body-polishing'];

const offerNames = ['غسيل خارجي فقط', 'غسيل داخلي فقط', 'تنظيف المحرك', 'تلميع الهيكل'];

const readDist = (path) => readFile(new URL(`../dist/client/${path}`, import.meta.url), 'utf8');

const [indexHtml, polishingHtml, ...detailHtmls] = await Promise.all([
  readDist('offers/index.html'),
  readDist('offers/body-polishing/index.html'),
  ...slugs.map((slug) => readDist(`offers/${slug}/index.html`)),
]);

test('builds a detail page for every car care offer', () => {
  assert.equal(detailHtmls.length, 4);
  for (const html of detailHtmls) {
    assert.match(html, /data-breadcrumbs/);
    assert.match(html, /href="\/book\/\?department=offer(?:&amp;|&)item=/);
    assert.match(html, /tel:\+966579777407/);
    assert.doesNotMatch(html, /العودة للعروض/);
  }
});

test('renders all four offers on the offers index', () => {
  assert.equal((indexHtml.match(/data-offer-card/g) ?? []).length, 4);

  for (const name of offerNames) {
    assert.match(indexHtml, new RegExp(name));
  }

  for (const slug of slugs) {
    assert.match(indexHtml, new RegExp(`href="/offers/${slug}/"`));
  }
});

test('shows special offer copy with flat prices and no mismatched banner assets', () => {
  assert.match(indexHtml, /العناية بالسيارات/);
  assert.match(indexHtml, /عرض خاص/);
  assert.equal((indexHtml.match(/\/assets\/offers\/[a-z-]+\.jpg/g) ?? []).length, 0);
  assert.match(indexHtml, /١٥ ر\.س/);
  assert.match(indexHtml, /٢٠ ر\.س/);
  assert.match(indexHtml, /٥٠ ر\.س/);
  assert.match(indexHtml, /١٠٠ ر\.س/);
});

test('wires booking form and call actions on offer cards', () => {
  assert.match(indexHtml, /data-offer-card[\s\S]*?href="\/book\/\?department=offer(?:&amp;|&)item=/);
  assert.match(indexHtml, /data-offer-card[\s\S]*?tel:\+966579777407/);
  assert.match(indexHtml, /aria-current="page"/);
  assert.match(indexHtml, /href="\/offers\/"/);
});

test('renders the body polishing offer detail with booking text', () => {
  assert.match(polishingHtml, /<h1[^>]*>[\s\S]*?تلميع الهيكل/);
  assert.doesNotMatch(polishingHtml, /\/assets\/offers\/body-polishing\.jpg/);
  assert.match(polishingHtml, /١٠٠ ر\.س/);
  assert.match(polishingHtml, /serviceType":"عناية بالسيارات"/);
  assert.match(
    polishingHtml,
    /href="\/book\/\?department=offer(?:&amp;|&)item=[^"]*?%D8%AA%D9%84%D9%85%D9%8A%D8%B9/,
  );
});
