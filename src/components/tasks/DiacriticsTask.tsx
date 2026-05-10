import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { SignBoard } from '../ui/SignBoard'
import { theme, block } from '../../theme'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function DiacriticsTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 22, padding: '0 16px 8px', minHeight: 0,
    }}>
      <SignBoard fontSize={22}>{task.question}</SignBoard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300 }}>
        {(task.options as string[]).map(opt => (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(opt)}
            style={{
              width: '100%', padding: '14px 20px',
              background: selected === opt
                ? (opt === task.correctAnswer ? '#e6f9ec' : '#fde8e6')
                : theme.card,
              border: `3px solid ${
                selected === opt
                  ? (opt === task.correctAnswer ? theme.emerald : theme.red)
                  : theme.cardEdge
              }`,
              borderRadius: 14, fontSize: 20, fontWeight: 800,
              color: theme.ink, fontFamily: 'inherit', cursor: 'pointer',
              boxShadow: block(3),
              textAlign: 'center',
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
