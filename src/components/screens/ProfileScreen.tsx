// src/components/screens/ProfileScreen.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'
import { WORLDS } from '../../data/worlds'
import { SKILL_TREE } from '../../data/skills'
import { BADGES } from '../../data/badges'
import { getLevelData } from '../../data/levels'
import { HUD } from '../hud/HUD'
import { ScreenShell } from '../ui/ScreenShell'
import { Cloud } from '../ui/Cloud'
import { CHILD_ID_KEY } from '../../hooks/useSupabaseSync'
import { theme, block, skyShort } from '../../theme'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 16, fontWeight: 900, color: theme.ink,
      padding: '14px 0 8px', display: 'flex', alignItems: 'center', gap: 6,
    }}>{children}</div>
  )
}

export function ProfileScreen() {
  const { totalCorrect, totalAttempts, maxCombo, sessionsPlayed, unlockedWorlds, showcaseSlots, studentProgress, navigateTo, level, xp, unlockedBadges } = useGameStore()
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  const { progressPercent } = getLevelData(xp)
  const childId = localStorage.getItem(CHILD_ID_KEY) ?? '—'
  const [copied, setCopied] = useState(false)

  function copyChildId() {
    navigator.clipboard.writeText(childId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <ScreenShell background={skyShort}>
      <Cloud style={{ top: 80, left: 24, opacity: 0.7 }} />

      <HUD />

      <div style={{ overflowY: 'auto', flex: 1, padding: '0 12px 16px' }}>
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: theme.card, border: `4px solid ${theme.cardEdge}`,
            borderRadius: 18, padding: '16px 20px',
            boxShadow: block(5),
            display: 'flex', alignItems: 'center', gap: 14,
            marginBottom: 16,
          }}
        >
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#ffd9a6', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, border: `3px solid ${theme.cardEdge}`,
            flexShrink: 0,
          }}>🧑‍🌾</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: theme.ink }}>Adínek</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: theme.inkSoft, marginBottom: 4 }}>Level {level} · {xp} XP</div>
            <div style={{
              height: 10, background: '#eadfcc', borderRadius: 5,
              overflow: 'hidden', border: `1px solid ${theme.cardEdge}`,
            }}>
              <div style={{
                height: '100%', width: `${progressPercent}%`,
                background: theme.grass1, transition: 'width 0.4s ease-out',
              }} />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <SectionTitle>📊 Statistiky</SectionTitle>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 8, marginBottom: 16,
        }}>
          {[
            { icon: '✅', label: 'Správně', value: totalCorrect },
            { icon: '🎯', label: 'Přesnost', value: `${accuracy}%` },
            { icon: '🔥', label: 'Max combo', value: maxCombo },
            { icon: '🎮', label: 'Sezení', value: sessionsPlayed },
          ].map(stat => (
            <div key={stat.label} style={{
              background: theme.card, border: `3px solid ${theme.cardEdge}`,
              borderRadius: 12, padding: '10px 12px',
              boxShadow: block(3),
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 22, marginBottom: 2 }}>{stat.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: theme.ink }}>{stat.value}</div>
              <div style={{ fontSize: 10, fontWeight: 800, color: theme.inkSoft }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <SectionTitle>🏅 Odznaky</SectionTitle>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8, marginBottom: 16,
        }}>
          {BADGES.map((b, i) => {
            const unlocked = unlockedBadges.includes(b.id)
            return (
              <motion.div
                key={b.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                title={b.description}
                style={{
                  background: unlocked ? theme.card : 'rgba(255,255,255,0.4)',
                  border: `3px solid ${unlocked ? theme.gold : theme.cardEdge}`,
                  borderRadius: 12, padding: '12px 4px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  opacity: unlocked ? 1 : 0.55,
                  boxShadow: unlocked ? block(3, theme.goldDeep) : 'none',
                }}
              >
                <div style={{
                  fontSize: 32, marginBottom: 4,
                  filter: unlocked ? 'none' : 'grayscale(1)',
                }}>
                  {unlocked ? b.icon : '🔒'}
                </div>
                <div style={{ fontSize: 10, fontWeight: 800, color: theme.ink, lineHeight: 1.1 }}>
                  {b.name}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Skills */}
        <SectionTitle>🧠 Matematické dovednosti</SectionTitle>
        <div style={{ marginBottom: 16 }}>
          {SKILL_TREE.map((skill, i) => {
            const state = studentProgress[skill.id]
            const pct = Math.round(state.mastery * 100)
            const barColor = pct >= 70 ? theme.grass1 : pct >= 30 ? theme.gold : theme.red
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: state.unlocked ? 1 : 0.38, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  padding: '8px 12px', marginBottom: 4,
                  background: theme.card, border: `2px solid ${theme.cardEdge}`,
                  borderRadius: 10,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13, fontWeight: 800, color: theme.ink }}>
                  <span>{skill.icon} {skill.name}</span>
                  <span style={{ color: theme.inkSoft, fontSize: 11 }}>
                    {state.unlocked ? `${pct}%` : '🔒 Zamčeno'}
                  </span>
                </div>
                {state.unlocked && (
                  <div style={{ height: 6, background: '#eadfcc', borderRadius: 3, overflow: 'hidden' }}>
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
        </div>

        {/* Showcase */}
        <SectionTitle>🖼️ Moje vitrína</SectionTitle>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8, marginBottom: 16,
        }}>
          {showcaseSlots.map((itemId, slot) => {
            const item = itemId ? SHOP_ITEMS.find(i => i.id === itemId) : null
            return (
              <motion.div
                key={slot}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: slot * 0.04 }}
                style={{
                  aspectRatio: '1',
                  background: item ? theme.card : 'rgba(255,255,255,0.3)',
                  border: item ? `3px solid ${theme.gold}` : `2px dashed ${theme.cardEdge}`,
                  borderRadius: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: item ? 26 : 16,
                  color: item ? theme.ink : theme.inkSoft,
                  boxShadow: item ? block(3) : 'none',
                }}
              >
                {item ? item.icon : '?'}
              </motion.div>
            )
          })}
        </div>

        {/* Worlds */}
        <SectionTitle>🌍 Světy</SectionTitle>
        <div style={{ marginBottom: 16 }}>
          {WORLDS.map(world => {
            const isUrl = world.icon.startsWith('/') || world.icon.startsWith('http')
            const isUnlocked = unlockedWorlds.includes(world.id)
            return (
              <div key={world.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', marginBottom: 4,
                background: theme.card, border: `2px solid ${theme.cardEdge}`,
                borderRadius: 10, fontSize: 14, fontWeight: 800,
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: theme.ink }}>
                  {isUrl ? <img src={world.icon} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} /> : world.icon}
                  {world.name}
                </span>
                <span style={{ color: isUnlocked ? theme.grass1 : theme.inkSoft, fontSize: 12 }}>
                  {isUnlocked ? '✓ Odemčeno' : '🔒'}
                </span>
              </div>
            )
          })}
        </div>

        {/* Parent code */}
        <SectionTitle>👨‍👩‍👧 Rodičovský kód</SectionTitle>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: theme.card, border: `2px solid ${theme.cardEdge}`,
          borderRadius: 10, padding: '8px 12px', marginBottom: 16,
        }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: theme.inkSoft, flex: 1, wordBreak: 'break-all' }}>{childId}</span>
          <button
            onClick={copyChildId}
            style={{
              padding: '6px 12px', fontSize: 12,
              background: copied ? theme.grass1 : theme.card,
              border: `2px solid ${theme.cardEdge}`,
              borderRadius: 8, color: theme.ink, cursor: 'pointer',
              whiteSpace: 'nowrap', fontWeight: 800,
            }}
          >
            {copied ? '✓ Zkopírováno' : '📋 Kopírovat'}
          </button>
        </div>
      </div>

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
          onClick={() => navigateTo('home')}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            background: theme.card, border: `3px solid ${theme.cardEdge}`,
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
