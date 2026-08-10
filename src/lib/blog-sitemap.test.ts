import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { BlogPost } from '../modules/blog/model/blog-types.ts';
import { getMockPublishedPostsSync } from '../modules/blog/repository/mock-blog-repository.ts';
import { BLOG_PAGE_SIZE } from '../modules/blog/model/blog-types.ts';
import { selectListing } from '../modules/blog/lib/blog-selectors.ts';
import { buildBlogSitemapEntries, renderBlogSitemapXml } from './blog-sitemap.ts';

function stubPost(overrides: Partial<BlogPost> & Pick<BlogPost, 'id' | 'slug'>): BlogPost {
  return {
    locale: 'ar',
    title: 'عنوان',
    excerpt: 'مقدمة كافية للتحقق من خريطة الموقع.',
    category: { id: 'general', label: 'عام' },
    author: { name: 'فريق نجم سبا' },
    cover: { src: '/assets/a.jpg', alt: 'صورة', width: 1200, height: 630 },
    publishedAt: '2026-01-01T00:00:00.000Z',
    featured: false,
    draft: false,
    seo: {},
    body: { format: 'html', html: '<p>نص</p>' },
    ...overrides,
  };
}

describe('blog sitemap', () => {
  it('matches the selected repository posts and excludes drafts/future', () => {
    const posts = getMockPublishedPostsSync();
    const entries = buildBlogSitemapEntries('https://nagmspa.com', posts);
    const locs = entries.map((entry) => entry.loc);

    assert.ok(locs.includes('https://nagmspa.com/blogs/'));
    for (const post of posts) {
      assert.ok(locs.includes(`https://nagmspa.com/blogs/${post.slug}/`));
    }
    assert.equal(locs.some((loc) => loc.includes('/en/blogs')), false);
    assert.equal(locs.some((loc) => loc.includes('post-future')), false);
  });

  it('includes pagination URLs when recent posts span multiple pages', () => {
    const posts = Array.from({ length: BLOG_PAGE_SIZE + 3 }, (_, index) =>
      stubPost({
        id: `post-${index + 1}`,
        slug: `article-${index + 1}`,
        publishedAt: `2026-01-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`,
      }),
    );
    const listing = selectListing(posts);
    const expectedPages = Math.ceil(listing.recent.length / BLOG_PAGE_SIZE);
    const entries = buildBlogSitemapEntries('https://nagmspa.com/', posts);
    const locs = entries.map((entry) => entry.loc);

    assert.ok(locs.includes('https://nagmspa.com/blogs/'));
    if (expectedPages >= 2) {
      assert.ok(locs.includes('https://nagmspa.com/blogs/page/2/'));
    }
  });

  it('uses updatedAt when present for lastmod and escapes XML', () => {
    const posts = [
      stubPost({
        id: 'post-xml',
        slug: 'a&b',
        publishedAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-02-03T00:00:00.000Z',
      }),
    ];
    const xml = renderBlogSitemapXml('https://nagmspa.com', posts);
    assert.match(xml, /<lastmod>2026-02-03<\/lastmod>/);
    assert.match(xml, /hreflang="ar"/);
    assert.match(xml, /hreflang="x-default"/);
    assert.match(xml, /blogs\/a&amp;b\//);
    assert.doesNotMatch(xml, /\/en\/blogs/);
  });
});
