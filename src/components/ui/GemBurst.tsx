// src/components/ui/GemBurst.tsx
import { motion } from 'framer-motion'

interface GemParticle {
  emoji: string
  count: number
}

interface Props {
  gems: GemParticle[]
}

export function GemBurst({ gems }: Props) {
  return (
    <div className="gem-burst-row">
      {gems.map(({ emoji, count }, i) =>
        count > 0 ? (
          <motion.div
            key={emoji}
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 300 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
          >
            <span style={{ fontSize: 36 }}>{emoji}</span>
            <span style={{ fontSize: 10, color: '#ffd700' }}>+{count}</span>
          </motion.div>
        ) : null
      )}
    </div>
  )
}
