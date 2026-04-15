// src/components/screens/ProfileScreen.tsx
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'
import { WORLDS } from '../../data/worlds'
import { HUD } from '../hud/HUD'

export function ProfileScreen() {
  const { totalCorrect, totalAttempts, maxCombo, sessionsPlayed, unlockedWorlds, ownedItems, showcaseSlots, navigateTo } = useGameStore()
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  return (
    <div className="screen" style={{ background: 'var(--mc-bg)' }}>
      <HUD />
      <div className="section-title">👤 Profil</div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        <div className="stat-row"><span className="label">Správných odpovědí</span><span className="value">{totalCorrect}</span></div>
        <div className="stat-row"><span className="label">Přesnost</span><span className="value">{accuracy} %</span></div>
        <div className="stat-row"><span className="label">Nejlepší combo</span><span className="value">🔥 {maxCombo}</span></div>
        <div className="stat-row"><span className="label">Odehraných sezení</span><span className="value">{sessionsPlayed}</span></div>
        <div className="stat-row"><span className="label">Odemčené světy</span><span className="value">{unlockedWorlds.length} / {WORLDS.length}</span></div>
        <div className="stat-row"><span className="label">Sbírka</span><span className="value">{ownedItems.length} / {SHOP_ITEMS.length}</span></div>

        <div className="section-title" style={{ marginTop: 8 }}>🖼️ Moje vitrína</div>
        <motion.div
          className="showcase-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {showcaseSlots.map((itemId, slot) => {
            const item = itemId ? SHOP_ITEMS.find(i => i.id === itemId) : null
            return (
              <motion.div
                key={slot}
                className={`showcase-slot ${item ? 'filled' : 'empty'}`}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: slot * 0.04 }}
              >
                {item ? item.icon : '?'}
              </motion.div>
            )
          })}
        </motion.div>

        <div className="section-title">🌍 Světy</div>
        {WORLDS.map(world => (
          <div key={world.id} className="stat-row">
            <span className="label">{world.icon} {world.name}</span>
            <span className="value" style={{ color: unlockedWorlds.includes(world.id) ? 'var(--mc-green)' : 'var(--mc-muted)' }}>
              {unlockedWorlds.includes(world.id) ? '✓ Odemčeno' : '🔒'}
            </span>
          </div>
        ))}
      </div>

      <div className="bottom-nav">
        <button className="nav-btn" onClick={() => navigateTo('home')}>
          <span>🌍</span><span>Světy</span>
        </button>
        <button className="nav-btn" onClick={() => navigateTo('shop')}>
          <span>🏪</span><span>Obchod</span>
        </button>
        <button className="nav-btn active">
          <span>👤</span><span>Profil</span>
        </button>
      </div>
    </div>
  )
}
