// src/components/tasks/WordOrderTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { useGameStore } from '../../store/gameStore'
import { HINT_COST, CURRENCY_ICONS } from '../../data/config'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function WordOrderTask({ task, onAnswer }: Props) {
  const total = (task.correctAnswer as string).length
  const [placed, setPlaced] = useState<string[]>([])
  const [usedIndices, setUsedIndices] = useState<number[]>([])
  const [hintUsed, setHintUsed] = useState(false)
  const diamonds = useGameStore(s => s.diamonds)
  const spendDiamonds = useGameStore(s => s.spendDiamonds)

  function handlePick(idx: number) {
    if (usedIndices.includes(idx)) return
    const letter = task.letters![idx]
    const newPlaced = [...placed, letter]
    const newUsed = [...usedIndices, idx]
    setPlaced(newPlaced)
    setUsedIndices(newUsed)
    if (newPlaced.length === total) {
      setTimeout(() => onAnswer(newPlaced.join('')), 400)
    }
  }

  function handleHint() {
    if (hintUsed || placed.length > 0) return
    if (!spendDiamonds(HINT_COST)) return
    const firstLetter = (task.correctAnswer as string)[0]
    const idx = task.letters!.findIndex((l, i) => l === firstLetter && !usedIndices.includes(i))
    if (idx === -1) return
    setPlaced([firstLetter])
    setUsedIndices([idx])
    setHintUsed(true)
  }

  function handleRemoveLast() {
    if (placed.length === 0) return
    setPlaced(placed.slice(0, -1))
    setUsedIndices(usedIndices.slice(0, -1))
  }

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>

      {/* Answer slots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 44, height: 52,
              border: '2px solid var(--mc-accent, #5dfc8c)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 'bold',
              background: placed[i] ? 'var(--mc-accent, #5dfc8c)' : 'transparent',
              color: placed[i] ? '#000' : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            {placed[i] ?? ''}
          </div>
        ))}
      </div>

      {/* Source letters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
        {task.letters!.map((letter, idx) => (
          <motion.button
            key={idx}
            className="answer-btn"
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePick(idx)}
            style={{
              width: 48, fontSize: 22, fontWeight: 'bold',
              opacity: usedIndices.includes(idx) ? 0.2 : 1,
              pointerEvents: usedIndices.includes(idx) ? 'none' : 'auto',
            }}
          >
            {letter}
          </motion.button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <motion.button
          className="pixel-btn"
          onClick={handleRemoveLast}
          disabled={placed.length === 0}
          whileTap={{ scale: 0.95 }}
          style={{ opacity: placed.length === 0 ? 0.4 : 1 }}
        >
          ↺ Zpět
        </motion.button>

        {!hintUsed && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleHint}
            disabled={placed.length > 0 || diamonds < HINT_COST}
            style={{
              padding: '8px 14px', fontSize: 13,
              background: 'transparent',
              border: '2px solid #888',
              borderRadius: 4, color: '#aaa', cursor: placed.length > 0 || diamonds < HINT_COST ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: placed.length > 0 || diamonds < HINT_COST ? 0.4 : 1,
            }}
          >
            💡 Nápověda ({CURRENCY_ICONS.diamonds} -{HINT_COST})
          </motion.button>
        )}
      </div>
    </div>
  )
}
