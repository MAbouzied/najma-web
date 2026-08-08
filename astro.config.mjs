// @ts-check
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import { cacheCloudflare } from '@astrojs/cloudflare/cache';
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { getBlogSitemapPages } from './src/lib/blog-sitemap-pages.ts';

const site = 'https://najma-web.mohamed-abouzied.workers.dev';

export default defineConfig({
  site,
  adapter: cloudflare({ imageService: 'compile' }),
  cache: { provider: cacheCloudflare() },
  trailingSlash: 'ignore',
  env: {
    schema: {
      GOOGLE_SERVICE_ACCOUNT_EMAIL: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_PRIVATE_KEY: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_SHEET_ID: envField.string({
        context: 'server',
        access: 'public',
        default: '1QK0DCOr52q6wbbNvuPJchCvOgL3HlLab2eaLiX87QDA',
      }),
      GOOGLE_BOOKINGS_SHEET_NAME: envField.string({ context: 'server', access: 'public', default: 'Bookings' }),
      GOOGLE_CUSTOMERS_SHEET_NAME: envField.string({ context: 'server', access: 'public', default: 'Customers' }),
      BLOG_PROVIDER: envField.enum({
        context: 'server',
        access: 'public',
        values: ['mock', 'sanity'],
        optional: true,
        default: 'mock',
      }),
      SANITY_PROJECT_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      SANITY_DATASET: envField.string({ context: 'server', access: 'secret', optional: true }),
      SANITY_API_VERSION: envField.string({ context: 'server', access: 'secret', optional: true }),
      SANITY_API_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      SANITY_WRITE_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      BLOG_REVALIDATE_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      // Separate private dataset used only for staff authorization and management.
      SANITY_AUTH_DATASET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
        default: 'staff-auth',
      }),
      SANITY_AUTH_TOKEN: envField.string({ context: 'server', access: 'secret', optional: true }),
      ADMIN_AUTH_DISABLED: envField.boolean({
        context: 'server',
        access: 'secret',
        optional: true,
        default: false,
      }),
      PUBLIC_SANITY_STUDIO_URL: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      BETTER_AUTH_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      BETTER_AUTH_URL: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_CLIENT_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
      GOOGLE_CLIENT_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({
      customPages: getBlogSitemapPages(site),
      i18n: {
        defaultLocale: 'ar',
        locales: { ar: 'ar', en: 'en' },
      },
      filter: (page) => {
        try {
          const path = new URL(page).pathname;
          return !/\/(book|go|api|admin|login)(\/|$)/.test(path);
        } catch {
          return !/\/(book|go|api|admin|login)(\/|$)/.test(page);
        }
      },
      // Blog is Arabic-only — keep a self hreflang=ar alternate, never invent /en/blogs*.
      serialize(item) {
        try {
          const path = new URL(item.url).pathname;
          if (path === '/blogs/' || path.startsWith('/blogs/')) {
            return {
              ...item,
              links: [{ url: item.url, lang: 'ar' }],
            };
          }
        } catch {
          /* keep default item */
        }
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
