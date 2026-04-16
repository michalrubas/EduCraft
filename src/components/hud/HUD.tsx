// src/components/hud/HUD.tsx
import { useGameStore } from '../../store/gameStore'
import { getComboInfo } from '../../hooks/useCombo'
import { getLevelData } from '../../data/levels'
import { ComboBar } from './ComboBar'

export function HUD() {
  const { diamonds, emeralds, stars, combo, muted, setMuted, xp, level } = useGameStore()
  const info = getComboInfo(combo)
  const { progressPercent } = getLevelData(xp)

  return (
    <>
      <div className="hud">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: 4, marginRight: 4 }}>
          <span style={{ fontSize: 14, color: '#55ff55', fontWeight: 'bold' }}>Lev {level}</span>
        </div>
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
      
      {/* XP Bar */}
      <div style={{ height: 4, background: '#1c301c', width: '100%', position: 'relative', borderBottom: '1px solid #000' }}>
        <div style={{ 
          height: '100%', 
          background: '#55ff55', 
          width: `${progressPercent}%`,
          transition: 'width 0.4s ease-out'
        }} />
      </div>

      <ComboBar combo={combo} />
    </>
  )
}
