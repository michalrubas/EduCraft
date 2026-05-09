// src/components/ui/LuckyWheel.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { WheelReward } from '../../data/types'
import { WHEEL_REWARDS } from '../../hooks/useLuckyWheel'
import { playSound } from '../../audio/sounds'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'
import { CURRENCY_ICONS } from '../../data/config'
import { Icon } from './Icon'
import { OverlayBackdrop } from './OverlayBackdrop'
import { ButtonPrimary } from './ButtonPrimary'
import { theme, block } from '../../theme'

interface Props {
  onCollect: (reward: WheelReward) => void
}

const SEGMENT_COLORS = [theme.diamond, theme.gold, theme.emerald, theme.star, theme.purple, theme.red]

export function LuckyWheel({ onCollect }: Props) {
  const [spinning, setSpinning] = useState(false)
  const [resultReward, setResultReward] = useState<WheelReward | null>(null)
  const [rotation, setRotation] = useState(0)

  const segmentAngle = 360 / WHEEL_REWARDS.length

  function spin() {
    if (spinning || resultReward !== null) return
    const pickedIdx = Math.floor(Math.random() * WHEEL_REWARDS.length)
    const targetAngle = 360 * 10 + (360 - pickedIdx * segmentAngle - segmentAngle / 2)
    setSpinning(true)
    setRotation(prev => prev + targetAngle)
    playSound.wheel()
    setTimeout(() => {
      setSpinning(false)
      let picked = WHEEL_REWARDS[pickedIdx]
      if (picked.itemId === 'random') {
        const s = useGameStore.getState()
        const available = SHOP_ITEMS.filter(i => !s.ownedItems.includes(i.id))
        if (available.length > 0) {
          const resolved = available[Math.floor(Math.random() * available.length)]
          picked = { ...picked, itemId: resolved.id, label: `🎁 ${resolved.name}` }
        } else {
          picked = { ...picked, itemId: undefined, diamonds: 50, label: `💎 +50 (Náhrada za vše)` }
        }
      }
      setResultReward(picked)
    }, 4600)
  }

  return (
    <OverlayBackdrop>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{
          background: theme.card, border: `4px solid ${theme.cardEdge}`,
          borderRadius: 22, padding: '20px', boxShadow: block(6),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          maxWidth: 320, width: '100%',
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 900, color: theme.goldDeep, letterSpacing: 1 }}>
          🎡 Šťastné kolo
        </div>

        <div style={{ position: 'relative', width: 220, height: 220 }}>
          {/* Red pointer */}
          <div style={{
            position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: `16px solid ${theme.red}`,
            zIndex: 10,
          }} />

          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 4.5, ease: [0.0, 0.0, 0.2, 1.0] }}
            style={{
              width: 220, height: 220, borderRadius: '50%',
              border: `4px solid ${theme.cardEdge}`,
              overflow: 'hidden', position: 'relative',
            }}
          >
            <svg viewBox="0 0 100 100" width="220" height="220">
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
                const rotate = `rotate(${i * segmentAngle + segmentAngle / 2}, ${tx}, ${ty})`

                const segIcon = reward.diamonds ? CURRENCY_ICONS.diamonds
                  : reward.emeralds ? CURRENCY_ICONS.emeralds
                  : reward.stars ? CURRENCY_ICONS.stars
                  : null
                const segAmount = reward.diamonds ? `+${reward.diamonds}`
                  : reward.emeralds ? `+${reward.emeralds}`
                  : reward.stars ? `+${reward.stars}`
                  : null
                const isImg = segIcon?.startsWith('/')

                return (
                  <g key={i}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                      stroke={theme.cardEdge}
                      strokeWidth="0.8"
                    />
                    <g transform={rotate}>
                      {segIcon && segAmount ? (
                        isImg ? (
                          <>
                            <image href={segIcon} x={tx - 5} y={ty - 10} width="10" height="10" />
                            <text x={tx} y={ty + 5} textAnchor="middle" dominantBaseline="middle" fontSize="6" fill="#fff" style={{ fontFamily: 'monospace' }}>{segAmount}</text>
                          </>
                        ) : (
                          <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#fff" style={{ fontFamily: 'monospace' }}>{`${segIcon} ${segAmount}`}</text>
                        )
                      ) : (
                        <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#fff" style={{ fontFamily: 'monospace' }}>{reward.label}</text>
                      )}
                    </g>
                  </g>
                )
              })}
              {/* Gold center circle */}
              <circle cx="50" cy="50" r="8" fill={theme.gold} stroke={theme.cardEdge} strokeWidth="1.5" />
            </svg>
          </motion.div>
        </div>

        {resultReward === null ? (
          <ButtonPrimary onClick={spin}>
            {spinning ? '...' : 'ROZTOČIT'}
          </ButtonPrimary>
        ) : (() => {
          const r = resultReward
          let bigIcon = r.diamonds ? CURRENCY_ICONS.diamonds : r.emeralds ? CURRENCY_ICONS.emeralds : r.stars ? CURRENCY_ICONS.stars : '🎁'
          if (r.itemId) {
            const item = SHOP_ITEMS.find(i => i.id === r.itemId)
            if (item) bigIcon = item.icon
          }
          return (
            <motion.div
              initial={{ scale: 0, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 360, damping: 22 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
            >
              <motion.div
                style={{ lineHeight: 1, filter: `drop-shadow(0 0 24px ${theme.gold})` }}
                animate={{ rotate: [0, -12, 12, -6, 6, 0] }}
                transition={{ delay: 0.25, duration: 0.55 }}
              >
                <Icon src={bigIcon} size={72} />
              </motion.div>
              <motion.p
                style={{ fontSize: 24, fontWeight: 900, color: theme.ink, textAlign: 'center', letterSpacing: 1 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                🎉 {r.label}
              </motion.p>
              <ButtonPrimary onClick={(e) => {
                const rect = (e as React.MouseEvent).currentTarget.getBoundingClientRect()
                const x = rect.left + rect.width / 2
                const y = rect.top + rect.height / 2
                const { spawnParticles } = useGameStore.getState()
                if (r.diamonds) spawnParticles(CURRENCY_ICONS.diamonds, Math.min(r.diamonds, 15), x, y)
                if (r.emeralds) spawnParticles(CURRENCY_ICONS.emeralds, Math.min(r.emeralds, 10), x, y)
                if (r.stars) spawnParticles(CURRENCY_ICONS.stars, Math.min(r.stars, 5), x, y)
                onCollect(r)
              }}>
                ✓ VZÍT ODMĚNU
              </ButtonPrimary>
            </motion.div>
          )
        })()}
      </motion.div>
    </OverlayBackdrop>
  )
}
