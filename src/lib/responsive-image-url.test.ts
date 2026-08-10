import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { buildWidthSrcset } from './responsive-image-url.ts';

describe('buildWidthSrcset', () => {
  it('builds Sanity CDN srcset with auto format', () => {
    const srcset = buildWidthSrcset(
      'https://cdn.sanity.io/images/proj/prod/a.jpg?w=2000',
      [480, 768],
    );
    assert.ok(srcset);
    assert.match(srcset, /w=480/);
    assert.match(srcset, /w=768/);
    assert.match(srcset, /auto=format/);
    assert.match(srcset, / 480w/);
  });

  it('caps widths to the original max', () => {
    const srcset = buildWidthSrcset(
      'https://cdn.sanity.io/images/proj/prod/a.jpg',
      [480, 768, 1200, 1600],
      800,
    );
    assert.ok(srcset);
    assert.match(srcset, /480w/);
    assert.match(srcset, /768w/);
    assert.doesNotMatch(srcset, /1200w/);
  });

  it('ignores unrelated hosts', () => {
    assert.equal(buildWidthSrcset('https://evil.example/a.jpg'), undefined);
  });
});
