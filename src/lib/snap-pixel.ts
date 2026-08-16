const SNAP_PIXEL_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const DEFAULT_SNAP_PIXEL_ID = '7c95dced-8cb1-4a0a-8ad0-b97fa9ff8316';

export function isSnapPixelId(value: unknown): value is string {
  return typeof value === 'string' && SNAP_PIXEL_ID.test(value.trim());
}

export function resolveSnapPixelId(value: unknown): string {
  if (isSnapPixelId(value)) {
    return value.trim();
  }

  return DEFAULT_SNAP_PIXEL_ID;
}

export type SnaptrFn = ((...args: unknown[]) => void) & {
  queue?: unknown[];
  handleRequest?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    snaptr?: SnaptrFn;
  }
}

export function trackSnapPageView(): void {
  if (typeof window === 'undefined' || typeof window.snaptr !== 'function') {
    return;
  }

  window.snaptr('track', 'PAGE_VIEW');
}
