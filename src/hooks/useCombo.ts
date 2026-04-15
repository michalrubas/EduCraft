// src/hooks/useCombo.ts
import { ComboLevel, getComboLevel } from '../data/config'

export interface ComboInfo {
  level: ComboLevel
  label: string
  flames: number
  color: string
}

export function getComboInfo(combo: number): ComboInfo {
  const level = getComboLevel(combo)
  const map: Record<ComboLevel, ComboInfo> = {
    base:       { level, label: '',              flames: 0, color: '#ffffff' },
    fire:       { level, label: '🔥 COMBO x2',   flames: 1, color: '#ff9f43' },
    doubleFire: { level, label: '🔥🔥 COMBO x3',  flames: 2, color: '#ff6348' },
    mania:      { level, label: '🔥🔥🔥 MÁNIE!',  flames: 3, color: '#ffd700' },
  }
  return map[level]
}
