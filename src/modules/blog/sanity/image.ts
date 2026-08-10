import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import type { BlogImage } from '../model/blog-types.ts';
import type { SanityImageValue } from './types.ts';

export interface SanityImageUrlConfig {
  projectId: string;
  dataset: string;
}

function builderFor(config: SanityImageUrlConfig) {
  return createImageUrlBuilder({
    projectId: config.projectId,
    dataset: config.dataset,
  });
}

export function sanityImageUrl(
  config: SanityImageUrlConfig,
  source: SanityImageSource,
  width = 1600,
): string {
  return builderFor(config)
    .image(source)
    .width(width)
    .auto('format')
    .fit('max')
    .url();
}

function resolveImageSrc(
  config: SanityImageUrlConfig,
  value: SanityImageValue,
  width: number,
): string {
  const assetUrl = value.asset?.url?.trim();
  if (assetUrl) {
    try {
      const url = new URL(assetUrl);
      url.searchParams.set('w', String(width));
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'max');
      return url.href;
    } catch {
      return assetUrl;
    }
  }

  return sanityImageUrl(config, value as SanityImageSource, width);
}

/** Fixed JPEG 1200×630 share crop for Open Graph / Twitter cards. */
export function mapSanityOgImage(
  config: SanityImageUrlConfig,
  value: SanityImageValue | null | undefined,
  fallbackAlt: string,
  documentId: string,
  field: string,
): BlogImage {
  const asset = value?.asset;
  if (!asset?.url && !asset?._id) {
    throw new Error(`Sanity document ${documentId}: missing ${field} image asset`);
  }

  const alt = value?.alt?.trim() || fallbackAlt;
  if (!alt) {
    throw new Error(`Sanity document ${documentId}: missing ${field}.alt`);
  }

  const src = builderFor(config)
    .image(value as SanityImageSource)
    .width(1200)
    .height(630)
    .fit('crop')
    .format('jpg')
    .url();

  return {
    src,
    alt,
    width: 1200,
    height: 630,
  };
}

export function mapSanityImage(
  config: SanityImageUrlConfig,
  value: SanityImageValue | null | undefined,
  fallbackAlt: string,
  documentId: string,
  field: string,
): BlogImage {
  const asset = value?.asset;
  if (!asset?.url && !asset?._id) {
    throw new Error(`Sanity document ${documentId}: missing ${field} image asset`);
  }

  const alt = value?.alt?.trim();
  if (!alt) {
    throw new Error(`Sanity document ${documentId}: missing ${field}.alt`);
  }

  const width = asset.metadata?.dimensions?.width ?? 1600;
  const height = asset.metadata?.dimensions?.height ?? 1067;
  const src = resolveImageSrc(config, value!, Math.min(width, 2000));

  const image: BlogImage = {
    src,
    alt: alt || fallbackAlt,
    width,
    height,
  };

  if (value?.caption?.trim()) image.caption = value.caption.trim();
  if (
    typeof value?.hotspot?.x === 'number' &&
    typeof value?.hotspot?.y === 'number'
  ) {
    image.focalPoint = { x: value.hotspot.x, y: value.hotspot.y };
  }

  return image;
}
