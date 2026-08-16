import type { Locale, LocalizedString } from '../i18n/types';
import { L, localizeList } from '../i18n/localize';

export interface Benefit {
  icon: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface Service {
  slug: string;
  /** Card / listing thumbnail */
  image: string;
  /** Optional larger image for the service detail page */
  heroImage?: string;
  title: LocalizedString;
  description: LocalizedString;
  duration?: LocalizedString;
  /** Omit when the PDF only prices this treatment inside offers/packages. */
  price?: LocalizedString;
}

export interface Package {
  slug: string;
  name: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  price: LocalizedString;
  originalPrice?: LocalizedString;
  features: LocalizedString[];
  featured?: boolean;
}

export interface Offer {
  slug: string;
  name: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  price: LocalizedString;
  originalPrice: LocalizedString;
  features: LocalizedString[];
}

export interface Testimonial {
  quote: LocalizedString;
  name: LocalizedString;
  service?: LocalizedString;
}

export interface Faq {
  question: LocalizedString;
  answer: LocalizedString;
}

export const summerCampaign = {
  name: { ar: 'عروض نجم سبا', en: 'Nagm Spa Special Offers' } as LocalizedString,
  discountLabel: { ar: 'خصم ٢٠٪', en: '20% Off' } as LocalizedString,
  eyebrow: { ar: 'على جميع الباقات', en: 'On all packages' } as LocalizedString,
} as const;

export const benefits: Benefit[] = [
  {
    icon: '/assets/home/benefits/expert-therapists.png',
    title: { ar: 'فريق متخصص', en: 'Expert Team' },
    description: { ar: 'خدمة احترافية بأيدي متخصصين داخل أجواء مصممة للراحة والخصوصية', en: 'Professional care by specialists in an atmosphere designed for comfort and privacy' },
  },
  {
    icon: '/assets/home/benefits/luxury-products.png',
    title: { ar: 'أجواء فاخرة', en: 'Luxurious Atmosphere' },
    description: { ar: 'تجربة سبا متكاملة تجمع الهدوء والخصوصية وتجديد النشاط', en: 'A complete spa experience that combines tranquility, privacy, and renewed energy' },
  },
  {
    icon: '/assets/home/benefits/calm-atmosphere.png',
    title: { ar: 'أسعار تنافسية', en: 'Competitive Prices' },
    description: { ar: 'خدمات متميزة بأسعار مناسبة وعروض حصرية طوال العام', en: 'Premium services at affordable prices with exclusive offers year-round' },
  },
  {
    icon: '/assets/home/benefits/quick-booking.png',
    title: { ar: 'موقع مميز', en: 'Prime Location' },
    description: { ar: 'في قلب حفر الباطن — حي المصيف، نخدمك على مدار الساعة', en: 'In the heart of Hafar Al-Batin — Al-Masif district, serving you around the clock' },
  },
];

export const services: Service[] = [
  {
    slug: 'swedish-massage',
    image: '/assets/home/services/swedish-massage.jpg',
    title: { ar: 'مساج سويدي', en: 'Swedish Massage' },
    description: {
      ar: 'مساج سويدي ضمن عروض نجم سبا — لمسات انسيابية تُرخي العضلات وتُهدئ التوتر. احجز عبر واتساب ضمن الباقة المناسبة لك.',
      en: 'Swedish massage in Nagm Spa offers — flowing strokes that relax muscles and ease tension. Book via WhatsApp within the offer that suits you.',
    },
    price: { ar: 'ضمن العروض', en: 'Via offers' },
  },
  {
    slug: 'thai-massage',
    image: '/assets/home/services/thai-massage.jpg',
    title: { ar: 'مساج تايلندي', en: 'Thai Massage' },
    description: {
      ar: 'مساج تايلندي ضمن عروض نجم سبا — تمدد وضغط عميق لزيادة المرونة وتجديد الطاقة. احجز ضمن العرض المناسب لك.',
      en: 'Thai massage in Nagm Spa offers — stretching and deep pressure for flexibility and renewed energy. Book within the right offer.',
    },
    price: { ar: 'ضمن العروض', en: 'Via offers' },
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
    price: { ar: 'ضمن العروض', en: 'Via offers' },
  },
  {
    slug: 'cupping',
    image: '/assets/home/services/cupping.jpg',
    title: { ar: 'مساج كاسات صينية', en: 'Chinese Cupping Massage' },
    description: {
      ar: 'مساج الكاسات الصينية ضمن عروض نجم سبا — تحفيز للدورة الدموية وتخفيف الشد العميق.',
      en: 'Chinese cupping massage in Nagm Spa offers — supports circulation and eases deep tension.',
    },
    price: { ar: 'ضمن العروض', en: 'Via offers' },
  },
  {
    slug: 'massage-relaxation',
    image: '/assets/home/services/relaxation-massage.jpg',
    title: { ar: 'مساج استرخاء', en: 'Relaxation Massage' },
    description: {
      ar: 'مساج الاسترخاء ضمن عروض نجم سبا — جلسة هادئة لاستعادة التوازن وتهدئة الجسد والعقل.',
      en: 'Relaxation massage in Nagm Spa offers — a calm session to restore balance for body and mind.',
    },
    price: { ar: 'ضمن العروض', en: 'Via offers' },
  },
  {
    slug: 'shiatsu',
    image: '/assets/home/services/shiatsu-massage.jpg',
    title: { ar: 'مساج شياتسو', en: 'Shiatsu Massage' },
    description: {
      ar: 'مساج الشياتسو ضمن عروض نجم سبا — ضغط إيقاعي على مسارات الطاقة لإطلاق التشنجات.',
      en: 'Shiatsu massage in Nagm Spa offers — rhythmic pressure on energy pathways to release tight spots.',
    },
    price: { ar: 'ضمن العروض', en: 'Via offers' },
  },
  {
    slug: 'hot-oil-massage',
    image: '/assets/home/services/hot-oil-massage.jpg',
    title: { ar: 'مساج الزيت الحار', en: 'Hot Oil Massage' },
    description: {
      ar: 'مساج الزيت الحار ضمن عروض نجم سبا — زيوت دافئة لاسترخاء عضلي عميق وراحة مريحة.',
      en: 'Hot oil massage in Nagm Spa offers — warm oils for deep muscle ease and comfortable relief.',
    },
    price: { ar: 'ضمن العروض', en: 'Via offers' },
  },
  {
    slug: 'star-spa-massage',
    image: '/assets/home/services/star-spa-massage.jpg',
    title: { ar: 'مساج نجم سبا', en: 'Nagm Spa Signature Massage' },
    description: {
      ar: 'مساج نجم سبا التوقيع ضمن العروض — جلسة متكاملة تجمع الاسترخاء والعناية العميقة.',
      en: 'Nagm Spa signature massage within offers — a complete session combining relaxation and deep care.',
    },
    price: { ar: 'ضمن العروض', en: 'Via offers' },
  },
  {
    slug: 'moroccan-bath',
    image: '/assets/home/services/moroccan-bath.jpg',
    title: { ar: 'حمام مغربي كلاسيكي', en: 'Classic Moroccan Bath' },
    description: {
      ar: 'حمام مغربي كلاسيكي ضمن عروض نجم سبا — انتعاش ونضارة بتجربة حمام أصيلة.',
      en: 'Classic Moroccan bath in Nagm Spa offers — freshness and radiance with an authentic hammam experience.',
    },
    price: { ar: 'ضمن العروض', en: 'Via offers' },
  },
  {
    slug: 'royal-bath',
    image: '/assets/home/services/moroccan-clay.jpg',
    title: { ar: 'حمام ملكي فاخر', en: 'Luxury Royal Bath' },
    description: {
      ar: 'حمام ملكي فاخر ضمن عروض نجم سبا — تجربة فاخرة للعناية العميقة والاسترخاء.',
      en: 'Luxury royal bath in Nagm Spa offers — a premium ritual for deep care and relaxation.',
    },
    price: { ar: 'ضمن العروض', en: 'Via offers' },
  },
  {
    slug: 'steam-session',
    image: '/assets/home/services/steam-session.jpg',
    title: { ar: 'جلسة بخار', en: 'Steam Session' },
    description: {
      ar: 'جلسة بخار ضمن عروض نجم سبا — تهيئة مهدئة للجسم قبل أو مع باقة العناية.',
      en: 'Steam session in Nagm Spa offers — a calming prep for body care within your package.',
    },
    price: { ar: 'ضمن العروض', en: 'Via offers' },
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
    price: { ar: 'ضمن العروض', en: 'Via offers' },
  },
  {
    slug: 'body-scrub',
    image: '/assets/home/services/body-scrub.jpg',
    title: { ar: 'صنفرة بشرة', en: 'Body Scrub' },
    description: {
      ar: 'صنفرة البشرة ضمن عروض نجم سبا — تنعيم ونضارة كجزء من تجربة العناية المتكاملة.',
      en: 'Body scrub in Nagm Spa offers — smoother, fresher skin as part of a complete care experience.',
    },
    price: { ar: 'ضمن العروض', en: 'Via offers' },
  },
];

export const packages: Package[] = [
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
    name: { ar: 'العرض الرفاهية', en: 'Luxury Offer' },
    subtitle: { ar: 'تجربة سبا شاملة مع مشروب وحلا', en: 'A complete spa experience with drink and dessert' },
    description: {
      ar: 'العرض الرفاهية من نجم سبا يجمع مساج نجم سبا والزيت الحار والكاسات والأحجار مع حمام ملكي وبخار وبدكير وصنفرة، ويشمل مشروبًا وحلا. احجز عبر واتساب الآن.',
      en: 'Luxury offer from Nagm Spa combines Nagm Spa massage, hot oil, cupping, and hot stones with royal bath, steam, pedicure, and body scrub — plus drink and dessert. Book via WhatsApp now.',
    },
    price: { ar: '٥٤٩ ر.س', en: '549 SAR' },
    originalPrice: { ar: '٦٨٥ ر.س', en: '685 SAR' },
    features: [
      { ar: 'مساج نجم سبا + مساج زيت حار', en: 'Nagm Spa massage + hot oil massage' },
      { ar: 'مساج كاسات صينية + مساج أحجار ساخنة', en: 'Chinese cupping + hot stone massage' },
      { ar: 'حمام ملكي فاخر + جلسة بخار', en: 'Luxury royal bath + steam session' },
      { ar: 'بدكير يدين وقدمين + صنفرة بشرة', en: 'Hand & foot pedicure + body scrub' },
      { ar: 'يشمل العرض مشروب + حلا', en: 'Includes drink + dessert' },
    ],
  },
  {
    slug: 'gift',
    name: { ar: 'عرض الهدية', en: 'Gift Offer' },
    subtitle: { ar: 'هدية فاخرة مع حلا وبوكيه ورد', en: 'A luxurious gift with dessert and a flower bouquet' },
    description: {
      ar: 'عرض الهدية من نجم سبا — تجربة متكاملة من المساج والحمام الملكي والبدكير والصنفرة، مع حلا وبوكيه ورد. اطلبها عبر واتساب الآن.',
      en: 'Gift offer from Nagm Spa — a complete experience of massage, royal bath, pedicure, and body scrub, plus dessert and a flower bouquet. Order via WhatsApp now.',
    },
    price: { ar: '٥٩٠ ر.س', en: '590 SAR' },
    originalPrice: { ar: '٧٣٥ ر.س', en: '735 SAR' },
    features: [
      { ar: 'مساج نجم سبا + مساج زيت حار', en: 'Nagm Spa massage + hot oil massage' },
      { ar: 'مساج كاسات صينية + مساج أحجار ساخنة', en: 'Chinese cupping + hot stone massage' },
      { ar: 'حمام ملكي فاخر + جلسة بخار', en: 'Luxury royal bath + steam session' },
      { ar: 'بدكير يدين وقدمين + صنفرة بشرة', en: 'Hand & foot pedicure + body scrub' },
      { ar: 'يشمل العرض حلا + بوكيه ورد', en: 'Includes dessert + flower bouquet' },
    ],
  },
];

