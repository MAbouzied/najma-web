import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BASELINE_SECURITY_HEADERS, withSecurityHeaders } from './security-headers.ts';

describe('security headers', () => {
  it('does not ship CSP, framing, or cross-origin isolation headers', () => {
    assert.equal(BASELINE_SECURITY_HEADERS['Content-Security-Policy'], undefined);
    assert.equal(BASELINE_SECURITY_HEADERS['Content-Security-Policy-Report-Only'], undefined);
    assert.equal(BASELINE_SECURITY_HEADERS['Cross-Origin-Opener-Policy'], undefined);
    assert.equal(BASELINE_SECURITY_HEADERS['Cross-Origin-Embedder-Policy'], undefined);
    assert.equal(BASELINE_SECURITY_HEADERS['Cross-Origin-Resource-Policy'], undefined);
    assert.equal(BASELINE_SECURITY_HEADERS['X-Frame-Options'], undefined);
  });

  it('applies baseline headers without adding CSP, COOP, or X-Frame-Options', () => {
    const response = withSecurityHeaders(new Response('ok'));
    assert.equal(response.headers.get('Content-Security-Policy'), null);
    assert.equal(response.headers.get('Content-Security-Policy-Report-Only'), null);
    assert.equal(response.headers.get('Cross-Origin-Opener-Policy'), null);
    assert.equal(response.headers.get('Cross-Origin-Embedder-Policy'), null);
    assert.equal(response.headers.get('Cross-Origin-Resource-Policy'), null);
    assert.equal(response.headers.get('X-Frame-Options'), null);
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
  });

  it('strips a restrictive Content-Security-Policy and X-Frame-Options', () => {
    const response = withSecurityHeaders(
      new Response('ok', {
        headers: {
          'Content-Security-Policy': "default-src 'self'",
          'Content-Security-Policy-Report-Only': "default-src 'none'",
          'X-Frame-Options': 'DENY',
          'Cross-Origin-Opener-Policy': 'same-origin',
        },
      }),
    );
    assert.equal(response.headers.get('Content-Security-Policy'), null);
    assert.equal(response.headers.get('Content-Security-Policy-Report-Only'), null);
    assert.equal(response.headers.get('X-Frame-Options'), null);
    assert.equal(response.headers.get('Cross-Origin-Opener-Policy'), null);
  });

  it('strips CSP even when a caller tries to set one in extra headers', () => {
    const response = withSecurityHeaders(new Response('ok'), {
      'Content-Security-Policy': "default-src *",
      'X-Frame-Options': 'SAMEORIGIN',
    });
    assert.equal(response.headers.get('Content-Security-Policy'), null);
    assert.equal(response.headers.get('X-Frame-Options'), null);
  });
});
