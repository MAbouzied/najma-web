import type { Locale, LocalizedString } from './types';

export function L(value: LocalizedString, locale: Locale): string {
  const result = value[locale];
  if (typeof result !== 'string' || result.length === 0) {
    throw new Error(`Missing localized string for locale "${locale}"`);
  }
  return result;
}

export function localizeList(values: LocalizedString[], locale: Locale): string[] {
  return values.map((value) => L(value, locale));
}
