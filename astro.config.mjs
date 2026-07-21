// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';

const { SITE_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const configuredSite = SITE_URL?.trim();
let site = configuredSite || 'https://nagmspa.com';

if (configuredSite) {
  const parsedSite = new URL(configuredSite);
  const isOriginOnly =
    parsedSite.pathname === '/' &&
    !parsedSite.search &&
    !parsedSite.hash &&
    !parsedSite.username &&
    !parsedSite.password;

  if (parsedSite.protocol !== 'https:' || !isOriginOnly) {
    throw new Error('SITE_URL must be an HTTPS origin without a path, query, credentials, or hash.');
  }

  site = parsedSite.origin;
}

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
