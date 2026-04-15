// tests/useAdaptiveDifficulty.test.ts
import { describe, it, expect } from 'vitest'
import { getAdaptedRange } from '../src/hooks/useAdaptiveDifficulty'

const BASE: [number, number] = [1, 10]

describe('getAdaptedRange', () => {
  it('returns base range when no attempts yet', () => {
    expect(getAdaptedRange(BASE, 0, 0)).toEqual([1, 10])
  })
  it('returns base range when accuracy is in flow zone (60-90%)', () => {
    expect(getAdaptedRange(BASE, 7, 10)).toEqual([1, 10])
  })
  it('narrows to lower half when accuracy < 60%', () => {
    const result = getAdaptedRange(BASE, 2, 10)
    expect(result[0]).toBe(1)
    expect(result[1]).toBeLessThanOrEqual(6)
  })
  it('shifts to upper half when accuracy > 90%', () => {
    const result = getAdaptedRange(BASE, 10, 10)
    expect(result[0]).toBeGreaterThanOrEqual(5)
    expect(result[1]).toBe(10)
  })
  it('always returns range where min < max', () => {
    const tiny: [number, number] = [1, 2]
    const result = getAdaptedRange(tiny, 10, 10)
    expect(result[0]).toBeLessThan(result[1])
  })
})
