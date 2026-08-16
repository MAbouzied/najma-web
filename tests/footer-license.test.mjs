import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
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

test('renders VAT registration number with certificate link to public image', () => {
  assert.match(homeHtml, /الرقم الضريبي[\s\S]*?310360176500003/);
  assert.match(homeHtml, /\/assets\/icons\/zatca-vat\.svg/);
  const vatAnchor =
    homeHtml.match(/<a\b[^>]*data-vat-certificate-link[^>]*>/)?.[0] ?? '';
  assert.match(vatAnchor, /href="\/assets\/legal\/vat-registration-certificate\.png"/);
  assert.match(vatAnchor, /target="_blank"/);
  assert.match(vatAnchor, /rel="noopener noreferrer"/);
  assert.doesNotMatch(homeHtml, /data-vat-certificate-dialog/);
  assert.doesNotMatch(homeHtml, /data-license-missing/);
  assert.match(enHomeHtml, /VAT Number[\s\S]*?310360176500003/);
  const enVatAnchor =
    enHomeHtml.match(/<a\b[^>]*data-vat-certificate-link[^>]*>/)?.[0] ?? '';
  assert.match(enVatAnchor, /href="\/assets\/legal\/vat-registration-certificate\.png"/);
  assert.match(enVatAnchor, /target="_blank"/);
  assert.match(enVatAnchor, /rel="noopener noreferrer"/);
});

test('locks the site to the sand theme without a color switcher', () => {
  assert.match(homeHtml, /data-theme="sand"/);
  assert.doesNotMatch(homeHtml, /data-theme-switcher/);
  assert.doesNotMatch(homeHtml, /data-theme-option/);
});

test('presents licensing details as an accessible responsive card grid', () => {
  assert.match(homeHtml, /<dl[^>]*data-license-grid/);
  assert.equal(homeHtml.match(/data-license-card/g)?.length, 5);
  assert.match(homeHtml, /<dt[\s>]/);
  assert.match(homeHtml, /<dd[\s>]/);
  assert.match(enHomeHtml, /<dl[^>]*data-license-grid/);
  assert.match(enHomeHtml, /Commercial Register \(Unified National No\.\)[\s\S]*7032026861/);
});

test('ships VAT certificate and ZATCA badge assets', async () => {
  await access(new URL('../public/assets/legal/vat-registration-certificate.png', import.meta.url));
  await access(new URL('../public/assets/icons/zatca-vat.svg', import.meta.url));
});
