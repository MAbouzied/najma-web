const SNAP_PIXEL_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PLACEHOLDER = /insert|__insert/i;
const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export const DEFAULT_SNAP_PIXEL_ID = '7c95dced-8cb1-4a0a-8ad0-b97fa9ff8316';

export const SNAP_EVENTS = {
  pageView: 'PAGE_VIEW',
  viewContent: 'VIEW_CONTENT',
  addCart: 'ADD_CART',
  purchase: 'PURCHASE',
} as const;

export type SnapEventName = (typeof SNAP_EVENTS)[keyof typeof SNAP_EVENTS];

export type SnapContent = {
  item_ids: string[];
  item_category: string;
};

export type SnapEventParams = {
  price?: number;
  currency?: string;
  transaction_id?: string;
  item_ids?: string[];
  item_category?: string;
  number_items?: number;
  user_email?: string;
  user_phone_number?: string;
};

export type SnaptrFn = ((...args: unknown[]) => void) & {
  queue?: unknown[];
  handleRequest?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    snaptr?: SnaptrFn;
    __nagmSnapBound?: boolean;
  }
}

export function isSnapPixelId(value: unknown): value is string {
  return typeof value === 'string' && SNAP_PIXEL_ID.test(value.trim());
}

export function resolveSnapPixelId(value: unknown): string {
  if (isSnapPixelId(value)) {
    return value.trim();
  }

  return DEFAULT_SNAP_PIXEL_ID;
}

export function parseSnapPrice(value: unknown): number | undefined {
  if (typeof value !== 'string' && typeof value !== 'number') {
    return undefined;
  }

  const normalized = String(value)
    .replace(/[٠-٩]/gu, (digit) => String(ARABIC_INDIC_DIGITS.indexOf(digit)))
    .replace(/[^\d.]/gu, '')
    .replace(/^\.+|\.+$/gu, '');

  if (!normalized) {
    return undefined;
  }

  const amount = Number(normalized);
  return Number.isFinite(amount) && amount > 0 ? amount : undefined;
}

function isUsableValue(value: unknown): boolean {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 && !PLACEHOLDER.test(trimmed);
  }

  if (Array.isArray(value)) {
    return value.some((item) => isUsableValue(item));
  }

  return false;
}

export function compactSnapParams(params: SnapEventParams): Record<string, unknown> {
  const next: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    if (!isUsableValue(value)) {
      continue;
    }

    if (Array.isArray(value)) {
      const items = value
        .map((item) => String(item).trim())
        .filter((item) => item && !PLACEHOLDER.test(item));
      if (items.length > 0) {
        next[key] = items;
      }
      continue;
    }

    next[key] = typeof value === 'string' ? value.trim() : value;
  }

  return next;
}

const COLLECTION_TO_CATEGORY = {
  services: 'service',
  packages: 'package',
  offers: 'offer',
} as const;

function localeNeutralPath(pathname: string): string {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (path === '/en' || path === '/en/') return '/';
  if (path.startsWith('/en/')) {
    const rest = path.slice(3);
    return rest.endsWith('/') || rest === '/' ? rest : `${rest}/`;
  }
  return path.endsWith('/') || path === '/' ? path : `${path}/`;
}

export function contentFromPathname(pathname: string): SnapContent | null {
  const match = localeNeutralPath(pathname).match(/^\/(services|packages|offers)\/([^/]+)\/?$/);
  if (!match) {
    return null;
  }

  const collection = match[1] as keyof typeof COLLECTION_TO_CATEGORY;
  const slug = decodeURIComponent(match[2]).trim();
  if (!slug) {
    return null;
  }

  return {
    item_ids: [slug],
    item_category: COLLECTION_TO_CATEGORY[collection],
  };
}

export function contentFromBookingHref(href: string): SnapContent | null {
  let url: URL;
  try {
    url = new URL(href, 'https://nagmspa.com');
  } catch {
    return null;
  }

  if (localeNeutralPath(url.pathname) !== '/book/') {
    return null;
  }

  const department = url.searchParams.get('department')?.trim();
  const item = url.searchParams.get('item')?.trim();
  if (!department || department === 'general' || !item) {
    return {
      item_ids: ['general'],
      item_category: 'general',
    };
  }

  return {
    item_ids: [item],
    item_category: department,
  };
}

export function snapParamsFromBookingValue(
  value: string,
  extras: { phone?: string; price?: number; transactionId?: string } = {},
): SnapEventParams {
  const [item_category, itemId] = value.split(':');
  return compactSnapParams({
    item_category: item_category || undefined,
    item_ids: itemId ? [itemId] : undefined,
    number_items: 1,
    currency: 'SAR',
    user_phone_number: extras.phone,
    price: extras.price,
    transaction_id: extras.transactionId,
  }) as SnapEventParams;
}

export function trackSnapEvent(event: SnapEventName, params: SnapEventParams = {}): void {
  if (typeof window === 'undefined' || typeof window.snaptr !== 'function') {
    return;
  }

  const cleaned = compactSnapParams(params);
  if (Object.keys(cleaned).length === 0) {
    window.snaptr('track', event);
    return;
  }

  window.snaptr('track', event, cleaned);
}

export function trackSnapPageView(params: SnapEventParams = {}): void {
  trackSnapEvent(SNAP_EVENTS.pageView, params);
}

export function trackSnapViewContent(params: SnapEventParams = {}): void {
  trackSnapEvent(SNAP_EVENTS.viewContent, params);
}

export function trackSnapAddCart(params: SnapEventParams = {}): void {
  trackSnapEvent(SNAP_EVENTS.addCart, { number_items: 1, currency: 'SAR', ...params });
}

export function trackSnapPurchase(params: SnapEventParams = {}): void {
  trackSnapEvent(SNAP_EVENTS.purchase, { number_items: 1, currency: 'SAR', ...params });
}
