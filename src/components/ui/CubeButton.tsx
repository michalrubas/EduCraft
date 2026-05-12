import { motion } from 'framer-motion'
import { blockInset } from '../../theme'

interface Props {
  label: string | number
  color: string
  edge: string
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
}

const DIMS = {
  sm: { fontSize: 28, aspect: 1.1 },
  md: { fontSize: 36, aspect: 1.1 },
  lg: { fontSize: 50, aspect: 1, width: 100 },
} as const

function fitFontSize(base: number, label: string | number): number {
  const len = String(label).length
  if (len <= 3) return base
  if (len <= 5) return Math.round(base * 0.72)
  if (len <= 7) return Math.round(base * 0.58)
  return Math.round(base * 0.48)
}

export function CubeButton({ label, color, edge, size = 'md', onClick, className }: Props) {
  const d = DIMS[size]
  const fontSize = fitFontSize(d.fontSize, label)
  return (
    <motion.button
      className={className}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        width: 'width' in d ? d.width : '100%',
        aspectRatio: d.aspect,
        padding: '4px 6px',
        borderRadius: 14,
        background: color,
        border: `4px solid ${edge}`,
        boxShadow: `${blockInset}, 0 6px 0 ${edge}`,
        fontSize,
        fontWeight: 900,
        color: '#fff',
        textShadow: '0 2px 0 rgba(0,0,0,0.35)',
        fontFamily: 'inherit',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        lineHeight: 1.05,
        textAlign: 'center',
      }}
    >
      {label}
    </motion.button>
  )
}
