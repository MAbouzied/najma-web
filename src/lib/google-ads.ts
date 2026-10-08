/** Google tag and Ads conversion IDs for the public site. Production pages only. */

export const DEFAULT_GA_MEASUREMENT_ID = 'G-KKSXRY8MSN';

export const GOOGLE_ADS_ID = 'AW-18495815386';

/** Page-load conversion for the contact page (جهة اتصال). */
export const CONTACT_CONVERSION_SEND_TO = 'AW-18495815386/DmRmCIfvx5QdENr9vvNE';

const GOOGLE_ADS_ID_RE = /^AW-\d+$/;

export function isGoogleAdsId(value: unknown): value is string {
  return typeof value === 'string' && GOOGLE_ADS_ID_RE.test(value.trim());
}

/** Arabic and English contact pages, with or without a trailing slash. */
export function isContactConversionPath(pathname: string): boolean {
  const path = pathname.split('?')[0]?.split('#')[0] ?? '';
  const normalized = path.replace(/\/+$/, '') || '/';
  return normalized === '/contact' || normalized === '/en/contact';
}

/** Config IDs that follow the primary measurement ID inside the existing gtag snippet. */
export function googleTagConfigIds(measurementId: string): string[] {
  const ids: string[] = [];
  if (measurementId !== DEFAULT_GA_MEASUREMENT_ID) {
    ids.push(DEFAULT_GA_MEASUREMENT_ID);
  }
  ids.push(GOOGLE_ADS_ID);
  return ids;
}

export function trackGoogleAdsConversion(sendTo = CONTACT_CONVERSION_SEND_TO): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'conversion', { send_to: sendTo });
}
