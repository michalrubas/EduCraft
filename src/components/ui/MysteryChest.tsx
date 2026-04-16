// src/components/ui/MysteryChest.tsx
import { useState, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { WheelReward } from '../../data/types'
import { playSound } from '../../audio/sounds'
import { CURRENCY_ICONS } from '../../data/config'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'

interface Props {
  onCollect: (reward: WheelReward) => void
}

type ChestType = 'bronze' | 'silver' | 'gold' | 'diamond'

const CHEST_TIERS: Record<ChestType, {
  label: string
  color: string
  bgColor: string
  rewards: WheelReward[]
}> = {
  bronze: {
    label: '🥉 Bronzová truhla',
    color: '#cd7f32',
    bgColor: '#3d2010',
    rewards: [
      { label: '💰 +5',  diamonds: 5 },
      { label: '💰 +8',  diamonds: 8 },
      { label: '💰 +12', diamonds: 12 },
    ],
  },
  silver: {
    label: '🥈 Stříbrná truhla',
    color: '#c0c0c0',
    bgColor: '#1e2030',
    rewards: [
      { label: '💰 +20', diamonds: 20 },
      { label: '💎 +1',  emeralds: 1 },
      { label: '🎁 Předmět', itemId: 'random' },
    ],
  },
  gold: {
    label: '🥇 Zlatá truhla',
    color: '#ffd700',
    bgColor: '#2d2000',
    rewards: [
      { label: '💎 +2',  emeralds: 2 },
      { label: '💎 +3',  emeralds: 3 },
      { label: '💰 +30', diamonds: 30 },
      { label: '🎁 Předmět', itemId: 'random' },
    ],
  },
  diamond: {
    label: '💎 Diamantová truhla',
    color: '#5de8fc',
    bgColor: '#002028',
    rewards: [
      { label: '💎 +5',  emeralds: 5 },
      { label: '⬛ +1',  stars: 1 },
      { label: '💰 +50', diamonds: 50 },
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
        const available = SHOP_ITEMS.filter(i => !s.ownedItems.includes(i.id))
        if (available.length > 0) {
          const resolved = available[Math.floor(Math.random() * available.length)]
          picked = { ...picked, itemId: resolved.id, label: `🎁 ${resolved.name}` }
        } else {
          picked = { ...picked, itemId: undefined, diamonds: 50, label: `${CURRENCY_ICONS.diamonds} +50 (Náhrada za vše)` }
        }
      }
      setReward(picked)
      setOpened(true)
      playSound.reward()
    }
  }

  let bigIcon = reward?.diamonds ? CURRENCY_ICONS.diamonds : reward?.emeralds ? CURRENCY_ICONS.emeralds : reward?.stars ? CURRENCY_ICONS.stars : '🎁'
  if (reward?.itemId) {
    const item = SHOP_ITEMS.find(i => i.id === reward.itemId)
    if (item) bigIcon = item.icon
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.90)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 20, padding: 24,
      }}
    >
      <p style={{ fontSize: 14, color: tier.color, fontFamily: 'inherit', fontWeight: 800, letterSpacing: 1 }}>
        📦 ZÁHADNÁ TRUHLA!
      </p>
      <p style={{ fontSize: 20, color: tier.color, fontFamily: 'inherit', fontWeight: 800 }}>
        {tier.label}
      </p>

      {!opened ? (
        <>
          <motion.div
            animate={controls}
            onClick={handleTap}
            style={{
              cursor: 'pointer',
              filter: `drop-shadow(0 0 24px ${tier.color})`,
              userSelect: 'none',
              transformOrigin: 'center bottom',
            }}
          >
            <img src="/assets/items/bauzin.png" alt="Truhla" style={{ width: 140, height: 140, objectFit: 'contain' }} />
          </motion.div>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'inherit', textAlign: 'center' }}>
            Ťukni ještě <span style={{ color: tier.color }}>{tapsLeft}×</span>
          </p>
          <p style={{ fontSize: 13, color: '#8a9a8a', fontFamily: 'inherit' }}>
            (ťukni na truhlu)
          </p>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 22 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
        >
          <motion.div
            style={{ fontSize: 72, lineHeight: 1, filter: `drop-shadow(0 0 28px ${tier.color})` }}
            animate={{ rotate: [0, -12, 12, -6, 6, 0] }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            {bigIcon}
          </motion.div>
          <motion.p
            style={{ fontSize: 30, fontWeight: 800, color: tier.color, fontFamily: 'inherit', textAlign: 'center', letterSpacing: 2 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            🎉 {reward?.label}
          </motion.p>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const x = rect.left + rect.width / 2
              const y = rect.top + rect.height / 2
              const { spawnParticles } = useGameStore.getState()
              if (reward?.diamonds) spawnParticles('💰', Math.min(reward.diamonds, 15), x, y)
              if (reward?.emeralds) spawnParticles('💎', Math.min(reward.emeralds, 10), x, y)
              if (reward?.stars) spawnParticles('⬛', Math.min(reward.stars, 5), x, y)
              onCollect(reward!)
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              padding: '14px 36px', fontSize: 14, fontWeight: 800,
              background: tier.bgColor, border: `3px solid ${tier.color}`,
              borderRadius: 6, color: tier.color, cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ✓ VZÍT ODMĚNU
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
