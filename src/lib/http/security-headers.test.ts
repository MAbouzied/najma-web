import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BASELINE_SECURITY_HEADERS, withSecurityHeaders } from './security-headers.ts';

describe('security headers', () => {
  it('delivers frame-ancestors via HTTP header, not only X-Frame-Options', () => {
    assert.equal(BASELINE_SECURITY_HEADERS['Content-Security-Policy'], "frame-ancestors 'none'");
    assert.equal(BASELINE_SECURITY_HEADERS['X-Frame-Options'], 'DENY');
  });

  it('applies baseline CSP frame-ancestors when wrapping responses', () => {
    const response = withSecurityHeaders(new Response('ok'));
    assert.equal(response.headers.get('Content-Security-Policy'), "frame-ancestors 'none'");
  });

  it('does not overwrite an existing Content-Security-Policy header', () => {
    const response = withSecurityHeaders(
      new Response('ok', {
        headers: { 'Content-Security-Policy': "default-src 'self'" },
      }),
    );
    assert.equal(response.headers.get('Content-Security-Policy'), "default-src 'self'");
  });
});
