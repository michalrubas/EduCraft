export const COMBO_THRESHOLDS = {
  fire: 3,
  doubleFire: 5,
  mania: 10,
} as const

export type ComboLevel = 'base' | 'fire' | 'doubleFire' | 'mania'

export const COMBO_REWARDS: Record<ComboLevel, { diamonds: number; emeralds?: number; stars?: number }> = {
  base:       { diamonds: 1 },
  fire:       { diamonds: 2 },
  doubleFire: { diamonds: 3, emeralds: 1 },
  mania:      { diamonds: 5, emeralds: 2, stars: 1 },
}

export const SHOWCASE_SLOTS = 8
export const TASKS_BEFORE_EASY = 5
export const REWARD_SCREEN_DURATION = 2000
export const HINT_COST = 2

// Pro renderování přes <Icon> — může být emoji nebo cesta k obrázku
export const CURRENCY_ICONS = {
  diamonds: '💰',
  emeralds: '💎',
  stars: '/assets/planets/planet1.png',
}

export function getComboLevel(combo: number): ComboLevel {
  if (combo >= COMBO_THRESHOLDS.mania) return 'mania'
  if (combo >= COMBO_THRESHOLDS.doubleFire) return 'doubleFire'
  if (combo >= COMBO_THRESHOLDS.fire) return 'fire'
  return 'base'
}

// Runner task configuration — adjust these to tune difficulty and feel
export const RUNNER_CONFIG = {
  /** Total animation duration at 1× speed (comboMultiplier = 1.0), in ms.
   *  Both the block slide and the wall timeout scale with this value. */
  duration: 5000,
  /** Minimum duration regardless of world speed multiplier, in ms. */
  minDuration: 2500,
  /** Delay between each lane's block appearing, in ms.
   *  Creates a staggered "Guitar Hero" entry effect. */
  staggerDelay: 400,
  /** Number of answer lanes. Changing this also requires updating generators. */
  laneCount: 3,
} as const
