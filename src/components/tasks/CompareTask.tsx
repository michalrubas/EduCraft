import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { SignBoard } from '../ui/SignBoard'
import { CubeButton } from '../ui/CubeButton'
import { theme } from '../../theme'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function CompareTask({ task, onAnswer }: Props) {
  const [a, b] = task.options ?? [0, 0]
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24, padding: '0 16px 8px', minHeight: 0,
    }}>
      <SignBoard fontSize={22}>{task.question}</SignBoard>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <CubeButton label={a} color="#f5b90d" edge="#a06d04" size="lg" onClick={() => onAnswer(a)} />
        <div style={{
          fontSize: 44, fontWeight: 900, color: theme.ink,
          textShadow: '0 2px 0 rgba(255,255,255,0.5)',
        }}>?</div>
        <CubeButton label={b} color="#3ac8d1" edge="#1d7a80" size="lg" onClick={() => onAnswer(b)} />
      </div>
    </div>
  )
}
