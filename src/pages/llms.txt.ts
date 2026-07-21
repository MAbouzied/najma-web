import type { APIRoute } from 'astro';
import { services, packages } from '../data/home';
import {
  buildGeneralContactUrl,
  WHATSAPP_PHONE_DISPLAY,
} from '../lib/whatsapp';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const link = (path: string) => (site ? new URL(path, site).href : path);
  const serviceLinks = services
    .map((s) => `- [${s.title}](${link(`/services/${s.slug}/`)}): ${s.description} — ${s.price}`)
    .join('\n');
  const packageLinks = packages
    .map((p) => `- [${p.name}](${link(`/packages/${p.slug}/`)}): ${p.subtitle} — ${p.price}`)
    .join('\n');

  const body = `# نجم سبا

> مركز مساج وحمام مغربي في حفر الباطن، المملكة العربية السعودية. يقدم خدمات المساج والحمام المغربي والعناية الشخصية بأيدي أخصائيين فلبينيين محترفين.

جميع المحتويات باللغة العربية. الموقع يعمل بفرع واحد فقط في حفر الباطن — المحمدية. لا توجد فروع في الرياض أو جدة أو الخبر. بيانات التواصل والحجز موحدة في كل صفحات الموقع.

## الصفحات الرئيسية

- [الرئيسية](${link('/')}): تعريف بالخدمات والباقات والأسئلة الشائعة مع تجربة تصفح كاملة.
- [من نحن](${link('/about/')}): قصة المركز ورسالته وقائمة الخدمات المقدمة.
- [تواصل معنا](${link('/contact/')}): بيانات التواصل الكاملة (هاتف، واتساب، بريد، عنوان) مع نموذج إرسال عبر واتساب.

## الخدمات

${serviceLinks}

## الباقات

${packageLinks}

## معلومات التواصل

- [الهاتف / واتساب](${buildGeneralContactUrl()}): ${WHATSAPP_PHONE_DISPLAY}
- [واتساب للحجز](${buildGeneralContactUrl()}): راسلنا مباشرة للحجز والاستفسار
- [البريد الإلكتروني](mailto:info@nagmspa.com): info@nagmspa.com
- [العنوان](https://maps.app.goo.gl/7fA6iB4VxucoVwoc7?g_st=ic): طريق الملك فيصل بن عبد العزيز، المحمدية، حفر الباطن 39911
- [ساعات العمل](${link('/#')}): يوميًا ١٠ صباحًا – ١٢ منتصف الليل

## Optional

- [إنستقرام](https://www.instagram.com/nagmspa/): @nagmspa
- [تويتر](https://twitter.com/nagmspa): @nagmspa
- [سناب شات](https://www.snapchat.com/add/nagmspa): @nagmspa
- [الأسئلة الشائعة](${link('/#faq')}): إجابات عن الحجز والمواعيد والدفع والخصوصية.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
