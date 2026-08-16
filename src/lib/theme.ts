export const THEME_IDS = ['sand'] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const DEFAULT_THEME: ThemeId = 'sand';
export const THEME_STORAGE_KEY = 'nagm-theme';

export function isThemeId(value: unknown): value is ThemeId {
  return value === 'sand';
}

export function resolveTheme(_value: unknown): ThemeId {
  return DEFAULT_THEME;
}
