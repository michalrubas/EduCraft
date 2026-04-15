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

export function getComboLevel(combo: number): ComboLevel {
  if (combo >= COMBO_THRESHOLDS.mania) return 'mania'
  if (combo >= COMBO_THRESHOLDS.doubleFire) return 'doubleFire'
  if (combo >= COMBO_THRESHOLDS.fire) return 'fire'
  return 'base'
}
