export const HERO_SLIDE_IDS = [
  'facade',
  'hallway',
  'entrance',
  'room-sign',
  'mirror',
  'lounge',
] as const;

export type HeroSlideId = (typeof HERO_SLIDE_IDS)[number];

export const HERO_SLIDE_ALT_KEYS = {
  facade: 'homeHeroImageAlt',
  hallway: 'homeHeroImageAltHallway',
  entrance: 'homeHeroImageAltEntrance',
  'room-sign': 'homeHeroImageAltRoomSign',
  mirror: 'homeHeroImageAltMirror',
  lounge: 'homeHeroImageAltLounge',
} as const;
