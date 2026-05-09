import { theme, block } from '../../theme'

interface Props {
  icon: string
  value: string
  tint: string
}

export function RewardChip({ icon, value, tint }: Props) {
  return (
    <div style={{
      background: theme.card,
      border: `3px solid ${theme.cardEdge}`,
      borderRadius: 999,
      padding: '6px 14px 6px 6px',
      boxShadow: block(4),
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: '50%', background: tint,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.25), inset 3px 3px 0 rgba(255,255,255,0.4)',
      }}>{icon}</span>
      <span style={{ fontSize: 18, fontWeight: 900, color: theme.ink }}>{value}</span>
    </div>
  )
}
