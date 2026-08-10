import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  BODY_LIMITS,
  RequestBodyTooLargeError,
  UnsupportedMediaTypeError,
  assertSafeImageBytes,
  detectImageType,
  readLimitedBytes,
  readLimitedJson,
} from './request-body.ts';

function requestFromBytes(bytes: Uint8Array, contentType = 'application/octet-stream'): Request {
  return new Request('https://nagmspa.com/api/test', {
    method: 'POST',
    headers: { 'Content-Type': contentType },
    body: bytes,
  });
}

describe('readLimitedBytes', () => {
  it('reads bodies within the limit', async () => {
    const bytes = new TextEncoder().encode('{"ok":true}');
    const result = await readLimitedBytes(requestFromBytes(bytes), 100);
    assert.equal(new TextDecoder().decode(result), '{"ok":true}');
  });

  it('rejects oversized bodies before finishing the stream', async () => {
    const bytes = new Uint8Array(32);
    await assert.rejects(
      () => readLimitedBytes(requestFromBytes(bytes), 8),
      RequestBodyTooLargeError,
    );
  });
});

describe('readLimitedJson', () => {
  it('parses JSON within the limit', async () => {
    const bytes = new TextEncoder().encode('{"postId":"abc"}');
    const result = await readLimitedJson(requestFromBytes(bytes, 'application/json'), 100);
    assert.deepEqual(result, { postId: 'abc' });
  });
});

describe('image magic bytes', () => {
  it('detects jpeg png webp and gif signatures', () => {
    assert.equal(detectImageType(Uint8Array.of(0xff, 0xd8, 0xff, 0xe0)), 'jpeg');
    assert.equal(
      detectImageType(Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)),
      'png',
    );
    assert.equal(
      detectImageType(Uint8Array.of(
        0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50,
      )),
      'webp',
    );
    assert.equal(
      detectImageType(Uint8Array.of(0x47, 0x49, 0x46, 0x38, 0x39, 0x61)),
      'gif',
    );
  });

  it('rejects svg and unknown payloads', () => {
    assert.throws(
      () => assertSafeImageBytes(new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>')),
      UnsupportedMediaTypeError,
    );
    assert.throws(
      () => assertSafeImageBytes(new TextEncoder().encode('not-an-image')),
      UnsupportedMediaTypeError,
    );
  });

  it('returns a server-generated filename for valid jpeg bytes', () => {
    const jpeg = Uint8Array.of(0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0);
    const detected = assertSafeImageBytes(jpeg);
    assert.equal(detected.mime, 'image/jpeg');
    assert.match(detected.filename, /^blog-upload-[0-9a-f-]+\.jpg$/);
    assert.ok(BODY_LIMITS.imageUpload > jpeg.byteLength);
  });
});
