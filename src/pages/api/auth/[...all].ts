import type { APIRoute } from 'astro';
import { getAuth } from '../../../lib/auth/server.ts';
import { withSecurityHeaders } from '../../../lib/http/security-headers.ts';

export const prerender = false;

export const ALL: APIRoute = async (context) => {
  try {
    const auth = getAuth();
    const response = await auth.handler(context.request);
    if (
      context.url.pathname.endsWith('/callback/google')
      && response.status >= 500
    ) {
      return withSecurityHeaders(new Response(
        'Staff access is temporarily unavailable. Please try again later.',
        {
          status: 503,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'private, no-store',
            'X-Robots-Tag': 'noindex, nofollow',
          },
        },
      ));
    }
    return withSecurityHeaders(response);
  } catch (error) {
    console.error('[auth] unexpected failure', { error });
    return withSecurityHeaders(new Response('Authentication is temporarily unavailable.', {
      status: 503,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }));
  }
};
