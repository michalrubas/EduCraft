import { motion } from 'framer-motion'
import { playSound } from '../../audio/sounds'
import { useGameStore } from '../../store/gameStore'
import { getLevelReward } from '../../data/levels'
import { CURRENCY_ICONS } from '../../data/config'
import { useEffect } from 'react'
import { OverlayBackdrop } from './OverlayBackdrop'
import { ButtonPrimary } from './ButtonPrimary'
import { RewardChip } from './RewardChip'
import { theme, block } from '../../theme'

export function LevelUpOverlay() {
  const { level, collectLevelUpReward, spawnParticles } = useGameStore()
  const reward = getLevelReward(level)

  useEffect(() => {
    playSound.reward()
  }, [])

  function handleCollect(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    if (reward.diamonds > 0) spawnParticles(CURRENCY_ICONS.diamonds, Math.min(reward.diamonds, 15), x, y)
    if (reward.emeralds > 0) spawnParticles(CURRENCY_ICONS.emeralds, Math.min(reward.emeralds, 10), x, y)
    collectLevelUpReward()
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
          maxWidth: 320, width: '100%',
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 900, color: theme.goldDeep, letterSpacing: 2 }}>
          ★ NOVÝ LEVEL ★
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            width: 110, height: 110, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #fff5b8, #f5b90d 60%, #b67806 100%)',
            border: `4px solid ${theme.cardEdge}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, fontWeight: 900, color: '#fff',
            textShadow: '0 3px 0 rgba(0,0,0,0.3)',
            boxShadow: block(4, theme.goldDeep),
          }}
        >
          {level}
        </motion.div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: theme.ink }}>Level {level}!</div>
          <div style={{ fontSize: 13, color: theme.inkSoft, fontWeight: 800 }}>Skvělá práce! Pokračuj dál!</div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ display: 'flex', gap: 8 }}
        >
          {reward.diamonds > 0 && <RewardChip icon="💎" value={`+${reward.diamonds}`} tint={theme.diamond} />}
          {reward.emeralds > 0 && <RewardChip icon="🟢" value={`+${reward.emeralds}`} tint={theme.emerald} />}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <ButtonPrimary onClick={handleCollect}>Super! 🎉</ButtonPrimary>
        </motion.div>
      </motion.div>
    </OverlayBackdrop>
  )
}
