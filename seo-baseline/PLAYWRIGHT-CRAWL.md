# Browser regression coverage

Manual crawl notes are obsolete. Use the Playwright suite instead.

## Commands

```bash
npm run build
npm run test:browser:built
```

Or in one step:

```bash
npm run test:browser
```

## What it covers

- Critical Arabic/English routes (`e2e/smoke.spec.ts`)
- Skip link, mobile nav, language switch (`e2e/navigation.spec.ts`)
- Booking → WhatsApp payload (`e2e/booking.spec.ts`)
- Internal link integrity only (`e2e/links.spec.ts`)
- axe serious/critical smoke (`e2e/a11y.spec.ts`)

## Optional deep link audit

```bash
npm run preview:built
npm run audit:links
```

Writes an **untracked** report to `test-results/link-audit/`.  
External HTTP checks stay off unless `LINK_AUDIT_EXTERNAL=1`.
