import { readFileSync, writeFileSync } from 'node:fs';

const edits = [
  ['tests/seo.test.mjs', 'باقة الرفاهية', 'العرض الرفاهية'],
  ['tests/i18n.test.mjs', 'aria-label="Switch to Arabic"', 'aria-label="العربية"'],
];

for (const [path, from, to] of edits) {
  let s = readFileSync(path, 'utf8');
  if (!s.includes(from)) {
    console.log('skip (already done or missing):', path, from);
    continue;
  }
  writeFileSync(path, s.replace(from, to));
  console.log('updated', path);
}