export const offers: Offer[] = [
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
];

/** Five-star Google Maps reviews for مساج وحمام مغربي نجم سبا. */
export const testimonials: Testimonial[] = [
  {
    quote: {
      ar: 'ما شاء الله المحل جميل وراقي وتعامل الموظفين مره ممتاز ومحترم وخصوص موظف الاستقبال محمود والله يوفقهم ويرزقهم ويسر الامور حاب اشكرهم واقول يعطيك العافيه وبيض الله وجهكم',
      en: 'MashaAllah, the place is beautiful and elegant, and the staff are excellent and respectful — especially receptionist Mahmoud. May God grant them success. Thank you, well done.',
    },
    name: { ar: 'سعد المطيري', en: 'Saad Al-Mutairi' },
  },
  {
    quote: {
      ar: 'ماشاء الله تجربة ممتعة وإدارة على قدر كبير من الرقى وتعامل الإخوة المصرين الاستاذ محمودفى الاستقبال واخصائين المساج كفاءة عالية ننصحكم بالتجربة',
      en: 'MashaAllah, an enjoyable experience with refined management. Receptionist Mahmoud and the massage therapists were highly skilled. We recommend trying it.',
    },
    name: { ar: 'ع. المطيري', en: 'A. Al-Mutairi' },
  },
  {
    quote: {
      ar: 'أشكركم على الاستقبال المحترم الأستاذ محمود ابو سلمى والمحل نظيف والعمال كويس جدا',
      en: 'Thank you for the respectful welcome from Mr. Mahmoud Abu Salma. The place is clean and the staff are very good.',
    },
    name: { ar: 'مبارك اليامي', en: 'Mobark Alyami' },
  },
  {
    quote: {
      ar: 'ما شاء الله تبارك الله، المكان مرتب جدًا وواضح فيه التعب والاهتمام بالتفاصيل. شغل العمالة ممتاز واحترافي. أشكر بشكل خاص الأخ محمود في الاستقبال، إنسان محترم وتعاملُه راقٍ، واستقبالُه كان جدًا طيب. تجربة رائعة وأنصح بالمكان.',
      en: 'MashaAllah, the place is very tidy with clear attention to detail. The team’s work is excellent and professional. Special thanks to Mahmoud at reception — respectful, refined, and warm. A wonderful experience; I recommend it.',
    },
    name: { ar: 'مساعد', en: 'Musaid' },
  },
  {
    quote: {
      ar: 'موظف الاستقبال محمود ممتاز وقمة في الاخلاق',
      en: 'Receptionist Mahmoud is excellent and the height of good manners.',
    },
    name: { ar: 'حمد العنزي', en: 'Hamad Alanzi' },
  },
  {
    quote: {
      ar: 'المركز ممتاز والقامين على العمل فنانين يعطيه العافيه ما قصر والاخ محمود ما قصر اشكر',
      en: 'The center is excellent and the team are true professionals. Well done — and special thanks to Mahmoud.',
    },
    name: { ar: 'جراح الشمري', en: 'Jarrah Al-Shammari' },
  },
];

