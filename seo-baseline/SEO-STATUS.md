# SEO Status Report

Canonical origin: `https://nagmspa.com`

## Baseline (after Phase 3)

| Metric | Count |
|---|---:|
| Expected prerendered routes | 64 |
| Generated HTML routes | 64 |
| Static sitemap URLs | 60 |
| Live blog sitemap referenced | yes (`/sitemap-blog.xml`) |
| Branded `404.html` | yes |
| Heuristic SEO issues | 0 |
| Dist tests | 121 pass |
| Unit tests | 83 pass |
| `astro check` | 0 errors |

## Phase 3 completed

- Live repository-backed `/sitemap-blog.xml` via `customSitemaps`
- Branded 404/503 `StatusPage` + `SiteLayout` `seoMode="status"`
- Exact `1200×630` share image + truthful social image width/height/type
- Studio/Sanity `seo.ogImage` support
- Zero-hydration mobile nav + skip link to `#main-content`
- Heading text boundaries on home/About H1s
- `CollectionPage` for services/packages/offers/blog indexes
- Detail pages infer `Service` `mainEntity`
- API `X-Robots-Tag: noindex, nofollow, nosnippet` (confirmed from Phase 2)

## Phase 4 completed

- Removed unused `ClientRouter` / view transitions
- Local rasters via Astro `Image`/`Picture` (`src/assets` + `site-images` registry); SEO/OG keep public `/assets` URLs
- Blog covers emit Sanity CDN `srcset`
- Confirmed `/_astro/*` immutable + `/assets/*` 1-day/SWR headers

## Still open (Phase 5)

1. Lighthouse CI budgets (C5)
2. Split test scripts, Playwright/axe/LHCI, GitHub Actions (D3–D5)
3. Studio npm audit clean (Sanity major upgrade)

## Verification

```bash
npx astro check
npm test
node scripts/generate-seo-baseline.mjs
```
