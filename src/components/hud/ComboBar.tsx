// src/components/hud/ComboBar.tsx
import { COMBO_THRESHOLDS } from '../../data/config'
import { theme } from '../../theme'
import { block } from '../../theme'

interface Props {
  combo: number
}

export function ComboBar({ combo }: Props) {
  // How many pips are filled: pip 1 at fire(3), pip 2 at doubleFire(5), pip 3 at mania(10)
  const filled = combo >= COMBO_THRESHOLDS.mania ? 3
    : combo >= COMBO_THRESHOLDS.doubleFire ? 2
    : combo >= COMBO_THRESHOLDS.fire ? 1
    : 0

  const statusText = combo === 0
    ? 'Začni sérii!'
    : filled === 0
    ? `${combo}× v řadě`
    : filled === 1
    ? `${combo}× v řadě`
    : filled === 2
    ? `${combo}× v řadě`
    : `${combo}× MÁNIE!`

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '2px 0 8px', flexShrink: 0 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 28, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, lineHeight: 1,
          filter: i < filled ? 'drop-shadow(0 0 8px rgba(255,140,0,0.7))' : 'grayscale(1) opacity(0.35)',
          transition: 'all 0.2s',
        }}>🔥</div>
      ))}
      {combo > 0 && (
        <div style={{
          marginLeft: 6, alignSelf: 'center',
          background: theme.card, border: `2px solid ${theme.cardEdge}`,
          borderRadius: 999, padding: '2px 10px',
          fontSize: 13, fontWeight: 900, color: theme.ink, fontFamily: 'Nunito, sans-serif',
          boxShadow: block(2),
        }}>{statusText}</div>
      )}
    </div>
  )
}
