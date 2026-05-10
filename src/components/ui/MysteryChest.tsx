// src/components/ui/MysteryChest.tsx
import { useState, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { WheelReward } from '../../data/types'
import { playSound } from '../../audio/sounds'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'
import chestImg from '/assets/items/bauzin.png'
import { OverlayBackdrop } from './OverlayBackdrop'
import { ButtonPrimary } from './ButtonPrimary'
import { theme, block } from '../../theme'

interface Props {
  onCollect: (reward: WheelReward) => void
}

type ChestType = 'bronze' | 'silver' | 'gold' | 'diamond'

const CHEST_TIERS: Record<ChestType, {
  label: string
  color: string
  rewards: WheelReward[]
}> = {
  bronze: {
    label: '🥉 Bronzová truhla',
    color: '#cd7f32',
    rewards: [
      { label: '💎 +5',  diamonds: 5 },
      { label: '💎 +8',  diamonds: 8 },
      { label: '💎 +12', diamonds: 12 },
    ],
  },
  silver: {
    label: '🥈 Stříbrná truhla',
    color: '#c0c0c0',
    rewards: [
      { label: '💎 +20', diamonds: 20 },
      { label: '🟢 +1',  emeralds: 1 },
      { label: '🎁 Předmět', itemId: 'random' },
    ],
  },
  gold: {
    label: '🥇 Zlatá truhla',
    color: '#ffd700',
    rewards: [
      { label: '🟢 +2',  emeralds: 2 },
      { label: '🟢 +3',  emeralds: 3 },
      { label: '💎 +30', diamonds: 30 },
      { label: '🎁 Předmět', itemId: 'random' },
    ],
  },
  diamond: {
    label: '💎 Diamantová truhla',
    color: '#5de8fc',
    rewards: [
      { label: '🟢 +5',  emeralds: 5 },
      { label: '⭐ +1',  stars: 1 },
      { label: '💎 +50', diamonds: 50 },
      { label: '🎁 Vzácný předmět', itemId: 'random' },
    ],
  },
}

function pickChestType(): ChestType {
  const roll = Math.random()
  if (roll < 0.50) return 'bronze'
  if (roll < 0.80) return 'silver'
  if (roll < 0.95) return 'gold'
  return 'diamond'
}

export function MysteryChest({ onCollect }: Props) {
  const [chestType] = useState<ChestType>(pickChestType)
  const tapsLeftRef = useRef(Math.floor(Math.random() * 3) + 3)
  const [tapsLeft, setTapsLeft] = useState(tapsLeftRef.current)
  const [opened, setOpened] = useState(false)
  const [reward, setReward] = useState<WheelReward | null>(null)
  const controls = useAnimation()
  const tier = CHEST_TIERS[chestType]

  function handleTap() {
    if (opened || tapsLeftRef.current <= 0) return
    playSound.correct()
    controls.start({
      rotate: [-8, 8, -6, 6, -3, 0],
      y: [0, -14, 0],
      transition: { duration: 0.32 },
    })
    tapsLeftRef.current -= 1
    const next = tapsLeftRef.current
    setTapsLeft(next)
    if (next === 0) {
      let picked = tier.rewards[Math.floor(Math.random() * tier.rewards.length)]
      if (picked.itemId === 'random') {
        const s = useGameStore.getState()
        const available = SHOP_ITEMS.filter(i => !i.shopOnly && !s.ownedItems.includes(i.id))
        if (available.length > 0) {
          const resolved = available[Math.floor(Math.random() * available.length)]
          picked = { ...picked, itemId: resolved.id, label: `🎁 ${resolved.name}` }
        } else {
          picked = { ...picked, itemId: undefined, diamonds: 50, label: '💎 +50 (Náhrada za vše)' }
        }
      }
      setReward(picked)
      setOpened(true)
      playSound.reward()
    }
  }

  let bigIcon = reward?.diamonds ? '💎' : reward?.emeralds ? '🟢' : reward?.stars ? '⭐' : '🎁'
  const bigTint = reward?.diamonds ? theme.diamond : reward?.emeralds ? theme.emerald : reward?.stars ? theme.star : theme.gold
  if (reward?.itemId) {
    const item = SHOP_ITEMS.find(i => i.id === reward.itemId)
    if (item) bigIcon = item.icon
  }

  return (
    <OverlayBackdrop>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        style={{
          background: theme.card, border: `4px solid ${theme.cardEdge}`,
          borderRadius: 22, padding: '24px 20px', boxShadow: block(6),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          maxWidth: 320, width: '100%',
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 900, color: theme.goldDeep, letterSpacing: 1 }}>
          TAJEMNÁ TRUHLA
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: theme.inkSoft }}>
          {tier.label}
        </div>

        {!opened ? (
          <>
            <div style={{ position: 'relative' }}>
              {/* Sparkles */}
              <span style={{ position: 'absolute', top: -10, left: -10, fontSize: 20 }}>✨</span>
              <span style={{ position: 'absolute', top: 10, right: -14, fontSize: 18 }}>✨</span>
              <span style={{ position: 'absolute', bottom: -5, left: 20, fontSize: 16 }}>✨</span>
              <motion.div
                animate={controls}
                onClick={handleTap}
                style={{
                  cursor: 'pointer',
                  filter: `drop-shadow(0 0 6px ${tier.color})`,
                  userSelect: 'none',
                  transformOrigin: 'center bottom',
                }}
              >
                <img src={chestImg} alt="Truhla" style={{ width: 120, height: 120, objectFit: 'contain', imageRendering: 'pixelated' }} />
              </motion.div>
            </div>
            <div style={{
              background: theme.card, border: `3px solid ${theme.cardEdge}`,
              borderRadius: 14, padding: '8px 16px', boxShadow: block(3),
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: theme.ink }}>
                Ťukni ještě <span style={{ color: theme.gold }}>{tapsLeft}×</span>
              </div>
              <div style={{ fontSize: 11, color: theme.inkSoft, fontWeight: 800 }}>(ťukni na truhlu)</div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 22 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
          >
            <motion.div
              style={{ lineHeight: 1 }}
              animate={{ rotate: [0, -12, 12, -6, 6, 0] }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <span style={{
                fontSize: 40, width: 72, height: 72,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: bigTint, borderRadius: '50%',
                border: `3px solid ${theme.cardEdge}`,
                boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.25), inset 3px 3px 0 rgba(255,255,255,0.4)',
              }}>
                {bigIcon.startsWith('/') ? <img src={bigIcon} alt="" style={{ width: 44, height: 44, objectFit: 'contain' }} /> : bigIcon}
              </span>
            </motion.div>
            <motion.p
              style={{ fontSize: 24, fontWeight: 900, color: theme.ink, textAlign: 'center', letterSpacing: 1 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
            >
              🎉 {reward?.label}
            </motion.p>
            <ButtonPrimary onClick={(e) => {
              const rect = (e as React.MouseEvent).currentTarget.getBoundingClientRect()
              const x = rect.left + rect.width / 2
              const y = rect.top + rect.height / 2
              const { spawnParticles } = useGameStore.getState()
              if (reward?.diamonds) spawnParticles('💎', Math.min(reward.diamonds, 15), x, y)
              if (reward?.emeralds) spawnParticles('🟢', Math.min(reward.emeralds, 10), x, y)
              if (reward?.stars) spawnParticles('⭐', Math.min(reward.stars, 5), x, y)
              onCollect(reward!)
            }}>
              ✓ VZÍT ODMĚNU
            </ButtonPrimary>
          </motion.div>
        )}
      </motion.div>
    </OverlayBackdrop>
  )
}
