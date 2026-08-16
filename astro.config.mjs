// @ts-check
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import { cacheCloudflare } from '@astrojs/cloudflare/cache';
import { defineConfig, envField } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = 'https://nagmspa.com';

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
      PUBLIC_GA_MEASUREMENT_ID: envField.string({
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
  security: {
    checkOrigin: true,
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
        // Clickjacking protection is set on the HTTP response (meta CSP cannot express it).
        "object-src 'none'",
        "connect-src 'self' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://sc-static.net https://tr.snapchat.com https://*.snapchat.com",
        "img-src 'self' data: blob: https://cdn.sanity.io https://*.googleusercontent.com https://*.google-analytics.com https://tr.snapchat.com https://*.snapchat.com",
        "font-src 'self'",
        "frame-src https://www.googletagmanager.com https://www.youtube-nocookie.com https://player.vimeo.com https://tr.snapchat.com https://*.snapchat.com",
        "media-src 'self' https://cdn.sanity.io",
      ],
      scriptDirective: {
        // Keep false: 'strict-dynamic' disables host allowlisting, so Astro's
        // <script type="module" src="/_astro/..."> tags are blocked (hashes only
        // match inline bodies). Same-origin modules use 'self'; GTM uses the host below.
        strictDynamic: false,
        resources: [
          { resource: "'self'", kind: 'element' },
          {
            resource: 'https://www.googletagmanager.com',
            kind: 'element',
          },
          {
            resource: 'https://sc-static.net',
            kind: 'element',
          },
          {
            resource: 'https://tr.snapchat.com',
            kind: 'element',
          },
          { resource: "'none'", kind: 'attribute' },
        ],
      },
      styleDirective: {
        resources: [
          { resource: "'self'", kind: 'element' },
          { resource: "'unsafe-inline'", kind: 'attribute' },
        ],
      },
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
      // Live blog URLs come from SSR `/sitemap-blog.xml` (repository-backed).
      customSitemaps: [`${site}/sitemap-blog.xml`],
      i18n: {
        defaultLocale: 'ar',
        locales: { ar: 'ar', en: 'en' },
      },
      filter: (page) => {
        try {
          const path = new URL(page).pathname;
          return !/\/(book|go|form|api|admin|login|blogs)(\/|$)/.test(path);
        } catch {
          return !/\/(book|go|form|api|admin|login|blogs)(\/|$)/.test(page);
        }
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
