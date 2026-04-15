// src/components/screens/RewardScreen.tsx
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { getComboInfo } from '../../hooks/useCombo'
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

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    playSound.reward()
    timerRef.current = setTimeout(onDone, REWARD_SCREEN_DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [onDone])

  function handleSkip() {
    if (timerRef.current) clearTimeout(timerRef.current)
    onDone()
  }

  const earnedParts = [
    rewards.diamonds ? `+${rewards.diamonds} 🪙` : '',
    rewards.emeralds ? `+${rewards.emeralds} 💎` : '',
    rewards.stars    ? `+${rewards.stars} 🌑` : '',
  ].filter(Boolean).join('  ')

  return (
    <motion.div
      className="screen reward-screen"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 340, damping: 24 }}
      style={{ background: 'var(--mc-bg)' }}
    >
      <motion.div
        className="reward-check"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      >
        ✅
      </motion.div>

      <motion.p
        className="reward-title"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.08 }}
      >
        SPRÁVNĚ!
      </motion.p>

      <motion.div
        className="reward-gems"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {earnedParts}
      </motion.div>

      {combo > 2 && (
        <motion.div
          className="reward-combo-label"
          style={{ color: info.color, borderColor: info.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
        >
          {info.label}
        </motion.div>
      )}

      <motion.button
        className="pixel-btn"
        onClick={handleSkip}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        style={{ marginTop: 8 }}
      >
        Dál →
      </motion.button>
    </motion.div>
  )
}
