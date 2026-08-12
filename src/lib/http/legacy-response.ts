import { resolveLegacyRoute } from './legacy-routes.ts';
import { withSecurityHeaders } from './security-headers.ts';

/** Mistaken car-care offer URLs — soft-land on the spa offers index. */
const RETIRED_OFFER_SLUGS = new Set([
  'exterior-wash',
  'interior-wash',
  'engine-cleaning',
  'body-polishing',
]);

const GONE_HTML =
  '<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>410 — تمت إزالة الصفحة</title></head><body><h1>410 — تمت إزالة الصفحة</h1><p>هذه الصفحة لم تعد متاحة. <a href="/">العودة للرئيسية</a></p></body></html>';

function retiredOfferRedirect(pathname: string): string | null {
  const match = pathname.match(/^(\/en)?\/offers\/([^/]+)\/?$/);
  if (!match) return null;
  const slug = match[2];
  if (!RETIRED_OFFER_SLUGS.has(slug)) return null;
  return match[1] ? '/en/offers/' : '/offers/';
}

/** Keep Location headers same-origin relative and free of CRLF injection. */
function sanitizeRedirectTarget(destination: string, search = ''): string {
  const path =
    destination.startsWith('/') && !destination.startsWith('//') && !/[\r\n]/.test(destination)
      ? destination
      : '/';
  const query =
    search.startsWith('?') && !/[\r\n]/.test(search) ? search : '';
  return `${path}${query}`;
}

function redirectResponse(destination: string, search = ''): Response {
  return new Response(null, {
    status: 301,
    headers: {
      Location: sanitizeRedirectTarget(destination, search),
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

/**
 * Resolve retired-offer and WordPress legacy URLs to an early Response.
 * Used by the Cloudflare worker entry (before Astro) and Astro middleware.
 */
export function resolveLegacyResponse(pathname: string, search = ''): Response | null {
  const offerRedirect = retiredOfferRedirect(pathname.replace(/\/$/, '') || '/');
  if (offerRedirect) return redirectResponse(offerRedirect, search);

  const legacy = resolveLegacyRoute(pathname);
  if (!legacy) return null;

  if (legacy.kind === 'gone') {
    return withSecurityHeaders(
      new Response(GONE_HTML, {
        status: 410,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }),
      { 'X-Robots-Tag': 'noindex, nofollow' },
    );
  }

  return redirectResponse(legacy.destination, search);
}
