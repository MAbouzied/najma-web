import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isSnapPixelSetupActive, isSoftNavCandidate } from './soft-nav.ts';

function anchor(href: string, extras: Partial<HTMLAnchorElement> = {}): HTMLAnchorElement {
  const el = {
    href: new URL(href, 'https://nagmspa.com').href,
    getAttribute(name: string) {
      if (name === 'href') return href;
      return null;
    },
    hasAttribute(name: string) {
      return name in (extras as Record<string, unknown>);
    },
    target: extras.target ?? '',
    dataset: extras.dataset ?? {},
    ...extras,
  };
  return el as HTMLAnchorElement;
}

const click = {
  button: 0,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  defaultPrevented: false,
};

const location = {
  href: 'https://nagmspa.com/',
  origin: 'https://nagmspa.com',
};

describe('isSnapPixelSetupActive', () => {
  it('detects pixelSetupTool query and snap-pixel-setup-tool hash', () => {
    assert.equal(
      isSnapPixelSetupActive({
        href: 'https://nagmspa.com/?pixelSetupTool=abc',
        origin: 'https://nagmspa.com',
      }),
      true,
    );
    assert.equal(
      isSnapPixelSetupActive({
        href: 'https://nagmspa.com/#snap-pixel-setup-tool={"mode":"overlay"}',
        origin: 'https://nagmspa.com',
      }),
      true,
    );
    assert.equal(isSnapPixelSetupActive(location), false);
  });
});

describe('isSoftNavCandidate', () => {
  it('allows same-origin primary navigations', () => {
    assert.equal(isSoftNavCandidate(anchor('/about/'), click, location), true);
    assert.equal(isSoftNavCandidate(anchor('/en/services/'), click, location), true);
    assert.equal(isSoftNavCandidate(anchor('/blogs/'), click, location), true);
  });

  it('rejects modified clicks, downloads, and new tabs', () => {
    assert.equal(isSoftNavCandidate(anchor('/about/'), { ...click, ctrlKey: true }, location), false);
    assert.equal(
      isSoftNavCandidate(anchor('/about/', { target: '_blank' }), click, location),
      false,
    );
    assert.equal(
      isSoftNavCandidate(anchor('/about/', { download: '' } as Partial<HTMLAnchorElement>), click, location),
      false,
    );
  });

  it('rejects external, hash-only, api, and admin targets', () => {
    assert.equal(isSoftNavCandidate(anchor('https://example.com/x'), click, location), false);
    assert.equal(isSoftNavCandidate(anchor('#main-content'), click, location), false);
    assert.equal(isSoftNavCandidate(anchor('/api/customers'), click, location), false);
    assert.equal(isSoftNavCandidate(anchor('/admin/posts'), click, location), false);
    assert.equal(isSoftNavCandidate(anchor('/login'), click, location), false);
  });

  it('rejects same-path navigations so in-page behavior stays native', () => {
    assert.equal(isSoftNavCandidate(anchor('/'), click, location), false);
    assert.equal(isSoftNavCandidate(anchor('/#services'), click, location), false);
  });

  it('honors opt-out data attributes', () => {
    assert.equal(
      isSoftNavCandidate(
        anchor('/about/', { dataset: { fullReload: '' } } as Partial<HTMLAnchorElement>),
        click,
        location,
      ),
      false,
    );
  });

  it('disables soft-nav while Snapchat pixel setup tool is open', () => {
    const setupLocation = {
      href: 'https://nagmspa.com/?pixelSetupTool=abc#snap-pixel-setup-tool={}',
      origin: 'https://nagmspa.com',
    };
    assert.equal(isSoftNavCandidate(anchor('/book/'), click, setupLocation), false);
    assert.equal(isSoftNavCandidate(anchor('/services/swedish-massage/'), click, setupLocation), false);
  });

  it('treats hash-only snap setup marker as active for soft-nav opt-out', () => {
    const hashOnly = {
      href: 'https://nagmspa.com/#snap-pixel-setup-tool={"env":"prod"}',
      origin: 'https://nagmspa.com',
    };
    assert.equal(isSnapPixelSetupActive(hashOnly), true);
    assert.equal(isSoftNavCandidate(anchor('/about/'), click, hashOnly), false);
  });
});
