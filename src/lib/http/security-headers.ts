/**
 * Baseline browser security headers for SSR/API responses.
 *
 * CSP, reporting CSP, COOP, COEP, CORP, and X-Frame-Options are stripped.
 * Snapchat and Meta event setup tools frame the site, inject their overlay,
 * and talk to window.opener. Any of those headers blocks button selection.
 */
const STRIPPED_HEADERS = [
  'Content-Security-Policy',
  'Content-Security-Policy-Report-Only',
  'X-Frame-Options',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Embedder-Policy',
  'Cross-Origin-Resource-Policy',
] as const;

export const BASELINE_SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'X-XSS-Protection': '0',
};

export function withSecurityHeaders(response: Response, extra: Record<string, string> = {}): Response {
  const headers = new Headers(response.headers);
  for (const name of STRIPPED_HEADERS) headers.delete(name);
  for (const [name, value] of Object.entries(BASELINE_SECURITY_HEADERS)) {
    if (!headers.has(name)) headers.set(name, value);
  }
  for (const [name, value] of Object.entries(extra)) {
    headers.set(name, value);
  }
  for (const name of STRIPPED_HEADERS) headers.delete(name);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
