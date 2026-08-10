import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { blogMutationCacheTags } from '../../../../modules/blog/cache.ts';
import {
  deleteAdminPost,
  getAdminPost,
  listAdminPosts,
  listAdminServices,
  reserveAdminDraft,
  saveAdminPost,
  setAdminPostStatus,
  uploadAdminImage,
} from '../../../../lib/admin/blog-admin.ts';
import {
  isAdminBlogNotFoundError,
  parseAdminPostId,
  readAdminPostPayload,
} from '../../../../lib/admin/blog-admin-helpers.ts';
import { enforceRateLimit, rateLimitActor } from '../../../../lib/cloudflare/rate-limit.ts';
import {
  BODY_LIMITS,
  assertSafeImageBytes,
  isRequestBodyTooLargeError,
  isUnsupportedMediaTypeError,
  readLimitedBytes,
  readLimitedJson,
} from '../../../../lib/http/request-body.ts';
import { withSecurityHeaders } from '../../../../lib/http/security-headers.ts';
import { requireAdminApiAccess } from '../../../../lib/staff-access/admin-auth.ts';
import { adminApiError, hasSameOrigin } from '../../../../lib/staff-access/http.ts';

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

function notFound(): Response {
  return json({ error: 'المقال غير موجود' }, 404);
}

function isCuratedAdminMessage(message: string): boolean {
  if (message.length === 0 || message.length > 220) return false;
  if (/SANITY_|BETTER_AUTH|GOOGLE_|ADMIN_|process\.|node_modules|at\s+\S+\s+\(/i.test(message)) {
    return false;
  }
  return /[\u0600-\u06FF]/.test(message);
}

function toErrorResponse(error: unknown, requestId: string): Response {
  if (isAdminBlogNotFoundError(error)) return notFound();
  if (isRequestBodyTooLargeError(error)) {
    return json({ error: 'حجم الطلب أكبر من المسموح.' }, 413);
  }
  if (isUnsupportedMediaTypeError(error)) {
    return json({ error: error.message }, 415);
  }
  if (error instanceof Error && isCuratedAdminMessage(error.message)) {
    return json({ error: error.message }, 400);
  }
  console.error('[admin-blog] unexpected failure', { error, requestId });
  return json({ error: 'تعذر تنفيذ العملية حالياً.' }, 500);
}

async function readPayload(request: Request) {
  const payload = await readLimitedJson(request, BODY_LIMITS.blogEditorJson) as Partial<Record<string, unknown>>;
  return readAdminPostPayload(payload);
}

async function invalidateBlogCache(context: Parameters<APIRoute>[0], postId: string): Promise<void> {
  if (!context.cache?.enabled) return;
  try {
    await context.cache.invalidate({ tags: blogMutationCacheTags(postId) });
  } catch (error) {
    console.error(`Blog cache invalidation failed for ${postId}`, error);
  }
}

async function guardAdminMutation(
  locals: App.Locals,
  request: Request,
): Promise<Response | null> {
  const denied = requireAdminApiAccess(locals);
  if (denied) return withSecurityHeaders(denied);
  if (!hasSameOrigin(request)) return withSecurityHeaders(adminApiError('FORBIDDEN'));
  const limited = await enforceRateLimit(
    env.ADMIN_RATE_LIMITER,
    `admin-mutation:${rateLimitActor(request, locals.user?.id)}`,
  );
  return limited ? withSecurityHeaders(limited) : null;
}

export const GET: APIRoute = async ({ params, locals, request }) => {
  const denied = requireAdminApiAccess(locals);
  if (denied) return withSecurityHeaders(denied);
  const limited = await enforceRateLimit(
    env.ADMIN_RATE_LIMITER,
    `admin-read:${rateLimitActor(request, locals.user?.id)}`,
  );
  if (limited) return withSecurityHeaders(limited);

  const path = (params.path ?? '').split('/').filter(Boolean);
  try {
    if (path.length === 0 || path[0] === 'posts') {
      if (path[1]) {
        const id = parseAdminPostId(path[1]);
        const post = await getAdminPost(id);
        if (!post) return notFound();
        return json(post);
      }
      return json({ posts: await listAdminPosts(), services: listAdminServices() });
    }
    if (path[0] === 'services') return json({ services: listAdminServices() });
    return json({ error: 'غير موجود' }, 404);
  } catch (error) {
    return toErrorResponse(error, crypto.randomUUID());
  }
};

export const POST: APIRoute = async (context) => {
  const { params, locals, request } = context;
  const blocked = await guardAdminMutation(locals, request);
  if (blocked) return blocked;
  const path = (params.path ?? '').split('/').filter(Boolean);
  const requestId = crypto.randomUUID();
  try {
    if (path[0] === 'assets') {
      if (path[1] === 'import') return json({ error: 'غير موجود' }, 404);
      const bytes = await readLimitedBytes(request, BODY_LIMITS.imageUpload);
      const image = assertSafeImageBytes(bytes);
      return json(await uploadAdminImage({
        bytes,
        filename: image.filename,
        contentType: image.mime,
      }), 201);
    }
    if (path[0] === 'posts') {
      if (path[1] === 'reserve') {
        const payload = await readLimitedJson(request, BODY_LIMITS.staffJson) as { reservationId?: unknown };
        const reservationId = typeof payload.reservationId === 'string' ? payload.reservationId : '';
        return json(await reserveAdminDraft(reservationId), 201);
      }
      if (path[1] && path[2] === 'publish') {
        const id = parseAdminPostId(path[1]);
        const post = await setAdminPostStatus(id, true);
        if (!post) return notFound();
        await invalidateBlogCache(context, post.id);
        return json(post);
      }
      if (path[1] && path[2] === 'unpublish') {
        const id = parseAdminPostId(path[1]);
        const post = await setAdminPostStatus(id, false);
        if (!post) return notFound();
        await invalidateBlogCache(context, post.id);
        return json(post);
      }
      const post = await saveAdminPost(undefined, await readPayload(request), false);
      await invalidateBlogCache(context, post.id);
      return json(post, 201);
    }
    return json({ error: 'غير موجود' }, 404);
  } catch (error) {
    return toErrorResponse(error, requestId);
  }
};

export const PUT: APIRoute = async (context) => {
  const { params, locals, request } = context;
  const blocked = await guardAdminMutation(locals, request);
  if (blocked) return blocked;
  const path = (params.path ?? '').split('/').filter(Boolean);
  if (path[0] !== 'posts' || !path[1]) return json({ error: 'غير موجود' }, 404);
  try {
    const id = parseAdminPostId(path[1]);
    const post = await saveAdminPost(id, await readPayload(request), false);
    await invalidateBlogCache(context, post.id);
    return json(post);
  } catch (error) {
    return toErrorResponse(error, crypto.randomUUID());
  }
};

export const DELETE: APIRoute = async (context) => {
  const { params, locals, request } = context;
  const blocked = await guardAdminMutation(locals, request);
  if (blocked) return blocked;
  const path = (params.path ?? '').split('/').filter(Boolean);
  if (path[0] !== 'posts' || !path[1]) return json({ error: 'غير موجود' }, 404);
  try {
    const id = parseAdminPostId(path[1]);
    await deleteAdminPost(id);
    await invalidateBlogCache(context, id);
    return json({ ok: true });
  } catch (error) {
    return toErrorResponse(error, crypto.randomUUID());
  }
};
