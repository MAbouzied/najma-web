import type { Locale } from './types';
import { defaultLocale } from './types';

function withTrailingSlash(path: string): string {
  if (path === '/' || path.endsWith('/')) return path;
  return `${path}/`;
}

/** Strip /en prefix to get locale-neutral path; non-root paths keep a trailing slash */
export function stripLocalePrefix(pathname: string): string {
  let path = pathname.startsWith('/') ? pathname : `/${pathname}`;

  if (path === '/en' || path === '/en/') {
    return '/';
  }

  if (path.startsWith('/en/')) {
    path = path.slice(3);
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
  }

  return withTrailingSlash(path);
}

/** Prefix path for locale (ar has no prefix). Non-root paths always end with /. */
export function localePath(path: string, locale: Locale): string {
  const clean = withTrailingSlash(path.startsWith('/') ? path : `/${path}`);
  if (clean === '/') {
    return locale === defaultLocale ? '/' : '/en/';
  }
  if (locale === defaultLocale) return clean;
  return `/en${clean}`;
}

/** Blog is Arabic-only under /blogs — no /en/blogs counterpart. */
export function isBlogPath(pathname: string): boolean {
  const path = stripLocalePrefix(pathname);
  return path === '/blogs/' || path.startsWith('/blogs/');
}

export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  if (isBlogPath(pathname)) {
    return localePath('/', targetLocale);
  }
  return localePath(stripLocalePrefix(pathname), targetLocale);
}

export function getLocaleFromPathname(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ar';
}
