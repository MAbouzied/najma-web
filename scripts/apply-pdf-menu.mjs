import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('../src/data/home.ts', import.meta.url);
let s = readFileSync(path, 'utf8').replace(/\r\n/g, '\n');

s = s.replace(
  /export interface Package \{[\s\S]*?featured\?: boolean;\n\}/,
  `export interface Package {
  slug: string;
  name: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  price: LocalizedString;
  originalPrice?: LocalizedString;
  features: LocalizedString[];
  featured?: boolean;
}`,
);

s = s.replace(
  /  duration\?: LocalizedString;\n  price: LocalizedString;\n\}/,
  `  duration?: LocalizedString;
  /** Omit when the PDF only prices this treatment inside offers/packages. */
  price?: LocalizedString;
}`,
);

s = s.replace(
  /export const summerCampaign = \{[\s\S]*?\} as const;/,
  `export const summerCampaign = {
  name: { ar: 'عروض نجم سبا', en: 'Nagm Spa Special Offers' } as LocalizedString,
  discountLabel: { ar: 'خصم ٢٠٪', en: '20% Off' } as LocalizedString,
  eyebrow: { ar: 'على جميع الباقات', en: 'On all packages' } as LocalizedString,
} as const;`,
);

const viaOffers = `{ ar: 'ضمن العروض', en: 'Via offers' }`;

