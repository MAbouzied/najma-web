import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isAdminAuthBypassed } from './admin-mode.ts';

describe('isAdminAuthBypassed', () => {
  it('allows bypass only in development when explicitly disabled', () => {
    assert.equal(isAdminAuthBypassed({ dev: true, disabled: true }), true);
  });

  it('rejects bypass in production even when disabled is true', () => {
    assert.equal(isAdminAuthBypassed({ dev: false, disabled: true }), false);
  });

  it('rejects bypass when the disabled flag is missing or false', () => {
    assert.equal(isAdminAuthBypassed({ dev: true, disabled: false }), false);
    assert.equal(isAdminAuthBypassed({ dev: true, disabled: undefined }), false);
    assert.equal(isAdminAuthBypassed({ dev: true, disabled: null }), false);
    assert.equal(isAdminAuthBypassed({ dev: false, disabled: false }), false);
  });
});
