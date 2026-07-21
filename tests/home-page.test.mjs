import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const homeHtml = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');

test('renders every homepage section in design order', () => {
  const headings = [
    'استرخِ، استعد طاقتك،',
    'تجربة سبا متكاملة',
    'تجربة لا تُنسى',
    'باقات مختارة بعناية',
    'فروعنا في المملكة',
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
  assert.equal((homeHtml.match(/data-service-card/g) ?? []).length, 9);
  assert.equal((homeHtml.match(/data-package-card/g) ?? []).length, 3);
  assert.equal((homeHtml.match(/data-branch-card/g) ?? []).length, 1);
  assert.equal((homeHtml.match(/data-testimonial-card/g) ?? []).length, 3);
  assert.equal((homeHtml.match(/<details/g) ?? []).length, 8);
});

test('uses committed assets and shared site chrome', () => {
  assert.doesNotMatch(homeHtml, /figma\.com\/api\/mcp\/asset/);
  assert.match(homeHtml, /\/assets\/home\/hero-slider\./);
  assert.match(homeHtml, /\/assets\/home\/services\/swedish-massage\./);
  assert.match(homeHtml, /\/assets\/home\/benefits\/expert-therapists\./);
  assert.match(homeHtml, /data-site-header/);
  assert.match(homeHtml, /aria-current="page"/);
  assert.match(homeHtml, /data-site-cta/);
  assert.match(homeHtml, /data-site-footer/);
});

test('matches the intro order on one continuous background', () => {
  assert.match(
    homeHtml,
    /data-home-intro-shell[^>]*class="[^"]*bg-bg-primary[^"]*"[\s\S]*?data-home-hero[\s\S]*?واستمتع بلحظتك[\s\S]*?\/assets\/home\/hero-slider\.jpg[\s\S]*?data-home-benefits/,
  );
});

test('links service and package cards to detail pages with WhatsApp buttons', () => {
  assert.match(homeHtml, /data-service-card[\s\S]*?href="\/services\/massage-relaxation\/"/);
  assert.match(homeHtml, /data-service-card[\s\S]*?api\.whatsapp\.com\/send\/\?phone=966542030018/);
  assert.match(homeHtml, /data-package-card[\s\S]*?href="\/packages\/luxury\/"/);
  assert.match(homeHtml, /data-package-card[\s\S]*?api\.whatsapp\.com\/send\/\?phone=966542030018/);
});

test('renders an accessible FAQ with the first answer open', () => {
  assert.match(homeHtml, /<details[^>]*open[^>]*>[\s\S]*?هل يجب الحجز مسبقًا؟/);
  assert.match(homeHtml, /نعم، نوصي بالحجز المسبق لضمان توفر الوقت المناسب لك/);
});
