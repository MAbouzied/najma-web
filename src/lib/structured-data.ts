import { getBusinessProfile } from '../data/business';
import { localePath, stripLocalePrefix } from '../i18n/paths';
import { t } from '../i18n/t';
import type { Locale } from '../i18n/types';

export type PageSchemaType = 'WebPage' | 'AboutPage' | 'ContactPage';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ResolvedService {
  slug: string;
  image: string;
  title: string;
  description: string;
  duration?: string;
  price: string;
}

export interface ResolvedPackage {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  features: string[];
  featured?: boolean;
}

export interface ResolvedOffer {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  originalPrice: string;
  features: string[];
}

export interface ResolvedFaq {
  question: string;
  answer: string;
}

export interface StructuredDataOptions {
  title: string;
  description: string;
  pathname: string;
  pageType: PageSchemaType;
  image?: string | null;
  siteOrigin?: string;
  locale?: Locale;
  faqItems?: ResolvedFaq[];
  services?: ResolvedService[];
  packages?: ResolvedPackage[];
  offers?: ResolvedOffer[];
  breadcrumbLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
  /** When set, attaches mainEntity to the page WebPage node (e.g. BlogPosting @id). */
  mainEntityId?: string;
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
    .replace(/[^\d.]/gu, '')
    .replace(/^\.+|\.+$/gu, '');
}

function isCollectionDetail(pathname: string, collection: 'services' | 'packages' | 'offers'): boolean {
  const neutral = stripLocalePrefix(pathname);
  return new RegExp(`^/${collection}/[^/]+/?$`).test(neutral);
}

function localeHome(locale: Locale): string {
  return localePath('/', locale);
}

function detailPath(
  collection: 'services' | 'packages' | 'offers',
  slug: string,
  locale: Locale,
): string {
  return localePath(`/${collection}/${slug}/`, locale);
}

