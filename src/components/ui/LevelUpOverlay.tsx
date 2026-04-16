import { motion } from 'framer-motion'
import { playSound } from '../../audio/sounds'
import { useGameStore } from '../../store/gameStore'
import { getLevelReward } from '../../data/levels'
import { useEffect } from 'react'

export function LevelUpOverlay() {
  const { level, collectLevelUpReward, spawnParticles } = useGameStore()
  const reward = getLevelReward(level)

  useEffect(() => {
    playSound.reward()
  }, [])

  function handleCollect(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    
    // Spawnutí mincí podle typu odměny. Maximum particle omezíme na 10 aby to nezahlcovalo telefon.
    if (reward.diamonds > 0) spawnParticles('💰', Math.min(reward.diamonds, 15), x, y)
    if (reward.emeralds > 0) spawnParticles('💎', Math.min(reward.emeralds, 10), x, y)
    
    collectLevelUpReward()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24, gap: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{
          fontSize: 80,
          filter: 'drop-shadow(0 0 30px #5de8fc)',
          lineHeight: 1
        }}
      >
        ⭐
      </motion.div>

      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#5de8fc', margin: '0 0 12px 0', fontSize: 40, letterSpacing: 2 }}>
          LEVEL UP!
        </h1>
        <p style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0 }}>
          Dosáhl/a jsi úrovně <span style={{ color: '#ffd700', fontSize: 32 }}>{level}</span>!
        </p>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '16px 32px',
          borderRadius: 8,
          border: '2px solid rgba(255,255,255,0.2)',
          textAlign: 'center'
        }}
      >
        <p style={{ color: '#fff', margin: '0 0 8px 0', fontSize: 14 }}>Odměna za postup:</p>
        <div style={{ display: 'flex', gap: 16, fontSize: 24, fontWeight: 'bold' }}>
          {reward.diamonds > 0 && <span style={{ color: '#ffd700' }}>+{reward.diamonds} 💰</span>}
          {reward.emeralds > 0 && <span style={{ color: '#5de8fc' }}>+{reward.emeralds} 💎</span>}
        </div>
      </motion.div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={handleCollect}
        style={{
          padding: '16px 40px',
          fontSize: 18,
          fontWeight: 800,
          background: '#5de8fc',
          color: '#002028',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontFamily: 'inherit',
          marginTop: 16,
        }}
      >
        VYZVEDNOUT
      </motion.button>
    </motion.div>
  )
}
