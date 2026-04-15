// src/components/ui/LuckyWheel.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { WheelReward } from '../../data/types'
import { WHEEL_REWARDS } from '../../hooks/useLuckyWheel'
import { playSound } from '../../audio/sounds'

interface Props {
  onCollect: (reward: WheelReward) => void
}

const SEGMENT_COLORS = ['#2d6d44', '#1a3d88', '#6d2d44', '#6d5a2d', '#2d4d6d']

export function LuckyWheel({ onCollect }: Props) {
  const [spinning, setSpinning] = useState(false)
  const [resultIdx, setResultIdx] = useState<number | null>(null)
  const [rotation, setRotation] = useState(0)

  const segmentAngle = 360 / WHEEL_REWARDS.length

  function spin() {
    if (spinning || resultIdx !== null) return
    const picked = Math.floor(Math.random() * WHEEL_REWARDS.length)
    const targetAngle = 360 * 5 + (360 - picked * segmentAngle - segmentAngle / 2)
    setSpinning(true)
    setRotation(prev => prev + targetAngle)
    playSound.wheel()
    setTimeout(() => {
      setSpinning(false)
      setResultIdx(picked)
    }, 2200)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 24, padding: 24,
      }}
    >
      <p style={{ fontSize: 14, color: '#ffd700', fontFamily: 'inherit' }}>
        🎡 KOLO ŠTĚSTÍ!
      </p>

      <div style={{ position: 'relative', width: 240, height: 240 }}>
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          fontSize: 24, zIndex: 10,
        }}>▼</div>

        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            width: 240, height: 240,
            borderRadius: '50%',
            border: '4px solid #ffd700',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <svg viewBox="0 0 100 100" width="240" height="240">
            {WHEEL_REWARDS.map((reward, i) => {
              const startAngle = (i * segmentAngle - 90) * (Math.PI / 180)
              const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180)
              const x1 = 50 + 50 * Math.cos(startAngle)
              const y1 = 50 + 50 * Math.sin(startAngle)
              const x2 = 50 + 50 * Math.cos(endAngle)
              const y2 = 50 + 50 * Math.sin(endAngle)
              const midAngle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180)
              const tx = 50 + 32 * Math.cos(midAngle)
              const ty = 50 + 32 * Math.sin(midAngle)
              return (
                <g key={i}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                    stroke="#0d1b0f"
                    strokeWidth="0.5"
                  />
                  <text
                    x={tx} y={ty}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="8" fill="#fff"
                    transform={`rotate(${i * segmentAngle + segmentAngle / 2}, ${tx}, ${ty})`}
                    style={{ fontFamily: 'monospace' }}
                  >
                    {reward.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </motion.div>
      </div>

      {resultIdx === null ? (
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={spin}
          disabled={spinning}
          style={{
            padding: '14px 32px', fontSize: 14,
            background: '#2d6d44', border: '3px solid #5dfc8c',
            borderRadius: 6, color: '#fff', cursor: 'pointer',
            fontFamily: 'inherit', opacity: spinning ? 0.6 : 1,
          }}
        >
          {spinning ? '...' : '🎡 TOČIT!'}
        </motion.button>
      ) : (() => {
        const r = WHEEL_REWARDS[resultIdx!]
        const bigIcon = r.diamonds ? '💰' : r.emeralds ? '💎' : r.stars ? '⬛' : '🎁'
        const rewardText = r.diamonds ? `+${r.diamonds} 💰` : r.emeralds ? `+${r.emeralds} 💎` : r.stars ? `+${r.stars} ⬛` : '🎁 Překvapení!'
        return (
          <motion.div
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
          >
            <motion.div
              style={{ fontSize: 72, lineHeight: 1, filter: 'drop-shadow(0 0 24px #ffd700)' }}
              animate={{ rotate: [0, -12, 12, -6, 6, 0] }}
              transition={{ delay: 0.25, duration: 0.55 }}
            >
              {bigIcon}
            </motion.div>
            <motion.p
              style={{ fontSize: 30, fontWeight: 800, color: '#ffd700', fontFamily: 'inherit', textAlign: 'center', letterSpacing: 2 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {rewardText}
            </motion.p>
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={() => onCollect(r)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                padding: '14px 36px', fontSize: 14, fontWeight: 800,
                background: '#7a5c00', border: '3px solid #ffd700',
                borderRadius: 6, color: '#ffd700', cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ✓ VZÍT ODMĚNU
            </motion.button>
          </motion.div>
        )
      })()}
    </motion.div>
  )
}
