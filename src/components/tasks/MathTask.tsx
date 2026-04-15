import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function MathTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  function handleSelect(opt: number) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <motion.p
        className="task-question"
        style={{ fontSize: 22, letterSpacing: 4 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {task.question}
      </motion.p>
      <div className="answer-grid">
        {task.options?.map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            style={{ fontSize: 26 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(opt)}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
