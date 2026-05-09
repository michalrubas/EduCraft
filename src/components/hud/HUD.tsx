// src/components/hud/HUD.tsx
import { useGameStore } from '../../store/gameStore'
import { getLevelData } from '../../data/levels'
import { theme, block } from '../../theme'

function Coin({ icon, value, tint }: { icon: string; value: number; tint: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      background: theme.card, border: `3px solid ${theme.cardEdge}`,
      borderRadius: 999, padding: '3px 10px 3px 4px',
      boxShadow: block(3),
    }}>
      <span style={{
        fontSize: 18, width: 24, height: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: tint, borderRadius: '50%',
        boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.25), inset 2px 2px 0 rgba(255,255,255,0.4)',
      }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 900, color: theme.ink }}>{value}</span>
    </div>
  )
}

export function HUD() {
  const { diamonds, emeralds, stars, level, xp } = useGameStore()
  const { progressPercent } = getLevelData(xp)

  return (
    <div style={{
      padding: '10px 12px 8px',
      display: 'flex', alignItems: 'center', gap: 8,
      fontFamily: 'Nunito, sans-serif', fontWeight: 800,
      flexShrink: 0,
    }}>
      {/* Avatar + level */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: theme.card, border: `3px solid ${theme.cardEdge}`,
        borderRadius: 999, padding: '4px 12px 4px 4px',
        boxShadow: block(3),
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#ffd9a6', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, border: `2px solid ${theme.cardEdge}`,
        }}>🧑‍🌾</div>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontSize: 9, color: theme.inkSoft, letterSpacing: 0.5 }}>LEVEL</span>
          <span style={{ fontSize: 16, color: theme.ink, fontWeight: 900 }}>{level}</span>
        </div>
        {/* XP ring */}
        <div style={{
          width: 8, height: 24, background: '#eadfcc', borderRadius: 4, marginLeft: 4,
          overflow: 'hidden', display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{ width: '100%', height: `${progressPercent}%`, background: theme.grass1, transition: 'height 0.4s ease-out' }} />
        </div>
      </div>

      {/* Currencies */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
        <Coin icon="💎" value={diamonds} tint={theme.diamond} />
        <Coin icon="🟢" value={emeralds} tint={theme.emerald} />
        <Coin icon="⭐" value={stars} tint={theme.star} />
      </div>
    </div>
  )
}
