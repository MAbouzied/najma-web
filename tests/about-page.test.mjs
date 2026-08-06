import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const aboutHtml = await readFile(
  new URL('../dist/client/about/index.html', import.meta.url),
  'utf8',
);
const enAboutHtml = await readFile(
  new URL('../dist/client/en/about/index.html', import.meta.url),
  'utf8',
);

function firstSplitMediaSection(html) {
  return html.match(/data-split-media[\s\S]*?<\/section>/)?.[0] ?? '';
}

test('renders every About page section', () => {
  for (const heading of [
    'نجم سبا',
    'تجربة سبا لا تُنسى',
    'ما يميزنا',
    'أن نكون وجهتك المفضلة للراحة',
    'لحظتك من الراحة تبدأ هنا',
  ]) {
    assert.match(aboutHtml, new RegExp(heading));
  }
});

test('renders mission stats from Figma', () => {
  for (const item of ['فرع في حفر الباطن', 'ساعة عمل يوميًا', 'معالج محترف', 'سنة خبرة']) {
    assert.match(aboutHtml, new RegExp(item));
  }
});

test('renders about values from Figma', () => {
  for (const value of [
    'خبرة موثوقة',
    'جودة استثنائية',
    'أصالة وطبيعة',
    'أجواء ساكنة',
    'خصوصية تامة',
    'خدمة متكاملة',
  ]) {
    assert.match(aboutHtml, new RegExp(value));
  }
});

test('uses committed About assets and shared site chrome', () => {
  assert.doesNotMatch(aboutHtml, /figma\.com\/api\/mcp\/asset/);
  assert.match(aboutHtml, /\/assets\/about\/mission\./);
  assert.match(aboutHtml, /aria-current="page"[^>]*>من نحن<\/a>/);
  assert.match(aboutHtml, /data-site-header/);
  assert.match(aboutHtml, /data-site-footer/);
});

test('renders reusable split-media, feature-grid, and CTA patterns', () => {
  assert.equal((aboutHtml.match(/data-split-media/g) ?? []).length, 2);
  assert.match(aboutHtml, /data-feature-grid/);
  assert.match(aboutHtml, /data-site-cta/);
});

test('Arabic split-media mission block uses rtl logical start alignment', () => {
  const mission = firstSplitMediaSection(aboutHtml);

  assert.match(mission, /dir="rtl"/);
  assert.match(mission, /text-start/);
  assert.doesNotMatch(mission, /\btext-right\b/);
  assert.match(mission, /items-start text-start/);
});

test('English split-media mission block uses ltr logical start alignment', () => {
  assert.doesNotMatch(enAboutHtml, /\btext-right\b/);
  assert.doesNotMatch(enAboutHtml, /items-start text-right/);

  const mission = firstSplitMediaSection(enAboutHtml);

  assert.match(mission, /dir="ltr"/);
  assert.match(mission, /text-start/);
  assert.match(mission, /Our Mission/);
  assert.match(mission, /An Unforgettable Spa Experience/);
});

test('centered values section keeps intentional text-center alignment', () => {
  assert.match(aboutHtml, /items-center text-center[\s\S]*?ما يميزنا/);
  assert.match(enAboutHtml, /items-center text-center[\s\S]*?What Makes Us Different/);
  assert.match(aboutHtml, /data-site-cta[\s\S]*?text-center/);
});
