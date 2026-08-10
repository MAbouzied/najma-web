import { BLOG_PAGE_SIZE } from '../modules/blog/model/blog-types.ts';
import type { BlogPost } from '../modules/blog/model/blog-types.ts';
import { listingPathForPage, selectListing } from '../modules/blog/lib/blog-selectors.ts';
import { escapeXml, toSitemapLastmod } from './xml.ts';

export interface BlogSitemapEntry {
  loc: string;
  lastmod?: string;
}

export function buildBlogSitemapEntries(
  origin: string,
  posts: readonly BlogPost[],
): BlogSitemapEntry[] {
  const base = origin.replace(/\/$/, '');
  const listing = selectListing(posts);
  const entries: BlogSitemapEntry[] = [
    { loc: `${base}/blogs/` },
  ];

  const totalRecentPages = Math.max(
    1,
    Math.ceil(listing.recent.length / BLOG_PAGE_SIZE),
  );
  for (let page = 2; page <= totalRecentPages; page += 1) {
    entries.push({ loc: `${base}${listingPathForPage(page)}` });
  }

  for (const post of listing.allPublished) {
    const lastmod = toSitemapLastmod(post.updatedAt ?? post.publishedAt) ?? undefined;
    entries.push({
      loc: `${base}/blogs/${post.slug}/`,
      ...(lastmod ? { lastmod } : {}),
    });
  }

  return entries;
}

export function renderBlogSitemapXml(
  origin: string,
  posts: readonly BlogPost[],
): string {
  const entries = buildBlogSitemapEntries(origin, posts);
  const body = entries.map((entry) => {
    const lastmod = entry.lastmod
      ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
      : '';
    return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${lastmod}
    <xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(entry.loc)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(entry.loc)}" />
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;
}
