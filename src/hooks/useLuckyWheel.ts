// src/hooks/useLuckyWheel.ts
import type { WheelReward } from '../data/types'

export type { WheelReward }

export const WHEEL_REWARDS: WheelReward[] = [
  { label: '💎 +5',   diamonds: 5 },
  { label: '🎁 ?',    itemId: 'random' },
  { label: '💎 +25',  diamonds: 25 },
  { label: '⭐ +3',   stars: 3 },
  { label: '🟢 +4',   emeralds: 4 },
  { label: '⭐ +1',   stars: 1 },
  { label: '🎁 ?',    itemId: 'random' },
]

export function shouldTriggerWheel(
  totalCorrectSession: number,
  wheelSpinsToday: number,
  isFirstCombo10: boolean
): boolean {
  if (wheelSpinsToday >= 3) return false
  if (isFirstCombo10) return true
  if (totalCorrectSession > 0 && totalCorrectSession % 20 === 0) {
    return Math.random() < 0.6
  }
  return false
}

export function pickRandomReward(): WheelReward {
  const idx = Math.floor(Math.random() * WHEEL_REWARDS.length)
  return WHEEL_REWARDS[idx]
}
