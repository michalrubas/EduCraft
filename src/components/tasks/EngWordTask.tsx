import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function EngWordTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <motion.p
        className="task-question"
        style={{ fontSize: 42, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {task.question}
      </motion.p>
      <p style={{ textAlign: 'center', color: '#aaa', fontSize: 14, marginBottom: 16 }}>
        Klepni na správný obrázek
      </p>
      <div
        className="answer-grid"
        style={{ gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 260, margin: '0 auto' }}
      >
        {task.options?.map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            style={{ fontSize: 48, padding: '16px 0', lineHeight: 1 }}
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
