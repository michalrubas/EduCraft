// src/components/ui/PixelButton.tsx
import { ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'gold' | 'danger'
  size?: 'normal' | 'big'
}

export function PixelButton({ variant = 'default', size = 'normal', className = '', children, ...rest }: Props) {
  const cls = ['pixel-btn', variant !== 'default' ? variant : '', size === 'big' ? 'big' : '', className]
    .filter(Boolean).join(' ')
  return (
    <motion.button
      className={cls}
      whileTap={{ scale: 0.94 }}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  )
}
