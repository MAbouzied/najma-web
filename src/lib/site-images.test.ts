import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const assetsRoot = fileURLToPath(new URL('../assets/', import.meta.url));
const publicRoot = fileURLToPath(new URL('../../public/', import.meta.url));

/** Public SEO paths that must have a matching src/assets file for the Image pipeline. */
const REQUIRED_PUBLIC_PATHS = [
  '/assets/nagm-logo.png',
  '/assets/contact-cta.jpg',
  '/assets/about/mission.jpg',
  '/assets/about/vision.jpg',
  '/assets/home/hero-interior.jpg',
  '/assets/home/benefits/expert-therapists.png',
  '/assets/home/benefits/luxury-products.png',
  '/assets/home/benefits/calm-atmosphere.png',
  '/assets/home/benefits/quick-booking.png',
  '/assets/home/services/swedish-massage.jpg',
  '/assets/home/services/thai-massage.jpg',
  '/assets/home/services/hot-stone-massage.jpg',
  '/assets/home/services/hot-stone-massage-hero.jpg',
  '/assets/home/services/cupping.jpg',
  '/assets/home/services/relaxation-massage.jpg',
  '/assets/home/services/shiatsu-massage.jpg',
  '/assets/home/services/hot-oil-massage.jpg',
  '/assets/home/services/star-spa-massage.jpg',
  '/assets/home/services/moroccan-bath.jpg',
  '/assets/home/services/moroccan-clay.jpg',
  '/assets/home/services/aromatherapy.jpg',
  '/assets/home/services/steam-session.jpg',
  '/assets/home/services/manicure-pedicure.jpg',
  '/assets/home/services/manicure-pedicure-hero.jpg',
  '/assets/home/services/facial-care.jpg',
  '/assets/home/services/body-scrub.jpg',
] as const;

describe('site image registry assets', () => {
  it('keeps source and public files for every mapped SEO path', async () => {
    for (const publicPath of REQUIRED_PUBLIC_PATHS) {
      const relative = publicPath.replace(/^\/assets\//, '');
      const sourceFile = join(assetsRoot, relative);
      const publicFile = join(publicRoot, publicPath.replace(/^\//, ''));
      await access(sourceFile);
      await access(publicFile);
      assert.deepEqual(
        await readFile(publicFile),
        await readFile(sourceFile),
        `${publicPath} differs between src/assets and public/assets`,
      );
    }
  });

  it('covers every service image path used in home data', async () => {
    const homeSource = await import('node:fs/promises').then((fs) =>
      fs.readFile(fileURLToPath(new URL('../data/home.ts', import.meta.url)), 'utf8'),
    );
    const paths = [...homeSource.matchAll(/image:\s*'(\/assets\/[^']+)'/g)].map((m) => m[1]);
    const heroes = [...homeSource.matchAll(/heroImage:\s*'(\/assets\/[^']+)'/g)].map((m) => m[1]);
    assert.ok(paths.length >= 13);
    for (const path of [...paths, ...heroes]) {
      assert.ok(
        REQUIRED_PUBLIC_PATHS.includes(path as (typeof REQUIRED_PUBLIC_PATHS)[number]),
        `missing registry coverage for ${path}`,
      );
    }
  });

  it('maps each supplied photo to its named service', async () => {
    const homeSource = await import('node:fs/promises').then((fs) =>
      fs.readFile(fileURLToPath(new URL('../data/home.ts', import.meta.url)), 'utf8'),
    );

    assert.match(
      homeSource,
      /slug:\s*'swedish-massage',\s*image:\s*'\/assets\/home\/services\/swedish-massage\.jpg'/,
    );
    assert.match(
      homeSource,
      /slug:\s*'star-spa-massage',\s*image:\s*'\/assets\/home\/services\/star-spa-massage\.jpg'/,
    );
    assert.match(
      homeSource,
      /slug:\s*'steam-session',\s*image:\s*'\/assets\/home\/services\/steam-session\.jpg'/,
    );
    assert.match(
      homeSource,
      /slug:\s*'body-scrub',\s*image:\s*'\/assets\/home\/services\/body-scrub\.jpg'/,
    );
  });

  it('keeps the menu import script aligned with supplied service images', async () => {
    const importSource = await import('node:fs/promises').then((fs) =>
      fs.readFile(fileURLToPath(new URL('../../scripts/apply-pdf-menu.mjs', import.meta.url)), 'utf8'),
    );

    assert.match(
      importSource,
      /slug:\s*'star-spa-massage',\s*image:\s*'\/assets\/home\/services\/star-spa-massage\.jpg'/,
    );
    assert.match(
      importSource,
      /slug:\s*'steam-session',\s*image:\s*'\/assets\/home\/services\/steam-session\.jpg'/,
    );
    assert.match(
      importSource,
      /slug:\s*'body-scrub',\s*image:\s*'\/assets\/home\/services\/body-scrub\.jpg'/,
    );
  });
});
