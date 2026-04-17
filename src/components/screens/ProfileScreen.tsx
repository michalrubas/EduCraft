// src/components/screens/ProfileScreen.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'
import { WORLDS } from '../../data/worlds'
import { SKILL_TREE } from '../../data/skills'
import { BADGES } from '../../data/badges'
import { HUD } from '../hud/HUD'
import { CHILD_ID_KEY } from '../../hooks/useSupabaseSync'

export function ProfileScreen() {
  const { totalCorrect, totalAttempts, maxCombo, sessionsPlayed, unlockedWorlds, ownedItems, showcaseSlots, studentProgress, navigateTo, level, xp, unlockedBadges } = useGameStore()
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  const childId = localStorage.getItem(CHILD_ID_KEY) ?? '—'
  const [copied, setCopied] = useState(false)

  function copyChildId() {
    navigator.clipboard.writeText(childId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

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

        <div className="section-title" style={{ marginTop: 8 }}>👨‍👩‍👧 Rodičovský kód</div>
        <div style={{ padding: '8px 12px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--mc-muted)', flex: 1, wordBreak: 'break-all' }}>{childId}</span>
          <button
            onClick={copyChildId}
            style={{ padding: '6px 12px', fontSize: 12, background: copied ? 'var(--mc-green)' : 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 6, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {copied ? '✓ Zkopírováno' : '📋 Kopírovat'}
          </button>
        </div>

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

        <div className="section-title" style={{ marginTop: 8 }}>🏅 Moje odznaky</div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '0 8px 16px' }}
        >
          {BADGES.map((b, i) => {
            const unlocked = unlockedBadges.includes(b.id)
            return (
              <motion.div
                key={b.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  background: unlocked ? 'radial-gradient(circle, #fff7b0 0%, #ffd700 80%)' : 'rgba(255,255,255,0.05)',
                  borderRadius: 12, padding: '12px 4px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  opacity: unlocked ? 1 : 0.4,
                  filter: unlocked ? 'drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3))' : 'none',
                  border: unlocked ? '2px solid #fff' : '2px solid transparent',
                }}
                title={b.description}
              >
                <div style={{ fontSize: 32, marginBottom: 4 }}>
                  {unlocked ? b.icon : '🔒'}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: unlocked ? '#000' : '#888', lineHeight: 1.1, fontFamily: 'inherit' }}>
                  {b.name}
                </div>
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
        {WORLDS.map(world => {
          const isUrl = world.icon.startsWith('/') || world.icon.startsWith('http')
          return (
            <div key={world.id} className="stat-row">
              <span className="label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {isUrl ? <img src={world.icon} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} /> : world.icon} 
                {world.name}
              </span>
              <span className="value" style={{ color: unlockedWorlds.includes(world.id) ? 'var(--mc-green)' : 'var(--mc-muted)' }}>
                {unlockedWorlds.includes(world.id) ? '✓ Odemčeno' : '🔒'}
              </span>
            </div>
          )
        })}
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
