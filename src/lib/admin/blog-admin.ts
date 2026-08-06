import { createClient, type SanityClient } from '@sanity/client';
import { BLOG_PROVIDER, SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID, SANITY_WRITE_TOKEN } from 'astro:env/server';
import { services } from '../../data/home.ts';
import { calculateReadingTimeMinutes } from '../../modules/blog/lib/reading-time.ts';
import type { BlogPost } from '../../modules/blog/model/blog-types.ts';
import { sanitizeBlogHtml, htmlToPlainText } from './blog-content.ts';

const DEFAULT_AUTHOR = 'فريق نجم سبا';
const DEFAULT_COVER = '/assets/home/hero-interior.jpg';

export type AdminPostStatus = 'draft' | 'published';

export interface AdminPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  status: AdminPostStatus;
  publishedAt: string | null;
  updatedAt: string;
  featured: boolean;
  category: string;
  author: string;
  coverUrl: string;
  coverAlt: string;
  coverAssetId: string;
  coverWidth: number | null;
  coverHeight: number | null;
  relatedServiceId: string;
}

export interface AdminPostInput {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  category?: string;
  author?: string;
  coverUrl?: string;
  coverAlt?: string;
  coverAssetId?: string;
  coverWidth?: number | null;
  coverHeight?: number | null;
  relatedServiceId?: string;
  featured?: boolean;
}

function nowIso(): string {
  return new Date().toISOString();
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || `blog-${Date.now()}`;
}

// Local mode starts empty by design. It is only an in-memory workspace for testing
// the admin editor when a database provider is not configured; no fixture posts are seeded.
const mockStore = new Map<string, AdminPost>();

function emptyAdminDraft(id: string): AdminPost {
  return {
    id,
    title: '',
    slug: '',
    excerpt: '',
    contentHtml: '',
    status: 'draft',
    publishedAt: null,
    updatedAt: nowIso(),
    featured: false,
    category: 'عام',
    author: DEFAULT_AUTHOR,
    coverUrl: '',
    coverAlt: '',
    coverAssetId: '',
    coverWidth: null,
    coverHeight: null,
    relatedServiceId: '',
  };
}

export async function reserveAdminDraft(reservationId: string): Promise<AdminPost> {
  const id = reservationId.trim();
  if (!id || !/^[a-zA-Z0-9_-]{8,100}$/.test(id)) throw new Error('معرف المسودة غير صالح.');
  if (BLOG_PROVIDER !== 'sanity') {
    const existing = mockStore.get(id);
    if (existing) {
      if (existing.status !== 'draft') throw new Error('لا يمكن استخدام معرف مقال منشور لمسودة جديدة.');
      return existing;
    }
    const draft = emptyAdminDraft(id);
    mockStore.set(id, draft);
    return draft;
  }

  const existing = await getAdminPost(id);
  if (existing) {
    if (existing.status !== 'draft') throw new Error('لا يمكن استخدام معرف مقال منشور لمسودة جديدة.');
    return existing;
  }
  const client = getSanityClient();
  const now = nowIso();
  const categoryId = 'blog-category-general';
  const authorId = 'blog-author-default';
  await client.createOrReplace({ _id: categoryId, _type: 'blogCategory', categoryId: { _type: 'slug', current: 'general' }, label: 'عام' });
  await client.createOrReplace({ _id: authorId, _type: 'blogAuthor', name: DEFAULT_AUTHOR });
  await client.createOrReplace({
    _id: `drafts.${id}`,
    _type: 'blogPost',
    locale: 'ar',
    title: '',
    slug: { _type: 'slug', current: '' },
    excerpt: '',
    bodyFormat: 'html',
    bodyHtml: '',
    updatedAt: now,
    featured: false,
    category: { _type: 'reference', _ref: categoryId },
    author: { _type: 'reference', _ref: authorId },
  });
  return (await getAdminPost(id)) ?? emptyAdminDraft(id);
}

function toPublicPost(post: AdminPost): BlogPost | null {
  if (post.status !== 'published' || !post.title.trim() || !post.excerpt.trim() || !post.contentHtml.trim()) return null;
  const publishedAt = post.publishedAt ?? post.updatedAt;
  return {
    id: post.id,
    slug: post.slug,
    locale: 'ar',
    title: post.title,
    excerpt: post.excerpt,
    category: { id: 'general', label: post.category || 'عام' },
    author: { name: post.author || DEFAULT_AUTHOR },
    cover: {
      src: post.coverUrl || DEFAULT_COVER,
      alt: post.coverAlt || post.title,
      width: post.coverWidth ?? 1600,
      height: post.coverHeight ?? 1067,
    },
    publishedAt,
    updatedAt: post.updatedAt,
    featured: post.featured,
    draft: false,
    seo: {},
    body: { format: 'html', html: sanitizeBlogHtml(post.contentHtml) },
    relatedServiceId: post.relatedServiceId || undefined,
    readingTimeMinutes: calculateReadingTimeMinutes(htmlToPlainText(post.contentHtml)),
  };
}

