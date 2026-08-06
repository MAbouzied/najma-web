import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const component = await readFile(
  new URL('../src/components/FloatingContact.astro', import.meta.url),
  'utf8',
);
const layout = await readFile(
  new URL('../src/layouts/SiteLayout.astro', import.meta.url),
  'utf8',
);
const whatsappIcon = await readFile(
  new URL('../public/assets/icons/whatsapp.svg', import.meta.url),
  'utf8',
);

test('renders compact icon-only floating contact links', () => {
  assert.doesNotMatch(component, />\s*\{t\(locale, 'action(?:Whatsapp|Call)'\)\}/);
  assert.match(component, /aria-label=\{t\(locale, 'actionWhatsapp'\)\}/);
  assert.match(component, /aria-label=\{t\(locale, 'actionCallNow'\)\}/);
  assert.match(component, /flex flex-col/);
  assert.match(component, /min-h-11/);
  assert.match(component, /min-w-11/);
  assert.match(component, /gtmContactAttrs\(GTM_EVENTS\.whatsapp, 'floating'\)/);
  assert.match(component, /gtmContactAttrs\(GTM_EVENTS\.call, 'floating'\)/);
  assert.match(component, /dir=\{isEnglish \? 'ltr' : 'rtl'\}/);
  assert.match(component, /bottom-4 end-4/);
  assert.doesNotMatch(component, /target="_blank"/);
  assert.doesNotMatch(component, /start-4/);
  assert.doesNotMatch(layout, /pb-36/);
});

test('whatsapp icon uses inline svg with readable contrast on gold buttons', () => {
  assert.match(component, /WhatsAppIcon/);
  assert.match(component, /text-text-btn/);
  assert.match(whatsappIcon, /fill="#031108"/);
  assert.match(whatsappIcon, /M12\.001 2c5\.523/);
});