export const faqs: Faq[] = [
  {
    question: { ar: 'هل يجب الحجز مسبقًا؟', en: 'Do I need to book in advance?' },
    answer: { ar: 'نعم، نوصي بالحجز المسبق لضمان توفر الوقت المناسب لك، ويمكنك الحجز بسهولة عبر واتساب أو الاتصال. نحن مفتوحون على مدار الساعة.', en: 'Yes, we recommend booking in advance to ensure your preferred time slot is available. You can easily book via WhatsApp or by calling. We are open around the clock.' },
  },
  {
    question: { ar: 'متى يُفضّل الوصول قبل الموعد؟', en: 'How early should I arrive before my appointment?' },
    answer: { ar: 'يُفضّل الوصول قبل الموعد بـ ١٥ دقيقة لإتمام إجراءات الاستقبال والاستعداد للجلسة بهدوء.', en: 'We recommend arriving 15 minutes before your appointment to complete check-in and prepare for your session calmly.' },
  },
  {
    question: { ar: 'هل يمكن تعديل أو إلغاء الحجز؟', en: 'Can I modify or cancel my booking?' },
    answer: { ar: 'نعم، يمكنك تعديل أو إلغاء الحجز قبل الموعد بـ ٢٤ ساعة دون رسوم.', en: 'Yes, you can modify or cancel your booking up to 24 hours before the appointment at no charge.' },
  },
  {
    question: { ar: 'هل توفرون غرفًا خاصة؟', en: 'Do you offer private rooms?' },
    answer: { ar: 'نعم، جميع جلساتنا تُقدّم في غرف خاصة مصممة لتوفير الراحة والخصوصية التامة.', en: 'Yes, all our sessions are provided in private rooms designed for comfort and complete privacy.' },
  },
  {
    question: { ar: 'هل الأسعار تشمل الضريبة؟', en: 'Are prices inclusive of tax?' },
    answer: { ar: 'نعم، جميع الأسعار المعروفة تشمل ضريبة القيمة المضافة.', en: 'Yes, all listed prices include VAT.' },
  },
  {
    question: { ar: 'ما طرق الدفع المتاحة؟', en: 'What payment methods are accepted?' },
    answer: { ar: 'نقبل الدفع النقدي والبطاقات البنكية ومدى.', en: 'We accept cash, bank cards, and Mada.' },
  },
  {
    question: { ar: 'هل يمكن شراء بطاقة هدية؟', en: 'Can I purchase a gift card?' },
    answer: { ar: 'نعم، تتوفر بطاقات هدايا بقيم وتجارب مختلفة ويمكن تخصيصها لمناسبتك.', en: 'Yes, gift cards are available in various values and experiences and can be customized for your occasion.' },
  },
];

