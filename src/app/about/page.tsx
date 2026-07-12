import Image from "next/image";
import { JsonLd } from "@/components/Analytics";
import { PageShell } from "@/components/layout/PageShell";
import { CTABanner } from "@/components/sections/CTABanner";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { ABOUT_CONTENT } from "@/content/about";
import { PAGES } from "@/content/site";
import {
  breadcrumbJsonLd,
  buildMetadata,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata = buildMetadata({
  title: PAGES.about.title,
  description: PAGES.about.description,
  path: PAGES.about.slug,
});

export default function AboutPage() {
  return (
    <PageShell>
      <JsonLd
        data={[
          webPageJsonLd({
            title: PAGES.about.title,
            description: PAGES.about.description,
            path: PAGES.about.slug,
          }),
          breadcrumbJsonLd([
            { name: "الرئيسية", path: "/" },
            { name: "من نحن", path: "/about/" },
          ]),
        ]}
      />

      <section className="relative flex min-h-[50vh] items-center overflow-hidden">
        <Image
          src={ABOUT_CONTENT.image}
          alt="نجم سبا"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-burgundy-dark/75" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 text-center lg:px-8">
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            {ABOUT_CONTENT.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
            {ABOUT_CONTENT.subheadline}
          </p>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-bold tracking-widest text-gold-dark uppercase">
                قصتنا
              </p>
              <h2 className="mb-6 text-3xl font-extrabold text-burgundy-dark md:text-4xl">
                رحلتك نحو الاسترخاء تبدأ هنا
              </h2>
              <p className="mb-6 leading-relaxed text-muted">
                {ABOUT_CONTENT.intro}
              </p>
              <p className="leading-relaxed text-muted">
                {ABOUT_CONTENT.mission}
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src={ABOUT_CONTENT.secondaryImage}
                alt="أجواء نجم سبا"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="mt-16">
            <h3 className="mb-8 text-center text-2xl font-extrabold text-burgundy-dark">
              ما نقدمه
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ABOUT_CONTENT.offerings.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-cream-dark bg-cream p-4"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold-dark">
                    ✓
                  </span>
                  <span className="font-bold text-burgundy-dark">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhyUsSection />
      <CTABanner />
    </PageShell>
  );
}
