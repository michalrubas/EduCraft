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
  sm: { fontSize: 28 },
  md: { fontSize: 36 },
  lg: { fontSize: 50, width: 100 },
} as const

export function CubeButton({ label, color, edge, size = 'md', onClick, className }: Props) {
  const d = DIMS[size]
  return (
    <motion.button
      className={className}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        aspectRatio: '1.1',
        width: 'width' in d ? d.width : undefined,
        borderRadius: 14,
        background: color,
        border: `4px solid ${edge}`,
        boxShadow: `${blockInset}, 0 6px 0 ${edge}`,
        fontSize: d.fontSize,
        fontWeight: 900,
        color: '#fff',
        textShadow: '0 2px 0 rgba(0,0,0,0.35)',
        fontFamily: 'inherit',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </motion.button>
  )
}
