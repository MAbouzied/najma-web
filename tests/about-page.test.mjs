import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const aboutHtml = await readFile(
  new URL('../dist/about/index.html', import.meta.url),
  'utf8',
);

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
  for (const item of ['فروع فاخرة', 'عميل سعيد', 'معالج محترف', 'سنة خبرة']) {
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
