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

export function MultiChoiceTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | string | null>(null)

  function handleSelect(opt: number | string) {
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
      <SignBoard fontSize={22}>{task.question}</SignBoard>

      {task.objects && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: '#e8d6a8', border: `4px solid ${theme.cardEdge}`,
            borderRadius: 12, padding: '14px 20px',
            boxShadow: block(4),
            display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center',
            maxWidth: 280,
          }}
        >
          {task.objects.map((obj, i) => (
            (obj.startsWith('/') || obj.startsWith('http'))
              ? <img key={i} src={obj} alt="" style={{ width: 48, height: 48, objectFit: 'contain' }} />
              : <span key={i} style={{ fontSize: 36, lineHeight: 1 }}>{obj}</span>
          ))}
        </motion.div>
      )}

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 14, width: '100%', maxWidth: 280,
      }}>
        {options.map((opt, i) => (
          <CubeButton
            key={opt}
            label={opt}
            color={COLORS[i % COLORS.length].color}
            edge={COLORS[i % COLORS.length].edge}
            onClick={() => handleSelect(opt)}
          />
        ))}
      </div>
    </div>
  )
}
