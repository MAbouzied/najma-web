import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BASELINE_SECURITY_HEADERS, withSecurityHeaders } from './security-headers.ts';

describe('security headers', () => {
  it('does not ship a Content-Security-Policy header', () => {
    assert.equal(BASELINE_SECURITY_HEADERS['Content-Security-Policy'], undefined);
    assert.equal(BASELINE_SECURITY_HEADERS['X-Frame-Options'], 'DENY');
  });

  it('applies baseline headers without adding CSP', () => {
    const response = withSecurityHeaders(new Response('ok'));
    assert.equal(response.headers.get('Content-Security-Policy'), null);
    assert.equal(response.headers.get('X-Frame-Options'), 'DENY');
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
