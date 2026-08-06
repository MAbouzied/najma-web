import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const [bookHtml, englishBookHtml, apiSource, sheetsSource, configSource] = await Promise.all([
  readFile(new URL('../dist/client/book/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../dist/client/en/book/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../src/pages/api/customers.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/lib/google-sheets.ts', import.meta.url), 'utf8'),
  readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8'),
]);

test('renders private customer capture forms in both languages', () => {
  for (const html of [bookHtml, englishBookHtml]) {
    assert.match(html, /id="booking-form"/);
    assert.match(html, /name="name"/);
    assert.match(html, /name="phone"/);
    assert.match(html, /name="booking"/);
  }
});

test('uses the requested spreadsheet and a POST-only endpoint', () => {
  assert.match(apiSource, /export const POST/);
  assert.doesNotMatch(apiSource, /export const GET/);
  assert.match(configSource, /1QK0DCOr52q6wbbNvuPJchCvOgL3HlLab2eaLiX87QDA/);
});

test('writes Bookings and Customers together in a Sheets batch update', () => {
  assert.match(sheetsSource, /appendCells[\s\S]*appendCells/);
  assert.match(sheetsSource, /Submitted At[\s\S]*Department[\s\S]*Language/);
  assert.match(sheetsSource, /Registered At[\s\S]*Name[\s\S]*Phone/);
  assert.match(sheetsSource, /':batchUpdate'/);
});

test('accepts bookings without Google Sheets credentials until secrets are configured', () => {
  assert.match(sheetsSource, /export function isGoogleSheetsConfigured/);
  assert.match(
    apiSource,
    /if \(!isGoogleSheetsConfigured\(sheetsConfig\)\)[\s\S]*return json\(\{ ok: true, stored: false \}, 200\)/,
  );
  assert.doesNotMatch(apiSource, /return json\(\{ error: 'Booking storage is unavailable' \}, 503\)/);
});