// --- Localized getter helpers ---

export function getServices(locale: Locale) {
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

export function getPackages(locale: Locale) {
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

export function getOffers(locale: Locale) {
  return offers.map((o) => ({
    slug: o.slug,
    name: L(o.name, locale),
    subtitle: L(o.subtitle, locale),
    description: L(o.description, locale),
    price: L(o.price, locale),
    originalPrice: L(o.originalPrice, locale),
    features: localizeList(o.features, locale),
  }));
}

export function getBenefits(locale: Locale) {
  return benefits.map((b) => ({
    icon: b.icon,
    title: L(b.title, locale),
    description: L(b.description, locale),
  }));
}

export function getTestimonials(locale: Locale) {
  return testimonials.map((t) => ({
    quote: L(t.quote, locale),
    name: L(t.name, locale),
    ...(t.service ? { service: L(t.service, locale) } : {}),
  }));
}

export function getFaqs(locale: Locale) {
  return faqs.map((f) => ({
    question: L(f.question, locale),
    answer: L(f.answer, locale),
  }));
}

export function getSummerCampaign(locale: Locale) {
  return {
    name: L(summerCampaign.name, locale),
    discountLabel: L(summerCampaign.discountLabel, locale),
    eyebrow: L(summerCampaign.eyebrow, locale),
  };
}
