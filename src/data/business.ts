import { WHATSAPP_PHONE_DISPLAY } from '../lib/whatsapp';

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

export const businessProfile: BusinessProfile = {
  name: 'نجم سبا',
  description:
    'مركز استرخاء الجسد والعقل والروح — خدمات متميزة بأيدي أخصائيين محترفين',
  localDetails: {
    status: 'verified',
    telephone: WHATSAPP_PHONE_DISPLAY,
    email: 'info@nagmspa.com',
    priceRange: '$$',
    address: {
      streetAddress: 'طريق الملك فيصل بن عبد العزيز',
      addressLocality: 'حفر الباطن',
      addressRegion: 'المنطقة الشرقية',
      postalCode: '39911',
      addressCountry: 'SA',
    },
    openingHours: [
      {
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '10:00',
        closes: '00:00',
      },
    ],
    geo: {
      latitude: 28.4346,
      longitude: 45.9635,
    },
    sameAs: [
      'https://www.instagram.com/nagmspa/',
      'https://twitter.com/nagmspa',
      'https://www.snapchat.com/add/nagmspa',
    ],
    hasMap: 'https://maps.app.goo.gl/7fA6iB4VxucoVwoc7?g_st=ic',
  },
};
