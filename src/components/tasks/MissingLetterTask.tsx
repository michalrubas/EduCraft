import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { SignBoard } from '../ui/SignBoard'
import { CubeButton } from '../ui/CubeButton'
import { theme, block } from '../../theme'

interface Props { task: Task; onAnswer: (a: number | string) => void }

const COLORS = [
  { color: '#5fb84a', edge: '#2f6a23' },
  { color: '#3ac8d1', edge: '#1d7a80' },
  { color: '#f5b90d', edge: '#a06d04' },
  { color: '#e64a3a', edge: '#8a2418' },
]

export function MissingLetterTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  // Split the question into characters — the '_' is the missing slot
  const chars = task.question.split('')

  // Shrink letter tiles for longer words so they fit on narrow phones
  const tileSize = chars.length <= 4 ? 50 : chars.length <= 6 ? 44 : 38
  const tileHeight = chars.length <= 4 ? 60 : chars.length <= 6 ? 54 : 48
  const tileFont = chars.length <= 4 ? 36 : chars.length <= 6 ? 30 : 26

  const options = (task.options as string[]).slice(0, 4)

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24, padding: '0 16px 8px', minHeight: 0,
    }}>
      <SignBoard fontSize={22}>Doplň písmenko</SignBoard>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: '100%' }}>
        {chars.map((ch, i) => {
          const isMissing = ch === '_'
          return (
            <div key={i} style={{
              width: tileSize, height: tileHeight, borderRadius: 10,
              background: isMissing ? theme.gold : theme.card,
              border: `4px solid ${isMissing ? theme.goldDeep : theme.cardEdge}`,
              boxShadow: block(4, isMissing ? theme.goldDeep : theme.cardEdge),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: tileFont, fontWeight: 900, color: theme.ink,
              animation: isMissing ? 'pulse 1.2s ease-in-out infinite' : 'none',
            }}>{isMissing ? '_' : ch}</div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`, gap: 8, width: '100%', maxWidth: 320 }}>
        {options.map((opt, i) => (
          <CubeButton
            key={opt}
            label={opt}
            color={COLORS[i % COLORS.length].color}
            edge={COLORS[i % COLORS.length].edge}
            size="sm"
            onClick={() => handleSelect(opt)}
          />
        ))}
      </div>
    </div>
  )
}
