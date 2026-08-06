# Playwright Crawl Report

Date: 2026-08-02  
Server: local `serve dist/client`  
Tool: Playwright MCP (`browser_run_code_unsafe`)

## Summary

| Check | Result |
|---|---|
| Routes visited | **58 / 58** |
| HTTP status | **all 200** |
| Arabic pages `lang`/`dir` | **ar / rtl** |
| English pages `lang`/`dir` | **en / ltr** |
| Routes with translation issues | **0** |
| Unique internal links discovered | **60** |
| Broken internal links | **0** |
| English pages with Arabic UI leaks (excl. language switcher) | **0** |
| Broken local image/link assets (sample + EN home) | **0** |
| EN contact form labels | English (`Mobile Number`, `Full Name`, `Email`, `Requested Service`, `Your Message`) |
| EN breadcrumb aria-label | `Breadcrumb` |

## Translation

- Every English H1 is English (e.g. Relaxation Massage, Luxury Package, Golden Offer).
- Every Arabic H1 is Arabic.
- No Arabic chrome leaked into English nav, footer, breadcrumbs, or forms.
- Language switcher text `العربية` is present and expected on English pages.

## Links

All root-relative links found across the 58 pages resolve with HTTP &lt; 400, including:

- Locale navigation (`/`, `/en/`, about/services/packages/offers/contact)
- All service / package / offer detail slugs in both locales
- Booking (`/book/`, `/en/book/`) and link-hub (`/go/`, `/en/go/`)
- Local assets under `/assets/`, favicons, and icons

## Notes

- Crawl used the production build output (`dist/client`), not `astro dev`.
- External links (WhatsApp, tel, Maps, social) were not asserted for remote HTTP status.
- API routes under `/api/` are dynamic and were not exercised against this static server.
