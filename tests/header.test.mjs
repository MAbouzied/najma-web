import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const header = await readFile(new URL('../src/components/Header.astro', import.meta.url), 'utf8');

test('places the mobile burger after language and booking actions', () => {
  const language = header.indexOf('<LanguageSwitcher');
  const booking = header.indexOf('gold-button');
  const burger = header.indexOf('data-mobile-nav');

  assert.ok(language >= 0, 'language switcher should exist');
  assert.ok(booking >= 0, 'booking button should exist');
  assert.ok(burger >= 0, 'mobile burger should exist');
  assert.ok(burger > language, 'burger should come after the language switcher');
  assert.ok(burger > booking, 'burger should come after the booking button');
});
