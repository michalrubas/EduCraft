// src/components/screens/HomeScreen.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WORLDS } from '../../data/worlds'
import { useGameStore } from '../../store/gameStore'
import { WorldCard } from '../ui/WorldCard'
import { HUD } from '../hud/HUD'

export function HomeScreen() {
  const { unlockedWorlds, diamonds, emeralds, stars, enterWorld, unlockWorld, navigateTo } = useGameStore()
  const wallet = { diamonds, emeralds, stars }
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [unlockedId, setUnlockedId] = useState<string | null>(null)

  function handleWorldPress(worldId: string, cost: number, currency: 'diamonds' | 'emeralds' | 'stars') {
    const isUnlocked = unlockedWorlds.includes(worldId)
    if (isUnlocked) {
      enterWorld(worldId)
    } else if (wallet[currency] >= cost) {
      unlockWorld(worldId, cost, currency)
      setUnlockedId(worldId)
      setTimeout(() => setUnlockedId(null), 2200)
    } else {
      setShakeId(worldId)
      setTimeout(() => setShakeId(null), 500)
    }
  }

  const unlockedWorld = unlockedId ? WORLDS.find(w => w.id === unlockedId) : null

  return (
    <div className="screen" style={{ background: 'var(--mc-bg)' }}>
      <HUD />
      <div className="section-title">Vyber svět 🌍</div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          alignContent: 'start',
          gap: '12px',
          padding: '12px',
          flex: 1,
        }}
      >
        {WORLDS.map((world, i) => (
          <motion.div
            key={world.id}
            initial={{ opacity: 0, y: 30 }}
            animate={shakeId === world.id
              ? { x: [0, -10, 10, -10, 10, -5, 5, 0] }
              : { opacity: 1, y: 0, x: 0 }
            }
            transition={shakeId === world.id
              ? { duration: 0.4 }
              : { delay: i * 0.08 }
            }
            style={{ height: '100%' }}
          >
            <WorldCard
              world={world}
              unlocked={unlockedWorlds.includes(world.id)}
              onPress={() => handleWorldPress(world.id, world.unlockCost, world.unlockCurrency ?? 'diamonds')}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Unlock overlay */}
      <AnimatePresence>
        {unlockedWorld && (
          <motion.div
            key="unlock-overlay"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.75)',
              zIndex: 50,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: [0.5, 1.3, 1], rotate: [- 15, 10, 0] }}
              transition={{ duration: 0.5 }}
              style={{ fontSize: 72, marginBottom: 16 }}
            >
              🔓
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: 28, fontWeight: 900, letterSpacing: 1,
                color: unlockedWorld.accentColor,
                textShadow: `0 0 20px ${unlockedWorld.accentColor}`,
                marginBottom: 8,
              }}
            >
              {unlockedWorld.icon.startsWith('/') ? '' : unlockedWorld.icon} {unlockedWorld.name}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: 14, color: '#aaa' }}
            >
              Odemčeno!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bottom-nav">
        <button className="nav-btn active">
          <span>🌍</span><span>Světy</span>
        </button>
        <button className="nav-btn" onClick={() => navigateTo('shop')}>
          <span>🏪</span><span>Obchod</span>
        </button>
        <button className="nav-btn" onClick={() => navigateTo('profile')}>
          <span>👤</span><span>Profil</span>
        </button>
      </div>
    </div>
  )
}
