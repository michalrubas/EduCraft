// src/components/screens/RewardScreen.tsx
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { REWARD_SCREEN_DURATION, COMBO_REWARDS, getComboLevel } from '../../data/config'
import { ScreenShell } from '../ui/ScreenShell'
import { Cloud } from '../ui/Cloud'
import { RewardChip } from '../ui/RewardChip'
import { theme, block, blockInset, skyFull } from '../../theme'
import { playSound } from '../../audio/sounds'

interface Props { onDone: () => void }

export function RewardScreen({ onDone }: Props) {
  const { combo } = useGameStore()
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

  return (
    <ScreenShell background={skyFull}>
      <Cloud style={{ top: 60, left: 30, opacity: 0.7 }} />
      <Cloud style={{ top: 100, right: 20, opacity: 0.5, transform: 'scale(0.8)' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, padding: '20px 24px' }}>
        {/* Big check on a glowing ray burst */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', top: 0, left: 0 }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2
              const x1 = 90 + Math.cos(a) * 40, y1 = 90 + Math.sin(a) * 40
              const x2 = 90 + Math.cos(a) * 85, y2 = 90 + Math.sin(a) * 85
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.gold} strokeWidth="6" strokeLinecap="round" opacity="0.8" />
            })}
          </svg>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: theme.grass1, border: `5px solid ${theme.cardEdge}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 70, position: 'relative', zIndex: 1,
            boxShadow: blockInset,
          }}>✓</div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
          style={{
            fontSize: 32, fontWeight: 900, color: theme.ink,
            textShadow: '0 2px 0 rgba(255,255,255,0.5)', letterSpacing: 1,
          }}
        >
          SUPER!
        </motion.div>

        {/* Reward chips */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{ display: 'flex', gap: 8 }}
        >
          {rewards.diamonds && <RewardChip icon="💎" value={`+${rewards.diamonds}`} tint={theme.diamond} />}
          {rewards.emeralds && <RewardChip icon="🟢" value={`+${rewards.emeralds}`} tint={theme.emerald} />}
          {rewards.stars && <RewardChip icon="⭐" value={`+${rewards.stars}`} tint={theme.star} />}
        </motion.div>

        {/* Combo flame card */}
        {combo > 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260 }}
            style={{
              background: theme.card, border: `3px solid ${theme.cardEdge}`, borderRadius: 14,
              padding: '8px 16px', boxShadow: block(3),
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <span style={{ fontSize: 22 }}>🔥</span>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: theme.inkSoft }}>SÉRIE</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: theme.ink, lineHeight: 1 }}>{combo}× v řadě</div>
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={handleSkip}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          whileTap={{ scale: 0.94 }}
          style={{
            background: theme.gold, border: `3px solid ${theme.cardEdge}`,
            borderRadius: 14, padding: '10px 22px', marginTop: 8,
            fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900,
            color: theme.ink, cursor: 'pointer', boxShadow: block(4, theme.goldDeep),
          }}
        >
          Dál →
        </motion.button>
      </div>
    </ScreenShell>
  )
}
