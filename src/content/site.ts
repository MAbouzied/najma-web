export const SITE = {
  name: "نجم سبا",
  tagline: "للمساج والحمام المغربي",
  url: "https://nagmspa.com",
  locale: "ar",
  direction: "rtl" as const,
  phone: "0542030018",
  phoneIntl: "+966542030018",
  whatsappUrl:
    "https://api.whatsapp.com/send/?phone=966542030018&text&type=phone_number&app_absent=0",
  email: "info@nagmspa.com",
  address:
    "طريق الملك فيصل بن عبد العزيز، المحمدية، حفر الباطن 39911",
  mapsUrl: "https://maps.app.goo.gl/7fA6iB4VxucoVwoc7?g_st=ic",
  mapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3510.289009665672!2d45.9878199!3d28.3803376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fd7395f6655ba97%3A0x46ece719fea2c84a!2z2YXYs9in2Kwg2YjYrdmF2KfZhSDZhdi62LHYqNmKINmG2KzZhSDYs9io2Kc!5e0!3m2!1sar!2ssa!4v1699568510615!5m2!1sar!2ssa",
  logo: "/assets/branding/logo-gold.png",
  logoHeader: "/assets/branding/logo-header.png",
  logoWhite: "/assets/branding/logo-white-sm.png",
  logoAlt: "نجم سبا",
  favicon: "/assets/branding/favicon.png",
  footerCredit: "مساج و حمام مغربي نجم سبا",
  social: {
    instagram: "https://www.instagram.com/nagmspa/",
    twitter: "https://twitter.com/nagmspa",
    snapchat: "https://www.snapchat.com/add/nagmspa",
    maps: "https://maps.app.goo.gl/mz3yZmbpk4xH24oTA",
  },
} as const;

export const NAV_ITEMS = [
  { label: "الرئيسية", href: "/" },
  { label: "من نحن", href: "/about/" },
  { label: "اتصل بنا", href: "/contact/" },
] as const;

export const PAGES = {
  index: {
    slug: "/",
    title: "نجم سبا - مساج وحمام مغربي في حفر الباطن",
    description:
      "نجم سبا لخدمات المساج والحمام المغربي في حفر الباطن. مركز استرخاء الجسد والعقل والروح بأيدي أخصائيين محترفين.",
  },
  home: {
    slug: "/",
    title: "الرئيسية - نجم سبا",
    description:
      "مساج وحمام مغربي نجم سبا بحفر الباطن مركز استرخاء الجسد والعقل والروح",
  },
  about: {
    slug: "/about/",
    title: "من نحن - نجم سبا",
    description:
      "مركز مساج نجم سبا لتقديم خدمات المساج والحمام المغربي والعناية الشخصية والمساجات العلاجية",
  },
  contact: {
    slug: "/contact/",
    title: "اتصل بنا - نجم سبا",
    description:
      "تواصل مع نجم سبا - طريق الملك فيصل بن عبد العزيز، المحمدية، حفر الباطن",
  },
} as const;
