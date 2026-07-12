import type { Metadata } from "next";
import { SITE } from "@/content/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata(page: PageMeta): Metadata {
  const url = `${SITE.url}${page.path === "/" ? "" : page.path}`;

  return {
    title: page.title,
    description: page.description,
    metadataBase: new URL(SITE.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      url,
      siteName: SITE.name,
      title: page.title,
      description: page.description,
      images: [
        {
          url: `${SITE.url}${SITE.logo}`,
          alt: SITE.logoAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [`${SITE.url}${SITE.logo}`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    name: SITE.name,
    description: SITE.tagline,
    url: SITE.url,
    telephone: SITE.phoneIntl,
    email: SITE.email,
    image: `${SITE.url}${SITE.logo}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address,
      addressLocality: "\u062d\u0641\u0631 \u0627\u0644\u0628\u0627\u0637\u0646",
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.3803376,
      longitude: 45.9878199,
    },
    sameAs: [
      SITE.social.instagram,
      SITE.social.twitter,
      SITE.social.snapchat,
      SITE.social.maps,
    ],
    priceRange: "$$",
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.tagline,
    inLanguage: "ar",
  };
}

export function webPageJsonLd(page: PageMeta) {
  const url = `${SITE.url}${page.path === "/" ? "" : page.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url,
    inLanguage: "ar",
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
