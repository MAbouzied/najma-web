import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  isAllowedBlogEmbedUrl,
  isAllowedBlogImageUrl,
  sanitizeBlogHtml,
} from './blog-html-sanitize.ts';

describe('sanitizeBlogHtml', () => {
  it('strips scripts event handlers svg math and srcdoc', () => {
    const dirty = `
      <p onclick="alert(1)">ok</p>
      <script>alert(1)</script>
      <img src="https://cdn.sanity.io/x.jpg" alt="x" onerror="alert(1)" />
      <iframe srcdoc="<script>alert(1)</script>"></iframe>
      <svg onload="alert(1)"></svg>
      <math></math>
    `;
    const clean = sanitizeBlogHtml(dirty);
    assert.match(clean, /<p>ok<\/p>/);
    assert.doesNotMatch(clean, /script|onclick|onerror|srcdoc|svg|math/i);
    assert.match(clean, /cdn\.sanity\.io\/x\.jpg/);
  });

  it('allows only local and Sanity images', () => {
    assert.match(
      sanitizeBlogHtml('<img src="/assets/a.jpg" alt="a" />'),
      /src="\/assets\/a\.jpg"/,
    );
    assert.equal(sanitizeBlogHtml('<img src="https://evil.example/a.jpg" alt="a" />'), '');
    assert.equal(sanitizeBlogHtml('<img src="//cdn.sanity.io/a.jpg" alt="a" />'), '');
  });

  it('hardens youtube-nocookie and vimeo iframes', () => {
    const clean = sanitizeBlogHtml(
      '<iframe src="https://www.youtube-nocookie.com/embed/abc"></iframe>',
    );
    assert.match(clean, /sandbox=/);
    assert.match(clean, /referrerpolicy=/);
    assert.match(clean, /loading="lazy"/);
    assert.match(clean, /allow=/);
    assert.equal(
      sanitizeBlogHtml('<iframe src="https://www.youtube.com/embed/abc"></iframe>'),
      '',
    );
  });
});

describe('blog media URL allowlists', () => {
  it('accepts approved image and embed hosts only', () => {
    assert.equal(isAllowedBlogImageUrl('/assets/x.jpg'), true);
    assert.equal(isAllowedBlogImageUrl('https://cdn.sanity.io/images/x.jpg'), true);
    assert.equal(isAllowedBlogImageUrl('https://example.com/x.jpg'), false);
    assert.equal(isAllowedBlogEmbedUrl('https://www.youtube-nocookie.com/embed/a'), true);
    assert.equal(isAllowedBlogEmbedUrl('https://player.vimeo.com/video/1'), true);
    assert.equal(isAllowedBlogEmbedUrl('https://www.youtube.com/embed/a'), false);
  });
});
