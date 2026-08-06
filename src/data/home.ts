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
  price: LocalizedString;
}

export interface Package {
  slug: string;
  name: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  price: LocalizedString;
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
  service: LocalizedString;
}

export interface Faq {
  question: LocalizedString;
  answer: LocalizedString;
}

export const summerCampaign = {
  name: { ar: 'صيفك على كيفك', en: 'Your Summer, Your Way' } as LocalizedString,
  discountLabel: { ar: 'خصم ٢٠٪', en: '20% Off' } as LocalizedString,
  eyebrow: { ar: 'عروض الصيف', en: 'Summer Offers' } as LocalizedString,
} as const;

export const benefits: Benefit[] = [
  {
    icon: '/assets/home/benefits/expert-therapists.png',
    title: { ar: 'فريق متخصص', en: 'Expert Team' },
    description: { ar: 'أخصائيون فلبينيون على أعلى درجة من الكفاءة والخبرة', en: 'Highly skilled and experienced Filipino specialists' },
  },
  {
    icon: '/assets/home/benefits/luxury-products.png',
    title: { ar: 'أجواء فاخرة', en: 'Luxurious Atmosphere' },
    description: { ar: 'مساحات مصممة للراحة والاسترخاء بأعلى معايير النظافة', en: 'Spaces designed for comfort and relaxation with the highest hygiene standards' },
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
    slug: 'massage-relaxation',
    image: '/assets/home/services/relaxation-massage.jpg',
    title: { ar: 'مساج الاسترخاء', en: 'Relaxation Massage' },
    description: {
      ar: 'احجز مساج الاسترخاء في نجم سبا — جلسة هادئة تُخفف التوتر وتستعيد توازن الجسم والعقل بأيدي أخصائيين محترفين. تجربة مريحة — احجز عبر واتساب الآن.',
      en: 'Book a relaxation massage at Nagm Spa — a calming session that relieves stress and restores body and mind balance with professional specialists. A soothing experience — book via WhatsApp now.',
    },
    duration: { ar: '٤٥ دقيقة', en: '45 min' },
    price: { ar: '١٥٠ ر.س', en: '150 SAR' },
  },
  {
    slug: 'hot-oil-massage',
    image: '/assets/home/services/hot-oil-massage.jpg',
    title: { ar: 'مساج الزيت الحار', en: 'Hot Oil Massage' },
    description: {
      ar: 'مساج الزيت الحار في نجم سبا — زيوت دافئة تُرخّي العضلات وتحسّن الدورة الدموية وتمنحك استرخاءً عميقًا ومريحًا. احجز جلستك عبر واتساب الآن بسهولة.',
      en: 'Hot oil massage at Nagm Spa — warm oils that relax muscles, improve blood circulation, and deliver deep, comfortable relaxation. Book your session via WhatsApp now.',
    },
    duration: { ar: '٤٥ دقيقة', en: '45 min' },
    price: { ar: '١٥٠ ر.س', en: '150 SAR' },
  },
  {
    slug: 'foot-massage',
    image: '/assets/home/services/hand-foot-massage.jpg',
    title: { ar: 'مساج القدمين واليدين', en: 'Hand & Foot Massage' },
    description: {
      ar: 'مساج القدمين واليدين في نجم سبا — عناية متخصصة تُريح الجسم بالكامل وتخفف الإرهاق من أطرافك حتى كامل جسدك. تجربة منعشة — احجز عبر واتساب الآن.',
      en: 'Hand and foot massage at Nagm Spa — specialized care that relaxes the entire body and relieves fatigue from your extremities throughout. A refreshing experience — book via WhatsApp now.',
    },
    duration: { ar: '٤٥ دقيقة', en: '45 min' },
    price: { ar: '١٥٠ ر.س', en: '150 SAR' },
  },
  {
    slug: 'shiatsu',
    image: '/assets/home/services/shiatsu-massage.jpg',
    title: { ar: 'مساج الشياتسو', en: 'Shiatsu Massage' },
    description: {
      ar: 'مساج الشياتسو في نجم سبا — ضغط إيقاعي على مسارات الطاقة لتحفيز الدورة الدموية وإطلاق التشنجات العميقة. تجربة أصيلة — احجز عبر واتساب الآن.',
      en: 'Shiatsu massage at Nagm Spa — rhythmic pressure on energy meridians to stimulate blood circulation and release deep tension. An authentic experience — book via WhatsApp now.',
    },
    duration: { ar: '٦٠ دقيقة', en: '60 min' },
    price: { ar: '١٨٥ ر.س', en: '185 SAR' },
  },
  {
    slug: 'thai-massage',
    image: '/assets/home/services/thai-massage.jpg',
    title: { ar: 'مساج تايلندي', en: 'Thai Massage' },
    description: {
      ar: 'المساج التايلندي في نجم سبا يجمع التمدد والضغط العميق لزيادة المرونة وتجديد طاقة الجسم. تجربة أصيلة بأيدي محترفين — احجز موعدك عبر واتساب الآن.',
      en: 'Thai massage at Nagm Spa combines stretching and deep pressure to increase flexibility and rejuvenate body energy. An authentic experience by professionals — book your appointment via WhatsApp now.',
    },
    duration: { ar: '٦٠ دقيقة', en: '60 min' },
    price: { ar: '١٨٥ ر.س', en: '185 SAR' },
  },
  {
    slug: 'sports-massage',
    image: '/assets/home/services/deep-tissue.jpg',
    title: { ar: 'المساج الرياضي', en: 'Sports Massage' },
    description: {
      ar: 'المساج الرياضي في نجم سبا مخصص لتخفيف شد العضلات وتحسين التعافي بعد الجهد بأيدي أخصائيين محترفين. جلسة تناسب احتياجك — احجز موعدك عبر واتساب الآن.',
      en: 'Sports massage at Nagm Spa is designed to relieve muscle tension and improve post-exertion recovery with professional specialists. A session tailored to your needs — book your appointment via WhatsApp now.',
    },
    duration: { ar: '٦٠ دقيقة', en: '60 min' },
    price: { ar: '١٩٩ ر.س', en: '199 SAR' },
  },
  {
    slug: 'star-spa-massage',
    image: '/assets/home/services/swedish-massage.jpg',
    title: { ar: 'مساج نجم سبا', en: 'Nagm Spa Signature Massage' },
    description: {
      ar: 'مساج نجم سبا التوقيع — جلسة طويلة متكاملة تجمع الاسترخاء والعناية العميقة لاستعادة طاقتك بالكامل. تجربة مميزة — احجز موعدك عبر واتساب الآن.',
      en: 'Nagm Spa signature massage — a comprehensive long session combining relaxation and deep care to fully restore your energy. A unique experience — book your appointment via WhatsApp now.',
    },
    duration: { ar: '٨٠ دقيقة', en: '80 min' },
    price: { ar: '٢٤٩ ر.س', en: '249 SAR' },
  },
  {
    slug: 'moroccan-bath',
    image: '/assets/home/services/moroccan-bath.jpg',
    title: { ar: 'حمام مغربي كلاسيك', en: 'Classic Moroccan Bath' },
    description: {
      ar: 'حمام مغربي كلاسيك في نجم سبا يجمع البخار والصابون البلدي وتقشير البشرة لنضارة وانتعاش فوري وعميق. تجربة أصيلة فاخرة — احجز موعدك عبر واتساب.',
      en: 'Classic Moroccan bath at Nagm Spa combines steam, traditional black soap, and skin exfoliation for instant deep freshness and radiance. A luxurious authentic experience — book your appointment via WhatsApp.',
    },
    price: { ar: '١٥٠ ر.س', en: '150 SAR' },
  },
  {
    slug: 'moroccan-bath-clay',
    image: '/assets/home/services/moroccan-clay.jpg',
    title: { ar: 'حمام مغربي بالطين المغربي', en: 'Moroccan Bath with Moroccan Clay' },
    description: {
      ar: 'حمام مغربي بالطين المغربي في نجم سبا — تنظيف عميق ونضارة للبشرة مع تجربة حمام أصيلة فاخرة. احجز موعدك عبر واتساب الآن بسهولة.',
      en: 'Moroccan bath with Moroccan clay at Nagm Spa — deep cleansing and skin radiance with a luxurious authentic bath experience. Book your appointment via WhatsApp now.',
    },
    price: { ar: '١٩٥ ر.س', en: '195 SAR' },
  },
  {
    slug: 'manicure-pedicure',
    image: '/assets/home/services/manicure-pedicure.jpg',
    heroImage: '/assets/home/services/manicure-pedicure-hero.jpg',
    title: { ar: 'بدكير اليدين والقدمين', en: 'Manicure & Pedicure' },
    description: {
      ar: 'بدكير اليدين والقدمين في نجم سبا — عناية متكاملة لأظافرك وبشرتك بمظهر أنيق ومرتب. تجربة مريحة — احجز موعدك عبر واتساب الآن.',
      en: 'Manicure and pedicure at Nagm Spa — complete care for your nails and skin for a polished, elegant look. A comfortable experience — book your appointment via WhatsApp now.',
    },
    price: { ar: '١٥٠ ر.س', en: '150 SAR' },
  },
];

