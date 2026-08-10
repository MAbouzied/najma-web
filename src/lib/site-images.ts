import type { ImageMetadata } from 'astro';

import logo from '../assets/nagm-logo.png';
import contactCta from '../assets/contact-cta.jpg';
import aboutMission from '../assets/about/mission.jpg';
import aboutVision from '../assets/about/vision.jpg';
import heroInterior from '../assets/home/hero-interior.jpg';

import expertTherapists from '../assets/home/benefits/expert-therapists.png';
import luxuryProducts from '../assets/home/benefits/luxury-products.png';
import calmAtmosphere from '../assets/home/benefits/calm-atmosphere.png';
import quickBooking from '../assets/home/benefits/quick-booking.png';
import personalizedSessions from '../assets/home/benefits/personalized-sessions.png';
import privateRooms from '../assets/home/benefits/private-rooms.png';

import swedishMassage from '../assets/home/services/swedish-massage.jpg';
import thaiMassage from '../assets/home/services/thai-massage.jpg';
import hotStoneMassage from '../assets/home/services/hot-stone-massage.jpg';
import hotStoneMassageHero from '../assets/home/services/hot-stone-massage-hero.jpg';
import cupping from '../assets/home/services/cupping.jpg';
import relaxationMassage from '../assets/home/services/relaxation-massage.jpg';
import shiatsuMassage from '../assets/home/services/shiatsu-massage.jpg';
import hotOilMassage from '../assets/home/services/hot-oil-massage.jpg';
import moroccanBath from '../assets/home/services/moroccan-bath.jpg';
import moroccanClay from '../assets/home/services/moroccan-clay.jpg';
import aromatherapy from '../assets/home/services/aromatherapy.jpg';
import manicurePedicure from '../assets/home/services/manicure-pedicure.jpg';
import manicurePedicureHero from '../assets/home/services/manicure-pedicure-hero.jpg';
import facialCare from '../assets/home/services/facial-care.jpg';

/**
 * Maps stable public SEO URLs (`/assets/...`) to compile-time ImageMetadata.
 * OG/JSON-LD keep the public paths; UI renders through Astro Image/Picture.
 */
const byPublicPath: Record<string, ImageMetadata> = {
  '/assets/nagm-logo.png': logo,
  '/assets/contact-cta.jpg': contactCta,
  '/assets/about/mission.jpg': aboutMission,
  '/assets/about/vision.jpg': aboutVision,
  '/assets/home/hero-interior.jpg': heroInterior,
  '/assets/home/benefits/expert-therapists.png': expertTherapists,
  '/assets/home/benefits/luxury-products.png': luxuryProducts,
  '/assets/home/benefits/calm-atmosphere.png': calmAtmosphere,
  '/assets/home/benefits/quick-booking.png': quickBooking,
  '/assets/home/benefits/personalized-sessions.png': personalizedSessions,
  '/assets/home/benefits/private-rooms.png': privateRooms,
  '/assets/home/services/swedish-massage.jpg': swedishMassage,
  '/assets/home/services/thai-massage.jpg': thaiMassage,
  '/assets/home/services/hot-stone-massage.jpg': hotStoneMassage,
  '/assets/home/services/hot-stone-massage-hero.jpg': hotStoneMassageHero,
  '/assets/home/services/cupping.jpg': cupping,
  '/assets/home/services/relaxation-massage.jpg': relaxationMassage,
  '/assets/home/services/shiatsu-massage.jpg': shiatsuMassage,
  '/assets/home/services/hot-oil-massage.jpg': hotOilMassage,
  '/assets/home/services/moroccan-bath.jpg': moroccanBath,
  '/assets/home/services/moroccan-clay.jpg': moroccanClay,
  '/assets/home/services/aromatherapy.jpg': aromatherapy,
  '/assets/home/services/manicure-pedicure.jpg': manicurePedicure,
  '/assets/home/services/manicure-pedicure-hero.jpg': manicurePedicureHero,
  '/assets/home/services/facial-care.jpg': facialCare,
};

export function tryLocalImage(publicPath: string): ImageMetadata | undefined {
  return byPublicPath[publicPath];
}

export function localImage(publicPath: string): ImageMetadata {
  const image = byPublicPath[publicPath];
  if (!image) {
    throw new Error(`Missing src/assets mapping for public path: ${publicPath}`);
  }
  return image;
}

export const siteImage = {
  logo,
  contactCta,
  heroInterior,
  aboutMission,
  aboutVision,
} as const;
