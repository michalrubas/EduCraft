import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { SignBoard } from '../ui/SignBoard'
import { CubeButton } from '../ui/CubeButton'
import { theme, block } from '../../theme'

interface Props { task: Task; onAnswer: (a: number | string) => void }

const COLORS = [
  { color: '#f5b90d', edge: '#a06d04' },
  { color: '#5fb84a', edge: '#2f6a23' },
  { color: '#3ac8d1', edge: '#1d7a80' },
  { color: '#e64a3a', edge: '#8a2418' },
]

export function EngPictureTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  const options = (task.options ?? []).slice(0, 4)

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 22, padding: '0 16px 8px', minHeight: 0,
    }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          background: '#e8d6a8', border: `4px solid ${theme.cardEdge}`,
          borderRadius: 16, padding: 16,
          boxShadow: block(4),
          fontSize: 72, lineHeight: 1, textAlign: 'center',
        }}
      >
        {task.objects?.[0]}
      </motion.div>

      <SignBoard fontSize={20}>{task.question}</SignBoard>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 14, width: '100%', maxWidth: 280,
      }}>
        {options.map((opt, i) => (
          <CubeButton
            key={String(opt)}
            label={opt}
            color={COLORS[i % COLORS.length].color}
            edge={COLORS[i % COLORS.length].edge}
            onClick={() => handleSelect(String(opt))}
          />
        ))}
      </div>
    </div>
  )
}
