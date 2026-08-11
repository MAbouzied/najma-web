import { expect, test } from '@playwright/test';
import { gotoReady } from './helpers';

test.describe('navigation and a11y chrome', () => {
  test('skip link targets main content', async ({ page }) => {
    await gotoReady(page, '/');
    const skip = page.locator('a.skip-link');
    await skip.focus();
    await expect(skip).toBeVisible();
    await skip.press('Enter');
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('mobile nav exposes primary links without hydration', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoReady(page, '/');

    const mobileNav = page.locator('details[data-mobile-nav]');
    await expect(mobileNav).toBeVisible();
    await mobileNav.locator('summary').click();
    await expect(mobileNav).toHaveAttribute('open', '');

    const services = mobileNav.locator('a[href="/services/"]');
    await expect(services).toBeVisible();
    await services.click();
    await expect(page).toHaveURL(/\/services\/?$/);
  });

  test('language switch moves between Arabic and English homes', async ({ page }) => {
    await gotoReady(page, '/');
    await page.locator('header a[hreflang="en"]').click();
    await expect(page).toHaveURL(/\/en\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');

    await page.locator('header a[hreflang="ar"]').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  });

  test('internal nav stays soft like an SPA (no full document reload)', async ({ page }) => {
    await gotoReady(page, '/');
    await page.evaluate(() => {
      (window as Window & { __nagmSoftNavMarker?: boolean }).__nagmSoftNavMarker = true;
    });

    await page.locator('header a[href="/about/"]').first().click();
    await expect(page).toHaveURL(/\/about\/?$/);
    await expect(page.locator('main#main-content')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);

    const kept = await page.evaluate(
      () => (window as Window & { __nagmSoftNavMarker?: boolean }).__nagmSoftNavMarker === true,
    );
    expect(kept, 'window state should survive soft navigation').toBe(true);
  });
});
