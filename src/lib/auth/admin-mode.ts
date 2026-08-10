/**
 * Fail-closed admin auth bypass. Production always requires authentication,
 * even if ADMIN_AUTH_DISABLED is set in the environment.
 */
export function isAdminAuthBypassed(options: {
  dev: boolean;
  disabled?: boolean | null;
}): boolean {
  return options.dev === true && options.disabled === true;
}
