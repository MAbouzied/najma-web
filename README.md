# Najma Spa

Static Astro website for Najma Spa, deployed to Cloudflare Workers.

## Requirements

- Node.js 22.12 or newer
- npm

## Local development

```sh
npm install
npm run dev
```

## Validation

```sh
npm test
```

This builds the production site and runs the automated tests.

## Cloudflare deployment

The production site is built into `dist/` and served by the existing
`najma-web` Cloudflare Worker.

```sh
npm run preview:cf
npm run deploy
```

For Cloudflare Git integration, use:

- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Build output directory: `dist` (only when the dashboard requests it)
- Node.js version: `22`

Set `SITE_URL` to the site's final HTTPS origin in Cloudflare if it differs
from the default `https://nagmspa.com`.

The previous Next.js implementation is preserved on the `nextjs` branch.
