import { ReactNode } from 'react'
import { theme, block } from '../../theme'

interface Props {
  children: ReactNode
  fontSize?: number
}

export function SignBoard({ children, fontSize = 36 }: Props) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', left: '50%', bottom: -18, transform: 'translateX(-50%)',
        width: 14, height: 28, background: '#7a4a1a',
        border: `2px solid ${theme.cardEdge}`, borderRadius: 2,
      }} />
      <div style={{
        background: 'linear-gradient(180deg, #c98e4a 0%, #a86d2e 100%)',
        border: `4px solid ${theme.cardEdge}`, borderRadius: 12,
        padding: '14px 24px', boxShadow: block(5),
        fontSize, fontWeight: 900, color: '#fff',
        textShadow: '0 2px 0 rgba(0,0,0,0.4)', letterSpacing: 1,
        textAlign: 'center', maxWidth: 320,
      }}>{children}</div>
    </div>
  )
}
