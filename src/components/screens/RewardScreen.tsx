// src/components/screens/RewardScreen.tsx
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { getComboInfo } from '../../hooks/useCombo'
import { GemBurst } from '../ui/GemBurst'
import { REWARD_SCREEN_DURATION, COMBO_REWARDS, getComboLevel } from '../../data/config'
import { playSound } from '../../audio/sounds'

interface Props {
  onDone: () => void
}

export function RewardScreen({ onDone }: Props) {
  const { combo } = useGameStore()
  const info = getComboInfo(combo)
  const level = getComboLevel(combo)
  const rewards = COMBO_REWARDS[level]

  useEffect(() => {
    playSound.reward()
    const t = setTimeout(onDone, REWARD_SCREEN_DURATION)
    return () => clearTimeout(t)
  }, [onDone])

  const gems = [
    { emoji: '💎', count: rewards.diamonds ?? 0 },
    { emoji: '💚', count: rewards.emeralds ?? 0 },
    { emoji: '⭐', count: rewards.stars ?? 0 },
  ]

  return (
    <motion.div
      className="screen reward-screen"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      style={{ background: 'var(--mc-bg)' }}
    >
      <motion.p
        className="reward-title"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        SPRÁVNĚ! ✓
      </motion.p>

      {combo > 2 && (
        <motion.div
          className="reward-combo-label"
          style={{ color: info.color, borderColor: info.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260 }}
        >
          {info.label}
        </motion.div>
      )}

      <GemBurst gems={gems} />
    </motion.div>
  )
}
