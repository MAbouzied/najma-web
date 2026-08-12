import { handle } from '@astrojs/cloudflare/handler';
import { resolveLegacyResponse } from './lib/http/legacy-response.ts';

type WorkerEnv = Parameters<typeof handle>[1];

/**
 * Custom Worker entry so WordPress legacy redirects run before Astro's
 * static-asset fallback (which can serve 404.html without middleware).
 */
export default {
  fetch(request: Request, env: WorkerEnv, ctx: ExecutionContext): Response | Promise<Response> {
    const url = new URL(request.url);
    // Never intercept Astro's Cloudflare prerender protocol endpoints.
    if (!url.pathname.startsWith('/__astro_')) {
      const early = resolveLegacyResponse(url.pathname, url.search);
      if (early) return early;
    }
    return handle(request, env, ctx);
  },
};
