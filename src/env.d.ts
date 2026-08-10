/// <reference path="../.astro/types.d.ts" />
/// <reference path="./cloudflare-workers.d.ts" />

declare namespace App {
  interface Locals {
    user: import('better-auth').User | null;
    session: import('better-auth').Session | null;
    staffAccess: import('./lib/staff-access/types.ts').StaffAccessRecord | null;
  }
}

interface CloudflareRateLimit {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

declare namespace Cloudflare {
  interface Env {
    LEAD_RATE_LIMITER?: CloudflareRateLimit;
    ADMIN_RATE_LIMITER?: CloudflareRateLimit;
    GOOGLE_SHEET_ID?: string;
  }
}
