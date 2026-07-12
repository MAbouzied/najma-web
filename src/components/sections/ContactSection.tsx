import { SITE } from "@/content/site";
import { SocialLinks } from "@/components/ui/SocialLinks";

type ContactSectionProps = {
  showMap?: boolean;
};

export function ContactSection({ showMap = false }: ContactSectionProps) {
  const cards = [
    {
      title: "الهاتف",
      value: SITE.phoneIntl,
      href: `tel:${SITE.phone}`,
      external: false,
      icon: "phone",
    },
    {
      title: "واتساب",
      value: "راسلنا الآن",
      href: SITE.whatsappUrl,
      external: true,
      icon: "whatsapp",
    },
    {
      title: "البريد الإلكتروني",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      external: false,
      icon: "email",
    },
    {
      title: "العنوان",
      value: SITE.address,
      href: SITE.mapsUrl,
      external: true,
      icon: "location",
    },
  ];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <h2 className="mb-2 text-center text-3xl font-extrabold text-burgundy-dark md:text-4xl lg:text-right">
          تواصل معنا
        </h2>
        <p className="mb-10 text-center text-muted lg:text-right">
          نحن هنا لخدمتك — تواصل معنا لحجز موعدك أو الاستفسار عن خدماتنا
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              {...(card.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex flex-col items-center rounded-2xl border border-cream-dark bg-cream p-5 text-center transition hover:border-gold hover:shadow-md lg:items-start lg:text-right"
            >
              <div className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-dark transition group-hover:bg-gold group-hover:text-white">
                <ContactIcon type={card.icon} />
              </div>
              <p className="text-sm font-bold text-burgundy">{card.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{card.value}</p>
            </a>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="text-center lg:text-right">
            <p className="mb-3 text-sm font-bold text-burgundy-dark">تابعنا</p>
            <SocialLinks className="justify-center lg:justify-start" />
          </div>

          {showMap && (
            <div className="w-full overflow-hidden rounded-2xl shadow-lg lg:max-w-xl">
              <iframe
                src={SITE.mapsEmbedUrl}
                title="موقع نجم سبا على الخريطة"
                className="h-[280px] w-full border-0 md:h-[320px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactIcon({ type }: { type: string }) {
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
      </svg>
    );
  }
  if (type === "whatsapp") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    );
  }
  if (type === "email") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
    </svg>
  );
}