export function getMockAdminPublishedPostsSync(): BlogPost[] {
  return Array.from(mockStore.values())
    .map(toPublicPost)
    .filter((post): post is BlogPost => Boolean(post))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

function listMock(): AdminPost[] {
  return Array.from(mockStore.values()).sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

function saveMock(id: string | undefined, input: AdminPostInput, publish: boolean): AdminPost {
  const timestamp = nowIso();
  const existing = id ? mockStore.get(id) : undefined;
  const post: AdminPost = {
    id: id ?? `post-${crypto.randomUUID()}`,
    title: input.title.trim(),
    slug: slugify(input.slug || input.title),
    excerpt: input.excerpt.trim(),
    contentHtml: sanitizeBlogHtml(input.contentHtml),
    status: publish ? 'published' : 'draft',
    publishedAt: publish ? (existing?.publishedAt ?? timestamp) : (existing?.publishedAt ?? null),
    updatedAt: timestamp,
    featured: input.featured === true,
    category: input.category?.trim() || existing?.category || 'عام',
    author: input.author?.trim() || existing?.author || DEFAULT_AUTHOR,
    coverUrl: input.coverUrl?.trim() || existing?.coverUrl || DEFAULT_COVER,
    coverAlt: input.coverAlt?.trim() || existing?.coverAlt || input.title.trim(),
    coverAssetId: input.coverAssetId?.trim() || existing?.coverAssetId || '',
    coverWidth: input.coverWidth ?? existing?.coverWidth ?? null,
    coverHeight: input.coverHeight ?? existing?.coverHeight ?? null,
    relatedServiceId: input.relatedServiceId?.trim() || existing?.relatedServiceId || '',
  };
  mockStore.set(post.id, post);
  return post;
}

function getSanityClient(): SanityClient {
  if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_VERSION || !SANITY_WRITE_TOKEN) {
    throw new Error('Sanity admin writes require SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION and SANITY_WRITE_TOKEN.');
  }
  return createClient({ projectId: SANITY_PROJECT_ID, dataset: SANITY_DATASET, apiVersion: SANITY_API_VERSION, token: SANITY_WRITE_TOKEN, useCdn: false, perspective: 'raw' });
}

function sanityProjection(): string {
  return `{ _id, title, "slug": slug.current, excerpt, "contentHtml": bodyHtml, publishedAt, updatedAt, featured, "status": select(_id match "drafts.*" => "draft", defined(publishedAt) => "published", "draft"), "category": category->label, "author": author->name, "coverUrl": coalesce(cover.asset->url, coverUrl), "coverAssetId": cover.asset._ref, "coverWidth": cover.asset->metadata.dimensions.width, "coverHeight": cover.asset->metadata.dimensions.height, "coverAlt": cover.alt, relatedServiceId }`;
}

function mapSanityAdmin(raw: Record<string, unknown>): AdminPost {
  return {
    id: String(raw._id ?? '').replace(/^drafts\./, ''),
    title: String(raw.title ?? ''), slug: String(raw.slug ?? ''), excerpt: String(raw.excerpt ?? ''),
    contentHtml: sanitizeBlogHtml(String(raw.contentHtml ?? '')), status: raw.status === 'published' ? 'published' : 'draft',
    publishedAt: typeof raw.publishedAt === 'string' ? raw.publishedAt : null,
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : nowIso(), featured: raw.featured === true,
    category: String(raw.category ?? 'عام'),
    author: String(raw.author ?? DEFAULT_AUTHOR),
    coverUrl: String(raw.coverUrl ?? ''),
    coverAlt: String(raw.coverAlt ?? ''),
    coverAssetId: String(raw.coverAssetId ?? ''),
    coverWidth: typeof raw.coverWidth === 'number' ? raw.coverWidth : null,
    coverHeight: typeof raw.coverHeight === 'number' ? raw.coverHeight : null,
    relatedServiceId: String(raw.relatedServiceId ?? ''),
  };
}

export async function listAdminPosts(): Promise<AdminPost[]> {
  if (BLOG_PROVIDER !== 'sanity') return listMock();
  const client = getSanityClient();
  const rows = await client.fetch<Record<string, unknown>[]>(`*[_type == "blogPost" && locale == "ar"] | order(updatedAt desc) ${sanityProjection()}`);
  const grouped = new Map<string, AdminPost>();
  for (const row of rows ?? []) {
    const mapped = mapSanityAdmin(row);
    if (String(row._id).startsWith('drafts.')) grouped.set(mapped.id, mapped);
    else if (!grouped.has(mapped.id)) grouped.set(mapped.id, mapped);
  }
  return Array.from(grouped.values());
}

export async function getAdminPost(id: string): Promise<AdminPost | null> {
  if (BLOG_PROVIDER !== 'sanity') return mockStore.get(id) ?? null;
  const client = getSanityClient();
  const row = await client.fetch<Record<string, unknown> | null>(`coalesce(*[_id == $draftId][0], *[_id == $id][0]) ${sanityProjection()}`, { id, draftId: `drafts.${id}` });
  return row ? mapSanityAdmin(row) : null;
}

export async function saveAdminPost(id: string | undefined, input: AdminPostInput, publish: boolean): Promise<AdminPost> {
  if (BLOG_PROVIDER !== 'sanity') return saveMock(id, input, publish);
  const client = getSanityClient();
  const documentId = id ?? crypto.randomUUID();
  const existing = id ? await getAdminPost(documentId) : null;
  const coverAssetId = input.coverAssetId !== undefined ? input.coverAssetId.trim() : (existing?.coverAssetId ?? '');
  const categoryId = 'blog-category-general';
  const authorId = 'blog-author-default';
  await client.createOrReplace({ _id: categoryId, _type: 'blogCategory', categoryId: { _type: 'slug', current: 'general' }, label: input.category?.trim() || 'عام' });
  await client.createOrReplace({ _id: authorId, _type: 'blogAuthor', name: input.author?.trim() || DEFAULT_AUTHOR });
  const doc = {
    _id: publish ? documentId : `drafts.${documentId}`,
    _type: 'blogPost', locale: 'ar', title: input.title.trim(), slug: { _type: 'slug', current: slugify(input.slug || input.title) }, excerpt: input.excerpt.trim(),
    bodyFormat: 'html', bodyHtml: sanitizeBlogHtml(input.contentHtml), publishedAt: publish ? nowIso() : undefined, updatedAt: nowIso(), featured: input.featured === true,
    category: { _type: 'reference', _ref: categoryId }, author: { _type: 'reference', _ref: authorId }, relatedServiceId: input.relatedServiceId?.trim() || undefined,
    coverUrl: coverAssetId ? undefined : (input.coverUrl?.trim() || existing?.coverUrl || undefined),
    ...(coverAssetId ? {
      cover: {
        _type: 'blogImage',
        asset: { _type: 'reference', _ref: coverAssetId },
        alt: input.coverAlt?.trim() || existing?.coverAlt || input.title.trim(),
      },
    } : {}),
  };
  await client.createOrReplace(doc);
  if (publish) await client.delete(`drafts.${documentId}`).catch(() => undefined);
  return (await getAdminPost(documentId)) ?? mapSanityAdmin(doc as unknown as Record<string, unknown>);
}

export async function setAdminPostStatus(id: string, publish: boolean): Promise<AdminPost | null> {
  const existing = await getAdminPost(id);
  if (!existing) return null;
  if (publish && (!existing.title.trim() || !existing.excerpt.trim() || !htmlToPlainText(existing.contentHtml))) {
    throw new Error('المقال يحتاج عنواناً ومقدمة ومحتوى قبل النشر.');
  }
  if (publish && BLOG_PROVIDER === 'sanity' && !existing.coverAssetId && !existing.coverUrl.trim()) {
    throw new Error('أضف صورة رئيسية من خلال رفع ملف أو إدخال رابط صورة قبل نشر المقال.');
  }
  const updated = await saveAdminPost(id, { ...existing, contentHtml: existing.contentHtml }, publish);
  if (!publish && BLOG_PROVIDER === 'sanity') {
    await getSanityClient().delete(id).catch(() => undefined);
  }
  return updated;
}

export async function deleteAdminPost(id: string): Promise<void> {
  if (BLOG_PROVIDER !== 'sanity') { mockStore.delete(id); return; }
  const client = getSanityClient();
  await client.delete(id).catch(() => undefined);
  await client.delete(`drafts.${id}`).catch(() => undefined);
}

export function listAdminServices(): Array<{ id: string; title: string }> {
  return services.map((service) => ({ id: service.slug, title: service.title.ar }));
}

export async function uploadAdminImage(file: File): Promise<{ assetId: string; url: string; width: number | null; height: number | null }> {
  if (BLOG_PROVIDER !== 'sanity') {
    throw new Error('رفع الصور يحتاج BLOG_PROVIDER=sanity مع إعدادات Sanity كاملة.');
  }
  const client = getSanityClient();
  const asset = await client.assets.upload('image', file, {
    filename: file.name || 'blog-cover',
    contentType: file.type || undefined,
  });
  return {
    assetId: asset._id,
    url: asset.url,
    width: 'metadata' in asset && asset.metadata?.dimensions ? asset.metadata.dimensions.width : null,
    height: 'metadata' in asset && asset.metadata?.dimensions ? asset.metadata.dimensions.height : null,
  };
}
