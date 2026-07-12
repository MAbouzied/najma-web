import Image from "next/image";
import { JsonLd } from "@/components/Analytics";
import { PageShell } from "@/components/layout/PageShell";
import { ContactSection } from "@/components/sections/ContactSection";
import { PAGES } from "@/content/site";
import {
  breadcrumbJsonLd,
  buildMetadata,
  localBusinessJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata = buildMetadata({
  title: PAGES.contact.title,
  description: PAGES.contact.description,
  path: PAGES.contact.slug,
});

export default function ContactPage() {
  return (
    <PageShell>
      <JsonLd
        data={[
          localBusinessJsonLd(),
          webPageJsonLd({
            title: PAGES.contact.title,
            description: PAGES.contact.description,
            path: PAGES.contact.slug,
          }),
          breadcrumbJsonLd([
            { name: "الرئيسية", path: "/" },
            { name: "اتصل بنا", path: "/contact/" },
          ]),
        ]}
      />

      <section className="relative flex min-h-[40vh] items-center overflow-hidden">
        <Image
          src="/assets/gallery/spa-3.jpg"
          alt="اتصل بنا"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-burgundy-dark/85 to-burgundy/60" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 text-center lg:px-8">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            اتصل بنا
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/85">
            نسعد بخدمتك — تواصل معنا لحجز موعدك أو الاستفسار عن خدماتنا
          </p>
        </div>
      </section>

      <ContactSection showMap />
    </PageShell>
  );
}
