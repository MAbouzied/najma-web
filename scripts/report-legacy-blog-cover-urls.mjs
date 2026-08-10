/**
 * Lists published/draft blog posts that still use a legacy external coverUrl
 * instead of a Sanity image asset. Run with Sanity env vars available:
 *
 *   node --env-file=.dev.vars scripts/report-legacy-blog-cover-urls.mjs
 */
import { createClient } from '@sanity/client';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION || '2025-01-01';
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!projectId || !dataset || !token) {
  console.error('Missing SANITY_PROJECT_ID, SANITY_DATASET, or a Sanity token.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
  perspective: 'raw',
});

const rows = await client.fetch(`
  *[_type == "blogPost" && defined(coverUrl) && !defined(cover.asset)]{
    _id,
    title,
    "slug": slug.current,
    coverUrl
  } | order(_updatedAt desc)
`);

if (!rows.length) {
  console.log('No legacy external cover URLs found.');
  process.exit(0);
}

console.log(`Found ${rows.length} legacy cover URL(s):\n`);
for (const row of rows) {
  console.log(`- ${row._id} | ${row.slug || '(no-slug)'} | ${row.title || '(untitled)'}`);
  console.log(`  ${row.coverUrl}`);
}
