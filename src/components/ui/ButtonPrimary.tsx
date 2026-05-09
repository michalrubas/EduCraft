import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { theme, block } from '../../theme'

interface Props {
  children: ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function ButtonPrimary({ children, onClick }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      style={{
        background: theme.gold,
        border: `3px solid ${theme.cardEdge}`,
        borderRadius: 14,
        padding: '10px 22px',
        fontFamily: 'Nunito, sans-serif',
        fontSize: 16,
        fontWeight: 900,
        color: theme.ink,
        cursor: 'pointer',
        boxShadow: block(4, theme.goldDeep),
        letterSpacing: 0.5,
      }}
    >
      {children}
    </motion.button>
  )
}
