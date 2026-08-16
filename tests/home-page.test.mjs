import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const homeHtml = await readFile(new URL('../dist/client/index.html', import.meta.url), 'utf8');

test('renders every homepage section in design order', () => {
  const headings = [
    'استرخِ، استعد طاقتك،',
    'تجربة سبا متكاملة',
    'تجربة لا تُنسى',
    'عروض نجم سبا',
    'باقات مختارة بعناية',
    'فرع حفر الباطن',
    'آراء من واقع التجربة',
    'أسئلة قد تخطر ببالك',
    'جاهز لتجربة الاسترخاء؟',
  ];

  let previousIndex = -1;
  for (const heading of headings) {
    const index = homeHtml.indexOf(heading, previousIndex + 1);
    assert.ok(index > previousIndex, `${heading} should appear in design order`);
    previousIndex = index;
  }
});

test('renders all data-driven homepage collections', () => {
  assert.equal((homeHtml.match(/data-service-card/g) ?? []).length, 13);
  assert.equal((homeHtml.match(/data-offer-card/g) ?? []).length, 8);
  assert.equal((homeHtml.match(/data-package-card/g) ?? []).length, 3);
  assert.equal((homeHtml.match(/data-branch-card/g) ?? []).length, 1);
  assert.equal((homeHtml.match(/data-testimonial-card/g) ?? []).length, 6);
  // 7 FAQ items + mobile nav + header theme + footer theme
  assert.equal((homeHtml.match(/<details/g) ?? []).length, 10);
  assert.match(homeHtml, /data-mobile-nav/);
});

test('uses committed assets and shared site chrome', () => {
  assert.doesNotMatch(homeHtml, /figma\.com\/api\/mcp\/asset/);
  // LCP/card rasters go through Astro Image → /_astro/*; SEO still uses public /assets paths.
  assert.match(homeHtml, /\/_astro\/hero-interior\.[^"']+/);
  assert.match(homeHtml, /\/_astro\/relaxation-massage\.[^"']+/);
  assert.match(homeHtml, /\/_astro\/manicure-pedicure\.[^"']+/);
  assert.match(homeHtml, /\/_astro\/expert-therapists\.[^"']+/);
  assert.match(homeHtml, /data-home-hero[\s\S]*?data-hero-slider[\s\S]*?<picture[\s\S]*?<\/picture>/);
  assert.equal((homeHtml.match(/data-hero-slide/g) ?? []).length, 6);
  assert.match(homeHtml, /data-hero-next/);
  assert.match(homeHtml, /data-hero-prev/);
  assert.match(homeHtml, /showHeroSlide/);
  assert.match(homeHtml, /data-site-header/);
  assert.match(homeHtml, /aria-current="page"/);
  assert.match(homeHtml, /data-site-cta/);
  assert.match(homeHtml, /data-site-footer/);
  assert.match(homeHtml, /data-site-cta[\s\S]*?loading="lazy"/);
});

test('matches the intro order on one continuous background', () => {
  assert.match(
    homeHtml,
    /data-home-intro-shell[^>]*class="[^"]*bg-bg-primary[^"]*"[\s\S]*?data-home-hero[\s\S]*?واستمتع بلحظتك[\s\S]*?\/_astro\/hero-interior\.[^"']+[\s\S]*?data-home-benefits/,
  );
});

test('links service and package cards to detail pages with WhatsApp and call buttons', () => {
  assert.match(homeHtml, /data-service-card[\s\S]*?href="\/services\/swedish-massage\/"/);
  assert.match(homeHtml, /data-service-card[\s\S]*?api\.whatsapp\.com\/send\/\?phone=966579777407/);
  assert.match(homeHtml, /data-service-card[\s\S]*?tel:\+966579777407/);
  assert.match(homeHtml, /data-offer-card[\s\S]*?href="\/offers\/signature\/"/);
  assert.match(homeHtml, /data-offer-card[\s\S]*?api\.whatsapp\.com\/send\/\?phone=966579777407/);
  assert.match(homeHtml, /href="\/offers\/"[^>]*>[\s\S]*?كل العروض/);
  assert.match(homeHtml, /data-package-card[\s\S]*?href="\/packages\/luxury\/"/);
  assert.match(homeHtml, /data-package-card[\s\S]*?api\.whatsapp\.com\/send\/\?phone=966579777407/);
  assert.match(homeHtml, /data-language-switcher/);
  assert.match(homeHtml, /data-theme-switcher/);
  assert.match(homeHtml, />EN</);
  assert.match(homeHtml, /آراؤنا على خرائط جوجل/);
});

test('renders an accessible FAQ with the first answer open', () => {
  assert.match(homeHtml, /<details[^>]*open[^>]*>[\s\S]*?هل يجب الحجز مسبقًا؟/);
  assert.match(homeHtml, /نعم، نوصي بالحجز المسبق لضمان توفر الوقت المناسب لك/);
});
