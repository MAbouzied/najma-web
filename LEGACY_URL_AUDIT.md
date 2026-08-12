# Legacy WordPress URL Audit

**Audit date:** 2026-08-12  
**Query:** `site:nagmspa.com` (Google Search, 4 pages via Playwright)  
**Indexed unique URLs found:** 34  
**Supplementary source:** prior audit (2026-08-11) for product/author families

## Valid legacy spa pages

| Old URL | Classification | New URL | Status |
|---------|---------------|---------|--------|
| `/home/` | WordPress home alias | `/` | 301 |
| `/about/` | About page (already exists) | passthrough | — |
| `/contact/` | Contact page (already exists) | passthrough | — |
| `/%D8%A7%D9%84%D9%85%D8%AF%D9%88%D9%86%D8%A9/` (`/المدونة/`) | Arabic blog listing | `/blogs/` | 301 |
| `/%D8%A7%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA/` (`/الخدمات/`) | Arabic services page | `/services/` | 301 |
| `/%D8%AE%D8%AF%D9%85%D8%A7%D8%AA/` (`/خدمات/`) | Arabic services alias | `/services/` | 301 |
| `/%D8%A7%D9%84%D8%B9%D8%B1%D9%88%D8%B6/` (`/العروض/`) | Arabic offers page | `/offers/` | 301 |
| `/product/%D8%B9%D8%B1%D8%B6-%D8%A7%D9%84%D9%81%D8%AE%D8%A7%D9%85%D8%A9/` (`/product/عرض-الفخامة/`) | WooCommerce offer | `/offers/elegance/` | 301 |
| `/product/%D9%86%D8%AC%D9%85-%D8%B3%D8%A8%D8%A7-%D8%B3%D8%AC%D9%86%D8%AA%D8%B4%D8%B1/` (`/product/نجم-سبا-سجنتشر/`) | WooCommerce offer | `/offers/signature/` | 301 |

## WordPress route-family fallbacks

| Pattern | Classification | New URL | Status |
|---------|---------------|---------|--------|
| `/product/*` (unmatched) | WooCommerce product | `/offers/` | 301 |
| `/product-category/*` | WooCommerce category | `/offers/` | 301 |
| `/author/*` | WordPress author archive | `/` | 301 |
| `/tag/*` (non-spam) | WordPress tag archive | `/blogs/` | 301 |
| `/category/*` (non-spam) | WordPress category archive | `/blogs/` | 301 |
| any other unmapped content path | orphaned WP/old URL | `/` | 301 |

Static assets (`*.png`, `robots.txt`, sitemaps, `/_astro/*`) and current app routes are never intercepted.

## Hacked/spam URLs (410 Gone)

These URLs were injected into the old WordPress site and contain gambling, dating, or unrelated content. They return `410 Gone` with `X-Robots-Tag: noindex, nofollow`.

| Old URL | Content type |
|---------|-------------|
| `/tag/bet/` | Gambling spam |
| `/tag/sky247-betting/` | Gambling spam |
| `/tag/most-bet/` | Gambling spam |
| `/tag/royalwin-apk/` | Gambling spam |
| `/tag/fairplay-betting/` | Gambling spam |
| `/tag/1-win-game/` | Gambling spam |
| `/tag/1-win-bet/` | Gambling spam |
| `/tag/gugo-bet-login/` | Gambling spam |
| `/tag/best-coins-for-staking/` | Gambling spam |
| `/tag/sat-bet/` | Gambling spam (indexed 2026-08-12) |
| `/category/mono-brand/` | Gambling spam |
| `/category/1xbet-kr/` | Gambling spam |
| `/category/sat-bet-582/` | Gambling spam |
| `/category/galactic-wins-casino-review-592/` | Gambling spam |
| `/partycasino-app-195/` | Gambling spam |
| `/royal-vegas-login-nz-832/` | Gambling spam |
| `/galactic-wins-bonus-code-629/` | Gambling spam |
| `/galactic-wins-casino-review-48/` | Gambling spam |
| `/gratogana-juegos-en-vivo-427/` | Gambling spam |
| `/ltqnyt-lhdyth-lhkr-1xbet-ltfh-wslyb-lhmy/` | Gambling spam |
| `/exploring-the-history-of-1xbet-login-systems/` | Gambling spam |
| `/kak-ispolzovat-mobilnuiu-versiiu-1xbet-ofitsialnyi-sait-aktualnaia-ssylka/` | Gambling spam |
| `/join-now-and-start-fulfilling-eritrean-singles-today/` | Dating spam |
| `/many-fabulous-and-almost-gay-hostels-in-bay-area/` | Dating spam |
| `/find-china-dating-girls-your-key-to-a-fulfilling-relationship/` | Dating spam |
| `/top-australian-free-e-wallet-casinos-for-hassle-free-gaming/` | Gambling spam |
| `/meet-local-grannies-looking-for-sex/` | Dating spam |
| `/erotic-monkey-assessment-top-erotic-experience-services/` | Adult spam (indexed 2026-08-12) |

## Google-indexed URLs that already exist (passthrough)

- `/` — Current homepage
- `/about/` — Current about page
- `/contact/` — Current contact page

## Passthrough (no action needed)

- `/services/*` — Current service routes
- `/offers/*` — Current offer routes
- `/packages/*` — Current package routes
- `/en/*` — English locale routes
- `/blogs/*` — Blog routes (SSR)
- `/api/*`, `/admin/*`, `/_astro/*` — Internal routes
- File-like paths (`*.xml`, `*.txt`, images, scripts)

## Production note

Legacy redirects require the Cloudflare Worker to run before static assets (`run_worker_first = true`, `not_found_handling = "none"`). Redeploy after changing `legacy-routes.ts` or `wrangler.toml`.
