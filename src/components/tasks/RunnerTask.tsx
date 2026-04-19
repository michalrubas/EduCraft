// src/components/tasks/RunnerTask.tsx
import { useEffect, useRef, useState } from 'react'
import { Task } from '../../data/types'
import { RUNNER_CONFIG } from '../../data/config'
import { useGameStore } from '../../store/gameStore'
import { getWorld } from '../../data/worlds'

interface Props {
  task: Task
  onAnswer: (answer: number | string) => void
}

export function RunnerTask({ task, onAnswer }: Props) {
  const currentWorldId = useGameStore(s => s.currentWorldId)
  const world = currentWorldId ? getWorld(currentWorldId) : null
  const multiplier = world?.comboMultiplier ?? 1

  const effectiveDur = Math.max(
    RUNNER_CONFIG.minDuration,
    Math.round(RUNNER_CONFIG.duration / multiplier),
  )
  const wallDur = effectiveDur + RUNNER_CONFIG.staggerDelay * (RUNNER_CONFIG.laneCount - 1)

  const [answered, setAnswered] = useState(false)
  const [selectedLane, setSelectedLane] = useState<number | null>(null)
  const [round, setRound] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const restartRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onAnswerRef = useRef(onAnswer)
  onAnswerRef.current = onAnswer

  function clearTimers() {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (restartRef.current) clearTimeout(restartRef.current)
  }

  useEffect(() => {
    setAnswered(false)
    setSelectedLane(null)

    timerRef.current = setTimeout(() => {
      setAnswered(true)
      onAnswerRef.current('')
      // After parent's shake animation, restart for another try
      restartRef.current = setTimeout(() => setRound(r => r + 1), 800)
    }, wallDur)

    return clearTimers
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id, round, wallDur])

  function handleTap(index: number) {
    if (answered) return
    clearTimers()
    setAnswered(true)
    setSelectedLane(index)
    const value = task.options![index]
    setTimeout(() => {
      onAnswerRef.current(value)
      if (value !== task.correctAnswer) {
        restartRef.current = setTimeout(() => setRound(r => r + 1), 800)
      }
    }, 300)
  }

  const options = task.options ?? []

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div
        key={round}
        className="runner-track"
        style={{ '--runner-wall-dur': `${wallDur}ms` } as React.CSSProperties}
      >
        <div className={`runner-wall${answered ? ' runner-wall--paused' : ''}`} />
        {options.map((opt, i) => {
          const laneClass = answered && selectedLane === i
            ? (opt === task.correctAnswer ? ' correct' : ' wrong')
            : ''
          return (
            <button
              key={i}
              className={`runner-lane${laneClass}`}
              style={{
                '--runner-block-dur': `${effectiveDur}ms`,
                '--runner-block-delay': `${i * RUNNER_CONFIG.staggerDelay}ms`,
              } as React.CSSProperties}
              onClick={() => handleTap(i)}
              disabled={answered}
            >
              <span className="runner-block">{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