const servicesBlock = `export const services: Service[] = [
  {
    slug: 'swedish-massage',
    image: '/assets/home/services/swedish-massage.jpg',
    title: { ar: 'مساج سويدي', en: 'Swedish Massage' },
    description: {
      ar: 'مساج سويدي ضمن عروض نجم سبا — لمسات انسيابية تُرخي العضلات وتُهدئ التوتر. احجز عبر واتساب ضمن الباقة المناسبة لك.',
      en: 'Swedish massage in Nagm Spa offers — flowing strokes that relax muscles and ease tension. Book via WhatsApp within the offer that suits you.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'thai-massage',
    image: '/assets/home/services/thai-massage.jpg',
    title: { ar: 'مساج تايلندي', en: 'Thai Massage' },
    description: {
      ar: 'مساج تايلندي ضمن عروض نجم سبا — تمدد وضغط عميق لزيادة المرونة وتجديد الطاقة. احجز ضمن العرض المناسب لك.',
      en: 'Thai massage in Nagm Spa offers — stretching and deep pressure for flexibility and renewed energy. Book within the right offer.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'hot-stone-massage',
    image: '/assets/home/services/hot-stone-massage.jpg',
    heroImage: '/assets/home/services/hot-stone-massage-hero.jpg',
    title: { ar: 'مساج أحجار ساخنة', en: 'Hot Stone Massage' },
    description: {
      ar: 'مساج الأحجار الساخنة ضمن عروض نجم سبا — حرارة مهدئة تُذيب الشد وتعمّق الاسترخاء.',
      en: 'Hot stone massage in Nagm Spa offers — soothing heat that melts tension and deepens relaxation.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'cupping',
    image: '/assets/home/services/cupping.jpg',
    title: { ar: 'مساج كاسات صينية', en: 'Chinese Cupping Massage' },
    description: {
      ar: 'مساج الكاسات الصينية ضمن عروض نجم سبا — تحفيز للدورة الدموية وتخفيف الشد العميق.',
      en: 'Chinese cupping massage in Nagm Spa offers — supports circulation and eases deep tension.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'massage-relaxation',
    image: '/assets/home/services/relaxation-massage.jpg',
    title: { ar: 'مساج استرخاء', en: 'Relaxation Massage' },
    description: {
      ar: 'مساج الاسترخاء ضمن عروض نجم سبا — جلسة هادئة لاستعادة التوازن وتهدئة الجسد والعقل.',
      en: 'Relaxation massage in Nagm Spa offers — a calm session to restore balance for body and mind.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'shiatsu',
    image: '/assets/home/services/shiatsu-massage.jpg',
    title: { ar: 'مساج شياتسو', en: 'Shiatsu Massage' },
    description: {
      ar: 'مساج الشياتسو ضمن عروض نجم سبا — ضغط إيقاعي على مسارات الطاقة لإطلاق التشنجات.',
      en: 'Shiatsu massage in Nagm Spa offers — rhythmic pressure on energy pathways to release tight spots.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'hot-oil-massage',
    image: '/assets/home/services/hot-oil-massage.jpg',
    title: { ar: 'مساج الزيت الحار', en: 'Hot Oil Massage' },
    description: {
      ar: 'مساج الزيت الحار ضمن عروض نجم سبا — زيوت دافئة لاسترخاء عضلي عميق وراحة مريحة.',
      en: 'Hot oil massage in Nagm Spa offers — warm oils for deep muscle ease and comfortable relief.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'star-spa-massage',
    image: '/assets/home/services/star-spa-massage.jpg',
    title: { ar: 'مساج نجم سبا', en: 'Nagm Spa Signature Massage' },
    description: {
      ar: 'مساج نجم سبا التوقيع ضمن العروض — جلسة متكاملة تجمع الاسترخاء والعناية العميقة.',
      en: 'Nagm Spa signature massage within offers — a complete session combining relaxation and deep care.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'moroccan-bath',
    image: '/assets/home/services/moroccan-bath.jpg',
    title: { ar: 'حمام مغربي كلاسيكي', en: 'Classic Moroccan Bath' },
    description: {
      ar: 'حمام مغربي كلاسيكي ضمن عروض نجم سبا — انتعاش ونضارة بتجربة حمام أصيلة.',
      en: 'Classic Moroccan bath in Nagm Spa offers — freshness and radiance with an authentic hammam experience.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'royal-bath',
    image: '/assets/home/services/moroccan-clay.jpg',
    title: { ar: 'حمام ملكي فاخر', en: 'Luxury Royal Bath' },
    description: {
      ar: 'حمام ملكي فاخر ضمن عروض نجم سبا — تجربة فاخرة للعناية العميقة والاسترخاء.',
      en: 'Luxury royal bath in Nagm Spa offers — a premium ritual for deep care and relaxation.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'steam-session',
    image: '/assets/home/services/steam-session.jpg',
    title: { ar: 'جلسة بخار', en: 'Steam Session' },
    description: {
      ar: 'جلسة بخار ضمن عروض نجم سبا — تهيئة مهدئة للجسم قبل أو مع باقة العناية.',
      en: 'Steam session in Nagm Spa offers — a calming prep for body care within your package.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'manicure-pedicure',
    image: '/assets/home/services/manicure-pedicure.jpg',
    heroImage: '/assets/home/services/manicure-pedicure-hero.jpg',
    title: { ar: 'بدكير يدين وقدمين', en: 'Hand & Foot Pedicure' },
    description: {
      ar: 'بدكير اليدين والقدمين ضمن عروض نجم سبا — عناية أنيقة لمظهر مرتب ومريح.',
      en: 'Hand and foot pedicure in Nagm Spa offers — polished care for a neat, comfortable finish.',
    },
    price: ${viaOffers},
  },
  {
    slug: 'body-scrub',
    image: '/assets/home/services/body-scrub.jpg',
    title: { ar: 'صنفرة بشرة', en: 'Body Scrub' },
    description: {
      ar: 'صنفرة البشرة ضمن عروض نجم سبا — تنعيم ونضارة كجزء من تجربة العناية المتكاملة.',
      en: 'Body scrub in Nagm Spa offers — smoother, fresher skin as part of a complete care experience.',
    },
    price: ${viaOffers},
  },
];`;

