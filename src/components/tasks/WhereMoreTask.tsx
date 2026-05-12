import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'
import { theme, block, blockInset } from '../../theme'

interface Props { task: Task; onAnswer: (a: number | string) => void }

function GroupTray({ items, letter }: { items: string[]; letter: string }) {
  return (
    <div style={{
      flex: 1,
      background: theme.card,
      border: `4px solid ${theme.cardEdge}`,
      borderRadius: 16,
      padding: '14px 8px 10px',
      boxShadow: block(4),
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      minHeight: 200,
    }}>
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 4,
        width: '100%',
        alignContent: 'center',
      }}>
        {items.map((obj, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 26, height: 38, lineHeight: 1,
          }}>
            {(obj.startsWith('/') || obj.startsWith('http'))
              ? <img src={obj} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} />
              : obj}
          </div>
        ))}
      </div>
      <div style={{
        background: theme.gold,
        color: theme.ink,
        fontWeight: 900,
        fontSize: 14,
        padding: '4px 14px',
        border: `2px solid ${theme.cardEdge}`,
        borderRadius: 999,
        boxShadow: block(2),
      }}>{letter}</div>
    </div>
  )
}

function SignButton({ label, onClick, dim }: { label: string; onClick: () => void; dim: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        width: 64, height: 64,
        padding: 0,
        borderRadius: 14,
        background: '#3ac8d1',
        border: '4px solid #1d7a80',
        boxShadow: `${blockInset}, 0 6px 0 #1d7a80`,
        color: '#fff',
        fontSize: 36, fontWeight: 900,
        textShadow: '0 2px 0 rgba(0,0,0,0.35)',
        fontFamily: 'inherit',
        cursor: 'pointer',
        opacity: dim ? 0.5 : 1,
        transition: 'opacity 0.15s',
      }}
    >{label}</motion.button>
  )
}

export function WhereMoreTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const groupA = task.objects ?? []
  const groupB = task.objectsB ?? []
  const options = (task.options ?? ['<', '=', '>']) as string[]

  function handleSelect(sign: string) {
    if (selected) return
    setSelected(sign)
    setTimeout(() => { setSelected(null); onAnswer(sign) }, 300)
  }

  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      gap: 14, minHeight: 0,
    }}>
      <div style={{ padding: '4px 16px 4px', textAlign: 'center' }}>
        <div style={{
          fontSize: 11, fontWeight: 800, color: theme.inkSoft,
          letterSpacing: 1.5, textTransform: 'uppercase',
        }}>{task.question}</div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          display: 'flex', gap: 10,
          padding: '0 14px',
        }}
      >
        <GroupTray items={groupA} letter="A" />
        <GroupTray items={groupB} letter="B" />
      </motion.div>

      <div style={{
        display: 'flex', justifyContent: 'center', gap: 10,
        padding: '4px 16px 8px',
      }}>
        {options.map(opt => (
          <SignButton
            key={opt}
            label={opt}
            dim={selected !== null && selected !== opt}
            onClick={() => handleSelect(opt)}
          />
        ))}
      </div>
    </div>
  )
}
