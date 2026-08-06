import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { BLOG_SLUGS, DIST } from './helpers/seo-routes.mjs';
import {
  BLOG_CACHE_MAX_AGE_SECONDS,
  BLOG_CACHE_SWR_SECONDS,
  blogArticleCacheTags,
  blogListingCacheTags,
  getMockPublishedPostsSync,
} from '../src/modules/blog/index.ts';
import { sanitizeBlogHtml } from '../src/lib/blog-content.ts';

test('blog routes are server-rendered (not prerendered into dist/client)', async () => {
  await assert.rejects(() => access(join(DIST, 'blogs/index.html')));
  for (const slug of BLOG_SLUGS) {
    await assert.rejects(() => access(join(DIST, `blogs/${slug}/index.html`)));
  }
  await assert.rejects(() => access(join(DIST, 'blogs/draft-internal-notes-only/index.html')));
  await assert.rejects(() => access(join(DIST, 'blogs/maqal-mustaqbali-mukhatat/index.html')));
});

test('mock provider exposes published spa posts and hides drafts/future', () => {
  const posts = getMockPublishedPostsSync();
  const slugs = posts.map((post) => post.slug).sort();
  assert.deepEqual(slugs, [...BLOG_SLUGS].sort());
  assert.ok(posts.every((post) => post.locale === 'ar'));
  assert.ok(posts.every((post) => !post.draft));
});

test('blog cache tags and TTLs match the shared beauty-corner contract', () => {
  assert.equal(BLOG_CACHE_MAX_AGE_SECONDS, 300);
  assert.equal(BLOG_CACHE_SWR_SECONDS, 3600);
  assert.deepEqual(blogListingCacheTags(), ['blog:listings']);
  assert.deepEqual(blogArticleCacheTags('abc'), ['blog:listings', 'blog:post:abc']);
});

test('html blog bodies are sanitized before render', () => {
  const dirty = '<p>مرحبا</p><script>alert(1)</script><a href="https://example.com">رابط</a>';
  const clean = sanitizeBlogHtml(dirty);
  assert.match(clean, /<p>مرحبا<\/p>/);
  assert.match(clean, /href="https:\/\/example\.com"/);
  assert.doesNotMatch(clean, /<script/);
});
