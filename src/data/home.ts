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
  { slug: 'massage-relaxation', image: '/assets/home/services/swedish-massage.jpg', title: 'مساج استرخاء', description: 'جلسة مساج هادئة لتخفيف التوتر واستعادة توازن الجسم والعقل', price: '٣٠٠ ر.س' },
  { slug: 'shiatsu', image: '/assets/home/services/deep-tissue.jpg', title: 'مساج شياتسو (ياباني)', description: 'تقنية يابانية تعتمد على الضغط بالأصابع لتحفيز نقاط الطاقة في الجسم', price: '٣٥٠ ر.س' },
  { slug: 'thai-massage', image: '/assets/home/services/moroccan-bath.jpg', title: 'المساج التايلندي', description: 'مساج تايلندي تقليدي يجمع بين التمدد والضغط العميق لمرونة أفضل', price: '٣٥٠ ر.س' },
  { slug: 'hot-stone', image: '/assets/home/services/hot-stone.jpg', title: 'مساج الأحجار الساخنة', description: 'أحجار بركانية دافئة تخترق العضلات وتمنحك استرخاءً عميقاً', price: '٤٠٠ ر.س' },
  { slug: 'ventosa-cupping', image: '/assets/home/services/aromatherapy.jpg', title: 'مساج بنتوسا (كاسات الهواء)', description: 'علاج بالكاسات الهوائية لتحسين الدورة الدموية وتخفيف آلام العضلات', price: '٣٥٠ ر.س' },
  { slug: 'foot-massage', image: '/assets/home/services/facial-care.jpg', title: 'مساج القدمين', description: 'عناية متخصصة بالقدمين تريح الجسم كاملاً عبر نقاط الانعكاس', price: '٢٥٠ ر.س' },
  { slug: 'moroccan-bath', image: '/assets/home/services/hot-stone.jpg', title: 'حمام مغربي كلاسيك', description: 'حمام مغربي أصيل مع تنظيف البشرة والبخار لنضارة وانتعاش فوري', price: '٤٥٠ ر.س' },
  { slug: 'therapeutic-massage', image: '/assets/home/services/aromatherapy.jpg', title: 'التدليك العلاجي', description: 'علاج متخصص للظهر والأبهر وكبار السن بأيدي خبراء معتمدين', price: '٤٠٠ ر.س' },
  { slug: 'swedish-massage', image: '/assets/home/services/facial-care.jpg', title: 'المساج السويدي', description: 'تقنيات سويدية كلاسيكية لتحسين الدورة الدموية واسترخاء العضلات', price: '٣٠٠ ر.س' },
];

export const packages: Package[] = [
  {
    slug: 'wedding',
    name: 'باقة العرسان',
    subtitle: 'تجهيز العرسان مع أفضل خدمات العناية',
    description: 'باقة متكاملة لتجهيز العرسان تشمل حمام مغربي ملكي ومساج استرخاء مع عناية كاملة بالبشرة والأظافر لإطلالة مثالية في يوم الزفاف.',
    price: '٦٩٠ ر.س',
    features: ['حمام مغربي ملكي', 'مساج استرخاء', 'بدكير ومنكير', 'عناية بالبشرة'],
  },
  {
    slug: 'luxury',
    name: 'باقة الرفاهية',
    subtitle: 'تجربة متكاملة للاسترخاء التام',
    description: 'أفخم باقات نجم سبا — حمام مغربي كلاسيك مع مساج سويدي طويل وجاكوزي وعناية متقدمة بالبشرة لتجربة استرخاء لا تُضاهى.',
    price: '٨٩٠ ر.س',
    featured: true,
    features: ['حمام مغربي كلاسيك', 'مساج سويدي ٧٥ دقيقة', 'جاكوزي', 'عناية بالبشرة'],
  },
  {
    slug: 'gift',
    name: 'باقة الإهداء',
    subtitle: 'بطاقة هدية لمن تحب',
    description: 'بطاقة هدية أنيقة تتيح للشخص الذي تهديه اختيار الخدمة التي تناسبه من قائمة خدمات نجم سبا — هدية مثالية للعناية والاسترخاء.',
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
