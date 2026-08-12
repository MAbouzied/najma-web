import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveLegacyResponse } from './legacy-response.ts';

describe('resolveLegacyResponse', () => {
  it('301 redirects /home/ to /', () => {
    const response = resolveLegacyResponse('/home/', '?utm=1');
    assert.ok(response);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), '/?utm=1');
  });

  it('301 redirects Arabic blog path to /blogs/', () => {
    const response = resolveLegacyResponse('/%D8%A7%D9%84%D9%85%D8%AF%D9%88%D9%86%D8%A9/');
    assert.ok(response);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), '/blogs/');
  });

  it('410 for spam tags', () => {
    const response = resolveLegacyResponse('/tag/bet/');
    assert.ok(response);
    assert.equal(response.status, 410);
    assert.match(response.headers.get('X-Robots-Tag') ?? '', /noindex/);
  });

  it('301 retired offer slugs to offers index', () => {
    const response = resolveLegacyResponse('/offers/exterior-wash/');
    assert.ok(response);
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('Location'), '/offers/');
  });

  it('strips CRLF from query before setting Location', () => {
    const response = resolveLegacyResponse('/home/', '?\r\nX-Injected: 1');
    assert.ok(response);
    assert.equal(response.headers.get('Location'), '/');
  });

  it('returns null for current site routes', () => {
    assert.equal(resolveLegacyResponse('/'), null);
    assert.equal(resolveLegacyResponse('/services/'), null);
    assert.equal(resolveLegacyResponse('/blogs/'), null);
    assert.equal(resolveLegacyResponse('/404'), null);
  });
});
