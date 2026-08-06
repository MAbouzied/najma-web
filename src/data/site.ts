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
  const labels: Record<'ar' | 'en', string[]> = {
    ar: [
      'مساج الاسترخاء',
      'مساج الزيت الحار',
      'مساج القدمين واليدين',
      'مساج الشياتسو',
      'مساج تايلندي',
      'المساج الرياضي',
      'مساج نجم سبا',
      'حمام مغربي كلاسيك',
      'حمام مغربي بالطين المغربي',
      'بدكير اليدين والقدمين',
    ],
    en: [
      'Relaxation Massage',
      'Hot Oil Massage',
      'Hands & Feet Massage',
      'Shiatsu Massage',
      'Thai Massage',
      'Sports Massage',
      'Nagm Spa Massage',
      'Classic Moroccan Bath',
      'Moroccan Clay Bath',
      'Manicure & Pedicure',
    ],
  };
  const slugs = [
    'massage-relaxation',
    'hot-oil-massage',
    'foot-massage',
    'shiatsu',
    'thai-massage',
    'sports-massage',
    'star-spa-massage',
    'moroccan-bath',
    'moroccan-bath-clay',
    'manicure-pedicure',
  ];
  return slugs.map((slug, i) => ({
    label: labels[locale][i],
    href: localePath(`/services/${slug}/`, locale),
  }));
}

export function getSocialLinks(locale: Locale) {
  return [
    { label: t(locale, 'socialInstagram'), href: 'https://www.instagram.com/nagmspa/', icon: '/assets/icons/instagram.svg' },
    { label: t(locale, 'socialTwitter'), href: 'https://twitter.com/nagmspa', icon: '/assets/icons/x.svg' },
    { label: t(locale, 'socialSnapchat'), href: 'https://www.snapchat.com/add/nagmspa', icon: '/assets/icons/snapchat.svg' },
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

export interface LicenseField {
  label: string;
  value: string | null;
}

export function getLicenseDetails(locale: Locale): { title: string; fields: LicenseField[] } {
  return {
    title: t(locale, 'licenseTitle'),
    fields: [
      { label: t(locale, 'licenseCommercialRegister'), value: '7032026861' },
      { label: t(locale, 'licenseMunicipalLicense'), value: '440511049271' },
      { label: t(locale, 'licenseLicensingAuthority'), value: t(locale, 'licenseLicensingAuthorityValue') },
      { label: t(locale, 'licenseLicensedActivity'), value: t(locale, 'licenseLicensedActivityValue') },
      { label: t(locale, 'licenseVatNumber'), value: null },
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
