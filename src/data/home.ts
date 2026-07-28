export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface Service {
  slug: string;
  image: string;
  title: string;
  description: string;
  duration?: string;
  price: string;
}

export interface Package {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  features: string[];
  featured?: boolean;
}

export interface Testimonial {
  quote: string;
  name: string;
  service: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export const benefits: Benefit[] = [
  { icon: '/assets/home/benefits/expert-therapists.png', title: 'فريق متخصص', description: 'أخصائيون فلبينيون على أعلى درجة من الكفاءة والخبرة' },
  { icon: '/assets/home/benefits/luxury-products.png', title: 'أجواء فاخرة', description: 'مساحات مصممة للراحة والاسترخاء بأعلى معايير النظافة' },
  { icon: '/assets/home/benefits/calm-atmosphere.png', title: 'أسعار تنافسية', description: 'خدمات متميزة بأسعار مناسبة وعروض حصرية طوال العام' },
  { icon: '/assets/home/benefits/quick-booking.png', title: 'موقع مميز', description: 'في قلب حفر الباطن - المحمدية، طريق الملك فيصل' },
];

export const services: Service[] = [
  {
    slug: 'massage-relaxation',
    image: '/assets/home/services/swedish-massage.jpg',
    title: 'مساج استرخاء',
    description:
      'احجز مساج استرخاء في نجم سبا — جلسة هادئة تُخفف التوتر وتستعيد توازن الجسم والعقل بأيدي أخصائيين محترفين. تجربة مريحة — احجز عبر واتساب الآن.',
    price: '٣٠٠ ر.س',
  },
  {
    slug: 'shiatsu',
    image: '/assets/home/services/deep-tissue.jpg',
    title: 'مساج شياتسو (ياباني)',
    description:
      'مساج شياتسو ياباني في نجم سبا — ضغط إيقاعي على مسارات الطاقة لتحفيز الدورة الدموية وإطلاق التشنجات العميقة. تجربة أصيلة — احجز عبر واتساب الآن.',
    price: '٣٥٠ ر.س',
  },
  {
    slug: 'thai-massage',
    image: '/assets/home/services/moroccan-bath.jpg',
    title: 'المساج التايلندي',
    description:
      'المساج التايلندي في نجم سبا يجمع التمدد والضغط العميق لزيادة المرونة وتجديد طاقة الجسم. تجربة أصيلة بأيدي محترفين — احجز موعدك عبر واتساب الآن.',
    price: '٣٥٠ ر.س',
  },
  {
    slug: 'hot-stone',
    image: '/assets/home/services/hot-stone.jpg',
    title: 'مساج الأحجار الساخنة',
    description:
      'مساج الأحجار الساخنة في نجم سبا — أحجار بركانية دافئة تخفف شد العضلات وتمنحك استرخاءً عميقًا ومريحًا للجسم كله. احجز جلستك عبر واتساب الآن بسهولة.',
    price: '٤٠٠ ر.س',
  },
  {
    slug: 'ventosa-cupping',
    image: '/assets/home/services/aromatherapy.jpg',
    title: 'مساج بنتوسا (كاسات الهواء)',
    description:
      'مساج بنتوسا بكاسات الهواء في نجم سبا يُنشّط الدورة الدموية ويخفف آلام الظهر والعضلات المتراكمة. علاج فعّال للتوتر — احجز موعدك عبر واتساب الآن.',
    price: '٣٥٠ ر.س',
  },
  {
    slug: 'foot-massage',
    image: '/assets/home/services/facial-care.jpg',
    title: 'مساج القدمين',
    description:
      'مساج القدمين في نجم سبا — عناية انعكاسية متخصصة تُريح الجسم بالكامل وتخفف الإرهاق من أخمص القدمين حتى الرأس. تجربة منعشة — احجز عبر واتساب الآن.',
    price: '٢٥٠ ر.س',
  },
  {
    slug: 'moroccan-bath',
    image: '/assets/home/services/hot-stone.jpg',
    title: 'حمام مغربي كلاسيك',
    description:
      'حمام مغربي كلاسيك في نجم سبا يجمع البخار والصابون البلدي وتقشير البشرة لنضارة وانتعاش فوري وعميق. تجربة أصيلة فاخرة — احجز موعدك عبر واتساب.',
    price: '٤٥٠ ر.س',
  },
  {
    slug: 'therapeutic-massage',
    image: '/assets/home/services/aromatherapy.jpg',
    title: 'التدليك العلاجي',
    description:
      'التدليك العلاجي في نجم سبا مخصص لآلام الظهر والرقبة والمفاصل بأيدي أخصائيين محترفين. جلسة تناسب احتياجك تمامًا — احجز موعدك عبر واتساب الآن.',
    price: '٤٠٠ ر.س',
  },
  {
    slug: 'swedish-massage',
    image: '/assets/home/services/facial-care.jpg',
    title: 'المساج السويدي',
    description:
      'المساج السويدي في نجم سبا بحركات انسيابية كلاسيكية لتحسين الدورة الدموية وتهدئة العضلات واستعادة الراحة اليومية. احجز موعدك عبر واتساب الآن.',
    price: '٣٠٠ ر.س',
  },
];

export const packages: Package[] = [
  {
    slug: 'wedding',
    name: 'باقة العرسان',
    subtitle: 'تحضير متكامل لإطلالة يوم الزفاف',
    description:
      'باقة العرسان من نجم سبا — حمام مغربي ملكي ومساج استرخاء وعناية بالبشرة والأظافر لإطلالة مثالية يوم الزفاف. احجز باقتك عبر واتساب الآن بسهولة.',
    price: '٦٩٠ ر.س',
    features: ['حمام مغربي ملكي', 'مساج استرخاء', 'بدكير ومنكير', 'عناية بالبشرة'],
  },
  {
    slug: 'luxury',
    name: 'باقة الرفاهية',
    subtitle: 'تجربة سبا فاخرة من البداية حتى النهاية',
    description:
      'باقة الرفاهية من نجم سبا: حمام مغربي كلاسيك ومساج سويدي طويل وجاكوزي وعناية بالبشرة ليوم استرخاء فاخر كامل. احجز باقتك عبر واتساب الآن بسهولة.',
    price: '٨٩٠ ر.س',
    featured: true,
    features: ['حمام مغربي كلاسيك', 'مساج سويدي ٧٥ دقيقة', 'جاكوزي', 'عناية بالبشرة'],
  },
  {
    slug: 'gift',
    name: 'باقة الإهداء',
    subtitle: 'هدية أنيقة قابلة للاختيار',
    description:
      'باقة الإهداء من نجم سبا — بطاقة هدية أنيقة تتيح اختيار الخدمة المناسبة مع شهادة شخصية وتوصيل مجاني. هدية راحة مثالية — اطلبها عبر واتساب الآن.',
    price: '٥٩٠ ر.س',
    features: ['اختيار الخدمة', 'بطاقة إهداء شخصية', 'شهادة هدية', 'توصيل مجاني'],
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: 'تجربة استثنائية من اللحظة الأولى. الأجواء هادئة والمعالجة محترفة جدًا.',
    name: 'ريم العتيبي',
    service: 'الحمام المغربي',
  },
  {
    quote: 'أفضل مكان جربته للاسترخاء. المكان راقٍ والخدمة على أعلى مستوى.',
    name: 'نوره القحطاني',
    service: 'مساج الأحجار الساخنة',
  },
  {
    quote: 'شعرت بتجدد كامل بعد الجلسة. تفاصيل صغيرة تصنع فرقًا كبيرًا.',
    name: 'سارة الدوسري',
    service: 'جلسة العناية بالبشرة',
  },
];

export const faqs: Faq[] = [
  { question: 'هل يجب الحجز مسبقًا؟', answer: 'نعم، نوصي بالحجز المسبق لضمان توفر الوقت المناسب لك، ويمكنك الحجز بسهولة عبر واتساب.' },
  { question: 'متى يُفضّل الوصول قبل الموعد؟', answer: 'يُفضّل الوصول قبل الموعد بـ ١٥ دقيقة لإتمام إجراءات الاستقبال والاستعداد للجلسة بهدوء.' },
  { question: 'هل يمكن تعديل أو إلغاء الحجز؟', answer: 'نعم، يمكنك تعديل أو إلغاء الحجز قبل الموعد بـ ٢٤ ساعة دون رسوم.' },
  { question: 'هل الجلسات مناسبة للحامل؟', answer: 'نوفر جلسات مخصصة للحامل بعد استشارة الطبيب، ويرجى إبلاغ فريق الحجز مسبقًا.' },
  { question: 'هل توفرون غرفًا خاصة؟', answer: 'نعم، جميع جلساتنا تُقدّم في غرف خاصة مصممة لتوفير الراحة والخصوصية التامة.' },
  { question: 'هل الأسعار تشمل الضريبة؟', answer: 'نعم، جميع الأسعار المعروفة تشمل ضريبة القيمة المضافة.' },
  { question: 'ما طرق الدفع المتاحة؟', answer: 'نقبل الدفع النقدي والبطاقات البنكية ومدى.' },
  { question: 'هل يمكن شراء بطاقة هدية؟', answer: 'نعم، تتوفر بطاقات هدايا بقيم وتجارب مختلفة ويمكن تخصيصها لمناسبتك.' },
];
