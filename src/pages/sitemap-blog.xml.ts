import type { APIRoute } from 'astro';
import { getBlogRepository } from '../modules/blog/repository/get-blog-repository.ts';
import { renderBlogSitemapXml } from '../lib/blog-sitemap.ts';

export const prerender = false;

export const GET: APIRoute = async ({ site }) => {
  const origin = (site?.origin ?? 'https://nagmspa.com').replace(/\/$/, '');

  try {
    const posts = await getBlogRepository().getPublishedPosts();
    const xml = renderBlogSitemapXml(origin, posts);
    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('[sitemap-blog] failed to build live blog sitemap', error);
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><error>Blog sitemap temporarily unavailable</error>',
      {
        status: 503,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      },
    );
  }
};
