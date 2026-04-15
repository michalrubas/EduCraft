// src/components/hud/ComboBar.tsx
import { COMBO_THRESHOLDS } from '../../data/config'
import { getComboInfo } from '../../hooks/useCombo'

interface Props {
  combo: number
}

export function ComboBar({ combo }: Props) {
  const info = getComboInfo(combo)
  const pct = Math.min(100, (combo / COMBO_THRESHOLDS.mania) * 100)
  return (
    <div className="combo-bar-wrap">
      <div
        className="combo-bar-fill"
        style={{ width: `${pct}%`, background: `linear-gradient(90deg, #2d6d44, ${info.color})` }}
      />
    </div>
  )
}
