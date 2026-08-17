export type SoftNavClickEvent = Pick<
  MouseEvent,
  'button' | 'metaKey' | 'ctrlKey' | 'shiftKey' | 'altKey' | 'defaultPrevented'
>;

export type SoftNavLocation = Pick<Location, 'href' | 'origin'>;

const PROGRESS_ID = 'nagm-nav-progress';

/** Snapchat Event Setup Tool keeps state in query + hash; soft-nav would tear it down. */
export function isSnapPixelSetupActive(location: SoftNavLocation): boolean {
  try {
    const current = new URL(location.href);
    return (
      current.searchParams.has('pixelSetupTool')
      || current.hash.includes('snap-pixel-setup-tool')
    );
  } catch {
    return false;
  }
}

/** Same-origin HTML navigations that should stay in-document (Next.js-style). */
export function isSoftNavCandidate(
  anchor: HTMLAnchorElement,
  event: SoftNavClickEvent,
  location: SoftNavLocation,
): boolean {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;
  if (anchor.dataset.fullReload != null || anchor.dataset.astroReload != null) return false;
  if (isSnapPixelSetupActive(location)) return false;

  const rawHref = anchor.getAttribute('href');
  if (!rawHref || rawHref.startsWith('#')) return false;

  let url: URL;
  try {
    url = new URL(anchor.href);
  } catch {
    return false;
  }

  if (url.origin !== location.origin) return false;
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  if (url.pathname.startsWith('/api/')) return false;
  if (url.pathname.startsWith('/admin')) return false;
  if (url.pathname.startsWith('/login')) return false;

  const current = new URL(location.href);
  if (url.pathname === current.pathname && url.search === current.search) {
    // Leave in-page hashes and no-op same-URL clicks to the browser.
    return false;
  }

  return true;
}

function ensureProgressEl(): HTMLElement {
  let el = document.getElementById(PROGRESS_ID);
  if (el) return el;

  el = document.createElement('div');
  el.id = PROGRESS_ID;
  el.className = 'nagm-nav-progress';
  el.setAttribute('aria-hidden', 'true');
  document.documentElement.appendChild(el);
  return el;
}

function setProgressState(state: 'idle' | 'loading' | 'done') {
  const el = ensureProgressEl();
  el.dataset.state = state;
}

function syncStylesheets(nextHead: HTMLHeadElement) {
  const existing = new Set(
    [...document.head.querySelectorAll('link[rel="stylesheet"]')].map((link) =>
      (link as HTMLLinkElement).href,
    ),
  );

  for (const link of nextHead.querySelectorAll('link[rel="stylesheet"]')) {
    const href = (link as HTMLLinkElement).href;
    if (!href || existing.has(href)) continue;
    const clone = document.createElement('link');
    clone.rel = 'stylesheet';
    clone.href = href;
    document.head.appendChild(clone);
  }
}

function syncDocumentMeta(nextDoc: Document) {
  document.documentElement.lang = nextDoc.documentElement.lang;
  document.documentElement.dir = nextDoc.documentElement.dir;
  document.title = nextDoc.title;

  const nextDescription = nextDoc.querySelector('meta[name="description"]')?.getAttribute('content');
  const currentDescription = document.querySelector('meta[name="description"]');
  if (nextDescription && currentDescription) {
    currentDescription.setAttribute('content', nextDescription);
  }

  syncStylesheets(nextDoc.head);
}

function activateScripts(root: ParentNode) {
  for (const oldScript of [...root.querySelectorAll('script')]) {
    const script = document.createElement('script');
    for (const attr of oldScript.attributes) {
      script.setAttribute(attr.name, attr.value);
    }
    script.textContent = oldScript.textContent;
    oldScript.replaceWith(script);
  }
}

async function renderNextDocument(html: string, href: string, push: boolean) {
  const nextDoc = new DOMParser().parseFromString(html, 'text/html');
  const nextBody = nextDoc.body;
  if (!nextBody) {
    window.location.assign(href);
    return;
  }

  const swap = () => {
    syncDocumentMeta(nextDoc);
    document.body.replaceWith(nextBody);
    activateScripts(document.body);
    if (push) {
      history.pushState({ softNav: true }, '', href);
    }
    window.scrollTo(0, 0);
    document.getElementById('main-content')?.focus({ preventScroll: true });
    document.dispatchEvent(new CustomEvent('nagm:page-load', { detail: { href } }));
  };

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && 'startViewTransition' in document) {
    const transition = document.startViewTransition(swap);
    await transition.finished.catch(() => undefined);
    return;
  }

  swap();
}

let navigating = false;

export async function softNavigate(href: string, options: { push?: boolean } = {}) {
  if (navigating) return;
  // Full reload keeps Snapchat Event Setup Tool URL state / opener handoff intact.
  if (isSnapPixelSetupActive(window.location)) {
    window.location.assign(href);
    return;
  }

  navigating = true;
  setProgressState('loading');

  try {
    const response = await fetch(href, {
      headers: { Accept: 'text/html' },
      credentials: 'same-origin',
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('text/html')) {
      window.location.assign(href);
      return;
    }

    const html = await response.text();
    await renderNextDocument(html, href, options.push !== false);
    setProgressState('done');
    window.setTimeout(() => setProgressState('idle'), 280);
  } catch {
    window.location.assign(href);
  } finally {
    navigating = false;
  }
}

declare global {
  interface Window {
    __nagmSoftNavInit?: boolean;
  }
}

/** Install document-level soft navigation once per tab. */
export function initSoftNav() {
  if (typeof window === 'undefined' || window.__nagmSoftNavInit) return;
  window.__nagmSoftNavInit = true;
  ensureProgressEl();
  setProgressState('idle');

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const anchor = event.target.closest('a[href]');
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (!isSoftNavCandidate(anchor, event, window.location)) return;

    event.preventDefault();
    void softNavigate(anchor.href, { push: true });
  });

  window.addEventListener('popstate', () => {
    // Snapchat setup may drive history; do not swap the document out from under it.
    if (isSnapPixelSetupActive(window.location)) return;
    void softNavigate(window.location.href, { push: false });
  });
}
