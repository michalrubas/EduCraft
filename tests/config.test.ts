import { describe, it, expect } from 'vitest'
import { getComboLevel, COMBO_THRESHOLDS } from '../src/data/config'

describe('getComboLevel', () => {
  it('returns base for combo 1', () => {
    expect(getComboLevel(1)).toBe('base')
  })
  it('returns base for combo 2', () => {
    expect(getComboLevel(2)).toBe('base')
  })
  it('returns fire at threshold', () => {
    expect(getComboLevel(COMBO_THRESHOLDS.fire)).toBe('fire')
  })
  it('returns doubleFire at threshold', () => {
    expect(getComboLevel(COMBO_THRESHOLDS.doubleFire)).toBe('doubleFire')
  })
  it('returns mania at threshold', () => {
    expect(getComboLevel(COMBO_THRESHOLDS.mania)).toBe('mania')
  })
  it('returns mania above threshold', () => {
    expect(getComboLevel(20)).toBe('mania')
  })
})
