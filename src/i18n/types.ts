export type Locale = 'ar' | 'en';
export type LocalizedString = { ar: string; en: string };
export const locales = ['ar', 'en'] as const;
export const defaultLocale: Locale = 'ar';
