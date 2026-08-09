export const WHATSAPP_PHONE = '966579777407';
export const WHATSAPP_PHONE_DISPLAY = '+966579777407';
export const PHONE_TEL_HREF = `tel:+${WHATSAPP_PHONE}`;

/** Compressed PDF price menu (download link only — not embedded). */
export const MENU_PDF_HREF = '/assets/nagm-spa-menu.pdf';

export const MAPS_HREF =
  'https://www.google.com/maps/search/?api=1&query=%D8%AD%D9%8A+%D8%A7%D9%84%D9%85%D8%B5%D9%8A%D9%81+%D8%AD%D9%81%D8%B1+%D8%A7%D9%84%D8%A8%D8%A7%D8%B7%D9%86+%D9%86%D8%AC%D9%85+%D8%B3%D8%A8%D8%A7';

export const GOOGLE_REVIEWS_HREF = MAPS_HREF;

export function buildWhatsAppUrl(message = ''): string {
  const params = new URLSearchParams({
    phone: WHATSAPP_PHONE,
    type: 'phone_number',
    app_absent: '0',
    text: message,
  });

  return `https://api.whatsapp.com/send/?${params.toString()}`;
}

export function buildBookingUrl(
  locale: 'ar' | 'en' = 'ar',
  department: 'service' | 'package' | 'offer' | 'general' = 'general',
  item = '',
): string {
  const path = locale === 'en' ? '/en/book/' : '/book/';
  if (department === 'general') return path;
  const params = new URLSearchParams({ department, item });
  return `${path}?${params.toString()}`;
}

export function buildServiceBookingUrl(serviceName: string, locale: 'ar' | 'en' = 'ar'): string {
  return buildBookingUrl(locale, 'service', serviceName);
}

export function buildPackageBookingUrl(packageName: string, locale: 'ar' | 'en' = 'ar'): string {
  return buildBookingUrl(locale, 'package', packageName);
}

export function buildOfferBookingUrl(offerName: string, locale: 'ar' | 'en' = 'ar'): string {
  return buildBookingUrl(locale, 'offer', offerName);
}

export function buildGeneralContactUrl(locale: 'ar' | 'en' = 'ar'): string {
  const msg = locale === 'en'
    ? 'Hello, I would like to contact Nagm Spa'
    : 'أهلاً، أريد التواصل مع نجم سبا';
  return buildWhatsAppUrl(msg);
}

export function buildCallHref(): string {
  return PHONE_TEL_HREF;
}
