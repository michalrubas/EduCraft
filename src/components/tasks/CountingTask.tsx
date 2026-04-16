import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function CountingTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  function handleSelect(opt: number) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <motion.div
        className="object-grid"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {task.objects?.map((obj, i) => (
          <span key={i}>{obj}</span>
        ))}
      </motion.div>
      <div className="answer-grid">
        {task.options?.map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
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
