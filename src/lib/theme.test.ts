import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';
import { DEFAULT_THEME, isThemeId, resolveTheme, THEME_IDS } from './theme.ts';

const themeCss = readFileSync(new URL('../styles/global.css', import.meta.url), 'utf8');
const brandLogo = readFileSync(new URL('../components/BrandLogo.astro', import.meta.url), 'utf8');

describe('site theme ids', () => {
  it('keeps sand as the only site theme', () => {
    assert.deepEqual(THEME_IDS, ['sand']);
    assert.equal(DEFAULT_THEME, 'sand');
  });

  it('accepts only sand', () => {
    assert.equal(isThemeId('sand'), true);
    assert.equal(isThemeId('grove'), false);
    assert.equal(isThemeId('deep'), false);
    assert.equal(isThemeId(''), false);
  });

  it('always resolves to sand', () => {
    assert.equal(resolveTheme(null), 'sand');
    assert.equal(resolveTheme('grove'), 'sand');
    assert.equal(resolveTheme('sand'), 'sand');
  });

  it('bakes sand colors into the default theme tokens', () => {
    assert.match(themeCss, /--color-bg-primary:\s*#fdf3e7/);
    assert.doesNotMatch(themeCss, /--color-logo-plate/);
    assert.doesNotMatch(themeCss, /data-theme='grove'/);
    assert.doesNotMatch(themeCss, /data-theme='deep'/);
    assert.match(themeCss, /\.brand-logo-mark/);
  });
});

describe('brand logo', () => {
  it('hides the wordmark on mobile and shows it on desktop', () => {
    assert.match(brandLogo, /hidden[\s\S]*lg:inline/);
  });
});