export const packages: Package[] = [
  {
    slug: 'wedding',
    name: { ar: 'باقة العرسان', en: 'Wedding Package' },
    subtitle: { ar: 'تحضير متكامل لإطلالة يوم الزفاف', en: 'Complete preparation for your wedding day look' },
    description: {
      ar: 'باقة العرسان من نجم سبا — حمام مغربي كلاسيك ومساج الاسترخاء وبدكير اليدين والقدمين لإطلالة مثالية يوم الزفاف. احجز باقتك عبر واتساب الآن بسهولة.',
      en: 'Wedding package from Nagm Spa — classic Moroccan bath, relaxation massage, and manicure & pedicure for the perfect wedding day look. Book your package via WhatsApp now.',
    },
    price: { ar: '٦٩٠ ر.س', en: '690 SAR' },
    features: [
      { ar: 'حمام مغربي كلاسيك', en: 'Classic Moroccan bath' },
      { ar: 'مساج الاسترخاء', en: 'Relaxation massage' },
      { ar: 'بدكير اليدين والقدمين', en: 'Manicure & pedicure' },
    ],
  },
  {
    slug: 'luxury',
    name: { ar: 'باقة الرفاهية', en: 'Luxury Package' },
    subtitle: { ar: 'تجربة سبا فاخرة من البداية حتى النهاية', en: 'A luxurious spa experience from start to finish' },
    description: {
      ar: 'باقة الرفاهية من نجم سبا: حمام مغربي بالطين المغربي ومساج نجم سبا الطويل ليوم استرخاء فاخر متكامل. احجز باقتك عبر واتساب الآن بسهولة.',
      en: 'Luxury package from Nagm Spa: Moroccan clay bath and extended Nagm Spa massage for a complete day of luxurious relaxation. Book your package via WhatsApp now.',
    },
    price: { ar: '٨٩٠ ر.س', en: '890 SAR' },
    featured: true,
    features: [
      { ar: 'حمام مغربي بالطين المغربي', en: 'Moroccan bath with Moroccan clay' },
      { ar: 'مساج نجم سبا ٨٠ دقيقة', en: 'Nagm Spa massage 80 min' },
    ],
  },
  {
    slug: 'gift',
    name: { ar: 'باقة الإهداء', en: 'Gift Package' },
    subtitle: { ar: 'هدية أنيقة قابلة للاختيار', en: 'An elegant customizable gift' },
    description: {
      ar: 'باقة الإهداء من نجم سبا — بطاقة هدية أنيقة تتيح اختيار الخدمة المناسبة من قائمة المساج والحمام والبدكير. هدية راحة مثالية — اطلبها عبر واتساب الآن.',
      en: 'Gift package from Nagm Spa — an elegant gift card that allows choosing any service from our massage, bath, and pedicure menu. The perfect relaxation gift — order via WhatsApp now.',
    },
    price: { ar: '٥٩٠ ر.س', en: '590 SAR' },
    features: [
      { ar: 'اختيار أي خدمة من القائمة', en: 'Choose any service from the menu' },
      { ar: 'بطاقة إهداء شخصية', en: 'Personalized gift card' },
      { ar: 'شهادة هدية', en: 'Gift certificate' },
    ],
  },
];

