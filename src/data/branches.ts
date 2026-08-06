import {
  buildCallHref,
  MAPS_HREF,
  WHATSAPP_PHONE_DISPLAY,
} from '../lib/whatsapp';
import type { Locale } from '../i18n/types';
import { t } from '../i18n/t';

export interface Branch {
  title: string;
  address: string;
  hours: string;
  phone: string;
  phoneHref?: string;
  mapsHref?: string;
}

export function getBranches(locale: Locale): Branch[] {
  const titles: Record<Locale, string> = {
    ar: 'فرع حفر الباطن — حي المصيف',
    en: 'Hafar Al-Batin Branch — Al-Musayyif',
  };
  const addresses: Record<Locale, string> = {
    ar: 'حي المصيف، حفر الباطن',
    en: 'Al-Musayyif District, Hafar Al-Batin',
  };
  const hours: Record<Locale, string> = {
    ar: 'على مدار الساعة — ٢٤ ساعة',
    en: 'Around the clock — 24 hours',
  };

  return [
    {
      title: titles[locale],
      address: addresses[locale],
      hours: hours[locale],
      phone: WHATSAPP_PHONE_DISPLAY,
      phoneHref: buildCallHref(),
      mapsHref: MAPS_HREF,
    },
  ];
}

/** @deprecated Use getBranches(locale) */
export const branches: Branch[] = getBranches('ar');
