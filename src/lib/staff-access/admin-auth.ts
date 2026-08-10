import { ADMIN_AUTH_DISABLED } from 'astro:env/server';
import { isAdminAuthBypassed } from '../auth/admin-mode.ts';
import { adminApiError } from './http.ts';

/** Defense-in-depth for API handlers; middleware performs the live Sanity check. */
export function requireAdminApiAccess(locals: App.Locals): Response | null {
  if (isAdminAuthBypassed({
    dev: import.meta.env.DEV,
    disabled: ADMIN_AUTH_DISABLED,
  })) {
    return null;
  }
  if (!locals.user) return adminApiError('UNAUTHENTICATED');
  if (!locals.staffAccess) return adminApiError('FORBIDDEN');
  return null;
}
