/**
 * Centralized analytics configuration.
 * Set IDs via environment variables at deploy time.
 * Do not hardcode live IDs in components - use this config only.
 */
export const ANALYTICS = {
  enabled: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true",
  gtm: {
    primaryId: process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-PFN9DZZS",
    secondaryId: process.env.NEXT_PUBLIC_GTM_SECONDARY_ID ?? "GTM-5F5ZSF34",
  },
  ga4: {
    measurementId: process.env.NEXT_PUBLIC_GA4_ID ?? "G-WMC25VLYMD",
  },
  googleTag: {
    id: process.env.NEXT_PUBLIC_GOOGLE_TAG_ID ?? "GT-NBXS4DWK",
  },
  snapchat: {
    pixelId:
      process.env.NEXT_PUBLIC_SNAP_PIXEL_ID ??
      "3c73e8eb-b2e1-4eb7-b0b3-28d717ed3e31",
  },
  tiktok: {
    pixelId: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "",
  },
  meta: {
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "",
  },
} as const;
