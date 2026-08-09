import { MAPS_HREF, WHATSAPP_PHONE_DISPLAY } from '../lib/whatsapp';
import type { Locale } from '../i18n/types';

interface VerifiedLocalDetails {
  status: 'verified';
  telephone: string;
  email: string;
  priceRange: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours: {
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[];
  geo?: {
    latitude: number;
    longitude: number;
  };
  sameAs?: string[];
  hasMap?: string;
}

interface UnverifiedLocalDetails {
  status: 'unverified';
  draft: {
    telephone: string;
    email: string;
    hours: string;
    locations: never[];
  };
}

export type LocalBusinessDetails = VerifiedLocalDetails | UnverifiedLocalDetails;

interface BusinessProfile {
  name: string;
  description: string;
  localDetails: LocalBusinessDetails;
}

const names: Record<Locale, string> = {
  ar: 'نجم سبا',
  en: 'Nagm Spa',
};

const descriptions: Record<Locale, string> = {
  ar: 'مركز استرخاء الجسد والعقل والروح في حفر الباطن — حي المصيف. خدمات متميزة بأيدي أخصائيين محترفين على مدار الساعة.',
  en: 'Body, mind, and soul relaxation center in Hafar Al-Batin — Al-Musayyif district. Premium services by professional therapists, open 24 hours.',
};

const addresses: Record<Locale, { streetAddress: string; addressLocality: string; addressRegion: string }> = {
  ar: {
    streetAddress: 'حي المصيف',
    addressLocality: 'حفر الباطن',
    addressRegion: 'المنطقة الشرقية',
  },
  en: {
    streetAddress: 'Al-Musayyif District',
    addressLocality: 'Hafar Al-Batin',
    addressRegion: 'Eastern Province',
  },
};

export function getBusinessProfile(locale: Locale): BusinessProfile {
  return {
    name: names[locale],
    description: descriptions[locale],
    localDetails: {
      status: 'verified',
      telephone: WHATSAPP_PHONE_DISPLAY,
      email: 'info@nagmspa.com',
      priceRange: '$$',
      address: {
        ...addresses[locale],
        postalCode: '31993',
        addressCountry: 'SA',
      },
      openingHours: [
        {
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '00:00',
          closes: '23:59',
        },
      ],
      geo: {
        latitude: 28.3803376,
        longitude: 45.9878199,
      },
      sameAs: [
        'https://www.instagram.com/nagmspa/',
        'https://www.snapchat.com/add/nagmspa',
      ],
      hasMap: MAPS_HREF,
    },
  };
}

/** @deprecated Use getBusinessProfile(locale) */
export const businessProfile: BusinessProfile = getBusinessProfile('ar');
