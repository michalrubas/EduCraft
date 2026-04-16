import { useRef, useEffect, useState } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { useTask } from '../../hooks/useTask'
import { HUD } from '../hud/HUD'
import { TaskRenderer } from '../tasks/TaskRenderer'
import { PixelButton } from '../ui/PixelButton'
import { playSound } from '../../audio/sounds'
import { getComboLevel, COMBO_THRESHOLDS, REWARD_SCREEN_DURATION } from '../../data/config'
import { useAdaptiveDifficulty } from '../../hooks/useAdaptiveDifficulty'
import { getWorld } from '../../data/worlds'
import { LuckyWheel } from '../ui/LuckyWheel'
import { MysteryChest } from '../ui/MysteryChest'
import { LevelUpOverlay } from '../ui/LevelUpOverlay'
import { shouldTriggerWheel } from '../../hooks/useLuckyWheel'
import { SkillDebugPanel } from '../dev/SkillDebugPanel'

export function GameScreen() {
  const { currentWorldId, combo, answerCorrect, answerIncorrect, navigateTo, resetCombo, wheelPending, wheelSpinsToday, totalCorrectSession, totalCorrect, triggerWheel, collectWheelReward, chestPending, triggerChest, collectChestReward, updateSkillMastery, levelUpPending } = useGameStore()
  const worldId = currentWorldId ?? 'forest'
  const world = getWorld(worldId)
  const { adaptedRange, recordCorrect, recordIncorrect } = useAdaptiveDifficulty(
    world?.numberRange ?? [1, 5]
  )
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

  function handleWheelCollect(reward: Parameters<typeof collectWheelReward>[0]) {
    collectWheelReward(reward)
    if (isSeriesEndRef.current) {
      resetCombo()
      navigateTo('home')
    }
  }

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
      answerCorrect(worldId)
      recordCorrect()
      const newSession = totalCorrectSession + 1
      const newCombo = combo + 1
      const delay = REWARD_SCREEN_DURATION + 200
      if (shouldTriggerWheel(newSession, wheelSpinsToday, newCombo === 10)) {
        setTimeout(triggerWheel, delay)
      } else if ((totalCorrect + 1) % 15 === 0) {
        setTimeout(triggerChest, delay)
      }
    } else {
      playSound.wrong()
      if (task?.skillId) updateSkillMastery(task.skillId, false)
      answerIncorrect()
      recordIncorrect()
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
    <div className="screen" style={{ background: 'var(--mc-bg)', position: 'relative' }}>
      <HUD />
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', gap: 8 }}>
        <PixelButton onClick={handleBackHome} style={{ padding: '8px 12px', fontSize: 10 }}>
          ← Domů
        </PixelButton>
      </div>
      <motion.div
        animate={shakeControls}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <TaskRenderer
          task={task}
          onAnswer={handleAnswer}
        />
      </motion.div>

      {wheelPending && (
        <LuckyWheel onCollect={handleWheelCollect} />
      )}

      {chestPending && (
        <MysteryChest onCollect={collectChestReward} />
      )}

      {levelUpPending && (
        <LevelUpOverlay />
      )}

      <AnimatePresence>
        {seriesComplete && !wheelPending && (
          <motion.div
            className="series-overlay"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          >
            <motion.div
              className="series-trophy"
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 350 }}
            >
              🏆
            </motion.div>
            <motion.p
              className="series-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18 }}
            >
              SÉRIE HOTOVA!
            </motion.p>
            <motion.p
              className="series-sub"
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
    </div>
  )
}
