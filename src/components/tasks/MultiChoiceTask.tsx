import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function MultiChoiceTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  function handleSelect(opt: number) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      {task.objects && (
        <div className="object-grid">
          {task.objects.map((obj, i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04, type: 'spring' }}>
              {obj}
            </motion.span>
          ))}
        </div>
      )}
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
