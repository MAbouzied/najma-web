import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const goHtml = await readFile(new URL('../dist/client/go/index.html', import.meta.url), 'utf8');

test('renders a dedicated contact landing with WhatsApp, call, and directions', () => {
  assert.match(goHtml, /واتساب/);
  assert.match(goHtml, /اتصال/);
  assert.match(goHtml, /الاتجاهات/);
  assert.match(goHtml, /api\.whatsapp\.com\/send\/\?phone=966579777407/);
  assert.match(goHtml, /tel:\+966579777407/);
  assert.match(
    goHtml,
    /href="https:\/\/maps\.app\.goo\.gl\/4TJpLxDQE7TJ6D1D9"/,
  );
  assert.match(goHtml, /حي المصيف/);
  assert.match(goHtml, /٢٤ ساعة|24/);
});
