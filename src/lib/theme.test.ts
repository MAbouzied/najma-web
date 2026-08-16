import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DEFAULT_THEME, isThemeId, resolveTheme, THEME_IDS } from './theme.ts';

describe('site theme ids', () => {
  it('keeps the current deep green plus three lighter options', () => {
    assert.deepEqual(THEME_IDS, ['deep', 'grove', 'cedar', 'mist']);
    assert.equal(DEFAULT_THEME, 'grove');
  });

  it('accepts only known theme ids', () => {
    assert.equal(isThemeId('deep'), true);
    assert.equal(isThemeId('grove'), true);
    assert.equal(isThemeId('light'), false);
    assert.equal(isThemeId(''), false);
  });

  it('falls back to the lighter default when storage is empty or invalid', () => {
    assert.equal(resolveTheme(null), 'grove');
    assert.equal(resolveTheme('nope'), 'grove');
    assert.equal(resolveTheme('cedar'), 'cedar');
  });
});
