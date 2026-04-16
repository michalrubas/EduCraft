import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { CURRENCY_ICONS } from '../../data/config'
import { Icon } from './Icon'

export function ParticlesOverlay() {
  const { particles, removeParticle } = useGameStore()

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <AnimatePresence>
        {particles.map(p => {
          // Konec animace je nahoře v HUD (cca 40px od kraje)
          const isNav = p.emoji === CURRENCY_ICONS.diamonds ? 60 : p.emoji === CURRENCY_ICONS.emeralds ? 120 : 180
          return (
            <motion.div
              key={p.id}
              initial={{ x: p.startX, y: p.startY, scale: 0.2, opacity: 1 }}
              animate={{ 
                x: isNav, 
                y: 30, 
                scale: 1.5, 
                opacity: 0 
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.8 + Math.random() * 0.3, // Rozprostření v čase
                ease: 'easeInOut' 
              }}
              onAnimationComplete={() => removeParticle(p.id)}
              style={{ position: 'absolute', padding: 0, margin: 0, filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
            >
              <Icon src={p.emoji} size={24} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
