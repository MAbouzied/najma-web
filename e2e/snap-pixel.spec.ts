import { expect, test } from '@playwright/test';
import { gotoReady, trackPageErrors } from './helpers';

const PIXEL_ID = '7c95dced-8cb1-4a0a-8ad0-b97fa9ff8316';

test.describe('Snap Pixel', () => {
  test('loads in the public head and initializes snaptr', async ({ page }) => {
    const getErrors = trackPageErrors(page);
    const pixelScript = page.waitForResponse(
      (response) =>
        response.url().includes('sc-static.net/scevent.min.js') && response.ok(),
      { timeout: 15_000 },
    );

    await gotoReady(page, '/');
    await pixelScript;

    await expect(page.locator('head meta[name="snap-pixel-id"]')).toHaveAttribute(
      'content',
      PIXEL_ID,
    );

    const snapState = await page.evaluate(() => {
      const snaptr = window.snaptr;
      return {
        isFunction: typeof snaptr === 'function',
        queuedInit: Array.isArray(snaptr?.queue)
          ? snaptr.queue.some((entry) => Array.isArray(entry) && entry[0] === 'init')
          : true,
      };
    });

    expect(snapState.isFunction).toBe(true);
    expect(getErrors().filter((error) => /Content-Security-Policy|snaptr|sc-static/i.test(error))).toEqual([]);
  });

  test('is absent from login', async ({ page }) => {
    await page.goto('/login/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('meta[name="snap-pixel-id"]')).toHaveCount(0);
    const hasSnaptr = await page.evaluate(() => typeof window.snaptr === 'function');
    expect(hasSnaptr).toBe(false);
  });
});
