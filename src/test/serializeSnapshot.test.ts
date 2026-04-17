import { describe, it, expect } from 'vitest'
import { serializeSnapshot } from '../hooks/useSupabaseSync'
import type { GameState } from '../data/types'

const mockState = {
  level: 3,
  xp: 250,
  combo: 5,
  maxCombo: 12,
  diamonds: 42,
  emeralds: 7,
  stars: 1,
  totalCorrect: 100,
  totalAttempts: 120,
  sessionsPlayed: 8,
  totalCorrectSession: 15,
  unlockedWorlds: ['forest', 'cave'],
  ownedItems: ['sword_wood'],
  showcaseSlots: [null, 'sword_wood', null],
  unlockedBadges: ['first_correct'],
  studentProgress: {
    add_no_regroup: { mastery: 0.8, unlocked: true, attempts: 20, lastPracticed: 1000 },
  },
  worldAccuracy: { forest: { correct: 80, total: 100 } },
  muted: false,
  // funkce — nesmí být v snapshotu
  navigateTo: () => {},
  enterWorld: () => {},
  answerCorrect: () => false,
} as unknown as GameState

describe('serializeSnapshot', () => {
  it('includes all expected fields', () => {
    const result = serializeSnapshot(mockState)
    expect(result.level).toBe(3)
    expect(result.xp).toBe(250)
    expect(result.diamonds).toBe(42)
    expect(result.studentProgress).toEqual(mockState.studentProgress)
    expect(result.worldAccuracy).toEqual(mockState.worldAccuracy)
  })

  it('excludes functions', () => {
    const result = serializeSnapshot(mockState)
    expect((result as Record<string, unknown>).navigateTo).toBeUndefined()
    expect((result as Record<string, unknown>).answerCorrect).toBeUndefined()
  })

  it('includes all 18 expected keys', () => {
    const result = serializeSnapshot(mockState)
    const keys = Object.keys(result)
    expect(keys).toContain('level')
    expect(keys).toContain('xp')
    expect(keys).toContain('combo')
    expect(keys).toContain('maxCombo')
    expect(keys).toContain('diamonds')
    expect(keys).toContain('emeralds')
    expect(keys).toContain('stars')
    expect(keys).toContain('totalCorrect')
    expect(keys).toContain('totalAttempts')
    expect(keys).toContain('sessionsPlayed')
    expect(keys).toContain('totalCorrectSession')
    expect(keys).toContain('unlockedWorlds')
    expect(keys).toContain('ownedItems')
    expect(keys).toContain('showcaseSlots')
    expect(keys).toContain('unlockedBadges')
    expect(keys).toContain('studentProgress')
    expect(keys).toContain('worldAccuracy')
    expect(keys).toContain('muted')
  })
})
