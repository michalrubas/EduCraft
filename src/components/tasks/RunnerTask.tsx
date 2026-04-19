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
  // wall expires slightly after the last block fully enters, giving the player a fair window
  const wallDur = effectiveDur + RUNNER_CONFIG.staggerDelay * (RUNNER_CONFIG.laneCount - 1)

  const [answered, setAnswered] = useState(false)
  const [selectedLane, setSelectedLane] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setAnswered(false)
    setSelectedLane(null)
    timerRef.current = setTimeout(() => {
      setAnswered(true)
      onAnswer('')   // timeout counts as wrong answer
    }, wallDur)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id])

  function handleTap(index: number) {
    if (answered) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setAnswered(true)
    setSelectedLane(index)
    setTimeout(() => onAnswer(task.options![index]), 300)
  }

  const options = task.options ?? []

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div
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
