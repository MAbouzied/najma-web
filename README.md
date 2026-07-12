# Najma Spa — Static Website

Frontend-only rebuild of [nagmspa.com](https://nagmspa.com) from the WordPress backup. No WordPress, CMS, or database dependency.

## Pages

| URL | Description |
|-----|-------------|
| `/` | Landing page (WordPress front page) |
| `/home/` | Main homepage with services |
| `/about/` | About Najma Spa |
| `/contact/` | Contact information and map |

Blog (`/المدونة/`) is excluded per project requirements.

## Development

```bash
npm install
npm run dev
```

## Production build (static export)

```bash
npm run build
```

Output is written to `out/`.

## Analytics

Set environment variables to enable tracking (disabled by default):

```env
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_GTM_ID=GTM-PFN9DZZS
NEXT_PUBLIC_GA4_ID=G-WMC25VLYMD
NEXT_PUBLIC_SNAP_PIXEL_ID=3c73e8eb-b2e1-4eb7-b0b3-28d717ed3e31
```

See `src/content/analytics.ts` for the full configuration.

## Content source

Page HTML is extracted from the WordPress backup `_elementor_element_cache` into `src/content/html/`. Images are copied to `public/assets/`. The original backup in `../public_html (1)/` and `../u211700373_24zbX.sql` is never modified.

## Forms

See [docs/FORMS.md](docs/FORMS.md) for the WPForms appointment form that requires an external service.
