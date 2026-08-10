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

export const GET: APIRoute = async ({ locals, request }) => {
  const denied = requireAdminApiAccess(locals);
  if (denied) return withSecurityHeaders(denied);
  const limited = await enforceRateLimit(
    env.ADMIN_RATE_LIMITER,
    `admin-users-read:${rateLimitActor(request, locals.user?.id)}`,
  );
  if (limited) return withSecurityHeaders(limited);

  try {
    const users = await getStaffAccessService().list(locals.user?.email);
    return withSecurityHeaders(privateJson({ users }));
  } catch (error) {
    return withSecurityHeaders(adminApiErrorFrom(error));
  }
};

export const POST: APIRoute = async ({ locals, request }) => {
  const denied = requireAdminApiAccess(locals);
  if (denied) return withSecurityHeaders(denied);
  if (!hasSameOrigin(request)) return withSecurityHeaders(adminApiError('FORBIDDEN'));
  const limited = await enforceRateLimit(
    env.ADMIN_RATE_LIMITER,
    `admin-users-write:${rateLimitActor(request, locals.user?.id)}`,
  );
  if (limited) return withSecurityHeaders(limited);

  try {
    const user = await getStaffAccessService().create(await readEmailBody(request));
    return withSecurityHeaders(privateJson({ user: { ...user, isCurrent: false } }, 201));
  } catch (error) {
    if (error instanceof StaffRequestBodyError) {
      return withSecurityHeaders(privateJson({ error: error.message }, error.status));
    }
    return withSecurityHeaders(adminApiErrorFrom(error));
  }
};
