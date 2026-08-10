export interface RateLimiterBinding {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export function createMemoryRateLimiter(limit: number): RateLimiterBinding {
  const hits = new Map<string, number>();
  return {
    async limit({ key }) {
      const count = (hits.get(key) ?? 0) + 1;
      hits.set(key, count);
      return { success: count <= limit };
    },
  };
}

export function rateLimitExceededResponse(retryAfterSeconds = 60): Response {
  return new Response(JSON.stringify({ error: 'Too many requests' }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Retry-After': String(retryAfterSeconds),
      'X-Robots-Tag': 'noindex, nofollow, nosnippet',
    },
  });
}

/** Returns a 429 response when limited, otherwise null. Missing bindings fail open. */
export async function enforceRateLimit(
  limiter: RateLimiterBinding | undefined | null,
  key: string,
  retryAfterSeconds = 60,
): Promise<Response | null> {
  if (!limiter) return null;
  const { success } = await limiter.limit({ key });
  return success ? null : rateLimitExceededResponse(retryAfterSeconds);
}

export function rateLimitActor(request: Request, userId?: string | null): string {
  if (userId?.trim()) return `user:${userId.trim()}`;
  return request.headers.get('cf-connecting-ip')?.trim() || 'local';
}