export function buildStructuredData({
  title,
  description,
  pathname,
  pageType,
  image = null,
  siteOrigin,
  locale = 'ar',
  faqItems = [],
  services = [],
  packages = [],
  offers = [],
  breadcrumbLabel,
  breadcrumbs,
  mainEntityId,
}: StructuredDataOptions): StructuredDataDocument {
  const profile = getBusinessProfile(locale);
  const homePath = localeHome(locale);
  const businessId = resolveSeoUrl('/#business', siteOrigin);
  const websiteId = resolveSeoUrl(`${homePath}#website`, siteOrigin);
  const pageUrl = resolveSeoUrl(pathname, siteOrigin);
  const pageId = resolveSeoUrl(`${pathname === '/' ? '/' : pathname}#webpage`, siteOrigin);
  const faqId = resolveSeoUrl(`${homePath}#faq`, siteOrigin);
  const inLanguage = locale === 'en' ? 'en-US' : 'ar-SA';
  const serviceDetail = isCollectionDetail(pathname, 'services');
  const packageDetail = isCollectionDetail(pathname, 'packages');
  const offerDetail = isCollectionDetail(pathname, 'offers');

  const business: Record<string, unknown> = {
    '@type': 'DaySpa',
    '@id': businessId,
    name: profile.name,
    url: resolveSeoUrl(homePath, siteOrigin),
    description: profile.description,
    currenciesAccepted: 'SAR',
    areaServed: {
      '@type': 'Country',
      name: t(locale, 'schemaCountryName'),
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
      caption: profile.name,
    },
  };

  const catalogs: Record<string, unknown>[] = [];
  const detailEntities: Record<string, unknown>[] = [];

  if (services.length > 0 && serviceDetail && services.length === 1) {
    const service = services[0];
    const servicePath = detailPath('services', service.slug, locale);
    const serviceUrl = resolveSeoUrl(servicePath, siteOrigin);
    const serviceId = resolveSeoUrl(`${servicePath}#service`, siteOrigin);
    const offerId = resolveSeoUrl(`${servicePath}#offer`, siteOrigin);
    const serviceEntity: Record<string, unknown> = {
      '@type': 'Service',
      '@id': serviceId,
      name: service.title,
      description: service.description,
      image: resolveSeoUrl(service.image, siteOrigin),
      serviceType: service.title,
      provider: { '@id': businessId },
      url: serviceUrl,
    };
    if (service.duration) {
      serviceEntity.additionalProperty = {
        '@type': 'PropertyValue',
        name: t(locale, 'serviceDetailDuration').replace(/:$/, ''),
        value: service.duration,
      };
    }
    detailEntities.push(serviceEntity);
    const price = toSchemaPrice(service.price);
    if (price) {
      detailEntities.push({
        '@type': 'Offer',
        '@id': offerId,
        url: serviceUrl,
        price,
        priceCurrency: 'SAR',
        itemOffered: { '@id': serviceId },
      });
    }
  } else if (services.length > 0) {
    catalogs.push({
      '@type': 'OfferCatalog',
      name: t(locale, 'schemaServicesCatalog'),
      itemListElement: services.map((service) => {
        const servicePath = detailPath('services', service.slug, locale);
        const serviceUrl = resolveSeoUrl(servicePath, siteOrigin);
        const serviceId = resolveSeoUrl(`${servicePath}#service`, siteOrigin);
        const offerId = resolveSeoUrl(`${servicePath}#offer`, siteOrigin);
        return {
          '@type': 'Offer',
          '@id': offerId,
          url: serviceUrl,
          price: toSchemaPrice(service.price),
          priceCurrency: 'SAR',
          itemOffered: {
            '@type': 'Service',
            '@id': serviceId,
            name: service.title,
            description: service.description,
            image: resolveSeoUrl(service.image, siteOrigin),
            serviceType: service.title,
            provider: { '@id': businessId },
            url: serviceUrl,
          },
        };
      }),
    });
  }

  if (packages.length > 0 && packageDetail && packages.length === 1) {
    const pkg = packages[0];
    const packagePath = detailPath('packages', pkg.slug, locale);
    const packageUrl = resolveSeoUrl(packagePath, siteOrigin);
    const serviceId = resolveSeoUrl(`${packagePath}#service`, siteOrigin);
    const offerId = resolveSeoUrl(`${packagePath}#offer`, siteOrigin);
    detailEntities.push({
      '@type': 'Service',
      '@id': serviceId,
      name: pkg.name,
      description: pkg.description,
      serviceType: t(locale, 'schemaSpaPackageType'),
      provider: { '@id': businessId },
      url: packageUrl,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: t(locale, 'packageDetailComponents'),
        itemListElement: pkg.features.map((feature, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: feature,
        })),
      },
    });
    const price = toSchemaPrice(pkg.price);
    if (price) {
      detailEntities.push({
        '@type': 'Offer',
        '@id': offerId,
        url: packageUrl,
        price,
        priceCurrency: 'SAR',
        itemOffered: { '@id': serviceId },
      });
    }
  } else if (packages.length > 0) {
    catalogs.push({
      '@type': 'OfferCatalog',
      name: t(locale, 'schemaPackagesCatalog'),
      itemListElement: packages.map((pkg) => {
        const packagePath = detailPath('packages', pkg.slug, locale);
        const packageUrl = resolveSeoUrl(packagePath, siteOrigin);
        const serviceId = resolveSeoUrl(`${packagePath}#service`, siteOrigin);
        const offerId = resolveSeoUrl(`${packagePath}#offer`, siteOrigin);
        return {
          '@type': 'Offer',
          '@id': offerId,
          url: packageUrl,
          price: toSchemaPrice(pkg.price),
          priceCurrency: 'SAR',
          itemOffered: {
            '@type': 'Service',
            '@id': serviceId,
            name: pkg.name,
            description: pkg.description,
            serviceType: t(locale, 'schemaSpaPackageType'),
            provider: { '@id': businessId },
            url: packageUrl,
          },
        };
      }),
    });
  }

  if (offers.length > 0 && offerDetail && offers.length === 1) {
    const offer = offers[0];
    const offerPath = detailPath('offers', offer.slug, locale);
    const offerUrl = resolveSeoUrl(offerPath, siteOrigin);
    const serviceId = resolveSeoUrl(`${offerPath}#service`, siteOrigin);
    const offerId = resolveSeoUrl(`${offerPath}#offer`, siteOrigin);
    detailEntities.push({
      '@type': 'Service',
      '@id': serviceId,
      name: offer.name,
      description: offer.description,
      serviceType: t(locale, 'schemaSpaPackageType'),
      provider: { '@id': businessId },
      url: offerUrl,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: t(locale, 'offerDetailComponents'),
        itemListElement: offer.features.map((feature, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: feature,
        })),
      },
    });
    const price = toSchemaPrice(offer.price);
    const originalPrice = toSchemaPrice(offer.originalPrice);
    if (price) {
      const offerEntity: Record<string, unknown> = {
        '@type': 'Offer',
        '@id': offerId,
        url: offerUrl,
        price,
        priceCurrency: 'SAR',
        itemOffered: { '@id': serviceId },
      };
      if (originalPrice && Number(originalPrice) > Number(price)) {
        offerEntity.priceSpecification = {
          '@type': 'UnitPriceSpecification',
          priceType: 'https://schema.org/StrikethroughPrice',
          price: originalPrice,
          priceCurrency: 'SAR',
        };
      }
      detailEntities.push(offerEntity);
    }
  } else if (offers.length > 0) {
    catalogs.push({
      '@type': 'OfferCatalog',
      name: t(locale, 'schemaOffersCatalog'),
      itemListElement: offers.map((offer) => {
        const offerPath = detailPath('offers', offer.slug, locale);
        const offerUrl = resolveSeoUrl(offerPath, siteOrigin);
        const serviceId = resolveSeoUrl(`${offerPath}#service`, siteOrigin);
        const offerId = resolveSeoUrl(`${offerPath}#offer`, siteOrigin);
        return {
          '@type': 'Offer',
          '@id': offerId,
          url: offerUrl,
          price: toSchemaPrice(offer.price),
          priceCurrency: 'SAR',
          itemOffered: {
            '@type': 'Service',
            '@id': serviceId,
            name: offer.name,
            description: offer.description,
            serviceType: t(locale, 'schemaSpaPackageType'),
            provider: { '@id': businessId },
            url: offerUrl,
          },
        };
      }),
    });
  }

  if (catalogs.length === 1) {
    business.hasOfferCatalog = catalogs[0];
  } else if (catalogs.length > 1) {
    business.hasOfferCatalog = catalogs;
  }

  if (profile.localDetails.status === 'verified') {
    const details = profile.localDetails;
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
    url: resolveSeoUrl(homePath, siteOrigin),
    name: profile.name,
    description: profile.description,
    inLanguage,
    publisher: { '@id': businessId },
  };

  const page: Record<string, unknown> = {
    '@type': pageType,
    '@id': pageId,
    url: pageUrl,
    name: title,
    description,
    inLanguage,
    isPartOf: { '@id': websiteId },
    about: { '@id': businessId },
    ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : {}),
  };

  const graph: Record<string, unknown>[] = [business, website];

  if (image) {
    const imageUrl = resolveSeoUrl(image, siteOrigin);
    const imageId = `${pageId}-primaryimage`;
    graph.push({
      '@type': 'ImageObject',
      '@id': imageId,
      url: imageUrl,
      contentUrl: imageUrl,
      caption: title,
    });
    page.primaryImageOfPage = { '@id': imageId };
  }

  graph.push(page, ...detailEntities);

  const breadcrumbTrail: BreadcrumbItem[] =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : breadcrumbLabel
        ? [
            { label: t(locale, 'breadcrumbHome'), href: homePath },
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
      url: resolveSeoUrl(`${homePath}#faq`, siteOrigin),
      name: t(locale, 'schemaFaqTitle'),
      inLanguage,
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
