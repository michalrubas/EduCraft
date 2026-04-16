// src/components/screens/ProfileScreen.tsx
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'
import { WORLDS } from '../../data/worlds'
import { SKILL_TREE } from '../../data/skills'
import { HUD } from '../hud/HUD'

export function ProfileScreen() {
  const { totalCorrect, totalAttempts, maxCombo, sessionsPlayed, unlockedWorlds, ownedItems, showcaseSlots, studentProgress, navigateTo, level, xp } = useGameStore()
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  return (
    <div className="screen" style={{ background: 'var(--mc-bg)' }}>
      <HUD />
      <div className="section-title">👤 Profil</div>

      <div style={{ padding: '4px 12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.2)', margin: '0 8px 12px 8px', borderRadius: 8 }}>
        <div style={{ fontSize: 40, background: '#ffd700', borderRadius: '50%', width: 72, height: 72, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 6, boxShadow: '0 4px 16px rgba(255, 215, 0, 0.4)', color: '#000', fontWeight: 'bold', border: '4px solid #fff' }}>
          {level}
        </div>
        <div style={{ fontSize: 16, color: '#55ff55', fontWeight: 'bold' }}>Celkem zkušeností: {xp} XP</div>
      </div>

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

        <div className="section-title" style={{ marginTop: 8 }}>🧠 Matematické dovednosti</div>
        {SKILL_TREE.map((skill, i) => {
          const state = studentProgress[skill.id]
          const pct = Math.round(state.mastery * 100)
          const barColor = pct >= 70 ? 'var(--mc-green)' : pct >= 30 ? '#ffd700' : '#ff6b6b'
          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: state.unlocked ? 1 : 0.38, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ padding: '6px 12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                <span>{skill.icon} {skill.name}</span>
                <span style={{ color: 'var(--mc-muted)', fontSize: 11 }}>
                  {state.unlocked ? `${pct}%` : '🔒 Zamčeno'}
                </span>
              </div>
              {state.unlocked && (
                <div style={{ height: 6, background: '#222', borderRadius: 3, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 + 0.1 }}
                    style={{ height: '100%', background: barColor, borderRadius: 3 }}
                  />
                </div>
              )}
            </motion.div>
          )
        })}

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
