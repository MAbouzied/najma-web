import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const testimonialCard = await readFile(
  new URL('../src/components/TestimonialCard.astro', import.meta.url),
  'utf8',
);
const branchCard = await readFile(
  new URL('../src/components/BranchCard.astro', import.meta.url),
  'utf8',
);
const branchesSection = await readFile(
  new URL('../src/components/BranchesSection.astro', import.meta.url),
  'utf8',
);
const astroConfig = await readFile(new URL('../astro.config.mjs', import.meta.url), 'utf8');
const publicHeaders = await readFile(new URL('../public/_headers', import.meta.url), 'utf8');

test('testimonial rating uses a permitted role with aria-label', () => {
  assert.match(
    testimonialCard,
    /role="img"[^>]*aria-label=\{t\(locale, 'testimonialRatingAria'\)\}|aria-label=\{t\(locale, 'testimonialRatingAria'\)\}[^>]*role="img"/,
  );
  assert.doesNotMatch(
    testimonialCard,
    /<div class="flex justify-start gap-0\.5 text-gold" aria-label=/,
  );
});

test('branch definition lists keep icons inside dt/dd groups', () => {
  for (const [name, source] of [
    ['BranchCard', branchCard],
    ['BranchesSection', branchesSection],
  ]) {
    assert.match(source, /<dl[\s\S]*?<dt[\s\S]*?<dd/, `${name} should use dt/dd`);
    assert.doesNotMatch(
      source,
      /<dl[^>]*>\s*<div[^>]*>\s*<img/,
      `${name} must not place img as a direct child of dl > div`,
    );
  }
});

test('frame-ancestors is not shipped in Astro meta CSP directives', () => {
  assert.doesNotMatch(astroConfig, /"frame-ancestors\b/);
});

test('frame-ancestors is delivered via Cloudflare _headers', () => {
  assert.match(
    publicHeaders,
    /Content-Security-Policy:\s*frame-ancestors 'none'/,
  );
});

test('allows Snap Pixel Setup Tool scripts and frames', () => {
  assert.match(astroConfig, /resource: 'https:\/\/\*\.snapchat\.com'/);
  assert.match(astroConfig, /"frame-src[\s\S]*https:\/\/\*\.snapchat\.com"/);
});
