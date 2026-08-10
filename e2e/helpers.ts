import { expect, type Page } from '@playwright/test';

export const CRITICAL_ROUTES = [
  { path: '/', lang: 'ar', dir: 'rtl' },
  { path: '/en/', lang: 'en', dir: 'ltr' },
  { path: '/about/', lang: 'ar', dir: 'rtl' },
  { path: '/en/about/', lang: 'en', dir: 'ltr' },
  { path: '/services/', lang: 'ar', dir: 'rtl' },
  { path: '/en/services/', lang: 'en', dir: 'ltr' },
  { path: '/contact/', lang: 'ar', dir: 'rtl' },
  { path: '/en/contact/', lang: 'en', dir: 'ltr' },
  { path: '/blogs/', lang: 'ar', dir: 'rtl' },
  { path: '/go/', lang: 'ar', dir: 'rtl' },
  { path: '/book/', lang: 'ar', dir: 'rtl' },
] as const;

/** Browser noise that is not an application regression. */
const IGNORED_CONSOLE = [
  /frame-ancestors.*ignored when delivered via a <meta> element/i,
  /ResizeObserver loop/i,
];

export function trackPageErrors(page: Page): () => string[] {
  const errors: string[] = [];
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  page.on('console', (message) => {
    if (message.type() !== 'error') return;
    const text = message.text();
    if (IGNORED_CONSOLE.some((pattern) => pattern.test(text))) return;
    errors.push(text);
  });
  return () => errors;
}

export async function gotoReady(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  expect(response, `missing response for ${path}`).toBeTruthy();
  expect(response!.status(), `${path} status`).toBeLessThan(400);
  await expect(page.locator('main#main-content')).toBeVisible();
  return response!;
}

export function isInternalPath(href: string, origin: string): boolean {
  try {
    const url = new URL(href, origin);
    if (url.origin !== origin) return false;
    const path = url.pathname;
    if (path.startsWith('/api/')) return false;
    if (path.startsWith('/admin')) return false;
    if (path.startsWith('/_astro/')) return false;
    if (path.startsWith('/@')) return false;
    return true;
  } catch {
    return false;
  }
}
