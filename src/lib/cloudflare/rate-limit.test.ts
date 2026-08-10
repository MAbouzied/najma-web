import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createMemoryRateLimiter,
  enforceRateLimit,
  rateLimitActor,
} from './rate-limit.ts';

describe('enforceRateLimit', () => {
  it('allows traffic when the binding is missing', async () => {
    assert.equal(await enforceRateLimit(undefined, 'customer-lead:local'), null);
  });

  it('returns 429 with Retry-After when the threshold is crossed', async () => {
    const limiter = createMemoryRateLimiter(2);
    assert.equal(await enforceRateLimit(limiter, 'customer-lead:a'), null);
    assert.equal(await enforceRateLimit(limiter, 'customer-lead:a'), null);
    const denied = await enforceRateLimit(limiter, 'customer-lead:a');
    assert.ok(denied);
    assert.equal(denied.status, 429);
    assert.equal(denied.headers.get('Retry-After'), '60');
    assert.match(await denied.text(), /Too many requests/);
  });
});

describe('rateLimitActor', () => {
  it('prefers authenticated user identity over connecting IP', () => {
    const request = new Request('https://nagmspa.com/api/admin/blog/posts', {
      headers: { 'cf-connecting-ip': '203.0.113.10' },
    });
    assert.equal(rateLimitActor(request, 'user-123'), 'user:user-123');
    assert.equal(rateLimitActor(request), '203.0.113.10');
  });
});
