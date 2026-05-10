// src/components/tasks/WordOrderTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { useGameStore } from '../../store/gameStore'
import { HINT_COST } from '../../data/config'
import { SignBoard } from '../ui/SignBoard'
import { theme, block } from '../../theme'

const EMOJI_HINT_COST = 1

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function WordOrderTask({ task, onAnswer }: Props) {
  const total = (task.correctAnswer as string).length
  const [placed, setPlaced] = useState<string[]>([])
  const [usedIndices, setUsedIndices] = useState<number[]>([])
  const [hintUsed, setHintUsed] = useState(false)
  const [emojiRevealed, setEmojiRevealed] = useState(false)
  const diamonds = useGameStore(s => s.diamonds)
  const stars = useGameStore(s => s.stars)
  const spendDiamonds = useGameStore(s => s.spendDiamonds)
  const spendStars = useGameStore(s => s.spendStars)

  function handlePick(idx: number) {
    if (usedIndices.includes(idx)) return
    const letter = task.letters![idx]
    const newPlaced = [...placed, letter]
    const newUsed = [...usedIndices, idx]
    setPlaced(newPlaced)
    setUsedIndices(newUsed)
    if (newPlaced.length === total) {
      setTimeout(() => onAnswer(newPlaced.join('')), 400)
    }
  }

  function handleEmojiHint() {
    if (emojiRevealed || !task.emoji) return
    if (!spendDiamonds(EMOJI_HINT_COST)) return
    setEmojiRevealed(true)
  }

  function handleHint() {
    if (hintUsed || placed.length > 0) return
    if (!spendDiamonds(HINT_COST)) return
    const firstLetter = (task.correctAnswer as string)[0]
    const idx = task.letters!.findIndex((l, i) => l === firstLetter && !usedIndices.includes(i))
    if (idx === -1) return
    setPlaced([firstLetter])
    setUsedIndices([idx])
    setHintUsed(true)
  }

  function handleRemoveLast() {
    if (placed.length === 0) return
    setPlaced(placed.slice(0, -1))
    setUsedIndices(usedIndices.slice(0, -1))
  }

  const hintBtnStyle = (disabled: boolean): React.CSSProperties => ({
    padding: '8px 14px', fontSize: 13, fontWeight: 800,
    background: theme.card, border: `3px solid ${theme.cardEdge}`,
    borderRadius: 12, color: theme.ink, fontFamily: 'inherit',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    boxShadow: block(3),
  })

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 18, padding: '0 16px 8px', minHeight: 0,
    }}>
      <SignBoard fontSize={22}>{task.question}</SignBoard>

      {/* Emoji hint */}
      {emojiRevealed && task.emoji && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{ fontSize: 52, textAlign: 'center', lineHeight: 1 }}
        >
          {task.emoji}
        </motion.div>
      )}

      {/* Answer slots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 44, height: 52,
              border: `3px solid ${placed[i] ? theme.grass1 : theme.cardEdge}`,
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 900,
              background: placed[i] ? theme.grass1 : theme.card,
              color: placed[i] ? '#fff' : 'transparent',
              boxShadow: block(3),
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            {placed[i] ?? ''}
          </div>
        ))}
      </div>

      {/* Source letters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {task.letters!.map((letter, idx) => (
          <motion.button
            key={idx}
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePick(idx)}
            style={{
              width: 48, aspectRatio: 1, fontSize: 22, fontWeight: 900,
              background: theme.card, border: `3px solid ${theme.cardEdge}`,
              borderRadius: 10, color: theme.ink, fontFamily: 'inherit',
              boxShadow: block(3),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: usedIndices.includes(idx) ? 0.2 : 1,
              pointerEvents: usedIndices.includes(idx) ? 'none' : 'auto',
              cursor: 'pointer',
            }}
          >
            {letter}
          </motion.button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <motion.button
          onClick={handleRemoveLast}
          disabled={placed.length === 0}
          whileTap={{ scale: 0.95 }}
          style={hintBtnStyle(placed.length === 0)}
        >
          ↺ Zpět
        </motion.button>

        {task.emoji && !emojiRevealed && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleEmojiHint}
            disabled={stars < EMOJI_HINT_COST}
            style={hintBtnStyle(stars < EMOJI_HINT_COST)}
          >
            🖼️ Obrázek (⭐ -{EMOJI_HINT_COST})
          </motion.button>
        )}

        {!hintUsed && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleHint}
            disabled={placed.length > 0 || diamonds < HINT_COST}
            style={hintBtnStyle(placed.length > 0 || diamonds < HINT_COST)}
          >
            💡 Nápověda (💎 -{HINT_COST})
          </motion.button>
        )}
      </div>
    </div>
  )
}
