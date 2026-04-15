import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function TapNumberTask({ task, onAnswer }: Props) {
  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 320 }}>
        {task.options?.map((opt, i) => (
          <motion.button
            key={opt}
            className="answer-btn"
            style={{ width: 72, height: 72, fontSize: 24 }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
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
