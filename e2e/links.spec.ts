import { expect, test } from '@playwright/test';
import { CRITICAL_ROUTES, isInternalPath } from './helpers';

/**
 * Internal-only link regression.
 * External social/maps reachability is intentionally excluded (flaky off-network).
 */
test.describe('internal link integrity', () => {
  test('critical pages expose only resolvable internal anchors', async ({ page, request, baseURL }) => {
    const origin = new URL(baseURL || 'http://127.0.0.1:4323').origin;
    const discovered = new Set<string>();

    for (const route of CRITICAL_ROUTES) {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      const pagePath = new URL(page.url()).pathname;
      const hrefs = await page.$$eval('a[href]', (anchors) =>
        anchors.map((anchor) => (anchor as HTMLAnchorElement).href),
      );
      for (const href of hrefs) {
        if (!isInternalPath(href, origin)) continue;
        const url = new URL(href);
        // In-page fragments are validated by dist tests.
        if (url.pathname === pagePath && url.hash) continue;
        discovered.add(`${url.pathname}${url.search}`);
      }
    }

    const failures: string[] = [];
    for (const path of [...discovered].sort()) {
      // Blog article URLs beyond listing are covered by the blog sitemap/unit suite.
      if (path.startsWith('/blogs/') && path !== '/blogs/' && !path.startsWith('/blogs/page/')) {
        continue;
      }
      if (path.startsWith('/login') || path.startsWith('/admin')) continue;

      const response = await request.get(path, { maxRedirects: 5 });
      if (response.status() >= 400) {
        failures.push(`${path} → ${response.status()}`);
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });

  test('homepage service cards link to real detail pages', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const hrefs = await page.$$eval('[data-service-card] a[href^="/services/"]', (anchors) =>
      [...new Set(anchors.map((anchor) => (anchor as HTMLAnchorElement).getAttribute('href') || ''))].filter(
        Boolean,
      ),
    );
    expect(hrefs.length).toBeGreaterThanOrEqual(13);

    for (const href of hrefs) {
      const response = await request.get(href!);
      expect(response.status(), href!).toBeLessThan(400);
    }
  });
});
