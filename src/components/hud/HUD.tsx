// src/components/hud/HUD.tsx
import { useGameStore } from '../../store/gameStore'
import { getComboInfo } from '../../hooks/useCombo'
import { ComboBar } from './ComboBar'

export function HUD() {
  const { diamonds, emeralds, stars, combo, muted, setMuted } = useGameStore()
  const info = getComboInfo(combo)

  return (
    <>
      <div className="hud">
        <span className="hud-currency">💰<span>{diamonds}</span></span>
        <span className="hud-currency">💎<span>{emeralds}</span></span>
        {stars > 0 && <span className="hud-currency">⬛<span>{stars}</span></span>}
        {info.label && (
          <span className="hud-combo" style={{ color: info.color }}>{info.label}</span>
        )}
        <button
          onClick={() => setMuted(!muted)}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--mc-muted)' }}
          aria-label={muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
      <ComboBar combo={combo} />
    </>
  )
}
