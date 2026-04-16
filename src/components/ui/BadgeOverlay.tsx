import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'

export function BadgeOverlay() {
  const { badgePending, dismissBadge, spawnParticles } = useGameStore()
  const badge = badgePending

  if (!badge) return null

  function handleCollect(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    spawnParticles('⭐', 15, x, y)
    dismissBadge()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 350,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24, gap: 20, textAlign: 'center'
      }}
    >
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ color: '#ffd700', fontSize: 16, fontWeight: 800, letterSpacing: 2, fontFamily: 'inherit' }}
      >
        NOVÝ ODZNAK!
      </motion.p>
      
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: [0, -10, 10, -5, 5, 0] }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          width: 120, height: 120,
          background: 'radial-gradient(circle, #fff7b0 0%, #ffd700 60%, #b8860b 100%)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 64, filter: 'drop-shadow(0 0 32px #ffd700)',
          border: '4px solid #fff'
        }}
      >
        {badge.icon}
      </motion.div>

      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ color: '#fff', fontSize: 32, margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)', fontFamily: 'inherit' }}
      >
        {badge.name}
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ color: '#ccc', fontSize: 16, maxWidth: 300, fontFamily: 'inherit' }}
      >
        {badge.description}
      </motion.p>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCollect}
        className="pixel-btn"
        style={{
          marginTop: 20,
          background: '#ffd700',
          color: '#000',
          padding: '16px 32px',
          fontSize: 16,
          borderColor: '#ffed4a'
        }}
      >
        Skvělé!
      </motion.button>
    </motion.div>
  )
}
