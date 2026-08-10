export class RequestBodyTooLargeError extends Error {
  constructor(maximumBytes: number) {
    super(`Request body exceeds ${maximumBytes} bytes.`);
    this.name = 'RequestBodyTooLargeError';
  }
}

export class UnsupportedMediaTypeError extends Error {
  constructor(message = 'Unsupported media type.') {
    super(message);
    this.name = 'UnsupportedMediaTypeError';
  }
}

export function isRequestBodyTooLargeError(error: unknown): error is RequestBodyTooLargeError {
  return error instanceof RequestBodyTooLargeError;
}

export function isUnsupportedMediaTypeError(error: unknown): error is UnsupportedMediaTypeError {
  return error instanceof UnsupportedMediaTypeError;
}

export const BODY_LIMITS = {
  customerLeadJson: 10 * 1024,
  revalidateJson: 4 * 1024,
  staffJson: 4 * 1024,
  blogEditorJson: 1 * 1024 * 1024,
  imageUpload: 10 * 1024 * 1024,
} as const;

const IMAGE_TYPES = {
  jpeg: { mime: 'image/jpeg', extension: 'jpg' },
  png: { mime: 'image/png', extension: 'png' },
  webp: { mime: 'image/webp', extension: 'webp' },
  gif: { mime: 'image/gif', extension: 'gif' },
} as const;

export type DetectedImageType = keyof typeof IMAGE_TYPES;

export async function readLimitedBytes(
  request: Request,
  maximumBytes: number,
): Promise<Uint8Array> {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();

  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;

      total += value.byteLength;
      if (total > maximumBytes) {
        await reader.cancel();
        throw new RequestBodyTooLargeError(maximumBytes);
      }

      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

export async function readLimitedJson(
  request: Request,
  maximumBytes: number,
): Promise<unknown> {
  const bytes = await readLimitedBytes(request, maximumBytes);
  if (bytes.byteLength === 0) return {};
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  return JSON.parse(text) as unknown;
}

export function detectImageType(bytes: Uint8Array): DetectedImageType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg';
  }
  if (
    bytes.length >= 8
    && bytes[0] === 0x89
    && bytes[1] === 0x50
    && bytes[2] === 0x4e
    && bytes[3] === 0x47
    && bytes[4] === 0x0d
    && bytes[5] === 0x0a
    && bytes[6] === 0x1a
    && bytes[7] === 0x0a
  ) {
    return 'png';
  }
  if (
    bytes.length >= 12
    && bytes[0] === 0x52
    && bytes[1] === 0x49
    && bytes[2] === 0x46
    && bytes[3] === 0x46
    && bytes[8] === 0x57
    && bytes[9] === 0x45
    && bytes[10] === 0x42
    && bytes[11] === 0x50
  ) {
    return 'webp';
  }
  if (
    bytes.length >= 6
    && bytes[0] === 0x47
    && bytes[1] === 0x49
    && bytes[2] === 0x46
    && bytes[3] === 0x38
    && (bytes[4] === 0x37 || bytes[4] === 0x39)
    && bytes[5] === 0x61
  ) {
    return 'gif';
  }
  return null;
}

export function assertSafeImageBytes(bytes: Uint8Array): {
  type: DetectedImageType;
  mime: string;
  extension: string;
  filename: string;
} {
  if (bytes.byteLength === 0) {
    throw new UnsupportedMediaTypeError('اختر ملف صورة أولاً.');
  }
  if (bytes.byteLength > BODY_LIMITS.imageUpload) {
    throw new RequestBodyTooLargeError(BODY_LIMITS.imageUpload);
  }

  // Reject SVG early even if Content-Type lied.
  const head = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 256)).trimStart();
  if (/^(<\?xml|<!doctype\s+svg|<svg\b)/i.test(head)) {
    throw new UnsupportedMediaTypeError('ملفات SVG غير مسموحة.');
  }

  const type = detectImageType(bytes);
  if (!type) {
    throw new UnsupportedMediaTypeError('يسمح برفع JPEG أو PNG أو WebP أو GIF فقط.');
  }

  const meta = IMAGE_TYPES[type];
  return {
    type,
    mime: meta.mime,
    extension: meta.extension,
    filename: `blog-upload-${crypto.randomUUID()}.${meta.extension}`,
  };
}
