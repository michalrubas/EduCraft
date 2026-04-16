// src/data/levels.ts

export interface LevelData {
  level: number
  currentXp: number
  nextLevelXp: number
  progressPercent: number
  totalXpThisLevel: number
  xpInCurrentLevel: number
}

export interface LevelReward {
  diamonds: number
  emeralds: number
}

// Základní XP za jednu správnou odpověď. Následně se bude násobit comboMultiplierem světa.
export const BASE_XP_PER_ANSWER = 10

export function getLevelData(xp: number): LevelData {
  let level = 1
  let requiredXp = 0
  let nextRequiredXp = 100 // Level 2 vyžaduje 100 XP

  // Zvyšujeme level, dokud současné XP přesahují požadavek pro CÍLOVÝ level
  while (xp >= nextRequiredXp) {
    level++
    requiredXp = nextRequiredXp
    // Každý další level vyžaduje trošku více XP (křivka postupně roste)
    // Např. Lev 2 -> 3 chce 100 * (2^1.3) = cca 240 + 100 = 340 XP atd.
    const step = Math.floor(150 * Math.pow(level, 1.5))
    nextRequiredXp = requiredXp + step
  }

  const xpInCurrentLevel = xp - requiredXp
  const totalXpThisLevel = nextRequiredXp - requiredXp
  const progressPercent = (xpInCurrentLevel / totalXpThisLevel) * 100

  return {
    level,
    currentXp: xp,
    nextLevelXp: nextRequiredXp,
    progressPercent: Math.min(100, Math.max(0, progressPercent)),
    totalXpThisLevel,
    xpInCurrentLevel,
  }
}

export function getLevelReward(level: number): LevelReward {
  return {
    diamonds: 20 * level,                // Lev 5 = 100 💰
    emeralds: Math.floor(level / 2),     // Lev 5 = 2 💎
  }
}
