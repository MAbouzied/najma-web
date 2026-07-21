import { buildGeneralContactUrl, WHATSAPP_PHONE_DISPLAY } from '../lib/whatsapp';

export interface Branch {
  title: string;
  address: string;
  hours: string;
  phone: string;
  phoneHref?: string;
  mapsHref?: string;
}

export const branches: Branch[] = [
  {
    title: 'فرع حفر الباطن — المحمدية',
    address: 'طريق الملك فيصل بن عبد العزيز، المحمدية، حفر الباطن',
    hours: '١٠ صباحًا – ١٢ منتصف الليل',
    phone: WHATSAPP_PHONE_DISPLAY,
    phoneHref: buildGeneralContactUrl(),
    mapsHref: 'https://maps.app.goo.gl/7fA6iB4VxucoVwoc7?g_st=ic',
  },
];
