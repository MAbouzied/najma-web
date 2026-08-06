import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const slugs = [
  'recovery',
  'relaxation',
  'signature',
  'care',
  'elegance',
  'prosperity',
  'royal',
  'golden',
];

const offerNames = [
  'عرض التعافي',
  'عرض الاسترخاء',
  'نجم سبا سجنتشر',
  'باقة العناية',
  'عرض الفخامة',
  'العرض الرخاء',
  'العرض الملكي',
  'العرض الذهبي',
];

const readDist = (path) => readFile(new URL(`../dist/client/${path}`, import.meta.url), 'utf8');

const [indexHtml, signatureHtml, ...detailHtmls] = await Promise.all([
  readDist('offers/index.html'),
  readDist('offers/signature/index.html'),
  ...slugs.map((slug) => readDist(`offers/${slug}/index.html`)),
]);

test('builds a detail page for every summer offer', () => {
  assert.equal(detailHtmls.length, 8);
  for (const html of detailHtmls) {
    assert.match(html, /data-breadcrumbs/);
    assert.match(html, /href="\/book\/\?department=offer(?:&amp;|&)item=/);
    assert.match(html, /tel:\+966542030018/);
    assert.doesNotMatch(html, /العودة للعروض/);
  }
});

test('renders all eight offers on the offers index', () => {
  assert.equal((indexHtml.match(/data-offer-card/g) ?? []).length, 8);

  for (const name of offerNames) {
    assert.match(indexHtml, new RegExp(name));
  }

  for (const slug of slugs) {
    assert.match(indexHtml, new RegExp(`href="/offers/${slug}/"`));
  }
});

test('shows campaign discount copy with struck original prices', () => {
  assert.match(indexHtml, /صيفك على كيفك/);
  assert.match(indexHtml, /خصم ٢٠٪/);
  assert.equal((indexHtml.match(/<s[\s>]/g) ?? []).length, 8);
  assert.match(indexHtml, /sr-only[^>]*>السعر قبل الخصم/);
  assert.match(indexHtml, /٣٥٩ ر\.س/);
  assert.match(indexHtml, /٤٤٩ ر\.س/);
  assert.match(indexHtml, /٥٦٢ ر\.س/);
});

test('wires booking form and call actions on offer cards', () => {
  assert.match(indexHtml, /data-offer-card[\s\S]*?href="\/book\/\?department=offer(?:&amp;|&)item=/);
  assert.match(indexHtml, /data-offer-card[\s\S]*?tel:\+966542030018/);
  assert.match(indexHtml, /aria-current="page"/);
  assert.match(indexHtml, /href="\/offers\/"/);
});

test('renders the signature offer detail with components and booking text', () => {
  assert.match(signatureHtml, /<h1[^>]*>[\s\S]*?نجم سبا سجنتشر/);
  assert.match(signatureHtml, /مكونات العرض/);
  assert.equal((signatureHtml.match(/مكونات العرض[\s\S]*?<li/g) ?? []).length >= 1, true);
  assert.match(
    signatureHtml,
    /href="\/book\/\?department=offer(?:&amp;|&)item=[^"]*?%D8%B3%D8%AC%D9%86%D8%AA%D8%B4%D8%B1/,
  );
  assert.match(signatureHtml, /٣٥٩ ر\.س/);
  assert.match(signatureHtml, /<s[\s\S]*?٤٤٩ ر\.س/);
});
