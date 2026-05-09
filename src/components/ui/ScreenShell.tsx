import { ReactNode } from 'react'

interface Props {
  background: string
  children: ReactNode
}

export function ScreenShell({ background, children }: Props) {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background,
      fontFamily: 'Nunito, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {children}
    </div>
  )
}
