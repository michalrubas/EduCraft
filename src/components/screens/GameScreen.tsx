import { useRef, useEffect, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { useTask } from '../../hooks/useTask'
import { HUD } from '../hud/HUD'
import { TaskRenderer } from '../tasks/TaskRenderer'
import { playSound } from '../../audio/sounds'
import { getComboLevel, COMBO_THRESHOLDS, REWARD_SCREEN_DURATION } from '../../data/config'
import { getAdaptedRange } from '../../hooks/useAdaptiveDifficulty'
import { getWorld } from '../../data/worlds'
import { shouldTriggerWheel } from '../../hooks/useLuckyWheel'
import { SkillDebugPanel } from '../dev/SkillDebugPanel'
import { ScreenShell } from '../ui/ScreenShell'
import { Cloud } from '../ui/Cloud'
import { ComboBar } from '../hud/ComboBar'
import { theme, block, skyFull } from '../../theme'

export function GameScreen() {
  const { currentWorldId, combo, answerCorrect, answerIncorrect, navigateTo, resetCombo, wheelPending, wheelSpinsToday, totalCorrectSession, totalCorrect, triggerWheel, collectWheelReward, triggerChest, updateSkillMastery, triggerLevelUp, worldAccuracy } = useGameStore()
  const worldId = currentWorldId ?? 'forest'
  const world = getWorld(worldId)
  const wa = worldAccuracy[worldId] ?? { correct: 0, total: 0 }
  const adaptedRange = getAdaptedRange(world?.numberRange ?? [1, 5], wa.correct, wa.total)
  const { task, checkAnswer } = useTask(worldId, adaptedRange)
  const shakeControls = useAnimation()
  const hasAnswered = useRef(false)
  const [seriesComplete, setSeriesComplete] = useState(false)
  // Capture whether this mount is a series-end (combo=10) before any reset
  const isSeriesEndRef = useRef(combo >= COMBO_THRESHOLDS.mania)

  // Series-end: show overlay (if no wheel coming), then navigate home
  useEffect(() => {
    if (!isSeriesEndRef.current) return
    if (wheelPending) return  // wheel will handle it
    setSeriesComplete(true)
    const t = setTimeout(() => {
      setSeriesComplete(false)
      resetCombo()
      // Read current wheelPending — if wheel fired in the meantime, let it handle navigation
      if (!useGameStore.getState().wheelPending) {
        navigateTo('home')
      }
    }, 2000)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentionally only on mount

  useEffect(() => {
    hasAnswered.current = false
  }, [task?.id])

  async function handleAnswer(answer: number | string) {
    if (hasAnswered.current) return
    hasAnswered.current = true

    if (checkAnswer(answer)) {
      const level = getComboLevel(combo + 1)
      if (level === 'mania') playSound.mania()
      else if (level === 'fire' || level === 'doubleFire') playSound.combo()
      else playSound.correct()
      if (task?.skillId) updateSkillMastery(task.skillId, true)
      const leveledUp = answerCorrect(worldId, task?.type)
      const newSession = totalCorrectSession + 1
      const newCombo = combo + 1
      const delay = REWARD_SCREEN_DURATION + 200

      if (leveledUp) {
        setTimeout(triggerLevelUp, delay)
      }

      if (shouldTriggerWheel(newSession, wheelSpinsToday, newCombo === 10)) {
        setTimeout(triggerWheel, delay)
      } else if ((totalCorrect + 1) % 15 === 0) {
        setTimeout(triggerChest, delay)
      }
    } else {
      playSound.wrong()
      if (task?.skillId) updateSkillMastery(task.skillId, false)
      answerIncorrect()
      resetCombo()
      await shakeControls.start({
        x: [0, -12, 12, -10, 10, -6, 6, 0],
        transition: { duration: 0.5 },
      })
      hasAnswered.current = false
    }
  }

  function handleBackHome() {
    resetCombo()
    navigateTo('home')
  }

  if (!task) return null

  return (
    <ScreenShell background={skyFull}>
      <Cloud style={{ top: 90, left: 30, opacity: 0.85 }} />
      <Cloud style={{ top: 130, right: 20, opacity: 0.6, transform: 'scale(0.7)' }} />

      <HUD />

      <div style={{ padding: '0 12px 6px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={handleBackHome}
          style={{
            background: theme.card, border: `3px solid ${theme.cardEdge}`,
            borderRadius: 999, padding: '4px 10px 4px 6px',
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'inherit', fontSize: 12, fontWeight: 900, color: theme.ink,
            boxShadow: block(3), cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 16 }}>←</span> Mapa
        </motion.button>
        <div style={{
          background: 'rgba(255,255,255,0.7)', borderRadius: 999, padding: '4px 10px',
          fontSize: 12, fontWeight: 800, color: theme.ink,
          border: `2px solid ${theme.cardEdge}`,
        }}>
          {world?.icon} {world?.name}
        </div>
      </div>

      <ComboBar combo={combo} />

      <motion.div
        animate={shakeControls}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <TaskRenderer
          task={task}
          onAnswer={handleAnswer}
        />
      </motion.div>

      <AnimatePresence>
        {seriesComplete && !wheelPending && (
          <motion.div
            style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'rgba(43, 29, 16, 0.78)', zIndex: 50 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <motion.div
              style={{ fontSize: 80, filter: 'drop-shadow(0 0 30px #ffd700)' }}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 350 }}
            >
              🏆
            </motion.div>
            <motion.p
              style={{ fontSize: 32, fontWeight: 900, color: '#f5b90d', textShadow: '0 0 20px #f5b90d', textAlign: 'center' }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18 }}
            >
              SÉRIE HOTOVA!
            </motion.p>
            <motion.p
              style={{ fontSize: 20, fontWeight: 700, color: '#fff', textAlign: 'center' }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.28 }}
            >
              10 správných v řadě! 🔥
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {import.meta.env.DEV && <SkillDebugPanel />}

      <div style={{ height: theme.navH, flexShrink: 0 }} />
    </ScreenShell>
  )
}
