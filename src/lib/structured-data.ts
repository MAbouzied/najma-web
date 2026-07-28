import { businessProfile } from '../data/business';
import type { Faq, Package, Service } from '../data/home';

export type PageSchemaType = 'WebPage' | 'AboutPage' | 'ContactPage';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface StructuredDataOptions {
  title: string;
  description: string;
  pathname: string;
  pageType: PageSchemaType;
  image: string;
  siteOrigin?: string;
  faqItems?: Faq[];
  services?: Service[];
  packages?: Package[];
  breadcrumbLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export interface StructuredDataDocument {
  '@context': 'https://schema.org';
  '@graph': Record<string, unknown>[];
}

export function resolveSeoUrl(path: string, siteOrigin?: string): string {
  if (/^https?:\/\//u.test(path)) {
    return path;
  }

  return siteOrigin ? new URL(path, siteOrigin).href : path;
}

function toSchemaPrice(price: string): string {
  const arabicIndicDigits = '٠١٢٣٤٥٦٧٨٩';
  return price
    .replace(/[٠-٩]/gu, (digit) => String(arabicIndicDigits.indexOf(digit)))
    .replace(/[^\d.]/gu, '');
}

export function buildStructuredData({
  title,
  description,
  pathname,
  pageType,
  image,
  siteOrigin,
  faqItems = [],
  services = [],
  packages = [],
  breadcrumbLabel,
  breadcrumbs,
}: StructuredDataOptions): StructuredDataDocument {
  const businessId = resolveSeoUrl('/#business', siteOrigin);
  const websiteId = resolveSeoUrl('/#website', siteOrigin);
  const pageUrl = resolveSeoUrl(pathname, siteOrigin);
  const pageId = resolveSeoUrl(`${pathname === '/' ? '/' : pathname}#webpage`, siteOrigin);
  const imageUrl = resolveSeoUrl(image, siteOrigin);
  const imageId = `${pageId}-primaryimage`;
  const faqId = resolveSeoUrl('/#faq', siteOrigin);

  const business: Record<string, unknown> = {
    '@type': 'DaySpa',
    '@id': businessId,
    name: businessProfile.name,
    url: resolveSeoUrl('/', siteOrigin),
    description: businessProfile.description,
    currenciesAccepted: 'SAR',
    areaServed: {
      '@type': 'Country',
      name: 'المملكة العربية السعودية',
    },
    image: [
      resolveSeoUrl('/assets/home/hero-slider.jpg', siteOrigin),
      resolveSeoUrl('/assets/og/nagm-spa-share.jpg', siteOrigin),
    ],
    logo: {
      '@type': 'ImageObject',
      '@id': resolveSeoUrl('/#logo', siteOrigin),
      url: resolveSeoUrl('/assets/nagm-logo.png', siteOrigin),
      contentUrl: resolveSeoUrl('/assets/nagm-logo.png', siteOrigin),
      caption: 'نجم سبا',
    },
  };

  const catalogs: Record<string, unknown>[] = [];

  if (services.length > 0) {
    catalogs.push({
      '@type': 'OfferCatalog',
      name: 'خدمات نجم سبا',
      itemListElement: services.map((service, index) => ({
        '@type': 'Offer',
        '@id': resolveSeoUrl(`/#offer-${index + 1}`, siteOrigin),
        url: resolveSeoUrl('/#services', siteOrigin),
        price: toSchemaPrice(service.price),
        priceCurrency: 'SAR',
        itemOffered: {
          '@type': 'Service',
          '@id': resolveSeoUrl(`/#service-${index + 1}`, siteOrigin),
          name: service.title,
          description: service.description,
          serviceType: service.title,
          provider: { '@id': businessId },
          url: resolveSeoUrl('/#services', siteOrigin),
        },
      })),
    });
  }

  if (packages.length > 0) {
    catalogs.push({
      '@type': 'OfferCatalog',
      name: 'باقات نجم سبا',
      itemListElement: packages.map((pkg, index) => ({
        '@type': 'Offer',
        '@id': resolveSeoUrl(`/#package-offer-${index + 1}`, siteOrigin),
        url: resolveSeoUrl(`/packages/${pkg.slug}/`, siteOrigin),
        price: toSchemaPrice(pkg.price),
        priceCurrency: 'SAR',
        itemOffered: {
          '@type': 'Service',
          '@id': resolveSeoUrl(`/#package-${index + 1}`, siteOrigin),
          name: pkg.name,
          description: pkg.description,
          serviceType: pkg.name,
          provider: { '@id': businessId },
          url: resolveSeoUrl(`/packages/${pkg.slug}/`, siteOrigin),
        },
      })),
    });
  }

  if (catalogs.length === 1) {
    business.hasOfferCatalog = catalogs[0];
  } else if (catalogs.length > 1) {
    business.hasOfferCatalog = catalogs;
  }

  if (businessProfile.localDetails.status === 'verified') {
    const details = businessProfile.localDetails;
    business.telephone = details.telephone;
    business.email = details.email;
    business.priceRange = details.priceRange;
    business.address = {
      '@type': 'PostalAddress',
      ...details.address,
    };
    business.openingHoursSpecification = details.openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      ...hours,
    }));

    if (details.geo) {
      business.geo = {
        '@type': 'GeoCoordinates',
        ...details.geo,
      };
    }
    if (details.sameAs?.length) {
      business.sameAs = details.sameAs;
    }
    if (details.hasMap) {
      business.hasMap = details.hasMap;
    }
  }

  const website = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: resolveSeoUrl('/', siteOrigin),
    name: 'نجم سبا',
    description: businessProfile.description,
    inLanguage: 'ar-SA',
    publisher: { '@id': businessId },
  };

  const primaryImage = {
    '@type': 'ImageObject',
    '@id': imageId,
    url: imageUrl,
    contentUrl: imageUrl,
    caption: title,
  };

  const page: Record<string, unknown> = {
    '@type': pageType,
    '@id': pageId,
    url: pageUrl,
    name: title,
    description,
    inLanguage: 'ar-SA',
    isPartOf: { '@id': websiteId },
    about: { '@id': businessId },
    primaryImageOfPage: { '@id': imageId },
  };

  if (pageType === 'AboutPage' || pageType === 'ContactPage') {
    page.mainEntity = { '@id': businessId };
  }

  const graph: Record<string, unknown>[] = [business, website, primaryImage, page];

  const breadcrumbTrail: BreadcrumbItem[] =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : breadcrumbLabel
        ? [
            { label: 'الرئيسية', href: '/' },
            { label: breadcrumbLabel, href: pathname },
          ]
        : [];

  if (breadcrumbTrail.length > 0) {
    const breadcrumbId = `${pageId}-breadcrumb`;
    page.breadcrumb = { '@id': breadcrumbId };
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: breadcrumbTrail.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        item: resolveSeoUrl(crumb.href ?? pathname, siteOrigin),
      })),
    });
  }

  if (faqItems.length > 0) {
    page.hasPart = { '@id': faqId };
    graph.push({
      '@type': 'FAQPage',
      '@id': faqId,
      url: resolveSeoUrl('/#faq', siteOrigin),
      name: 'الأسئلة الشائعة عن نجم سبا',
      inLanguage: 'ar-SA',
      isPartOf: { '@id': pageId },
      about: { '@id': businessId },
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
