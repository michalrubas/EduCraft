// src/data/types.ts

export type TaskType =
  | 'counting'
  | 'tapNumber'
  | 'compare'
  | 'multiChoice'
  | 'dragDrop'
  | 'find'
  | 'math'

export type Biome = 'forest' | 'cave' | 'snow' | 'nether' | 'end'

export interface World {
  id: string
  name: string
  icon: string
  blockColor: string
  biome: Biome
  taskTypes: TaskType[]
  numberRange: [number, number]
  unlockCost: number
  comboMultiplier: number
  bgColor: string
  accentColor: string
  story: string
}

export interface Task {
  id: string
  type: TaskType
  question: string
  visualCount?: number
  options?: number[]
  correctAnswer: number | string
  objects?: string[]
  dragTarget?: number
}

export type ItemCategory = 'weapon' | 'armor' | 'trophy' | 'decoration' | 'rare'
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface ShopItem {
  id: string
  name: string
  icon: string
  category: ItemCategory
  cost: { diamonds?: number; emeralds?: number; stars?: number }
  rarity: ItemRarity
}

export interface WheelReward {
  label: string
  diamonds?: number
  emeralds?: number
  stars?: number
  itemId?: string
}

export type Screen = 'home' | 'game' | 'reward' | 'shop' | 'profile'

export interface GameState {
  currentScreen: Screen
  currentWorldId: string | null
  combo: number
  maxCombo: number
  diamonds: number
  emeralds: number
  stars: number
  unlockedWorlds: string[]
  ownedItems: string[]
  showcaseSlots: (string | null)[]
  totalCorrect: number
  totalAttempts: number
  sessionsPlayed: number
  muted: boolean
  setMuted: (muted: boolean) => void
  wheelSpinsToday: number
  totalCorrectSession: number
  wheelPending: boolean
  chestPending: boolean
  triggerWheel: () => void
  dismissWheel: () => void
  collectWheelReward: (reward: WheelReward) => void
  triggerChest: () => void
  collectChestReward: (reward: WheelReward) => void
  // actions
  navigateTo: (screen: Screen) => void
  enterWorld: (worldId: string) => void
  answerCorrect: (worldId: string) => void
  answerIncorrect: () => void
  resetCombo: () => void
  buyItem: (item: ShopItem) => boolean
  addToShowcase: (itemId: string, slot: number) => void
  unlockWorld: (worldId: string, cost: number) => boolean
}
