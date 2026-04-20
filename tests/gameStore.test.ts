// tests/gameStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../src/store/gameStore'
import { SHOP_ITEMS } from '../src/data/shopItems'

beforeEach(() => {
  useGameStore.setState({
    currentScreen: 'home',
    currentWorldId: null,
    combo: 0,
    maxCombo: 0,
    diamonds: 10,
    emeralds: 0,
    stars: 0,
    unlockedWorlds: ['forest'],
    ownedItems: ['sword_wood'],
    showcaseSlots: Array(8).fill(null),
    totalCorrect: 0,
    totalAttempts: 0,
    sessionsPlayed: 0,
  })
})

describe('answerCorrect', () => {
  it('increments combo', () => {
    useGameStore.getState().answerCorrect('forest')
    expect(useGameStore.getState().combo).toBe(1)
  })
  it('adds diamonds', () => {
    useGameStore.getState().answerCorrect('forest')
    expect(useGameStore.getState().diamonds).toBeGreaterThan(10)
  })
  it('updates maxCombo', () => {
    useGameStore.getState().answerCorrect('forest')
    useGameStore.getState().answerCorrect('forest')
    useGameStore.getState().answerCorrect('forest')
    expect(useGameStore.getState().maxCombo).toBe(3)
  })
  it('switches screen to reward', () => {
    useGameStore.getState().answerCorrect('forest')
    expect(useGameStore.getState().currentScreen).toBe('reward')
  })
  it('applies comboMultiplier for nether (2.5x)', () => {
    useGameStore.setState({ diamonds: 0 })
    useGameStore.getState().answerCorrect('nether')
    // nether multiplier 2.5, base reward 1 diamond → Math.round(2.5) = 3
    expect(useGameStore.getState().diamonds).toBe(3)
  })
})

describe('answerIncorrect', () => {
  it('does NOT reset combo', () => {
    useGameStore.getState().answerCorrect('forest')
    useGameStore.getState().answerCorrect('forest')
    useGameStore.getState().answerIncorrect()
    expect(useGameStore.getState().combo).toBe(2)
  })
  it('increments totalAttempts', () => {
    useGameStore.getState().answerIncorrect()
    expect(useGameStore.getState().totalAttempts).toBe(1)
  })
})

describe('buyItem', () => {
  it('deducts diamonds on purchase', () => {
    useGameStore.setState({ diamonds: 50 })
    const item = SHOP_ITEMS.find(i => i.id === 'sword_stone')!
    useGameStore.getState().buyItem(item)
    expect(useGameStore.getState().diamonds).toBe(30)
  })
  it('adds item to ownedItems', () => {
    useGameStore.setState({ diamonds: 50 })
    const item = SHOP_ITEMS.find(i => i.id === 'sword_stone')!
    useGameStore.getState().buyItem(item)
    expect(useGameStore.getState().ownedItems).toContain('sword_stone')
  })
  it('returns false if not enough diamonds', () => {
    useGameStore.setState({ diamonds: 0 })
    const item = SHOP_ITEMS.find(i => i.id === 'sword_stone')!
    const result = useGameStore.getState().buyItem(item)
    expect(result).toBe(false)
  })
  it('returns false if already owned', () => {
    useGameStore.setState({ diamonds: 100 })
    const item = SHOP_ITEMS.find(i => i.id === 'sword_wood')!
    const result = useGameStore.getState().buyItem(item)
    expect(result).toBe(false)
  })
})

describe('unlockWorld', () => {
  it('deducts cost and adds world', () => {
    useGameStore.setState({ diamonds: 50 })
    useGameStore.getState().unlockWorld('cave', 30)
    expect(useGameStore.getState().diamonds).toBe(20)
    expect(useGameStore.getState().unlockedWorlds).toContain('cave')
  })
  it('returns false if insufficient diamonds', () => {
    useGameStore.setState({ diamonds: 5 })
    const result = useGameStore.getState().unlockWorld('cave', 30)
    expect(result).toBe(false)
  })
})
