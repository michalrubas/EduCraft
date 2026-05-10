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
  sm: { fontSize: 28, padding: '12px 8px' },
  md: { fontSize: 36, padding: '16px 8px' },
  lg: { fontSize: 50, padding: '18px 12px', width: 120 },
} as const

export function CubeButton({ label, color, edge, size = 'md', onClick, className }: Props) {
  const d = DIMS[size]
  return (
    <motion.button
      className={className}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{
        width: 'width' in d ? d.width : '100%',
        aspectRatio: 'width' in d ? 1 : undefined,
        padding: d.padding,
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
