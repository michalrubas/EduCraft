import { GameState, Badge } from './types'

export interface BadgeDefinition extends Badge {
  condition: (state: GameState) => boolean
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first_level',
    name: 'První krok',
    description: 'Dosáhni 2. úrovně.',
    icon: '🎯',
    condition: s => s.level >= 2,
  },
  {
    id: 'level_10',
    name: 'Desítka',
    description: 'Dosáhni 10. úrovně.',
    icon: '🔟',
    condition: s => s.level >= 10,
  },
  {
    id: 'combo_5',
    name: 'Soustředěn',
    description: 'Dosáhni komba úrovně 5 bez chyby.',
    icon: '🔥',
    condition: s => s.maxCombo >= 5,
  },
  {
    id: 'combo_10',
    name: 'Nezastavitelný!',
    description: 'Dokonči sérii 10 správných odpovědí.',
    icon: '🏆',
    condition: s => s.maxCombo >= 10,
  },
  {
    id: 'rich_kid',
    name: 'Zlatokop',
    description: 'Nasbírej najednou 500 zlaťáků.',
    icon: '💰',
    condition: s => s.diamonds >= 500,
  },
  {
    id: 'wealthy',
    name: 'Skrblík',
    description: 'Nasbírej najednou 2000 zlaťáků.',
    icon: '👑',
    condition: s => s.diamonds >= 2000,
  },
  {
    id: 'first_buy',
    name: 'Nákupčí',
    description: 'Kup si svůj první předmět v obchodě.',
    icon: '🛍️',
    condition: s => s.ownedItems.length > 1, // Začíná s jedním
  },
  {
    id: 'world_explorer',
    name: 'Cestovatel',
    description: 'Odemkni 3 různé světy.',
    icon: '🗺️',
    condition: s => s.unlockedWorlds.length >= 3,
  },
  {
    id: 'math_hero',
    name: 'Matematik',
    description: 'Odpověz celkově na 100 otázek správně.',
    icon: '🧠',
    condition: s => s.totalCorrect >= 100,
  },
  {
    id: 'math_god',
    name: 'Génius',
    description: 'Odpověz celkově na 500 otázek správně.',
    icon: '🌟',
    condition: s => s.totalCorrect >= 500,
  },
]

export function checkNewBadges(state: GameState): BadgeDefinition[] {
  return BADGES.filter(b => 
    !state.unlockedBadges.includes(b.id) && b.condition(state)
  )
}
