import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function FindTask({ task, onAnswer }: Props) {
  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div className="find-grid">
        {task.options?.map((opt, i) => (
          <motion.button
            key={`${opt}-${i}`}
            className="find-btn"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => onAnswer(opt)}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
