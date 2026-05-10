import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { OverlayBackdrop } from './OverlayBackdrop'
import { ButtonPrimary } from './ButtonPrimary'
import { theme, block } from '../../theme'

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
    <OverlayBackdrop>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{
          background: theme.card, border: `4px solid ${theme.cardEdge}`,
          borderRadius: 22, padding: '28px 24px', boxShadow: block(6),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          maxWidth: 320, width: '100%', textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 900, color: theme.goldDeep, letterSpacing: 2 }}>
          NOVÝ ODZNAK!
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: 110, height: 110,
            background: 'radial-gradient(circle at 30% 30%, #fff5b8, #f5b90d 60%, #b67806 100%)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 56,
            border: `4px solid ${theme.cardEdge}`,
            boxShadow: block(4, theme.goldDeep),
          }}
        >
          {badge.icon}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 26, fontWeight: 900, color: theme.ink, fontFamily: 'inherit' }}
        >
          {badge.name}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: 14, color: theme.inkSoft, fontWeight: 700, maxWidth: 260, fontFamily: 'inherit' }}
        >
          {badge.description}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ButtonPrimary onClick={handleCollect}>Skvělé! 🎉</ButtonPrimary>
        </motion.div>
      </motion.div>
    </OverlayBackdrop>
  )
}
