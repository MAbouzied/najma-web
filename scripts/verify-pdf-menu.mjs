import { readFileSync } from 'node:fs';

const s = readFileSync(new URL('../src/data/home.ts', import.meta.url), 'utf8');
const checks = {
  groom: s.includes("slug: 'groom'"),
  viaOffers: s.includes('Via offers'),
  packageOriginalPriceIface: s.includes('originalPrice?: LocalizedString'),
  servicePriceOptional: s.includes('price?: LocalizedString'),
  weddingGone: !s.includes("slug: 'wedding'"),
  royalBath: s.includes("slug: 'royal-bath'"),
  getServicesOptionalPrice: s.includes('price: s.price ? L(s.price, locale) : undefined'),
  getPackagesOriginalPrice: s.includes('originalPrice: p.originalPrice ? L(p.originalPrice, locale) : undefined'),
};
console.log(checks);
if (Object.values(checks).some((v) => !v)) process.exit(1);
