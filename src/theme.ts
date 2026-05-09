// src/theme.ts

export const theme = {
  // Sky/grass palette
  sky1: '#7ec8f0',
  sky2: '#a8dcf2',
  grass1: '#5fb84a',
  grass2: '#3f8e2d',
  // Surfaces
  card: '#fffaf0',
  cardEdge: '#3a2410',
  ink: '#2b1d10',
  inkSoft: '#6b5b48',
  // Accents
  gold: '#f5b90d',
  goldDeep: '#b67806',
  diamond: '#3ac8d1',
  emerald: '#30b15c',
  star: '#ffd84a',
  red: '#e64a3a',
  purple: '#9b59b6',
  shadow: 'rgba(58, 36, 16, 0.25)',
  // Layout
  navH: 90,
} as const

/** Chunky 3D block-depth shadow */
export function block(depth = 4, color = theme.cardEdge) {
  return `0 ${depth}px 0 ${color}, 0 ${depth + 2}px ${depth * 2}px rgba(0,0,0,0.18)`
}

/** Inset shadow for block faces */
export const blockInset = 'inset -6px -6px 0 rgba(0,0,0,0.28), inset 6px 6px 0 rgba(255,255,255,0.30)'

/** Sky gradient variants */
export const skyFull = `linear-gradient(180deg, ${theme.sky1} 0%, ${theme.sky2} 60%, ${theme.grass1} 100%)`
export const skyShort = `linear-gradient(180deg, ${theme.sky1} 0%, ${theme.sky2} 100%)`
