const ALLOWED_TAGS = new Set([
  'p',
  'h2',
  'h3',
  'h4',
  'strong',
  'em',
  'u',
  's',
  'ul',
  'ol',
  'li',
  'blockquote',
  'cite',
  'a',
  'br',
  'figure',
  'figcaption',
  'img',
  'div',
  'video',
  'source',
  'iframe',
  'code',
]);

const URL_ATTRIBUTES = new Set(['href', 'src', 'poster']);
const SAFE_ATTRIBUTES = new Set([
  'alt',
  'title',
  'target',
  'rel',
  'class',
  'style',
  'width',
  'height',
  'loading',
  'decoding',
  'allow',
  'allowfullscreen',
  'referrerpolicy',
  'sandbox',
  'frameborder',
]);

const EMBED_SRC =
  /^https:\/\/(www\.)?(youtube-nocookie\.com|player\.vimeo\.com)\//i;

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function safeUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || /^data:/i.test(trimmed) || /^javascript:/i.test(trimmed) || /^vbscript:/i.test(trimmed)) {
    return null;
  }
  if (trimmed.startsWith('//')) return null;
  if (/^https?:\/\//i.test(trimmed) || (trimmed.startsWith('/') && !trimmed.startsWith('//')) || trimmed.startsWith('#')) {
    return trimmed;
  }
  return null;
}

function isAllowedImageSrc(url: string): boolean {
  if (url.startsWith('/') && !url.startsWith('//')) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'cdn.sanity.io';
  } catch {
    return false;
  }
}

function sanitizeAttributes(raw: string, tag: string): string {
  const attributes: string[] = [];
  const matcher = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match: RegExpExecArray | null;
  let iframeSrc: string | null = null;

  while ((match = matcher.exec(raw))) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    if (name.startsWith('on') || name === 'srcdoc' || (!SAFE_ATTRIBUTES.has(name) && !URL_ATTRIBUTES.has(name))) {
      continue;
    }
    if (URL_ATTRIBUTES.has(name)) {
      const url = safeUrl(value);
      if (!url) continue;
      if (tag === 'iframe' && name === 'src') {
        if (!EMBED_SRC.test(url)) continue;
        iframeSrc = url;
        attributes.push(`src="${escapeAttribute(url)}"`);
        continue;
      }
      if ((tag === 'img' || tag === 'source' || (tag === 'video' && name === 'poster')) && name === 'src') {
        if (!isAllowedImageSrc(url)) continue;
      }
      if (tag === 'video' && name === 'src' && !isAllowedImageSrc(url)) continue;
      attributes.push(`${name}="${escapeAttribute(url)}"`);
      continue;
    }
    if (name === 'style') {
      const style = value
        .split(';')
        .map((rule) => rule.trim())
        .filter((rule) => /^(text-align|max-width|width|margin-inline|object-fit|border-radius)\s*:/i.test(rule))
        .join('; ');
      if (!style) continue;
      attributes.push(`style="${escapeAttribute(style)}"`);
      continue;
    }
    attributes.push(`${name}="${escapeAttribute(value)}"`);
  }

  if (tag === 'a' && attributes.some((item) => item.startsWith('href='))) {
    attributes.push('rel="noopener noreferrer"');
  }

  if (tag === 'iframe' && iframeSrc) {
    if (!attributes.some((item) => item.startsWith('title='))) {
      attributes.push('title="فيديو المقال"');
    }
    if (!attributes.some((item) => item.startsWith('loading='))) {
      attributes.push('loading="lazy"');
    }
    if (!attributes.some((item) => item.startsWith('referrerpolicy='))) {
      attributes.push('referrerpolicy="strict-origin-when-cross-origin"');
    }
    if (!attributes.some((item) => item.startsWith('allow='))) {
      attributes.push('allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"');
    }
    if (!attributes.some((item) => item.startsWith('sandbox='))) {
      attributes.push('sandbox="allow-scripts allow-same-origin allow-presentation"');
    }
    if (!attributes.some((item) => item.startsWith('width='))) {
      attributes.push('width="560"');
    }
    if (!attributes.some((item) => item.startsWith('height='))) {
      attributes.push('height="315"');
    }
  }

  return attributes.length ? ` ${attributes.join(' ')}` : '';
}

/** Single allowlisted HTML sanitizer for blog storage and render. */
export function sanitizeBlogHtml(input: string): string {
  const withoutDangerousBlocks = input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\s*(script|style|object|embed|form|math|svg)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, '')
    .replace(/<\s*(script|style|object|embed|form|math|svg)[^>]*\/?>/gi, '');

  const openIframes: boolean[] = [];

  return withoutDangerousBlocks.replace(/<\/?\s*([:\w-]+)([^>]*)>/g, (full, rawTag: string, rawAttributes: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return '';
    if (full.startsWith('</')) {
      if (tag === 'iframe') {
        if (!openIframes.pop()) return '';
      }
      return `</${tag}>`;
    }
    const attrs = sanitizeAttributes(rawAttributes, tag);
    if (tag === 'iframe' && !attrs.includes('src=')) return '';
    if (tag === 'img' && !attrs.includes('src=')) return '';
    if (tag === 'iframe') openIframes.push(true);
    const selfClosing = /\/\s*>$/.test(full) || tag === 'br' || tag === 'img' || tag === 'source';
    return `<${tag}${attrs}${selfClosing ? ' />' : '>'}`;
  });
}

export function htmlToPlainText(input: string): string {
  return input
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isAllowedBlogImageUrl(url: string): boolean {
  const safe = safeUrl(url);
  return Boolean(safe && isAllowedImageSrc(safe));
}

export function isAllowedBlogEmbedUrl(url: string): boolean {
  const safe = safeUrl(url);
  return Boolean(safe && EMBED_SRC.test(safe));
}
