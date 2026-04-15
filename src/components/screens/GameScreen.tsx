import { useRef, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { useTask } from '../../hooks/useTask'
import { HUD } from '../hud/HUD'
import { TaskRenderer } from '../tasks/TaskRenderer'
import { PixelButton } from '../ui/PixelButton'
import { playSound } from '../../audio/sounds'
import { getComboLevel } from '../../data/config'
import { useAdaptiveDifficulty } from '../../hooks/useAdaptiveDifficulty'
import { getWorld } from '../../data/worlds'

export function GameScreen() {
  const { currentWorldId, combo, answerCorrect, answerIncorrect, navigateTo, resetCombo } = useGameStore()
  const worldId = currentWorldId ?? 'forest'
  const world = getWorld(worldId)
  const { adaptedRange, recordCorrect, recordIncorrect } = useAdaptiveDifficulty(
    world?.numberRange ?? [1, 5]
  )
  const { task, checkAnswer } = useTask(worldId, adaptedRange)
  const shakeControls = useAnimation()
  const hasAnswered = useRef(false)

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
    <div className="screen" style={{ background: 'var(--mc-bg)' }}>
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
    </div>
  )
}
