// src/components/ui/WorldCard.tsx
import { motion } from 'framer-motion'
import { World } from '../../data/types'

interface Props {
  world: World
  unlocked: boolean
  onPress: () => void
}

export function WorldCard({ world, unlocked, onPress }: Props) {
  return (
    <motion.div
      className={`world-card ${unlocked ? '' : 'locked'}`}
      style={{ borderColor: unlocked ? world.accentColor : undefined }}
      whileTap={{ scale: 0.96 }}
      onClick={onPress}
    >
      {!unlocked && <span className="lock-badge">🔒</span>}
      <span className="world-icon">{world.icon}</span>
      <span className="world-name">{world.name}</span>
      {!unlocked && (
        <span className="world-cost">
          💎 {world.unlockCost}
        </span>
      )}
    </motion.div>
  )
}
