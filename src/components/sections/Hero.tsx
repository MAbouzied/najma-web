"use client";

import Image from "next/image";
import { HERO_IMAGES } from "@/content/services";
import { SITE } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { SiteLogo } from "@/components/ui/SiteLogo";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        {HERO_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0"
            style={{
              animation: `hero-fade ${HERO_IMAGES.length * 6}s infinite`,
              animationDelay: `${i * 6}s`,
              opacity: i === 0 ? 1 : 0,
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              className="object-cover animate-ken-burns"
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-l from-burgundy-dark/90 via-burgundy/75 to-burgundy-dark/50" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 drop-shadow-2xl">
            <SiteLogo src={SITE.logoHeader} alt={SITE.logoAlt} size="hero" priority />
          </div>

          <p className="mb-3 text-sm font-bold tracking-[0.25em] text-gold-light uppercase md:text-base">
            حفر الباطن · المحمدية
          </p>

          <h1 className="mb-4 max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
            مساج وحمام مغربي
            <span className="mt-2 block text-gold">نجم سبا</span>
          </h1>

          <p className="mb-10 max-w-xl text-lg text-white/90 md:text-xl">
            مركز استرخاء الجسد والعقل والروح — خدمات متميزة بأيدي أخصائيين محترفين
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button href={SITE.whatsappUrl} variant="whatsapp" external>
              <WhatsAppIcon />
              احجز عبر واتساب
            </Button>
            <Button href={`tel:${SITE.phone}`} variant="outline" external>
              <PhoneIcon />
              {SITE.phone}
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2" aria-hidden>
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/40 p-1">
          <div className="h-2 w-1 animate-bounce rounded-full bg-gold" />
        </div>
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden>
      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
    </svg>
  );
}
