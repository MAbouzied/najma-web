import type { APIRoute } from 'astro';
import { offers, packages, services } from '../data/home';
import {
  buildCallHref,
  buildGeneralContactUrl,
  MAPS_HREF,
  WHATSAPP_PHONE_DISPLAY,
} from '../lib/whatsapp';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const link = (path: string) => (site ? new URL(path, site).href : path);
  const serviceLinksAr = services
    .map((s) => `- [${s.title.ar}](${link(`/services/${s.slug}/`)}): ${s.description.ar} — ${s.price.ar}`)
    .join('\n');
  const serviceLinksEn = services
    .map((s) => `- [${s.title.en}](${link(`/en/services/${s.slug}/`)}): ${s.description.en} — ${s.price.en}`)
    .join('\n');
  const offerLinksAr = offers
    .map((offer) => {
      const was = offer.originalPrice ? ` (بدلاً من ${offer.originalPrice.ar})` : '';
      return `- [${offer.name.ar}](${link(`/offers/${offer.slug}/`)}): ${offer.subtitle.ar} — ${offer.price.ar}${was}`;
    })
    .join('\n');
  const offerLinksEn = offers
    .map((offer) => {
      const was = offer.originalPrice ? ` (was ${offer.originalPrice.en})` : '';
      return `- [${offer.name.en}](${link(`/en/offers/${offer.slug}/`)}): ${offer.subtitle.en} — ${offer.price.en}${was}`;
    })
    .join('\n');
  const packageLinksAr = packages
    .map((p) => `- [${p.name.ar}](${link(`/packages/${p.slug}/`)}): ${p.subtitle.ar} — ${p.price.ar}`)
    .join('\n');
  const packageLinksEn = packages
    .map((p) => `- [${p.name.en}](${link(`/en/packages/${p.slug}/`)}): ${p.subtitle.en} — ${p.price.en}`)
    .join('\n');

  const body = `# نجم سبا / Nagm Spa

> مركز مساج وحمام مغربي في حفر الباطن — حي المصيف، المملكة العربية السعودية. مفتوح على مدار الساعة.
> Massage and Moroccan bath center in Hafar Al-Batin — Al-Musayyif district, Saudi Arabia. Open 24 hours.

Arabic is the default locale (unprefixed). English is available under /en/. The business operates from a single branch in Hafar Al-Batin — Al-Musayyif. There are no branches in Riyadh, Jeddah, or Khobar.

## الصفحات الرئيسية (Arabic)

- [الرئيسية](${link('/')}): تعريف بالخدمات والباقات والعروض والأسئلة الشائعة.
- [من نحن](${link('/about/')}): قصة المركز ورسالته وقيمه.
- [الخدمات](${link('/services/')}): فهرس خدمات المساج والحمام والعناية.
- [الباقات](${link('/packages/')}): فهرس باقات العناية المتكاملة.
- [العروض](${link('/offers/')}): عروض خاصة على غسيل وتلميع السيارات.
- [المدونة](${link('/blogs/')}): مقالات عربية عن المساج والاسترخاء والعناية (عربي فقط).
- [تواصل معنا](${link('/contact/')}): بيانات التواصل الكاملة مع نموذج الحجز.

## Main pages (English)

- [Home](${link('/en/')}): Services, packages, offers, and FAQs.
- [About](${link('/en/about/')}): Brand story, mission, and values.
- [Services](${link('/en/services/')}): Massage, bath, and personal care index.
- [Packages](${link('/en/packages/')}): Integrated care packages index.
- [Offers](${link('/en/offers/')}): Special car wash and polishing offers.
- [Contact](${link('/en/contact/')}): Full contact details and booking form.

## الخدمات / Services

### العربية
${serviceLinksAr}

### English
${serviceLinksEn}

## العروض / Offers

### العربية
${offerLinksAr}

### English
${offerLinksEn}

## الباقات / Packages

### العربية
${packageLinksAr}

### English
${packageLinksEn}

## معلومات التواصل / Contact

- [الهاتف / Phone](${buildCallHref()}): ${WHATSAPP_PHONE_DISPLAY}
- [واتساب للحجز / WhatsApp](${buildGeneralContactUrl()}): Direct booking and inquiries
- [البريد الإلكتروني / Email](mailto:info@nagmspa.com): info@nagmspa.com
- [العنوان / Address](${MAPS_HREF}): حي المصيف، حفر الباطن / Al-Musayyif, Hafar Al-Batin
- [ساعات العمل / Hours](${link('/contact/')}): على مدار الساعة — ٢٤ ساعة يوميًا / Open 24 hours

## Social

- [إنستقرام](https://www.instagram.com/nagmspa/): @nagmspa
- [تويتر](https://twitter.com/nagmspa): @nagmspa
- [سناب شات](https://www.snapchat.com/add/nagmspa): @nagmspa
- [الأسئلة الشائعة / FAQ](${link('/#faq')})
- [English FAQ](${link('/en/#faq')})
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
