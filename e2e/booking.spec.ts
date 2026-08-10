import { expect, test } from '@playwright/test';

const EXPECTED_PHONE = '966579777407';

async function captureWhatsApp(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    (window as Window & { __waCapture?: string | null }).__waCapture = null;
    window.open = ((url?: string | URL) => {
      const href = typeof url === 'string' ? url : String(url ?? '');
      (window as Window & { __waCapture?: string | null }).__waCapture = href;
      return {
        closed: false,
        close() {},
        location: {
          get href() {
            return (window as Window & { __waCapture?: string | null }).__waCapture || 'about:blank';
          },
          set href(value: string) {
            (window as Window & { __waCapture?: string | null }).__waCapture = String(value);
          },
        },
      } as Window;
    }) as typeof window.open;
  });
}

test.describe('booking WhatsApp flow', () => {
  test('Arabic booking deep-link preselects and opens WhatsApp', async ({ page }) => {
    await page.route('**/api/customers**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto(
      // Matches BookingForm data-ar for massage-relaxation
      '/book/?department=service&item=%D9%85%D8%B3%D8%A7%D8%AC%20%D8%A7%D8%B3%D8%AA%D8%B1%D8%AE%D8%A7%D8%A1',
      { waitUntil: 'networkidle' },
    );
    await expect(page.locator('#booking-form')).toBeVisible();

    const selected = page.locator('#booking-form select[name="booking"]');
    await expect
      .poll(async () => selected.inputValue(), { timeout: 10_000 })
      .toMatch(/^service:/);

    await page.fill('#booking-form input[name="name"]', 'Browser Regression');
    await page.fill('#booking-form input[name="phone"]', '0551234567');
    await captureWhatsApp(page);
    await page.click('#booking-form button[type="submit"]');

    await page.waitForFunction(
      () => Boolean((window as Window & { __waCapture?: string | null }).__waCapture),
      null,
      { timeout: 10_000 },
    );

    const whatsappUrl = await page.evaluate(
      () => (window as Window & { __waCapture?: string | null }).__waCapture || '',
    );
    expect(whatsappUrl).toContain('api.whatsapp.com');
    const url = new URL(whatsappUrl);
    expect(url.searchParams.get('phone')).toBe(EXPECTED_PHONE);
    const message = url.searchParams.get('text') || '';
    expect(message).toContain('Browser Regression');
    expect(message).toContain('0551234567');
  });
});
