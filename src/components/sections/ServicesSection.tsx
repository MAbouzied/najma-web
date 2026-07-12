import Image from "next/image";
import { SERVICES } from "@/content/services";
import { SITE } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ServicesSection() {
  return (
    <section id="services" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          eyebrow="خدماتنا"
          title="تجربة سبا متكاملة"
          subtitle="اختر من بين مجموعة واسعة من خدمات المساج والحمام المغربي والعناية الشخصية"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.id}
              className="group overflow-hidden rounded-2xl bg-cream shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-dark/80 via-transparent to-transparent" />
                <h3 className="absolute bottom-4 right-4 left-4 text-xl font-bold text-white">
                  {service.name}
                </h3>
              </div>

              <div className="p-5">
                <p className="mb-4 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
                <div className="flex gap-2">
                  <a
                    href={SITE.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-whatsapp py-2.5 text-sm font-bold text-white transition hover:brightness-110"
                  >
                    واتساب
                  </a>
                  <a
                    href={`tel:${SITE.phone}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gold py-2.5 text-sm font-bold text-white transition hover:bg-gold-dark"
                  >
                    اتصل
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
