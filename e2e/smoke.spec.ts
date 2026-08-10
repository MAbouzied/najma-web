import { expect, test } from '@playwright/test';
import { CRITICAL_ROUTES, gotoReady, trackPageErrors } from './helpers';

test.describe('public page smoke', () => {
  for (const route of CRITICAL_ROUTES) {
    test(`${route.path} loads with ${route.lang}/${route.dir}`, async ({ page }) => {
      const getErrors = trackPageErrors(page);
      await gotoReady(page, route.path);

      await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
      await expect(page.locator('html')).toHaveAttribute('dir', route.dir);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('a.skip-link')).toBeAttached();

      expect(getErrors(), `console/page errors on ${route.path}`).toEqual([]);
    });
  }

  test('branded 404 returns status 404', async ({ request }) => {
    const response = await request.get('/this-route-does-not-exist-nagm/');
    expect(response.status()).toBe(404);
    const body = await response.text();
    expect(body).toMatch(/الصفحة غير موجودة|Page not found/);
    expect(body).toMatch(/id="main-content"/);
  });

  test('missing static asset returns 404', async ({ request }) => {
    const response = await request.get('/_astro/nonexistent-file.abc123.js');
    expect(response.status()).toBe(404);
  });
});
