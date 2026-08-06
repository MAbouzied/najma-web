import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const homeHtml = await readFile(new URL('../dist/client/index.html', import.meta.url), 'utf8');
const enHomeHtml = await readFile(new URL('../dist/client/en/index.html', import.meta.url), 'utf8');

test('renders official licensing data in the footer', () => {
  assert.match(homeHtml, /data-license-details/);
  assert.match(homeHtml, /بيانات الترخيص الرسمية/);
  assert.match(homeHtml, /السجل التجاري \(الرقم الوطني الموحد\)[\s\S]*?7032026861/);
  assert.match(homeHtml, /رخصة النشاط البلدية \(بلدي\)[\s\S]*?440511049271/);
  assert.match(homeHtml, /أمانة حفر الباطن\s*\/\s*بلدية جنوب حفر الباطن/);
  assert.match(
    homeHtml,
    /النشاط المرخّص[\s\S]*?مراكز الاسترخاء والعناية الشخصية الرجالية في المباني القائمة/,
  );
});

test('marks missing VAT number for follow-up', () => {
  assert.match(
    homeHtml,
    /data-license-card[^>]*data-license-missing[^>]*>[\s\S]*?<dt[^>]*>الرقم الضريبي<\/dt>[\s\S]*?<dd[^>]*class="[^"]*text-danger[^"]*"[^>]*>\[مطلوب\]<\/dd>/,
  );
});

test('presents licensing details as an accessible responsive card grid', () => {
  assert.match(homeHtml, /<dl[^>]*data-license-grid/);
  assert.equal(homeHtml.match(/data-license-card/g)?.length, 5);
  assert.match(homeHtml, /<dt[\s>]/);
  assert.match(homeHtml, /<dd[\s>]/);
  assert.match(enHomeHtml, /<dl[^>]*data-license-grid/);
  assert.match(enHomeHtml, /Commercial Register \(Unified National No\.\)[\s\S]*7032026861/);
});
