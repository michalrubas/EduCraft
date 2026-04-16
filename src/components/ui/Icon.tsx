// src/components/ui/Icon.tsx
import React from 'react'

interface IconProps {
  src: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

export function Icon({ src, size = 24, className = '', style = {} }: IconProps) {
  const isUrl = src.startsWith('/') || src.startsWith('http')

  if (isUrl) {
    return (
      <img
        src={src}
        alt=""
        className={className}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          display: 'inline-block',
          verticalAlign: 'middle',
          ...style
        }}
      />
    )
  }

  return (
    <span
      className={className}
      style={{
        fontSize: size,
        lineHeight: 1,
        display: 'inline-block',
        verticalAlign: 'middle',
        ...style
      }}
    >
      {src}
    </span>
  )
}
