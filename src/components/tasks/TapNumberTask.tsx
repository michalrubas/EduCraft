import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { SignBoard } from '../ui/SignBoard'
import { theme, block } from '../../theme'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function TapNumberTask({ task, onAnswer }: Props) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 22, padding: '0 16px 8px', minHeight: 0,
    }}>
      <SignBoard fontSize={22}>{task.question}</SignBoard>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 320 }}>
        {task.options?.map((opt, i) => (
          <motion.button
            key={opt}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => onAnswer(opt)}
            style={{
              width: 72, height: 72, fontSize: 24, fontWeight: 900,
              background: theme.card, border: `3px solid ${theme.cardEdge}`,
              borderRadius: 14, color: theme.ink, fontFamily: 'inherit',
              cursor: 'pointer', boxShadow: block(3),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
