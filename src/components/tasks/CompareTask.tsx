import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function CompareTask({ task, onAnswer }: Props) {
  const [a, b] = task.options ?? [0, 0]
  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div className="compare-row">
        <motion.div className="compare-box" whileTap={{ scale: 0.9 }} onClick={() => onAnswer(a)}>
          {a}
        </motion.div>
        <span style={{ fontSize: 28, color: 'var(--mc-muted)' }}>VS</span>
        <motion.div className="compare-box" whileTap={{ scale: 0.9 }} onClick={() => onAnswer(b)}>
          {b}
        </motion.div>
      </div>
    </div>
  )
}
