import { CSSProperties } from 'react'

interface Props {
  style?: CSSProperties
}

export function Cloud({ style }: Props) {
  return (
    <div style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <svg width="80" height="34" viewBox="0 0 80 34">
        <ellipse cx="20" cy="22" rx="18" ry="11" fill="#fff" />
        <ellipse cx="40" cy="16" rx="22" ry="14" fill="#fff" />
        <ellipse cx="60" cy="22" rx="18" ry="11" fill="#fff" />
      </svg>
    </div>
  )
}
