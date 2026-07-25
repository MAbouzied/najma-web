import {
  buildGeneralContactUrl,
  buildWhatsAppUrl,
  WHATSAPP_PHONE_DISPLAY,
} from '../lib/whatsapp';

export type PageId = 'home' | 'about' | 'services' | 'packages' | 'contact';

export interface SiteLink {
  label: string;
  href: string;
  page?: PageId;
}

export interface SiteAction {
  label: string;
  href: string;
}

export const navigationLinks: SiteLink[] = [
  { label: 'الرئيسية', href: '/', page: 'home' },
  { label: 'من نحن', href: '/about', page: 'about' },
  { label: 'خدماتنا', href: '/services/', page: 'services' },
  { label: 'باقاتنا', href: '/packages/', page: 'packages' },
  { label: 'اتصل بنا', href: '/contact', page: 'contact' },
];

export const quickLinks: SiteLink[] = [
  { label: 'الرئيسية', href: '/' },
  { label: 'من نحن', href: '/about' },
  { label: 'خدماتنا', href: '/services/' },
  { label: 'باقاتنا', href: '/packages/' },
  { label: 'اتصل بنا', href: '/contact' },
];

export const serviceLinks: SiteLink[] = [
  { label: 'مساج استرخاء', href: '/services/massage-relaxation/' },
  { label: 'مساج شياتسو (ياباني)', href: '/services/shiatsu/' },
  { label: 'المساج التايلندي', href: '/services/thai-massage/' },
  { label: 'مساج الأحجار الساخنة', href: '/services/hot-stone/' },
  { label: 'مساج بنتوسا (كاسات الهواء)', href: '/services/ventosa-cupping/' },
  { label: 'مساج القدمين', href: '/services/foot-massage/' },
  { label: 'حمام مغربي كلاسيك', href: '/services/moroccan-bath/' },
  { label: 'التدليك العلاجي', href: '/services/therapeutic-massage/' },
  { label: 'المساج السويدي', href: '/services/swedish-massage/' },
];

export const socialLinks = [
  { label: 'إنستقرام', href: 'https://www.instagram.com/nagmspa/', icon: '/assets/icons/instagram.svg' },
  { label: 'تويتر', href: 'https://twitter.com/nagmspa', icon: '/assets/icons/x.svg' },
  { label: 'سناب شات', href: 'https://www.snapchat.com/add/nagmspa', icon: '/assets/icons/snapchat.svg' },
];

export const contactDetails = {
  phoneDisplay: WHATSAPP_PHONE_DISPLAY,
  phoneHref: buildGeneralContactUrl(),
  hours: 'يوميًا ١٠ص – ١٢م',
};

export const brandDescription =
  'مركز مساج وحمام مغربي في حفر الباطن — خدمات متميزة بأيدي أخصائيين محترفين.';

export const bookingAction: SiteAction = {
  label: 'احجز الآن',
  href: buildWhatsAppUrl('أهلاً، أريد حجز موعد'),
};