const packagesBlock = `export const packages: Package[] = [
  {
    slug: 'groom',
    name: { ar: 'باقة المعرس', en: 'Groom Package' },
    subtitle: { ar: 'تجهيز متكامل لإطلالة يوم الزفاف', en: 'Complete preparation for your wedding day look' },
    description: {
      ar: 'باقة المعرس من نجم سبا — مساج مكس، أحجار ساخنة، حمام مغربي ملكي، وبدكير يدين وقدمين مع مشروب ساخن أو بارد. احجز عبر واتساب الآن.',
      en: 'Groom package from Nagm Spa — mix massage, hot stones, royal Moroccan bath, and hand & foot pedicure with a hot or cold drink. Book via WhatsApp now.',
    },
    price: { ar: '٣٩٩ ر.س', en: '399 SAR' },
    originalPrice: { ar: '٤٩٩ ر.س', en: '499 SAR' },
    featured: true,
    features: [
      { ar: 'مساج مكس', en: 'Mix massage' },
      { ar: 'أحجار ساخنة', en: 'Hot stones' },
      { ar: 'حمام مغربي ملكي', en: 'Royal Moroccan bath' },
      { ar: 'بدكير يدين وقدمين', en: 'Hand & foot pedicure' },
      { ar: 'مشروب ساخن أو بارد', en: 'Hot or cold drink' },
    ],
  },
  {
    slug: 'luxury',
    name: { ar: 'باقة الرفاهية', en: 'Luxury Package' },
    subtitle: { ar: 'تجربة سبا شاملة مع مشروب وحلا', en: 'A complete spa experience with drink and dessert' },
    description: {
      ar: 'باقة الرفاهية من نجم سبا تجمع مساج نجم سبا والزيت الحار والكاسات والأحجار مع حمام ملكي وبخار وبدكير وصنفرة، وتشمل مشروبًا وحلا. احجز عبر واتساب الآن.',
      en: 'Luxury package from Nagm Spa combines Nagm Spa massage, hot oil, cupping, and hot stones with royal bath, steam, pedicure, and body scrub — plus drink and dessert. Book via WhatsApp now.',
    },
    price: { ar: '٥٤٩ ر.س', en: '549 SAR' },
    originalPrice: { ar: '٦٨٥ ر.س', en: '685 SAR' },
    features: [
      { ar: 'مساج نجم سبا + مساج زيت حار', en: 'Nagm Spa massage + hot oil massage' },
      { ar: 'مساج كاسات صينية + مساج أحجار ساخنة', en: 'Chinese cupping + hot stone massage' },
      { ar: 'حمام ملكي فاخر + جلسة بخار', en: 'Luxury royal bath + steam session' },
      { ar: 'بدكير يدين وقدمين + صنفرة بشرة', en: 'Hand & foot pedicure + body scrub' },
      { ar: 'تشمل الباقة مشروب + حلا', en: 'Includes drink + dessert' },
    ],
  },
  {
    slug: 'gift',
    name: { ar: 'باقة الهدية', en: 'Gift Package' },
    subtitle: { ar: 'هدية فاخرة مع حلا وبوكيه ورد', en: 'A luxurious gift with dessert and a flower bouquet' },
    description: {
      ar: 'باقة الهدية من نجم سبا — تجربة متكاملة من المساج والحمام الملكي والبدكير والصنفرة، مع حلا وبوكيه ورد. اطلبها عبر واتساب الآن.',
      en: 'Gift package from Nagm Spa — a complete experience of massage, royal bath, pedicure, and body scrub, plus dessert and a flower bouquet. Order via WhatsApp now.',
    },
    price: { ar: '٥٩٠ ر.س', en: '590 SAR' },
    originalPrice: { ar: '٧٣٥ ر.س', en: '735 SAR' },
    features: [
      { ar: 'مساج نجم سبا + مساج زيت حار', en: 'Nagm Spa massage + hot oil massage' },
      { ar: 'مساج كاسات صينية + مساج أحجار ساخنة', en: 'Chinese cupping + hot stone massage' },
      { ar: 'حمام ملكي فاخر + جلسة بخار', en: 'Luxury royal bath + steam session' },
      { ar: 'بدكير يدين وقدمين + صنفرة بشرة', en: 'Hand & foot pedicure + body scrub' },
      { ar: 'تشمل الباقة حلا + بوكيه ورد', en: 'Includes dessert + flower bouquet' },
    ],
  },
];`;

