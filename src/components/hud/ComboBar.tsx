// src/components/hud/ComboBar.tsx
import { COMBO_THRESHOLDS } from '../../data/config'
import { getComboInfo } from '../../hooks/useCombo'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  combo: number
}

// Ordered thresholds for progress calculation
const TIERS = [
  { at: 0, label: '' },
  { at: COMBO_THRESHOLDS.fire, label: '🔥' },
  { at: COMBO_THRESHOLDS.doubleFire, label: '🔥🔥' },
  { at: COMBO_THRESHOLDS.mania, label: '🔥🔥🔥' },
]

function getProgress(combo: number) {
  // Find current tier and next tier
  let currentIdx = 0
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (combo >= TIERS[i].at) { currentIdx = i; break }
  }
  const current = TIERS[currentIdx]
  const next = TIERS[currentIdx + 1] // undefined if at max

  if (!next) {
    // At max tier — full bar
    return { pct: 100, nextAt: current.at, tierLabel: current.label }
  }

  const rangeSize = next.at - current.at
  const inRange = combo - current.at
  const pct = Math.min(100, (inRange / rangeSize) * 100)
  return { pct, nextAt: next.at, tierLabel: current.label }
}

export function ComboBar({ combo }: Props) {
  const info = getComboInfo(combo)
  const { pct, nextAt, tierLabel } = getProgress(combo)

  if (combo === 0) return null

  return (
    <div className="combo-bar-wrap" style={{ position: 'relative' }}>
      {/* Track fill */}
      <motion.div
        className="combo-bar-fill"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ background: `linear-gradient(90deg, #2d6d44, ${info.color})` }}
      />

      {/* Overlay: combo number + tier label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 6, pointerEvents: 'none',
      }}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={combo}
            initial={{ y: -8, opacity: 0, scale: 0.7 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            style={{
              fontSize: 11, fontWeight: 900, color: '#fff',
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
              fontFamily: 'inherit',
            }}
          >
            {combo}×
          </motion.span>
        </AnimatePresence>

        {tierLabel && (
          <motion.span
            key={tierLabel}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ fontSize: 10, lineHeight: 1 }}
          >
            {tierLabel}
          </motion.span>
        )}

        {/* Next threshold hint (only if not maxed) */}
        {combo < COMBO_THRESHOLDS.mania && (
          <span style={{
            position: 'absolute', right: 4,
            fontSize: 9, color: 'rgba(255,255,255,0.5)',
            fontFamily: 'inherit',
          }}>
            → {nextAt}
          </span>
        )}
      </div>
    </div>
  )
}
