// src/components/ui/WorldCard.tsx
import { motion } from 'framer-motion'
import { World } from '../../data/types'
import { theme, block, blockInset } from '../../theme'

interface Props {
  world: World
  unlocked: boolean
  isCurrent: boolean
  progress?: number
  onPress: () => void
}

export function WorldCard({ world, unlocked, isCurrent, progress, onPress }: Props) {
  const size = isCurrent ? 130 : 100
  const locked = !unlocked

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={onPress}
      style={{
        flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        transform: isCurrent ? 'translateY(-8px)' : 'none',
        paddingTop: isCurrent ? 14 : 0,
        cursor: 'pointer',
      }}
    >
      <div style={{ position: 'relative' }}>
        {/* Done badge */}
        {unlocked && !isCurrent && (
          <div style={{
            position: 'absolute', top: -8, right: -8, zIndex: 2,
            width: 28, height: 28, borderRadius: '50%',
            background: theme.gold, border: `3px solid ${theme.cardEdge}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, boxShadow: block(2),
          }}>✓</div>
        )}
        {/* Current HRÁT badge */}
        {isCurrent && (
          <div style={{
            position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', zIndex: 2,
            background: theme.red, color: '#fff', fontSize: 10, fontWeight: 900,
            padding: '3px 8px', borderRadius: 999, letterSpacing: 1,
            border: `2px solid ${theme.cardEdge}`, boxShadow: block(2),
            whiteSpace: 'nowrap',
          }}>HRÁT</div>
        )}

        {/* Block face */}
        <div style={{
          width: size, height: size,
          background: locked ? '#9a9a9a' : world.blockColor,
          border: `4px solid ${locked ? '#5a5a5a' : (world.accentColor || theme.cardEdge)}`,
          borderRadius: 10,
          boxShadow: blockInset,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isCurrent ? 64 : 50, position: 'relative',
          filter: locked ? 'saturate(0.2)' : 'none',
        }}>
          {locked ? '🔒' : world.icon}
          {/* Progress bar on current world */}
          {isCurrent && progress != null && (
            <div style={{
              position: 'absolute', left: 8, right: 8, bottom: 8,
              height: 8, background: 'rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.4)',
            }}>
              <div style={{ height: '100%', width: `${progress * 100}%`, background: theme.gold }} />
            </div>
          )}
        </div>
      </div>

      <div style={{
        fontSize: isCurrent ? 16 : 13, fontWeight: 900, color: theme.ink,
        textShadow: '0 1px 0 rgba(255,255,255,0.5)',
      }}>{world.name}</div>

      {locked && (
        <div style={{
          background: theme.card, border: `2px solid ${theme.cardEdge}`,
          borderRadius: 999, padding: '2px 8px',
          fontSize: 12, fontWeight: 900, color: theme.ink, display: 'flex', alignItems: 'center', gap: 3,
          boxShadow: block(2),
        }}>
          {world.unlockCurrency === 'emeralds' ? '🟢' : world.unlockCurrency === 'stars' ? '⭐' : '💎'} {world.unlockCost}
        </div>
      )}
    </motion.div>
  )
}
