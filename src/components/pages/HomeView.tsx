import { JsonLd } from "@/components/Analytics";
import { CTABanner } from "@/components/sections/CTABanner";
import { ContactSection } from "@/components/sections/ContactSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { Hero } from "@/components/sections/Hero";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { PAGES } from "@/content/site";
import {
  breadcrumbJsonLd,
  localBusinessJsonLd,
  webPageJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export function HomeView() {
  return (
    <>
      <JsonLd
        data={[
          websiteJsonLd(),
          localBusinessJsonLd(),
          webPageJsonLd({
            title: PAGES.index.title,
            description: PAGES.index.description,
            path: PAGES.index.slug,
          }),
          breadcrumbJsonLd([{ name: "الرئيسية", path: "/" }]),
        ]}
      />
      <Hero />
      <ServicesSection />
      <WhyUsSection />
      <GallerySection />
      <CTABanner />
      <ContactSection />
    </>
  );
}
