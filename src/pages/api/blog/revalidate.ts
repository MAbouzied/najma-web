import type { APIRoute } from 'astro';
import { BLOG_REVALIDATE_SECRET } from 'astro:env/server';
import {
  BLOG_LISTING_CACHE_TAG,
  blogMutationCacheTags,
} from '../../../modules/blog/cache.ts';
import {
  BODY_LIMITS,
  isRequestBodyTooLargeError,
  readLimitedJson,
} from '../../../lib/http/request-body.ts';
import { withSecurityHeaders } from '../../../lib/http/security-headers.ts';

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return withSecurityHeaders(new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow, nosnippet',
    },
  }));
}

function timingSafeEqualString(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.byteLength !== right.byteLength) return false;
  let mismatch = 0;
  for (let i = 0; i < left.byteLength; i += 1) {
    mismatch |= left[i]! ^ right[i]!;
  }
  return mismatch === 0;
}

function authorize(request: Request): boolean {
  const secret = BLOG_REVALIDATE_SECRET?.trim();
  if (!secret) return false;
  const header = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${secret}`;
  return timingSafeEqualString(header, expected);
}

export const POST: APIRoute = async (context) => {
  if (!authorize(context.request)) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let postId = '';
  try {
    const payload = await readLimitedJson(context.request, BODY_LIMITS.revalidateJson) as {
      postId?: unknown;
    };
    postId = typeof payload.postId === 'string' ? payload.postId.trim() : '';
  } catch (error) {
    if (isRequestBodyTooLargeError(error)) return json({ error: 'Request too large' }, 413);
    return json({ error: 'Invalid JSON' }, 400);
  }

  const tags = postId ? blogMutationCacheTags(postId) : [BLOG_LISTING_CACHE_TAG];

  if (context.cache?.enabled) {
    try {
      await context.cache.invalidate({ tags });
    } catch (error) {
      console.error('Blog cache invalidation failed', { tags, error });
      return json({ error: 'Cache invalidation failed' }, 500);
    }
  }

  return json({ ok: true, tags });
};
