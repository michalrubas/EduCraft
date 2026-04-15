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
import { shouldTriggerWheel } from '../../hooks/useLuckyWheel'

export function GameScreen() {
  const { currentWorldId, combo, answerCorrect, answerIncorrect, navigateTo, resetCombo, wheelPending, wheelSpinsToday, totalCorrectSession, triggerWheel, collectWheelReward } = useGameStore()
  const worldId = currentWorldId ?? 'forest'
  const world = getWorld(worldId)
  const { adaptedRange, recordCorrect, recordIncorrect } = useAdaptiveDifficulty(
    world?.numberRange ?? [1, 5]
  )
  const { task, checkAnswer } = useTask(worldId, adaptedRange)
  const shakeControls = useAnimation()
  const hasAnswered = useRef(false)
  const [seriesComplete, setSeriesComplete] = useState(false)

  // Show "serie hotova" overlay when mounting back from reward with combo at mania
  useEffect(() => {
    if (combo >= COMBO_THRESHOLDS.mania) {
      setSeriesComplete(true)
      const t = setTimeout(() => {
        setSeriesComplete(false)
        resetCombo()
      }, 2000)
      return () => clearTimeout(t)
    }
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
      answerCorrect(worldId)
      recordCorrect()
      const newSession = totalCorrectSession + 1
      const newCombo = combo + 1
      if (shouldTriggerWheel(newSession, wheelSpinsToday, newCombo === 10)) {
        setTimeout(triggerWheel, REWARD_SCREEN_DURATION + 200)
      }
    } else {
      playSound.wrong()
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
        <LuckyWheel onCollect={collectWheelReward} />
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
    </div>
  )
}
