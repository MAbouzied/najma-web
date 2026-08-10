import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { gotoReady } from './helpers';

const A11Y_ROUTES = ['/', '/en/', '/about/', '/en/contact/'] as const;

/**
 * Known pre-existing rules temporarily excluded so the suite guards regressions
 * without blocking on historical footer/license markup debt.
 * Track separately: aria-prohibited-attr, definition-list.
 */
const KNOWN_DEBT_RULES = ['aria-prohibited-attr', 'definition-list'];

test.describe('accessibility smoke', () => {
  for (const path of A11Y_ROUTES) {
    test(`${path} has no new serious/critical axe violations`, async ({ page }) => {
      await gotoReady(page, path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .disableRules(KNOWN_DEBT_RULES)
        .analyze();

      const serious = results.violations.filter((violation) =>
        ['serious', 'critical'].includes(violation.impact || ''),
      );

      expect(
        serious,
        serious.map((v) => `${v.id}: ${v.help}`).join('\n'),
      ).toEqual([]);
    });
  }
});
