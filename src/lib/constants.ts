export const NOISE_TYPES = [
  'White Noise',
  'Grey Noise',
  'Pink Noise',
  'Brown Noise',
  'Blue Noise',
  'Violet Noise',
] as const

export type NoiseType = (typeof NOISE_TYPES)[number]

export const DEFAULT_FOCUS_MINUTES = 25
export const DEFAULT_BREAK_MINUTES = 5
export const DEFAULT_VOLUME = 0.5
export const DEFAULT_NOISE: NoiseType = 'White Noise'
export const DEFAULT_END_SOUND_ENABLED = true
export const DEFAULT_AUTO_START = false
