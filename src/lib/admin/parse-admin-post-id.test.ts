import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  AdminBlogNotFoundError,
  isAdminBlogNotFoundError,
  parseAdminPostId,
} from './blog-admin-helpers.ts';

describe('parseAdminPostId', () => {
  it('accepts compact alphanumeric ids in the allowed length range', () => {
    assert.equal(parseAdminPostId('abcd1234'), 'abcd1234');
    assert.equal(parseAdminPostId('  post_ABC-123456  '), 'post_ABC-123456');
    assert.equal(
      parseAdminPostId('12345678-1234-1234-1234-123456789012'),
      '12345678-1234-1234-1234-123456789012',
    );
  });

  it('rejects malformed, short, or non-string ids', () => {
    assert.throws(() => parseAdminPostId('short'), AdminBlogNotFoundError);
    assert.throws(() => parseAdminPostId('../etc/passwd'), AdminBlogNotFoundError);
    assert.throws(() => parseAdminPostId('drafts.post-1'), AdminBlogNotFoundError);
    assert.throws(() => parseAdminPostId('id with spaces!!!!'), AdminBlogNotFoundError);
    assert.throws(() => parseAdminPostId(''), AdminBlogNotFoundError);
    assert.throws(() => parseAdminPostId(null), AdminBlogNotFoundError);
    assert.throws(() => parseAdminPostId(42), AdminBlogNotFoundError);
  });

  it('exposes a typed not-found guard', () => {
    try {
      parseAdminPostId('bad');
      assert.fail('expected parseAdminPostId to throw');
    } catch (error) {
      assert.equal(isAdminBlogNotFoundError(error), true);
    }
  });
});
