// src/components/screens/HomeScreen.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WORLDS } from '../../data/worlds'
import { useGameStore } from '../../store/gameStore'
import { WorldCard } from '../ui/WorldCard'
import { HUD } from '../hud/HUD'
import { ComboBar } from '../hud/ComboBar'
import { ScreenShell } from '../ui/ScreenShell'
import { Cloud } from '../ui/Cloud'
import { theme, block, skyFull } from '../../theme'

export function HomeScreen() {
  const { unlockedWorlds, currentWorldId, diamonds, emeralds, stars, combo, enterWorld, unlockWorld, navigateTo } = useGameStore()
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
    <ScreenShell background={skyFull}>
      <Cloud style={{ top: 90, left: 30, opacity: 0.85 }} />
      <Cloud style={{ top: 130, right: 20, opacity: 0.6, transform: 'scale(0.7)' }} />

      <HUD />

      <div style={{ padding: '4px 16px 8px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: theme.inkSoft, letterSpacing: 1.5 }}>TVOJE CESTA</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: theme.ink, lineHeight: 1.1 }}>Kam dnes?</div>
      </div>

      {/* Horizontal journey carousel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        position: 'relative', minHeight: 0,
      }}>
        {/* Dotted path */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <line x1="20" y1="50%" x2="95%" y2="50%" stroke={theme.cardEdge} strokeWidth="3" strokeDasharray="4 8" opacity="0.35" />
        </svg>
        <div style={{
          display: 'flex', gap: 14, overflowX: 'auto',
          padding: '24px 16px 28px', scrollbarWidth: 'none',
          width: '100%',
        }}>
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
            >
              <WorldCard
                world={world}
                unlocked={unlockedWorlds.includes(world.id)}
                isCurrent={currentWorldId === world.id || (i === 0 && !currentWorldId)}
                onPress={() => handleWorldPress(world.id, world.unlockCost, world.unlockCurrency ?? 'diamonds')}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <ComboBar combo={combo} />

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
              background: 'rgba(43, 29, 16, 0.78)',
              zIndex: 50, pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: [0.5, 1.3, 1], rotate: [-15, 10, 0] }}
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
                color: theme.gold,
                textShadow: `0 0 20px ${theme.gold}`,
                marginBottom: 8,
              }}
            >
              {unlockedWorld.icon} {unlockedWorld.name}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: 14, color: '#fff' }}
            >
              Odemčeno!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for floating nav */}
      <div style={{ height: theme.navH, flexShrink: 0 }} />

      {/* Floating bottom nav */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 22,
        display: 'flex', justifyContent: 'center', gap: 14,
        pointerEvents: 'none', zIndex: 100,
      }}>
        <motion.button
          whileTap={{ scale: 0.94 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: theme.gold, border: `3px solid ${theme.cardEdge}`,
            borderRadius: 18, padding: '8px 18px',
            fontFamily: 'Nunito, sans-serif', color: theme.ink, fontWeight: 800,
            boxShadow: block(4), cursor: 'pointer', pointerEvents: 'auto',
          }}
        >
          <span style={{ fontSize: 24 }}>🗺️</span>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.3 }}>MAPA</span>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => navigateTo('shop')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: theme.card, border: `3px solid ${theme.cardEdge}`,
            borderRadius: 18, padding: '8px 18px',
            fontFamily: 'Nunito, sans-serif', color: theme.ink, fontWeight: 800,
            boxShadow: block(4), cursor: 'pointer', pointerEvents: 'auto',
          }}
        >
          <span style={{ fontSize: 24 }}>🎒</span>
          <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 0.3 }}>BATOH</span>
        </motion.button>
      </div>
    </ScreenShell>
  )
}
