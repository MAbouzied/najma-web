import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const enHome = await readFile(new URL('../dist/client/en/index.html', import.meta.url), 'utf8');
const arHome = await readFile(new URL('../dist/client/index.html', import.meta.url), 'utf8');
const enAbout = await readFile(new URL('../dist/client/en/about/index.html', import.meta.url), 'utf8');
const enServices = await readFile(new URL('../dist/client/en/services/index.html', import.meta.url), 'utf8');

test('English home renders translated content and locale-aware logo home link', () => {
  assert.match(enHome, /lang="en"/);
  assert.match(enHome, /dir="ltr"/);
  assert.match(enHome, /Nagm Spa/);
  assert.match(enHome, /Relaxation Massage|Hot Oil Massage|Thai Massage/);
  assert.match(enHome, /href="\/en\/"/);
  assert.doesNotMatch(enHome, /مساج الاسترخاء/);
});

test('Arabic home remains the default language experience', () => {
  assert.match(arHome, /lang="ar"/);
  assert.match(arHome, /dir="rtl"/);
  assert.match(arHome, /مساج الاسترخاء/);
  assert.match(arHome, /بيانات الترخيص الرسمية/);
});

test('English about and services pages are fully translated', () => {
  assert.match(enAbout, /Our Story|Trusted Expertise|Nagm Spa/);
  assert.match(enServices, /Premium Services|Relaxation Massage/);
  assert.match(enServices, /Official Licensing Information|Commercial Register/);
});

test('language switch from English home points back to Arabic home', () => {
  assert.match(enHome, /hreflang="ar"/);
  assert.match(enHome, /العربية/);
});