const offersBlock = `export const offers: Offer[] = [
  {
    slug: 'relaxation',
    name: { ar: 'عرض الاسترخاء', en: 'Relaxation Offer' },
    subtitle: { ar: 'هدوء عميق للجسم والعقل', en: 'Deep calm for body and mind' },
    description: {
      ar: 'عرض الاسترخاء من نجم سبا: مساج سويدي وتايلندي مع مساج الأحجار الساخنة لجلسة هدوء عميقة ومريحة. احجز عرضك عبر واتساب الآن.',
      en: 'Relaxation offer from Nagm Spa: Swedish and Thai massage with hot stone massage for a deeply calming session. Book via WhatsApp now.',
    },
    price: { ar: '١٩٩ ر.س', en: '199 SAR' },
    originalPrice: { ar: '٢٤٩ ر.س', en: '249 SAR' },
    features: [
      { ar: 'مساج سويدي', en: 'Swedish massage' },
      { ar: 'مساج تايلندي', en: 'Thai massage' },
      { ar: 'مساج أحجار ساخنة', en: 'Hot stone massage' },
    ],
  },
  {
    slug: 'recovery',
    name: { ar: 'عرض التعافي', en: 'Recovery Offer' },
    subtitle: { ar: 'استعادة النشاط بعد الجهد', en: 'Restore your energy after exertion' },
    description: {
      ar: 'عرض التعافي من نجم سبا يجمع المساج السويدي والتايلندي ومساج الكاسات الصينية لتخفيف الشد واستعادة نشاطك. احجز عبر واتساب الآن.',
      en: 'Recovery offer from Nagm Spa combines Swedish massage, Thai massage, and Chinese cupping to relieve tension and restore energy. Book via WhatsApp now.',
    },
    price: { ar: '١٩٩ ر.س', en: '199 SAR' },
    originalPrice: { ar: '٢٤٩ ر.س', en: '249 SAR' },
    features: [
      { ar: 'مساج سويدي', en: 'Swedish massage' },
      { ar: 'مساج تايلندي', en: 'Thai massage' },
      { ar: 'مساج كاسات صينية', en: 'Chinese cupping massage' },
    ],
  },
  {
    slug: 'prosperity',
    name: { ar: 'عرض الرخاء', en: 'Prosperity Offer' },
    subtitle: { ar: 'راحة هادئة بأسعار العروض', en: 'Quiet comfort at offer prices' },
    description: {
      ar: 'عرض الرخاء من نجم سبا يجمع المساج السويدي والحمام المغربي الكلاسيكي وجلسة البخار لراحة هادئة ومتوازنة. احجز عبر واتساب الآن.',
      en: 'Prosperity offer from Nagm Spa combines Swedish massage, classic Moroccan bath, and a steam session for quiet, balanced comfort. Book via WhatsApp now.',
    },
    price: { ar: '٢١٩ ر.س', en: '219 SAR' },
    originalPrice: { ar: '٢٧٤ ر.س', en: '274 SAR' },
    features: [
      { ar: 'مساج سويدي', en: 'Swedish massage' },
      { ar: 'حمام مغربي كلاسيكي', en: 'Classic Moroccan bath' },
      { ar: 'جلسة بخار', en: 'Steam session' },
    ],
  },
  {
    slug: 'care',
    name: { ar: 'باقة العناية', en: 'Care Package' },
    subtitle: { ar: 'عناية متوازنة للجسم والأطراف', en: 'Balanced care for body and extremities' },
    description: {
      ar: 'باقة العناية من نجم سبا تجمع مساج الاسترخاء والشياتسو والتايلندي مع بدكير اليدين والقدمين. احجز عبر واتساب الآن.',
      en: 'Care package from Nagm Spa combines relaxation, Shiatsu, and Thai massage with hand & foot pedicure. Book via WhatsApp now.',
    },
    price: { ar: '٢٥٩ ر.س', en: '259 SAR' },
    originalPrice: { ar: '٣٢٤ ر.س', en: '324 SAR' },
    features: [
      { ar: 'مساج استرخاء + مساج شياتسو', en: 'Relaxation massage + Shiatsu massage' },
      { ar: 'مساج تايلندي', en: 'Thai massage' },
      { ar: 'بدكير يدين وقدمين', en: 'Hand & foot pedicure' },
    ],
  },
  {
    slug: 'elegance',
    name: { ar: 'عرض الفخامة', en: 'Elegance Offer' },
    subtitle: { ar: 'مساج وحمام ملكي بأجواء فاخرة', en: 'Massage and royal bath in a luxurious setting' },
    description: {
      ar: 'عرض الفخامة من نجم سبا: مساج سويدي وتايلندي مع حمام ملكي فاخر وجلسة بخار ليوم استرخاء راقٍ. احجز عبر واتساب الآن.',
      en: 'Elegance offer from Nagm Spa: Swedish and Thai massage with a luxury royal bath and steam session. Book via WhatsApp now.',
    },
    price: { ar: '٢٤٩ ر.س', en: '249 SAR' },
    originalPrice: { ar: '٣١٢ ر.س', en: '312 SAR' },
    features: [
      { ar: 'مساج سويدي', en: 'Swedish massage' },
      { ar: 'مساج تايلندي', en: 'Thai massage' },
      { ar: 'حمام ملكي فاخر', en: 'Luxury royal bath' },
      { ar: 'جلسة بخار', en: 'Steam session' },
    ],
  },
  {
    slug: 'golden',
    name: { ar: 'العرض الذهبي', en: 'Golden Offer' },
    subtitle: { ar: 'مزيج ذهبي من المساج والحمام', en: 'A golden blend of massage and bath' },
    description: {
      ar: 'العرض الذهبي من نجم سبا يجمع مساج الاسترخاء والتايلندي والكاسات والأحجار الساخنة مع حمام ملكي فاخر وجلسة بخار. احجز عبر واتساب الآن.',
      en: 'Golden offer from Nagm Spa combines relaxation and Thai massage, cupping, and hot stones with luxury royal bath and steam. Book via WhatsApp now.',
    },
    price: { ar: '٣٤٩ ر.س', en: '349 SAR' },
    originalPrice: { ar: '٤٣٨ ر.س', en: '438 SAR' },
    features: [
      { ar: 'مساج استرخاء + مساج تايلندي', en: 'Relaxation massage + Thai massage' },
      { ar: 'مساج كاسات صينية', en: 'Chinese cupping massage' },
      { ar: 'مساج أحجار ساخنة', en: 'Hot stone massage' },
      { ar: 'حمام ملكي فاخر + جلسة بخار', en: 'Luxury royal bath + steam session' },
    ],
  },
  {
    slug: 'signature',
    name: { ar: 'نجم سبا سجنتشر', en: 'Nagm Spa Signature' },
    subtitle: { ar: 'التجربة الأشمل من نجم سبا', en: 'The most comprehensive experience from Nagm Spa' },
    description: {
      ar: 'نجم سبا سجنتشر — تجربة متكاملة تجمع المساج والزيت الحار والحمام الملكي والبدكير وصنفرة البشرة وجلسة البخار. احجز عبر واتساب الآن.',
      en: 'Nagm Spa Signature — a complete experience combining massage, hot oil, royal bath, pedicure, body scrub, and steam. Book via WhatsApp now.',
    },
    price: { ar: '٣٥٩ ر.س', en: '359 SAR' },
    originalPrice: { ar: '٤٤٩ ر.س', en: '449 SAR' },
    features: [
      { ar: 'مساج استرخاء + مساج تايلندي', en: 'Relaxation massage + Thai massage' },
      { ar: 'مساج الزيت الحار', en: 'Hot oil massage' },
      { ar: 'حمام ملكي فاخر + جلسة بخار', en: 'Luxury royal bath + steam session' },
      { ar: 'بدكير يدين وقدمين + صنفرة بشرة', en: 'Hand & foot pedicure + body scrub' },
    ],
  },
  {
    slug: 'royal',
    name: { ar: 'العرض الملكي', en: 'Royal Offer' },
    subtitle: { ar: 'تجربة ملكية شاملة بخصم العروض', en: 'A comprehensive royal experience at offer pricing' },
    description: {
      ar: 'العرض الملكي من نجم سبا — مساج نجم سبا والزيت الحار والكاسات والأحجار مع حمام ملكي وبدكير وصنفرة وبخار. احجز عبر واتساب الآن.',
      en: 'Royal offer from Nagm Spa — Nagm Spa massage, hot oil, cupping, and hot stones with royal bath, pedicure, body scrub, and steam. Book via WhatsApp now.',
    },
    price: { ar: '٤٤٩ ر.س', en: '449 SAR' },
    originalPrice: { ar: '٥٦٢ ر.س', en: '562 SAR' },
    features: [
      { ar: 'مساج نجم سبا + مساج زيت حار', en: 'Nagm Spa massage + hot oil massage' },
      { ar: 'مساج كاسات صينية + مساج أحجار ساخنة', en: 'Chinese cupping + hot stone massage' },
      { ar: 'حمام ملكي فاخر + جلسة بخار', en: 'Luxury royal bath + steam session' },
      { ar: 'بدكير يدين وقدمين + صنفرة بشرة', en: 'Hand & foot pedicure + body scrub' },
    ],
  },
];`;

