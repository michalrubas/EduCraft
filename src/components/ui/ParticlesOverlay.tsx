import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'

export function ParticlesOverlay() {
  const { particles, removeParticle } = useGameStore()

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      <AnimatePresence>
        {particles.map(p => {
          const isNav = p.emoji === '💎' ? 60 : p.emoji === '🟢' ? 120 : 180
          return (
            <motion.div
              key={p.id}
              initial={{ x: p.startX, y: p.startY, scale: 0.2, opacity: 1 }}
              animate={{
                x: isNav,
                y: 30,
                scale: 1.2,
                opacity: 0
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8 + Math.random() * 0.3,
                ease: 'easeInOut'
              }}
              onAnimationComplete={() => removeParticle(p.id)}
              style={{ position: 'absolute', fontSize: 24, lineHeight: 1 }}
            >
              {p.emoji}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
