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
  /** Optional promotional banner shown on cards and the detail page */
  image?: string;
  name: LocalizedString;
  subtitle: LocalizedString;
  description: LocalizedString;
  price: LocalizedString;
  originalPrice?: LocalizedString;
  features?: LocalizedString[];
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
  name: { ar: 'العناية بالسيارات', en: 'Car Care' } as LocalizedString,
  discountLabel: { ar: 'عرض خاص', en: 'Special Offer' } as LocalizedString,
  eyebrow: { ar: 'عروضنا', en: 'Our Offers' } as LocalizedString,
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
    slug: 'exterior-wash',
    name: { ar: 'غسيل خارجي فقط', en: 'Exterior Wash Only' },
    subtitle: { ar: 'سعر خاص لفترة محدودة', en: 'Special price for a limited time' },
    description: {
      ar: 'غسيل خارجي فقط لسيارتك من نجم سبا بسعر خاص — ١٥ ر.س لفترة محدودة. احجز عرضك الآن عبر واتساب أو اتصل بنا.',
      en: 'Exterior-only wash for your car at Nagm Spa at a special price — 15 SAR for a limited time. Book your offer now via WhatsApp or call us.',
    },
    price: { ar: '١٥ ر.س', en: '15 SAR' },
  },
  {
    slug: 'interior-wash',
    name: { ar: 'غسيل داخلي فقط', en: 'Interior Wash Only' },
    subtitle: { ar: 'عرض خاص لفترة محدودة', en: 'Special offer for a limited time' },
    description: {
      ar: 'غسيل داخلي فقط لسيارتك من نجم سبا بسعر خاص — ٢٠ ر.س لفترة محدودة. احجز عرضك الآن عبر واتساب أو اتصل بنا.',
      en: 'Interior-only wash for your car at Nagm Spa at a special price — 20 SAR for a limited time. Book your offer now via WhatsApp or call us.',
    },
    price: { ar: '٢٠ ر.س', en: '20 SAR' },
  },
  {
    slug: 'engine-cleaning',
    name: { ar: 'تنظيف المحرك', en: 'Engine Cleaning' },
    subtitle: { ar: 'عرض خاص لفترة محدودة', en: 'Special offer for a limited time' },
    description: {
      ar: 'تنظيف المحرك من نجم سبا بسعر خاص — ٥٠ ر.س لفترة محدودة. احجز عرضك الآن عبر واتساب أو اتصل بنا.',
      en: 'Engine cleaning at Nagm Spa at a special price — 50 SAR for a limited time. Book your offer now via WhatsApp or call us.',
    },
    price: { ar: '٥٠ ر.س', en: '50 SAR' },
  },
  {
    slug: 'body-polishing',
    name: { ar: 'تلميع الهيكل', en: 'Body Polishing' },
    subtitle: { ar: 'عرض خاص لفترة محدودة', en: 'Special offer for a limited time' },
    description: {
      ar: 'تلميع الهيكل من نجم سبا بسعر خاص — ١٠٠ ر.س لفترة محدودة. احجز عرضك الآن عبر واتساب أو اتصل بنا.',
      en: 'Body polishing at Nagm Spa at a special price — 100 SAR for a limited time. Book your offer now via WhatsApp or call us.',
    },
    price: { ar: '١٠٠ ر.س', en: '100 SAR' },
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
    ...(o.image ? { image: o.image } : {}),
    name: L(o.name, locale),
    subtitle: L(o.subtitle, locale),
    description: L(o.description, locale),
    price: L(o.price, locale),
    originalPrice: o.originalPrice ? L(o.originalPrice, locale) : undefined,
    features: o.features ? localizeList(o.features, locale) : [],
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
