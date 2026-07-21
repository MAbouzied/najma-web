export const WHATSAPP_PHONE = '966542030018';
export const WHATSAPP_PHONE_DISPLAY = '+966542030018';

export function buildWhatsAppUrl(message = ''): string {
  const params = new URLSearchParams({
    phone: WHATSAPP_PHONE,
    type: 'phone_number',
    app_absent: '0',
    text: message,
  });

  return `https://api.whatsapp.com/send/?${params.toString()}`;
}

export function buildServiceBookingUrl(serviceName: string): string {
  return buildWhatsAppUrl(`أهلاً، أريد حجز ${serviceName}`);
}

export function buildPackageBookingUrl(packageName: string): string {
  return buildWhatsAppUrl(`أهلاً، أريد حجز ${packageName}`);
}

export function buildGeneralContactUrl(): string {
  return buildWhatsAppUrl('أهلاً، أريد التواصل مع نجم سبا');
}
