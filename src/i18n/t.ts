import { ui } from './ui';
import type { Locale } from './types';

type UIKey = keyof typeof ui.ar;

export function t(locale: Locale, key: UIKey): string {
  const value = ui[locale][key];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing translation for key "${key}" in locale "${locale}"`);
  }
  return value;
}
