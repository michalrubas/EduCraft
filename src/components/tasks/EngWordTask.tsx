import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { SignBoard } from '../ui/SignBoard'
import { CubeButton } from '../ui/CubeButton'

interface Props { task: Task; onAnswer: (a: number | string) => void }

const COLORS = [
  { color: '#f5b90d', edge: '#a06d04' },
  { color: '#5fb84a', edge: '#2f6a23' },
  { color: '#3ac8d1', edge: '#1d7a80' },
  { color: '#e64a3a', edge: '#8a2418' },
]

export function EngWordTask({ task, onAnswer }: Props) {
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
      <SignBoard fontSize={32}>{task.question}</SignBoard>

      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${options.length <= 3 ? options.length : 2}, 1fr)`,
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
