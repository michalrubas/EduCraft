// src/components/ui/WorldCard.tsx
import { motion } from 'framer-motion'
import { World } from '../../data/types'
import { CURRENCY_ICONS } from '../../data/config'

interface Props {
  world: World
  unlocked: boolean
  onPress: () => void
}

export function WorldCard({ world, unlocked, onPress }: Props) {
  return (
    <motion.div
      className={`world-card ${unlocked ? '' : 'locked'}`}
      style={{ borderColor: unlocked ? world.accentColor : undefined, height: '100%' }}
      whileTap={{ scale: 0.96 }}
      onClick={onPress}
    >
      {!unlocked && <span className="lock-badge">🔒</span>}

      {/* Minecraft-style block face */}
      <div
        className="world-block"
        style={{ background: unlocked ? world.blockColor : '#333' }}
      >
        <span className="world-block-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {(world.icon.startsWith('/') || world.icon.startsWith('http')) 
            ? <img src={world.icon} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} /> 
            : world.icon}
        </span>
      </div>

      <span className="world-name">{world.name}</span>

      {/* always reserve space at bottom — keeps all cards same height */}
      <span className="world-cost" style={{ visibility: unlocked ? 'hidden' : 'visible' }}>
        {world.unlockCurrency === 'emeralds' ? CURRENCY_ICONS.emeralds : world.unlockCurrency === 'stars' ? CURRENCY_ICONS.stars : CURRENCY_ICONS.diamonds} {world.unlockCost}
      </span>
    </motion.div>
  )
}
