# SEO Status Report

Generated after Phases 1–13 implementation work.
Canonical origin (unchanged pending confirmation): `https://najma-web.mohamed-abouzied.workers.dev`

## Phase 2 blocker

Confirm whether production should stay on the Workers URL or move to a custom domain such as `nagmspa.com`.
No domain guess was made; `astro.config.mjs` `site` remains the Workers origin.

## Baseline vs current

| Metric | Phase 1 baseline | After fixes |
|---|---:|---:|
| Expected routes | 58 | 58 |
| Generated HTML routes | 58 | 58 |
| Sitemap URLs | 58 | 54 |
| Missing bilingual counterparts | 0 | 0 |
| Duplicate titles / locale | 0 | 0 |
| Heuristic SEO issues | 8 | 0 |
| Automated tests | 64 pass | 100 pass |

## Completed

- Route manifest + matrix in `seo-baseline/`
- Route-specific robots (`index, follow, max-image-preview:large` default; `noindex, follow` for `/book` and `/go`)
- API `X-Robots-Tag: noindex, nofollow` + `robots.txt` `Disallow: /api/`
- Sitemap excludes `/book`, `/go`, `/api` (without falsely excluding `/offers/golden`)
- Shared localized views for all major routes; thin Arabic/English page wrappers
- Breadcrumbs locale-aware (`aria-label`, `dir`)
- English contact form/branches localization via `ContactPage`
- Structured data localized (catalogs, country, FAQ IDs/URLs, slug-based IDs, detail Service+Offer entities)
- Homepage packages included in JSON-LD
- `llms.txt` Arabic + English coverage; utility routes removed
- New test suites: route-manifest, seo-metadata-matrix, bilingual-seo, structured-data, discovery-files, link-integrity, page-semantics
- GTM files and placeholder ID left unchanged

## Remaining / external

1. Confirm production canonical domain, then update `site` and re-verify discovery files.
2. Content differentiation pass (Phase 8): reduce repeated WhatsApp copy; strengthen unique intent per service.
3. Expired-offer lifecycle policy when an offer is retired (redirect vs noindex).
4. Local Lighthouse / Core Web Vitals on desktop + mobile (Phase 12).
5. Post-deploy: Rich Results Test, Search Console sitemap submit, live crawl (Phase 14).

## Verification commands

```bash
npm run astro check
npm test
```

Both currently pass (`astro check`: 0 errors; `npm test`: 100/100).
