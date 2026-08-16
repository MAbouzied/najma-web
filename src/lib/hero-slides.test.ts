import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HERO_SLIDE_ALT_KEYS, HERO_SLIDE_IDS } from './hero-slides.ts';

describe('home hero slides', () => {
  it('keeps the night facade first and adds the five new spa photos', () => {
    assert.deepEqual(HERO_SLIDE_IDS, [
      'facade',
      'hallway',
      'entrance',
      'room-sign',
      'mirror',
      'lounge',
    ]);
  });

  it('maps every slide to an alt key', () => {
    for (const id of HERO_SLIDE_IDS) {
      assert.equal(typeof HERO_SLIDE_ALT_KEYS[id], 'string');
      assert.match(HERO_SLIDE_ALT_KEYS[id], /^homeHero/);
    }
  });
});
