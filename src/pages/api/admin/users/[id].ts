import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { enforceRateLimit, rateLimitActor } from '../../../../lib/cloudflare/rate-limit.ts';
import { withSecurityHeaders } from '../../../../lib/http/security-headers.ts';
import { requireAdminApiAccess } from '../../../../lib/staff-access/admin-auth.ts';
import {
  StaffRequestBodyError,
  adminApiError,
  adminApiErrorFrom,
  hasSameOrigin,
  privateJson,
  readEmailBody,
} from '../../../../lib/staff-access/http.ts';
import { getStaffAccessService } from '../../../../lib/staff-access/server.ts';

export const prerender = false;

export const PATCH: APIRoute = async ({ locals, params, request }) => {
  const denied = requireAdminApiAccess(locals);
  if (denied) return withSecurityHeaders(denied);
  if (!hasSameOrigin(request)) return withSecurityHeaders(adminApiError('FORBIDDEN'));
  const limited = await enforceRateLimit(
    env.ADMIN_RATE_LIMITER,
    `admin-users-write:${rateLimitActor(request, locals.user?.id)}`,
  );
  if (limited) return withSecurityHeaders(limited);

  try {
    const user = await getStaffAccessService().updateEmail(
      params.id,
      await readEmailBody(request),
      locals.user?.email,
    );
    return withSecurityHeaders(privateJson({ user: { ...user, isCurrent: false } }));
  } catch (error) {
    if (error instanceof StaffRequestBodyError) {
      return withSecurityHeaders(privateJson({ error: error.message }, error.status));
    }
    return withSecurityHeaders(adminApiErrorFrom(error));
  }
};

export const DELETE: APIRoute = async ({ locals, params, request }) => {
  const denied = requireAdminApiAccess(locals);
  if (denied) return withSecurityHeaders(denied);
  if (!hasSameOrigin(request)) return withSecurityHeaders(adminApiError('FORBIDDEN'));
  const limited = await enforceRateLimit(
    env.ADMIN_RATE_LIMITER,
    `admin-users-write:${rateLimitActor(request, locals.user?.id)}`,
  );
  if (limited) return withSecurityHeaders(limited);

  try {
    await getStaffAccessService().delete(params.id, locals.user?.email);
    return withSecurityHeaders(privateJson({ ok: true }));
  } catch (error) {
    return withSecurityHeaders(adminApiErrorFrom(error));
  }
};