export const offers: Offer[] = [
  {
    slug: 'recovery',
    name: { ar: 'عرض التعافي', en: 'Recovery Offer' },
    subtitle: { ar: 'استعادة النشاط بعد الجهد', en: 'Restore your energy after exertion' },
    description: {
      ar: 'عرض التعافي من نجم سبا يجمع المساج السويدي والتايلندي ومساج الكاسات الصينية لتخفيف الشد واستعادة نشاطك. احجز عرضك عبر واتساب الآن.',
      en: 'Recovery offer from Nagm Spa combines Swedish massage, Thai massage, and cupping massage to relieve tension and restore your energy. Book your offer via WhatsApp now.',
    },
    price: { ar: '١٩٩ ر.س', en: '199 SAR' },
    originalPrice: { ar: '٢٤٩ ر.س', en: '249 SAR' },
    features: [
      { ar: 'مساج سويدي', en: 'Swedish massage' },
      { ar: 'مساج تايلندي', en: 'Thai massage' },
      { ar: 'مساج كاسات صينية', en: 'Cupping massage' },
    ],
  },
  {
    slug: 'relaxation',
    name: { ar: 'عرض الاسترخاء', en: 'Relaxation Offer' },
    subtitle: { ar: 'هدوء عميق للجسم والعقل', en: 'Deep calm for body and mind' },
    description: {
      ar: 'عرض الاسترخاء من نجم سبا: مساج سويدي وتايلندي مع مساج الأحجار الساخنة لجلسة هدوء عميقة ومريحة. احجز عرضك عبر واتساب الآن بسهولة.',
      en: 'Relaxation offer from Nagm Spa: Swedish and Thai massage with hot stone massage for a deeply calming and comfortable session. Book your offer via WhatsApp now.',
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
    slug: 'signature',
    name: { ar: 'نجم سبا سجنتشر', en: 'Nagm Spa Signature' },
    subtitle: { ar: 'التجربة الأشمل من نجم سبا', en: 'The most comprehensive experience from Nagm Spa' },
    description: {
      ar: 'نجم سبا سجنتشر — تجربة متكاملة تجمع المساج والحمام الملكي والبدكير وصنفرة البشرة وجلسة البخار. احجز عرضك عبر واتساب الآن.',
      en: 'Nagm Spa Signature — a complete experience combining massage, royal bath, pedicure, body scrub, and steam session. Book your offer via WhatsApp now.',
    },
    price: { ar: '٣٥٩ ر.س', en: '359 SAR' },
    originalPrice: { ar: '٤٤٩ ر.س', en: '449 SAR' },
    features: [
      { ar: 'مساج استرخاء', en: 'Relaxation massage' },
      { ar: 'مساج تايلندي', en: 'Thai massage' },
      { ar: 'مساج الزيت الحار', en: 'Hot oil massage' },
      { ar: 'حمام ملكي فاخر', en: 'Luxurious royal bath' },
      { ar: 'بدكير يدين وقدمين', en: 'Hand & foot pedicure' },
      { ar: 'صنفرة بشرة', en: 'Body scrub' },
      { ar: 'جلسة بخار', en: 'Steam session' },
    ],
  },
  {
    slug: 'care',
    name: { ar: 'باقة العناية', en: 'Care Package' },
    subtitle: { ar: 'عناية متوازنة للجسم والأطراف', en: 'Balanced care for body and extremities' },
    description: {
      ar: 'باقة العناية من نجم سبا تجمع مساج الاسترخاء والشياتسو والتايلندي مع بدكير اليدين والقدمين. احجز باقتك عبر واتساب الآن بسهولة.',
      en: 'Care package from Nagm Spa combines relaxation, Shiatsu, and Thai massage with manicure & pedicure. Book your package via WhatsApp now.',
    },
    price: { ar: '٢٥٩ ر.س', en: '259 SAR' },
    originalPrice: { ar: '٣٢٤ ر.س', en: '324 SAR' },
    features: [
      { ar: 'مساج استرخاء + مساج شياتسو', en: 'Relaxation massage + Shiatsu massage' },
      { ar: 'مساج تايلندي', en: 'Thai massage' },
      { ar: 'بدكير يدين وقدمين', en: 'Manicure & pedicure' },
    ],
  },
  {
    slug: 'elegance',
    name: { ar: 'عرض الفخامة', en: 'Elegance Offer' },
    subtitle: { ar: 'مساج وحمام ملكي بأجواء فاخرة', en: 'Massage and royal bath in a luxurious setting' },
    description: {
      ar: 'عرض الفخامة من نجم سبا: مساج سويدي وتايلندي مع حمام ملكي فاخر وجلسة بخار ليوم استرخاء راقٍ. احجز عرضك عبر واتساب الآن.',
      en: 'Elegance offer from Nagm Spa: Swedish and Thai massage with a luxurious royal bath and steam session for a refined day of relaxation. Book your offer via WhatsApp now.',
    },
    price: { ar: '٢٤٩ ر.س', en: '249 SAR' },
    originalPrice: { ar: '٣١٢ ر.س', en: '312 SAR' },
    features: [
      { ar: 'مساج سويدي', en: 'Swedish massage' },
      { ar: 'مساج تايلندي', en: 'Thai massage' },
      { ar: 'حمام ملكي فاخر', en: 'Luxurious royal bath' },
      { ar: 'جلسة بخار', en: 'Steam session' },
    ],
  },
  {
    slug: 'prosperity',
    name: { ar: 'العرض الرخاء', en: 'Prosperity Offer' },
    subtitle: { ar: 'راحة هادئة بأسعار الصيف', en: 'Quiet comfort at summer prices' },
    description: {
      ar: 'العرض الرخاء من نجم سبا يجمع المساج السويدي والحمام المغربي الكلاسيكي وجلسة البخار لراحة هادئة ومتوازنة. احجز عبر واتساب الآن.',
      en: 'Prosperity offer from Nagm Spa combines Swedish massage, classic Moroccan bath, and steam session for quiet, balanced comfort. Book via WhatsApp now.',
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
    slug: 'royal',
    name: { ar: 'العرض الملكي', en: 'Royal Offer' },
    subtitle: { ar: 'تجربة ملكية شاملة بخصم الصيف', en: 'A comprehensive royal experience at summer discount' },
    description: {
      ar: 'العرض الملكي من نجم سبا — مساج نجم سبا والزيت الحار والكاسات والأحجار مع حمام ملكي وبدكير وصنفرة وبخار. احجز عبر واتساب الآن.',
      en: 'Royal offer from Nagm Spa — Nagm Spa massage, hot oil, cupping, and hot stones with royal bath, pedicure, body scrub, and steam. Book via WhatsApp now.',
    },
    price: { ar: '٤٤٩ ر.س', en: '449 SAR' },
    originalPrice: { ar: '٥٦٢ ر.س', en: '562 SAR' },
    features: [
      { ar: 'مساج نجم سبا + مساج زيت حار', en: 'Nagm Spa massage + hot oil massage' },
      { ar: 'مساج كاسات صينية + مساج أحجار ساخنة', en: 'Cupping massage + hot stone massage' },
      { ar: 'حمام ملكي فاخر + بدكير يدين وقدمين', en: 'Luxurious royal bath + manicure & pedicure' },
      { ar: 'صنفرة بشرة + جلسة بخار', en: 'Body scrub + steam session' },
    ],
  },
  {
    slug: 'golden',
    name: { ar: 'العرض الذهبي', en: 'Golden Offer' },
    subtitle: { ar: 'مزيج ذهبي من المساج والحمام', en: 'A golden blend of massage and bath' },
    description: {
      ar: 'العرض الذهبي من نجم سبا يجمع مساج الاسترخاء والتايلندي والكاسات والأحجار الساخنة مع حمام ملكي فاخر. احجز عرضك عبر واتساب الآن.',
      en: 'Golden offer from Nagm Spa combines relaxation massage, Thai massage, cupping, and hot stones with a luxurious royal bath. Book your offer via WhatsApp now.',
    },
    price: { ar: '٣٤٩ ر.س', en: '349 SAR' },
    originalPrice: { ar: '٤٣٨ ر.س', en: '438 SAR' },
    features: [
      { ar: 'مساج استرخاء + مساج تايلندي', en: 'Relaxation massage + Thai massage' },
      { ar: 'مساج كاسات صينية', en: 'Cupping massage' },
      { ar: 'مساج أحجار ساخنة', en: 'Hot stone massage' },
      { ar: 'حمام ملكي فاخر', en: 'Luxurious royal bath' },
    ],
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: { ar: 'تجربة استثنائية من اللحظة الأولى. الأجواء هادئة والمعالجة محترفة جدًا.', en: 'An exceptional experience from the very first moment. The atmosphere is calm and the therapist is very professional.' },
    name: { ar: 'ريم العتيبي', en: 'Reem Al-Otaibi' },
    service: { ar: 'حمام مغربي كلاسيك', en: 'Classic Moroccan Bath' },
  },
  {
    quote: { ar: 'أفضل مكان جربته للاسترخاء. المكان راقٍ والخدمة على أعلى مستوى.', en: 'The best place I have tried for relaxation. The venue is upscale and the service is top-notch.' },
    name: { ar: 'نوره القحطاني', en: 'Noura Al-Qahtani' },
    service: { ar: 'مساج الزيت الحار', en: 'Hot Oil Massage' },
  },
  {
    quote: { ar: 'شعرت بتجدد كامل بعد الجلسة. تفاصيل صغيرة تصنع فرقًا كبيرًا.', en: 'I felt completely renewed after the session. Small details make a big difference.' },
    name: { ar: 'سارة الدوسري', en: 'Sara Al-Dosari' },
    service: { ar: 'مساج الاسترخاء', en: 'Relaxation Massage' },
  },
  {
    quote: { ar: 'خدمة سريعة ومكان نظيف. المساج الرياضي خفف ألم الظهر بوضوح.', en: 'Quick service and a clean place. The sports massage clearly relieved my back pain.' },
    name: { ar: 'فهد الشمري', en: 'Fahd Al-Shammari' },
    service: { ar: 'المساج الرياضي', en: 'Sports Massage' },
  },
  {
    quote: { ar: 'أجواء هادئة وخصوصية تامة. أعود إليهم باستمرار بعد يوم طويل.', en: 'Calm atmosphere and complete privacy. I keep coming back after a long day.' },
    name: { ar: 'مشاعل العتيبي', en: 'Mashael Al-Otaibi' },
    service: { ar: 'مساج نجم سبا', en: 'Nagm Spa Massage' },
  },
  {
    quote: { ar: 'تجربة ممتازة من الاستقبال حتى نهاية الجلسة. أنصح بهم بشدة.', en: 'An excellent experience from reception to the end of the session. I highly recommend them.' },
    name: { ar: 'عبدالله الدوسري', en: 'Abdullah Al-Dosari' },
    service: { ar: 'مساج تايلندي', en: 'Thai Massage' },
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
    question: { ar: 'هل الجلسات مناسبة للحامل؟', en: 'Are the sessions suitable for pregnant women?' },
    answer: { ar: 'نوفر جلسات مخصصة للحامل بعد استشارة الطبيب، ويرجى إبلاغ فريق الحجز مسبقًا.', en: 'We offer specialized sessions for pregnant women after doctor consultation. Please inform the booking team in advance.' },
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
    price: L(s.price, locale),
  }));
}

export function getPackages(locale: Locale) {
  return packages.map((p) => ({
    slug: p.slug,
    name: L(p.name, locale),
    subtitle: L(p.subtitle, locale),
    description: L(p.description, locale),
    price: L(p.price, locale),
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
    service: L(t.service, locale),
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
