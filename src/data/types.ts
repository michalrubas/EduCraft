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
  | 'missingLetter'
  | 'diacritics'
  | 'wordOrder'

export type Biome = 'forest' | 'cave' | 'snow' | 'desert' | 'ocean' | 'jungle' | 'tnt' | 'nether' | 'end' | 'village' | 'castle' | 'graveyard'

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

export type LangSkillId =
  | 'letter_missing_easy'
  | 'letter_missing_hard'
  | 'diacritics_basic'
  | 'diacritics_hard'
  | 'word_order_short'
  | 'word_order_long'

export type SkillId = MathSkillId | LangSkillId

export interface SkillState {
  mastery: number        // 0.0 – 1.0
  unlocked: boolean
  attempts: number
  lastPracticed?: number // unix ms; undefined/0 = nikdy
}

export type StudentProgress = Record<MathSkillId | LangSkillId, SkillState>

export interface World {
  id: string
  name: string
  icon: string
  blockColor: string
  biome: Biome
  taskTypes: TaskTypeEntry[]
  numberRange?: [number, number]
  unlockCost: number
  unlockCurrency?: 'diamonds' | 'emeralds' | 'stars'
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
  skillId?: MathSkillId | LangSkillId
  question: string
  visualCount?: number
  options?: (number | string)[]
  correctAnswer: number | string
  objects?: string[]
  dragTarget?: number
  letters?: string[]   // pro wordOrder: scramblovaná písmena
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
  shopPurchases: number
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
  
  worldAccuracy: Record<string, { correct: number; total: number }>

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
  updateSkillMastery: (skillId: MathSkillId | LangSkillId, isCorrect: boolean) => void
  // actions
  navigateTo: (screen: Screen) => void
  enterWorld: (worldId: string) => void
  answerCorrect: (worldId: string) => boolean
  answerIncorrect: () => void
  resetCombo: () => void
  spendDiamonds: (amount: number) => boolean
  buyItem: (item: ShopItem) => boolean
  addToShowcase: (itemId: string, slot: number) => void
  unlockWorld: (worldId: string, cost: number, currency?: 'diamonds' | 'emeralds' | 'stars') => boolean
}
