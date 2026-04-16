// src/data/types.ts

export interface Particle {
  id: string
  emoji: string
  startX: number
  startY: number
}

export type TaskType =
  | 'counting'
  | 'tapNumber'
  | 'compare'
  | 'multiChoice'
  | 'dragDrop'
  | 'find'
  | 'math'
  | 'mathMultiply'

export type Biome = 'forest' | 'cave' | 'snow' | 'desert' | 'ocean' | 'jungle' | 'nether' | 'end'

// Typ úkolu s volitelnou vahou. Bez váhy = rovnoměrné rozdělení.
// Příklad: { type: 'math', weight: 3 } znamená 3× vyšší šanci než typ s weight: 1.
export type TaskTypeEntry = TaskType | { type: TaskType; weight: number }

export type MathSkillId =
  // Sčítání / odčítání (task type: 'math')
  | 'add_no_regroup'   // sčítání bez přechodu přes desítku  (2+3, 12+5)
  | 'complements_10'   // doplňky do 10                       (3+7, 6+4)
  | 'add_regroup'      // sčítání s přechodem přes desítku   (7+5, 17+8)
  | 'sub_no_regroup'   // odčítání bez přechodu               (8-3, 15-4)
  | 'sub_regroup'      // odčítání s přechodem                (12-7, 23-8)
  | 'add_sub_mix'      // mix sčítání a odčítání
  // Násobení (task type: 'mathMultiply')
  | 'mul_easy'         // násobilka 2, 5, 10 (vzorová)
  | 'mul_medium'       // násobilka 3, 4, 6  (odvozená)
  | 'mul_hard'         // násobilka 7, 8, 9  (zpaměti)

export interface SkillState {
  mastery: number    // 0.0 – 1.0
  unlocked: boolean
  attempts: number
}

export type StudentProgress = Record<MathSkillId, SkillState>

export interface World {
  id: string
  name: string
  icon: string
  blockColor: string
  biome: Biome
  taskTypes: TaskTypeEntry[]
  numberRange: [number, number]
  unlockCost: number
  comboMultiplier: number
  bgColor: string
  accentColor: string
  story: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
}

export interface Task {
  id: string
  type: TaskType
  skillId?: MathSkillId
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
  xp: number
  level: number
  levelUpPending: boolean
  studentProgress: StudentProgress
  particles: Particle[]
  unlockedBadges: string[]
  badgePending: Badge | null
  
  spawnParticles: (emoji: string, count: number, startX: number, startY: number) => void
  removeParticle: (id: string) => void
  triggerWheel: () => void
  dismissWheel: () => void
  collectWheelReward: (reward: WheelReward) => void
  triggerChest: () => void
  collectChestReward: (reward: WheelReward) => void
  triggerLevelUp: () => void
  dismissLevelUp: () => void
  collectLevelUpReward: () => void
  checkBadges: () => void
  dismissBadge: () => void
  updateSkillMastery: (skillId: MathSkillId, isCorrect: boolean) => void
  // actions
  navigateTo: (screen: Screen) => void
  enterWorld: (worldId: string) => void
  answerCorrect: (worldId: string) => boolean
  answerIncorrect: () => void
  resetCombo: () => void
  buyItem: (item: ShopItem) => boolean
  addToShowcase: (itemId: string, slot: number) => void
  unlockWorld: (worldId: string, cost: number) => boolean
}
