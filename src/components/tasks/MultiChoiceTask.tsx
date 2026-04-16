import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function MultiChoiceTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | string | null>(null)

  function handleSelect(opt: number | string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      {task.objects && (
        <motion.div 
          className="object-grid"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {task.objects.map((obj, i) => (
            (obj.startsWith('/') || obj.startsWith('http')) 
              ? <img key={i} src={obj} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} /> 
              : <span key={i}>{obj}</span>
          ))}
        </motion.div>
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
