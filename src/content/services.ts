export type Service = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export const SERVICES: Service[] = [
  {
    id: "relaxation",
    name: "مساج استرخاء",
    description: "جلسة مساج هادئة لتخفيف التوتر واستعادة توازن الجسم والعقل",
    image: "/assets/services/massage-relaxation.jpg",
  },
  {
    id: "shiatsu",
    name: "مساج شياتسو (ياباني)",
    description: "تقنية يابانية تعتمد على الضغط بالأصابع لتحفيز نقاط الطاقة في الجسم",
    image: "/assets/services/massage-shiatsu.jpg",
  },
  {
    id: "thai",
    name: "المساج التايلندي",
    description: "مساج تايلندي تقليدي يجمع بين التمدد والضغط العميق لمرونة أفضل",
    image: "/assets/services/massage-thai.jpg",
  },
  {
    id: "hot-stone",
    name: "مساج الأحجار الساخنة",
    description: "أحجار بركانية دافئة تخترق العضلات وتمنحك استرخاءً عميقاً",
    image: "/assets/services/massage-hot-stone.jpg",
  },
  {
    id: "ventosa",
    name: "مساج بنتوسا (كاسات الهواء)",
    description: "علاج بالكاسات الهوائية لتحسين الدورة الدموية وتخفيف آلام العضلات",
    image: "/assets/services/massage-ventosa.jpg",
  },
  {
    id: "foot",
    name: "مساج القدمين",
    description: "عناية متخصصة بالقدمين تريح الجسم كاملاً عبر نقاط الانعكاس",
    image: "/assets/services/massage-foot.jpg",
  },
  {
    id: "moroccan",
    name: "حمام مغربي كلاسيك",
    description: "حمام مغربي أصيل مع تنظيف البشرة والبخار لنضارة وانتعاش فوري",
    image: "/assets/services/massage-moroccan.jpg",
  },
  {
    id: "therapeutic",
    name: "التدليك العلاجي",
    description: "علاج متخصص للظهر والأبهر وكبار السن بأيدي خبراء معتمدين",
    image: "/assets/services/massage-therapeutic.jpg",
  },
  {
    id: "swedish",
    name: "المساج السويدي",
    description: "تقنيات سويدية كلاسيكية لتحسين الدورة الدموية واسترخاء العضلات",
    image: "/assets/services/massage-swedish.jpg",
  },
];

export const FEATURES = [
  {
    title: "فريق متخصص",
    description: "أخصائيون فلبينيون على أعلى درجة من الكفاءة والخبرة",
    icon: "team",
  },
  {
    title: "أجواء فاخرة",
    description: "مساحات مصممة للراحة والاسترخاء بأعلى معايير النظافة",
    icon: "spa",
  },
  {
    title: "أسعار تنافسية",
    description: "خدمات متميزة بأسعار مناسبة وعروض حصرية طوال العام",
    icon: "price",
  },
  {
    title: "موقع مميز",
    description: "في قلب حفر الباطن - المحمدية، طريق الملك فيصل",
    icon: "location",
  },
];

export const GALLERY_IMAGES = [
  "/assets/gallery/spa-1.jpg",
  "/assets/gallery/spa-2.jpg",
  "/assets/gallery/interior-1.jpg",
  "/assets/gallery/spa-4.jpg",
  "/assets/gallery/spa-5.jpg",
  "/assets/gallery/spa-6.jpg",
];

export const HERO_IMAGES = [
  "/assets/gallery/spa-1.jpg",
  "/assets/gallery/spa-2.jpg",
  "/assets/gallery/interior-1.jpg",
  "/assets/gallery/spa-3.jpg",
];
