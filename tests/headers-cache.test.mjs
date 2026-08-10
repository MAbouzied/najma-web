import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const headersText = await readFile(new URL('../dist/client/_headers', import.meta.url), 'utf8');

test('keeps long-lived immutable caching for hashed /_astro assets', () => {
  assert.match(
    headersText,
    /\/_astro\/\*[\s\S]*?Cache-Control:\s*public,\s*max-age=31536000,\s*immutable/,
  );
});

test('keeps one-day cache with SWR for unversioned /assets', () => {
  assert.match(
    headersText,
    /\/assets\/\*[\s\S]*?Cache-Control:\s*public,\s*max-age=86400,\s*stale-while-revalidate=604800/,
  );
});

test('does not mark HTML catch-all as immutable', () => {
  const catchAll = headersText.split('/_astro/*')[0] ?? headersText;
  assert.doesNotMatch(catchAll, /\/\*\s*\n[^\n]*immutable/);
});