s = s.replace(/export const services: Service\[\] = \[[\s\S]*?\];\n\nexport const packages/, `${servicesBlock}\n\nexport const packages`);
s = s.replace(/export const packages: Package\[\] = \[[\s\S]*?\];\n\nexport const offers/, `${packagesBlock}\n\nexport const offers`);
s = s.replace(/export const offers: Offer\[\] = \[[\s\S]*?\];\n\nexport const testimonials/, `${offersBlock}\n\nexport const testimonials`);

s = s.replace(
  /export function getServices\(locale: Locale\) \{[\s\S]*?\n\}\n\nexport function getPackages/,
  `export function getServices(locale: Locale) {
  return services.map((s) => ({
    slug: s.slug,
    image: s.image,
    heroImage: s.heroImage ?? s.image,
    title: L(s.title, locale),
    description: L(s.description, locale),
    duration: s.duration ? L(s.duration, locale) : undefined,
    price: s.price ? L(s.price, locale) : undefined,
  }));
}

export function getPackages`,
);

s = s.replace(
  /export function getPackages\(locale: Locale\) \{[\s\S]*?\n\}\n\nexport function getOffers/,
  `export function getPackages(locale: Locale) {
  return packages.map((p) => ({
    slug: p.slug,
    name: L(p.name, locale),
    subtitle: L(p.subtitle, locale),
    description: L(p.description, locale),
    price: L(p.price, locale),
    originalPrice: p.originalPrice ? L(p.originalPrice, locale) : undefined,
    features: localizeList(p.features, locale),
    featured: p.featured,
  }));
}

export function getOffers`,
);

// Why Nagm Spa benefit descriptions from PDF closing page
s = s.replace(
  /title: \{ ar: 'فريق متخصص', en: 'Expert Team' \},\n    description: \{ ar: '[^']+', en: '[^']+' \}/,
  `title: { ar: 'فريق متخصص', en: 'Expert Team' },
    description: { ar: 'خدمة احترافية بأيدي متخصصين داخل أجواء مصممة للراحة والخصوصية', en: 'Professional care by specialists in an atmosphere designed for comfort and privacy' }`,
);

s = s.replace(
  /title: \{ ar: 'أجواء فاخرة', en: 'Luxurious Atmosphere' \},\n    description: \{ ar: '[^']+', en: '[^']+' \}/,
  `title: { ar: 'أجواء فاخرة', en: 'Luxurious Atmosphere' },
    description: { ar: 'تجربة سبا متكاملة تجمع الهدوء والخصوصية وتجديد النشاط', en: 'A complete spa experience that combines tranquility, privacy, and renewed energy' }`,
);

writeFileSync(path, s);
console.log('home.ts menu data applied');
