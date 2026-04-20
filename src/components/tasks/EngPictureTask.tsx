import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function EngPictureTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ textAlign: 'center', fontSize: 96, lineHeight: 1.1, marginBottom: 8 }}
      >
        {task.objects?.[0]}
      </motion.div>
      <p className="task-question">{task.question}</p>
      <div className="answer-grid">
        {task.options?.map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(String(opt))}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
