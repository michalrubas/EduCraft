// src/components/tasks/MissingLetterTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function MissingLetterTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <p style={{ fontSize: 12, color: '#aaa', marginBottom: 4, textAlign: 'center' }}>
        Doplň chybějící písmeno
      </p>
      <p className="task-question" style={{ fontSize: 36, letterSpacing: 8, fontFamily: 'monospace' }}>
        {task.question}
      </p>
      <div className="answer-grid">
        {(task.options as string[]).map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(opt)}
            style={{ fontSize: 22, fontWeight: 'bold' }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
