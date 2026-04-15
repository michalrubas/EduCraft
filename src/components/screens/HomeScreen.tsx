// src/components/screens/HomeScreen.tsx
import { motion } from 'framer-motion'
import { WORLDS } from '../../data/worlds'
import { useGameStore } from '../../store/gameStore'
import { WorldCard } from '../ui/WorldCard'
import { HUD } from '../hud/HUD'

export function HomeScreen() {
  const { unlockedWorlds, diamonds, enterWorld, unlockWorld, navigateTo } = useGameStore()

  function handleWorldPress(worldId: string, cost: number) {
    const isUnlocked = unlockedWorlds.includes(worldId)
    if (isUnlocked) {
      enterWorld(worldId)
    } else if (diamonds >= cost) {
      unlockWorld(worldId, cost)
    }
  }

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
          gap: '12px',
          padding: '12px',
          flex: 1,
        }}
      >
        {WORLDS.map((world, i) => (
          <motion.div
            key={world.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <WorldCard
              world={world}
              unlocked={unlockedWorlds.includes(world.id)}
              onPress={() => handleWorldPress(world.id, world.unlockCost)}
            />
          </motion.div>
        ))}
      </motion.div>

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
