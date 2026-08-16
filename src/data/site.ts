import {
  buildCallHref,
  buildBookingUrl,
  buildGeneralContactUrl,
  WHATSAPP_PHONE_DISPLAY,
} from '../lib/whatsapp';
import { t } from '../i18n/t';
import type { Locale } from '../i18n/types';
import { localePath } from '../i18n/paths';

export type { Locale } from '../i18n/types';
export { defaultLocale, locales } from '../i18n/types';

export type PageId = 'home' | 'about' | 'services' | 'offers' | 'packages' | 'blogs' | 'contact';

export interface SiteLink {
  label: string;
  href: string;
  page?: PageId;
}

export interface SiteAction {
  label: string;
  href: string;
}

export function getNavigationLinks(locale: Locale): SiteLink[] {
  const links: SiteLink[] = [
    { label: t(locale, 'navHome'), href: localePath('/', locale), page: 'home' },
    { label: t(locale, 'navAbout'), href: localePath('/about', locale), page: 'about' },
    { label: t(locale, 'navServices'), href: localePath('/services/', locale), page: 'services' },
    { label: t(locale, 'navOffers'), href: localePath('/offers/', locale), page: 'offers' },
    { label: t(locale, 'navPackages'), href: localePath('/packages/', locale), page: 'packages' },
  ];

  // Blog is Arabic-only (same pattern as beauty-corner).
  if (locale === 'ar') {
    links.push({ label: t(locale, 'navBlogs'), href: '/blogs/', page: 'blogs' });
  }

  links.push({ label: t(locale, 'navContact'), href: localePath('/contact', locale), page: 'contact' });
  return links;
}

export function getQuickLinks(locale: Locale): SiteLink[] {
  const links: SiteLink[] = [
    { label: t(locale, 'navHome'), href: localePath('/', locale) },
    { label: t(locale, 'navAbout'), href: localePath('/about', locale) },
    { label: t(locale, 'navServices'), href: localePath('/services/', locale) },
    { label: t(locale, 'navOffers'), href: localePath('/offers/', locale) },
    { label: t(locale, 'navPackages'), href: localePath('/packages/', locale) },
  ];

  if (locale === 'ar') {
    links.push({ label: t(locale, 'navBlogs'), href: '/blogs/' });
  }

  links.push(
    { label: t(locale, 'navContact'), href: localePath('/contact', locale) },
    { label: t(locale, 'navGo'), href: localePath('/go/', locale) },
  );
  return links;
}

export function getServiceLinks(locale: Locale): SiteLink[] {
  // Keep footer links short: highlight core treatments from the PDF menu.
  const items =
    locale === 'en'
      ? [
          { slug: 'swedish-massage', label: 'Swedish Massage' },
          { slug: 'thai-massage', label: 'Thai Massage' },
          { slug: 'hot-stone-massage', label: 'Hot Stone Massage' },
          { slug: 'cupping', label: 'Chinese Cupping' },
          { slug: 'royal-bath', label: 'Luxury Royal Bath' },
          { slug: 'manicure-pedicure', label: 'Hand & Foot Pedicure' },
        ]
      : [
          { slug: 'swedish-massage', label: 'مساج سويدي' },
          { slug: 'thai-massage', label: 'مساج تايلندي' },
          { slug: 'hot-stone-massage', label: 'مساج أحجار ساخنة' },
          { slug: 'cupping', label: 'مساج كاسات صينية' },
          { slug: 'royal-bath', label: 'حمام ملكي فاخر' },
          { slug: 'manicure-pedicure', label: 'بدكير يدين وقدمين' },
        ];
  return items.map((item) => ({
    label: item.label,
    href: localePath(`/services/${item.slug}/`, locale),
  }));
}

export function getSocialLinks(locale: Locale) {
  return [
    { label: t(locale, 'socialInstagram'), href: 'https://www.instagram.com/nagmspa/', icon: 'instagram' as const },
    { label: t(locale, 'socialSnapchat'), href: 'https://www.snapchat.com/add/nagmspa', icon: 'snapchat' as const },
  ];
}

export function getContactDetails(locale: Locale) {
  return {
    phoneDisplay: WHATSAPP_PHONE_DISPLAY,
    phoneHref: buildCallHref(),
    whatsappHref: buildGeneralContactUrl(locale),
    hours: t(locale, 'hours24'),
  };
}

export function getBrandDescription(locale: Locale): string {
  return t(locale, 'brandDescription');
}

export interface LicenseCertificate {
  href: string;
  badgeSrc: string;
  openLabel: string;
  dialogTitle: string;
  imageAlt: string;
}

export interface LicenseField {
  label: string;
  value: string | null;
  certificate?: LicenseCertificate;
}

export const VAT_REGISTRATION_NUMBER = '310360176500003';
export const VAT_CERTIFICATE_HREF = '/assets/legal/vat-registration-certificate.png';
export const ZATCA_VAT_BADGE_SRC = '/assets/icons/zatca-vat.svg';

export function getLicenseDetails(locale: Locale): { title: string; fields: LicenseField[] } {
  return {
    title: t(locale, 'licenseTitle'),
    fields: [
      { label: t(locale, 'licenseCommercialRegister'), value: '7032026861' },
      { label: t(locale, 'licenseMunicipalLicense'), value: '440511049271' },
      { label: t(locale, 'licenseLicensingAuthority'), value: t(locale, 'licenseLicensingAuthorityValue') },
      { label: t(locale, 'licenseLicensedActivity'), value: t(locale, 'licenseLicensedActivityValue') },
      {
        label: t(locale, 'licenseVatNumber'),
        value: VAT_REGISTRATION_NUMBER,
        certificate: {
          href: VAT_CERTIFICATE_HREF,
          badgeSrc: ZATCA_VAT_BADGE_SRC,
          openLabel: t(locale, 'licenseVatCertificateOpen'),
          dialogTitle: t(locale, 'licenseVatCertificateTitle'),
          imageAlt: t(locale, 'licenseVatCertificateAlt'),
        },
      },
    ],
  };
}

export function getBookingAction(locale: Locale): SiteAction {
  return {
    label: t(locale, 'actionBookNow'),
    href: buildBookingUrl(locale),
  };
}

export function getCallAction(locale: Locale): SiteAction {
  return {
    label: t(locale, 'actionCallNow'),
    href: buildCallHref(),
  };
}

/** @deprecated Use getNavigationLinks(locale) */
export const navigationLinks: SiteLink[] = getNavigationLinks('ar');
/** @deprecated Use getQuickLinks(locale) */
export const quickLinks: SiteLink[] = getQuickLinks('ar');
/** @deprecated Use getServiceLinks(locale) */
export const serviceLinks: SiteLink[] = getServiceLinks('ar');
/** @deprecated Use getSocialLinks(locale) */
export const socialLinks = getSocialLinks('ar');
/** @deprecated Use getContactDetails(locale) */
export const contactDetails = getContactDetails('ar');
/** @deprecated Use getBrandDescription(locale) */
export const brandDescription = getBrandDescription('ar');
/** @deprecated Use getLicenseDetails(locale) */
export const licenseDetails = getLicenseDetails('ar');
/** @deprecated Use getBookingAction(locale) */
export const bookingAction: SiteAction = getBookingAction('ar');
/** @deprecated Use getCallAction(locale) */
export const callAction: SiteAction = getCallAction('ar');
