import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { DEFAULT_THEME, isThemeId, resolveTheme, THEME_IDS } from './theme.ts';

const themeCss = readFileSync(new URL('../styles/global.css', import.meta.url), 'utf8');

describe('site theme ids', () => {
  it('keeps the current deep green plus four named options', () => {
    assert.deepEqual(THEME_IDS, ['deep', 'grove', 'cedar', 'mist', 'sand']);
    assert.equal(DEFAULT_THEME, 'grove');
  });

  it('accepts only known theme ids', () => {
    assert.equal(isThemeId('deep'), true);
    assert.equal(isThemeId('grove'), true);
    assert.equal(isThemeId('sand'), true);
    assert.equal(isThemeId('light'), false);
    assert.equal(isThemeId(''), false);
  });

  it('falls back to the lighter default when storage is empty or invalid', () => {
    assert.equal(resolveTheme(null), 'grove');
    assert.equal(resolveTheme('nope'), 'grove');
    assert.equal(resolveTheme('cedar'), 'cedar');
    assert.equal(resolveTheme('sand'), 'sand');
  });

  it('puts a dark plate behind the light logo on sand', () => {
    assert.match(themeCss, /html\[data-theme='sand'\][\s\S]*--color-logo-plate:/);
    assert.match(themeCss, /html\[data-theme='sand'\] \.brand-logo-mark/);
  });
});
