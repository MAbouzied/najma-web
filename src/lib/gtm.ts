/** Google Analytics 4 measurement ID (or a GTM- container ID). */
export const GTM_CONTAINER_ID = 'G-KKSXRY8MSN';

/** False while a placeholder ID is in use — dataLayer events still fire. */
export const isGtmContainerConfigured = !GTM_CONTAINER_ID.includes('XXXX');

export const isGaMeasurementId = GTM_CONTAINER_ID.startsWith('G-');
export const isGtmContainerId = GTM_CONTAINER_ID.startsWith('GTM-');

export const GTM_EVENTS = {
  whatsapp: 'contact_whatsapp',
  call: 'contact_call',
  email: 'contact_email',
  formSubmit: 'contact_form_submit',
} as const;

export type GtmContactEvent =
  | (typeof GTM_EVENTS)[keyof typeof GTM_EVENTS];

export type GtmEventParams = {
  location?: string;
  link_url?: string;
  form_id?: string;
  service?: string;
  eventCallback?: () => void;
  eventTimeout?: number;
  [key: string]: string | number | (() => void) | undefined;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
    __nagmGtmBound?: boolean;
  }
}

export function resolveContactEvent(href: string): GtmContactEvent | null {
  const value = href.trim().toLowerCase();

  if (value.startsWith('tel:')) {
    return GTM_EVENTS.call;
  }

  if (value.startsWith('mailto:')) {
    return GTM_EVENTS.email;
  }

  if (
    value.includes('api.whatsapp.com') ||
    value.includes('wa.me/') ||
    value.includes('whatsapp.com')
  ) {
    return GTM_EVENTS.whatsapp;
  }

  return null;
}

export function gtmContactAttrs(
  event: GtmContactEvent,
  location: string,
): Record<'data-gtm-event' | 'data-gtm-location', string> {
  return {
    'data-gtm-event': event,
    'data-gtm-location': location,
  };
}

export function gtmAttrsForHref(
  href: string,
  location: string,
): Record<'data-gtm-event' | 'data-gtm-location', string> | Record<string, never> {
  const event = resolveContactEvent(href);
  if (!event) {
    return {};
  }

  return gtmContactAttrs(event, location);
}

export function pushGtmEvent(event: string, params: GtmEventParams = {}): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...params,
  });

  if (typeof window.gtag !== 'function') {
    return;
  }

  const { eventCallback, eventTimeout, ...gtagParams } = params;
  window.gtag('event', event, {
    ...gtagParams,
    ...(eventCallback ? { event_callback: eventCallback } : {}),
    ...(typeof eventTimeout === 'number' ? { event_timeout: eventTimeout } : {}),
  });
}
