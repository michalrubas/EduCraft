# EduCraft Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional Minecraft-themed math PWA for first-grade children with combo rewards, world progression, and a collectibles showcase.

**Architecture:** Screen-based navigation via Zustand store (no router), Framer Motion for all animations and drag & drop, data-driven configuration so worlds/tasks/items can be added without touching components.

**Tech Stack:** React 18 + TypeScript + Vite + Framer Motion + Zustand (persist) + Vitest + @testing-library/react

---

## File Map

```
src/
├── main.tsx                           (modify: already exists)
├── App.tsx                            (replace: screen router + AnimatePresence)
├── styles.css                         (replace: Minecraft pixel theme)
│
├── data/
│   ├── types.ts                       (create: all TS interfaces)
│   ├── config.ts                      (create: combo thresholds, rewards, constants)
│   ├── worlds.ts                      (create: 4 worlds definitions)
│   ├── tasks.ts                       (create: 7 task generators)
│   └── shopItems.ts                   (create: ~15 shop items)
│
├── store/
│   └── gameStore.ts                   (create: Zustand store with persist)
│
├── hooks/
│   ├── useTask.ts                     (create: task generation + answer check)
│   └── useCombo.ts                    (create: combo level + display info)
│
├── components/
│   ├── hud/
│   │   ├── HUD.tsx                    (create: top bar with currency + combo)
│   │   └── ComboBar.tsx               (create: animated combo strip)
│   ├── screens/
│   │   ├── HomeScreen.tsx             (create: world selection grid)
│   │   ├── GameScreen.tsx             (create: active task + HUD)
│   │   ├── RewardScreen.tsx           (create: gem burst + auto-return)
│   │   ├── ShopScreen.tsx             (create: tabs + showcase)
│   │   └── ProfileScreen.tsx          (create: stats + full showcase)
│   ├── tasks/
│   │   ├── TaskRenderer.tsx           (create: switch on task.type)
│   │   ├── CountingTask.tsx           (create)
│   │   ├── TapNumberTask.tsx          (create)
│   │   ├── CompareTask.tsx            (create)
│   │   ├── MultiChoiceTask.tsx        (create)
│   │   ├── MathTask.tsx               (create)
│   │   ├── FindTask.tsx               (create)
│   │   └── DragDropTask.tsx           (create: Framer Motion drag)
│   └── ui/
│       ├── PixelButton.tsx            (create)
│       ├── WorldCard.tsx              (create)
│       └── GemBurst.tsx               (create: animated gem particles)
│
├── test/
│   └── setup.ts                       (create: jest-dom)
│
tests/
├── tasks.test.ts                      (create: generator unit tests)
├── config.test.ts                     (create: combo level tests)
└── gameStore.test.ts                  (create: store action tests)
```

---

## Task 1: Install dependencies & configure testing

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Install runtime dependencies**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft
npm install framer-motion zustand
```

Expected: framer-motion and zustand appear in `dependencies` in package.json.

- [ ] **Step 2: Install test dependencies**

```bash
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

- [ ] **Step 3: Create test setup file**

```ts
// src/test/setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Update vite.config.ts**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

- [ ] **Step 5: Add test scripts to package.json**

In `package.json` scripts section, add:
```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 6: Verify test runner starts**

```bash
npm run test:run
```

Expected: "No test files found" — that is correct, no tests yet.

- [ ] **Step 7: Commit**

```bash
git init && git add package.json package-lock.json vite.config.ts src/test/setup.ts
git commit -m "feat: add framer-motion, zustand, vitest test setup"
```

---

## Task 2: TypeScript types

**Files:**
- Create: `src/data/types.ts`

- [ ] **Step 1: Create types**

```ts
// src/data/types.ts

export type TaskType =
  | 'counting'
  | 'tapNumber'
  | 'compare'
  | 'multiChoice'
  | 'dragDrop'
  | 'find'
  | 'math'

export type Biome = 'forest' | 'cave' | 'snow' | 'nether'

export interface World {
  id: string
  name: string
  icon: string
  biome: Biome
  taskTypes: TaskType[]
  numberRange: [number, number]
  unlockCost: number
  comboMultiplier: number
  bgColor: string
  accentColor: string
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/types.ts
git commit -m "feat: add core TypeScript type definitions"
```

---

## Task 3: Config system

**Files:**
- Create: `src/data/config.ts`
- Create: `tests/config.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// tests/config.test.ts
import { describe, it, expect } from 'vitest'
import { getComboLevel, COMBO_THRESHOLDS } from '../src/data/config'

describe('getComboLevel', () => {
  it('returns base for combo 1', () => {
    expect(getComboLevel(1)).toBe('base')
  })
  it('returns base for combo 2', () => {
    expect(getComboLevel(2)).toBe('base')
  })
  it('returns fire at threshold', () => {
    expect(getComboLevel(COMBO_THRESHOLDS.fire)).toBe('fire')
  })
  it('returns doubleFire at threshold', () => {
    expect(getComboLevel(COMBO_THRESHOLDS.doubleFire)).toBe('doubleFire')
  })
  it('returns mania at threshold', () => {
    expect(getComboLevel(COMBO_THRESHOLDS.mania)).toBe('mania')
  })
  it('returns mania above threshold', () => {
    expect(getComboLevel(20)).toBe('mania')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:run
```

Expected: FAIL — `getComboLevel` not found.

- [ ] **Step 3: Create config**

```ts
// src/data/config.ts

export const COMBO_THRESHOLDS = {
  fire: 3,
  doubleFire: 5,
  mania: 10,
} as const

export type ComboLevel = 'base' | 'fire' | 'doubleFire' | 'mania'

export const COMBO_REWARDS: Record<ComboLevel, { diamonds: number; emeralds?: number; stars?: number }> = {
  base:       { diamonds: 1 },
  fire:       { diamonds: 2 },
  doubleFire: { diamonds: 3, emeralds: 1 },
  mania:      { diamonds: 5, emeralds: 2, stars: 1 },
}

export const SHOWCASE_SLOTS = 8
export const TASKS_BEFORE_EASY = 5
export const REWARD_SCREEN_DURATION = 800

export function getComboLevel(combo: number): ComboLevel {
  if (combo >= COMBO_THRESHOLDS.mania) return 'mania'
  if (combo >= COMBO_THRESHOLDS.doubleFire) return 'doubleFire'
  if (combo >= COMBO_THRESHOLDS.fire) return 'fire'
  return 'base'
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run
```

Expected: 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/config.ts tests/config.test.ts
git commit -m "feat: add combo config and getComboLevel"
```

---

## Task 4: World & shop item data

**Files:**
- Modify: `src/data/types.ts` (add `story` field to World interface)
- Create: `src/data/worlds.ts`
- Create: `src/data/shopItems.ts`

- [ ] **Step 1: Add `story` field to World interface in types.ts**

In `src/data/types.ts`, add `story: string` to the `World` interface after `accentColor`:

```ts
export interface World {
  id: string
  name: string
  icon: string
  biome: Biome
  taskTypes: TaskType[]
  numberRange: [number, number]
  unlockCost: number
  comboMultiplier: number
  bgColor: string
  accentColor: string
  story: string           // ← add this line
}
```

Run `npx tsc --noEmit` to confirm no errors.

- [ ] **Step 2: Create worlds**

```ts
// src/data/worlds.ts
import { World } from './types'

export const WORLDS: World[] = [
  {
    id: 'forest',
    name: 'Příroda',
    icon: '🌱',
    biome: 'forest',
    taskTypes: ['counting', 'tapNumber', 'compare', 'multiChoice'],
    numberRange: [1, 5],
    unlockCost: 0,
    comboMultiplier: 1.0,
    bgColor: '#0d2010',
    accentColor: '#5dfc8c',
    story: 'Zachraň vesnici od hladu! Spočítej zásoby a pomoz farmářům.',
  },
  {
    id: 'cave',
    name: 'Jeskyně',
    icon: '🔥',
    biome: 'cave',
    taskTypes: ['counting', 'math', 'multiChoice', 'dragDrop'],
    numberRange: [1, 10],
    unlockCost: 30,
    comboMultiplier: 1.5,
    bgColor: '#1a0d00',
    accentColor: '#ff9f43',
    story: 'Prozkoumej temnou jeskyni a najdi poklady! Pozor na příšery.',
  },
  {
    id: 'snow',
    name: 'Sněžné království',
    icon: '❄️',
    biome: 'snow',
    taskTypes: ['math', 'find', 'compare', 'dragDrop'],
    numberRange: [1, 10],
    unlockCost: 60,
    comboMultiplier: 1.75,
    bgColor: '#0a1520',
    accentColor: '#74b9ff',
    story: 'Přežij sněžnou bouři! Postav igloo a nakorm tučňáky.',
  },
  {
    id: 'nether',
    name: 'Nether',
    icon: '⚡',
    biome: 'nether',
    taskTypes: ['math', 'multiChoice', 'find', 'dragDrop'],
    numberRange: [1, 20],
    unlockCost: 120,
    comboMultiplier: 2.0,
    bgColor: '#200005',
    accentColor: '#ff6b6b',
    story: 'Vstup do Netheru a znič mocného draka! Jen nejchytřejší přežijí.',
  },
]

export function getWorld(id: string): World | undefined {
  return WORLDS.find(w => w.id === id)
}
```

- [ ] **Step 2: Create shop items**

```ts
// src/data/shopItems.ts
import { ShopItem } from './types'

export const SHOP_ITEMS: ShopItem[] = [
  // Weapons
  { id: 'sword_wood',  name: 'Dřevěný meč',  icon: '🗡️', category: 'weapon', cost: { diamonds: 0  }, rarity: 'common'    },
  { id: 'sword_stone', name: 'Kamenný meč',   icon: '⚔️', category: 'weapon', cost: { diamonds: 20 }, rarity: 'common'    },
  { id: 'axe',         name: 'Sekera',         icon: '🪓', category: 'weapon', cost: { diamonds: 25 }, rarity: 'common'    },
  { id: 'bow',         name: 'Luk',            icon: '🏹', category: 'weapon', cost: { emeralds: 15 }, rarity: 'rare'      },
  { id: 'trident',     name: 'Trojzubec',      icon: '🔱', category: 'weapon', cost: { diamonds: 60 }, rarity: 'epic'      },
  // Armor
  { id: 'shield',      name: 'Štít',           icon: '🛡️', category: 'armor',  cost: { diamonds: 35 }, rarity: 'common'    },
  { id: 'helmet',      name: 'Přilba',         icon: '⛑️', category: 'armor',  cost: { diamonds: 40 }, rarity: 'rare'      },
  // Trophies
  { id: 'trophy',      name: 'Trofej',         icon: '🏆', category: 'trophy', cost: { diamonds: 30 }, rarity: 'rare'      },
  { id: 'medal',       name: 'Medaile',        icon: '🥇', category: 'trophy', cost: { emeralds: 20 }, rarity: 'rare'      },
  { id: 'crown',       name: 'Koruna',         icon: '👑', category: 'trophy', cost: { diamonds: 80 }, rarity: 'epic'      },
  // Decorations
  { id: 'potion',      name: 'Lektvar',        icon: '🧪', category: 'decoration', cost: { emeralds: 8  }, rarity: 'common' },
  { id: 'book',        name: 'Kouzelná kniha', icon: '📖', category: 'decoration', cost: { emeralds: 12 }, rarity: 'common' },
  { id: 'diamond_gem', name: 'Diamant',        icon: '💎', category: 'decoration', cost: { diamonds: 50 }, rarity: 'rare'   },
  // Rare
  { id: 'star_item',   name: 'Hvězda',         icon: '🌟', category: 'rare',   cost: { stars: 10 },     rarity: 'legendary' },
  { id: 'dragon_egg',  name: 'Dračí vejce',    icon: '🥚', category: 'rare',   cost: { stars: 15 },     rarity: 'legendary' },
]
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/worlds.ts src/data/shopItems.ts
git commit -m "feat: add worlds and shop items data"
```

---

## Task 5: Task generators

**Files:**
- Create: `src/data/tasks.ts`
- Create: `tests/tasks.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// tests/tasks.test.ts
import { describe, it, expect } from 'vitest'
import {
  generateCountingTask,
  generateTapNumberTask,
  generateCompareTask,
  generateMultiChoiceTask,
  generateMathTask,
  generateDragDropTask,
  generateFindTask,
} from '../src/data/tasks'

const RANGE: [number, number] = [1, 5]

describe('generateCountingTask', () => {
  it('returns correct type', () => {
    const t = generateCountingTask(RANGE, 'forest')
    expect(t.type).toBe('counting')
  })
  it('visualCount is within range', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateCountingTask(RANGE, 'forest')
      expect(t.visualCount).toBeGreaterThanOrEqual(1)
      expect(t.visualCount).toBeLessThanOrEqual(5)
    }
  })
  it('options contain correctAnswer', () => {
    const t = generateCountingTask(RANGE, 'forest')
    expect(t.options).toContain(t.correctAnswer)
  })
  it('has 3 options', () => {
    const t = generateCountingTask(RANGE, 'forest')
    expect(t.options).toHaveLength(3)
  })
})

describe('generateTapNumberTask', () => {
  it('returns correct type', () => {
    expect(generateTapNumberTask(RANGE).type).toBe('tapNumber')
  })
  it('options contain correctAnswer', () => {
    const t = generateTapNumberTask(RANGE)
    expect(t.options).toContain(t.correctAnswer)
  })
})

describe('generateCompareTask', () => {
  it('returns correct type', () => {
    expect(generateCompareTask(RANGE).type).toBe('compare')
  })
  it('correctAnswer is the larger of the two options', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateCompareTask(RANGE)
      const max = Math.max(...(t.options as number[]))
      expect(Number(t.correctAnswer)).toBe(max)
    }
  })
  it('two options are never equal', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateCompareTask(RANGE)
      expect(t.options![0]).not.toBe(t.options![1])
    }
  })
})

describe('generateMathTask', () => {
  it('returns correct type', () => {
    expect(generateMathTask(RANGE).type).toBe('math')
  })
  it('correctAnswer is within valid range', () => {
    for (let i = 0; i < 30; i++) {
      const t = generateMathTask([1, 10])
      expect(Number(t.correctAnswer)).toBeGreaterThanOrEqual(0)
      expect(Number(t.correctAnswer)).toBeLessThanOrEqual(20)
    }
  })
  it('has 3 options', () => {
    expect(generateMathTask(RANGE).options).toHaveLength(3)
  })
})

describe('generateDragDropTask', () => {
  it('returns correct type', () => {
    expect(generateDragDropTask(RANGE, 'forest').type).toBe('dragDrop')
  })
  it('dragTarget matches correctAnswer', () => {
    const t = generateDragDropTask(RANGE, 'forest')
    expect(t.dragTarget).toBe(Number(t.correctAnswer))
  })
})

describe('generateFindTask', () => {
  it('returns correct type', () => {
    expect(generateFindTask(RANGE).type).toBe('find')
  })
  it('options contain correctAnswer', () => {
    const t = generateFindTask(RANGE)
    expect(t.options).toContain(t.correctAnswer)
  })
})
```

- [ ] **Step 2: Run to confirm failures**

```bash
npm run test:run
```

Expected: FAIL — generators not found.

- [ ] **Step 3: Create task generators**

```ts
// src/data/tasks.ts
import { Task, TaskType, Biome } from './types'

const BIOME_OBJECTS: Record<Biome, string[]> = {
  forest: ['🌿', '🍄', '🌸', '🐛', '🌻', '🍀'],
  cave:   ['💎', '🔥', '⛏️', '🪨', '🦇', '🕯️'],
  snow:   ['❄️', '⛄', '🎿', '🌨️', '🐧', '🏔️'],
  nether: ['💀', '🔴', '⚡', '🌋', '👹', '🔮'],
}

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

function threeOptions(correct: number, min: number, max: number): number[] {
  const w1 = correct < max ? correct + 1 : correct - 1
  let w2 = correct > min + 1 ? correct - 2 : correct + 2
  if (w2 === w1) w2 = correct + 3 <= max ? correct + 3 : correct - 3
  return shuffle([correct, w1, w2])
}

export function generateCountingTask(range: [number, number], biome: string): Task {
  const [min, max] = range
  const count = ri(min, max)
  const objs = BIOME_OBJECTS[biome as Biome] ?? BIOME_OBJECTS.forest
  const obj = objs[ri(0, objs.length - 1)]
  return {
    id: uid(),
    type: 'counting',
    question: 'Kolik věciček vidíš?',
    visualCount: count,
    objects: Array(count).fill(obj),
    options: threeOptions(count, min, max),
    correctAnswer: count,
  }
}

export function generateTapNumberTask(range: [number, number]): Task {
  const [min, max] = range
  const target = ri(min, max)
  const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const distractors = shuffle(pool.filter(n => n !== target)).slice(0, Math.min(5, pool.length - 1))
  return {
    id: uid(),
    type: 'tapNumber',
    question: `Najdi číslo ${target}!`,
    options: shuffle([target, ...distractors]),
    correctAnswer: target,
  }
}

export function generateCompareTask(range: [number, number]): Task {
  const [min, max] = range
  let a = ri(min, max)
  let b = ri(min, max)
  let attempts = 0
  while (a === b && attempts < 20) { b = ri(min, max); attempts++ }
  if (a === b) b = a < max ? a + 1 : a - 1
  return {
    id: uid(),
    type: 'compare',
    question: 'Které číslo je větší?',
    options: [a, b],
    correctAnswer: Math.max(a, b),
  }
}

export function generateMultiChoiceTask(range: [number, number], biome: string): Task {
  const [min, max] = range
  const count = ri(min, max)
  const objs = BIOME_OBJECTS[biome as Biome] ?? BIOME_OBJECTS.forest
  const obj = objs[ri(0, objs.length - 1)]
  return {
    id: uid(),
    type: 'multiChoice',
    question: 'Kolik je to?',
    visualCount: count,
    objects: Array(count).fill(obj),
    options: threeOptions(count, min, max),
    correctAnswer: count,
  }
}

export function generateMathTask(range: [number, number]): Task {
  const [, max] = range
  const isAdd = Math.random() > 0.4
  if (isAdd) {
    const a = ri(1, Math.max(1, Math.floor(max * 0.7)))
    const b = ri(1, Math.max(1, max - a))
    const ans = a + b
    return {
      id: uid(), type: 'math',
      question: `${a} + ${b} = ?`,
      options: threeOptions(ans, 1, max * 2),
      correctAnswer: ans,
    }
  } else {
    const a = ri(2, max)
    const b = ri(1, a - 1)
    const ans = a - b
    return {
      id: uid(), type: 'math',
      question: `${a} − ${b} = ?`,
      options: threeOptions(ans, 0, max),
      correctAnswer: ans,
    }
  }
}

export function generateDragDropTask(range: [number, number], biome: string): Task {
  const [min, max] = range
  const target = ri(min, max)
  const objs = BIOME_OBJECTS[biome as Biome] ?? BIOME_OBJECTS.forest
  const obj = objs[ri(0, objs.length - 1)]
  const poolSize = Math.min(target + 3, max + 3)
  return {
    id: uid(),
    type: 'dragDrop',
    question: `Přetáhni ${target}× ${obj} do košíku`,
    dragTarget: target,
    visualCount: target,
    objects: Array(poolSize).fill(obj),
    correctAnswer: target,
  }
}

export function generateFindTask(range: [number, number]): Task {
  const [min, max] = range
  const target = ri(min, max)
  const gridSize = ri(4, 9)
  const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const distractors = shuffle(pool.filter(n => n !== target)).slice(0, Math.min(gridSize - 1, pool.length - 1))
  return {
    id: uid(),
    type: 'find',
    question: `Najdi číslo ${target}`,
    options: shuffle([target, ...distractors]),
    correctAnswer: target,
  }
}

export type TaskGenerator = (range: [number, number], biome: string) => Task

export const TASK_GENERATORS: Record<TaskType, TaskGenerator> = {
  counting:    (r, b) => generateCountingTask(r, b),
  tapNumber:   (r)    => generateTapNumberTask(r),
  compare:     (r)    => generateCompareTask(r),
  multiChoice: (r, b) => generateMultiChoiceTask(r, b),
  math:        (r)    => generateMathTask(r),
  dragDrop:    (r, b) => generateDragDropTask(r, b),
  find:        (r)    => generateFindTask(r),
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run
```

Expected: all task generator tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/tasks.ts tests/tasks.test.ts
git commit -m "feat: add task generators with tests"
```

---

## Task 6: Zustand game store

**Files:**
- Create: `src/store/gameStore.ts`
- Create: `tests/gameStore.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// tests/gameStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '../src/store/gameStore'
import { SHOP_ITEMS } from '../src/data/shopItems'

beforeEach(() => {
  useGameStore.setState({
    currentScreen: 'home',
    currentWorldId: null,
    combo: 0,
    maxCombo: 0,
    diamonds: 10,
    emeralds: 0,
    stars: 0,
    unlockedWorlds: ['forest'],
    ownedItems: ['sword_wood'],
    showcaseSlots: Array(8).fill(null),
    totalCorrect: 0,
    totalAttempts: 0,
    sessionsPlayed: 0,
  })
})

describe('answerCorrect', () => {
  it('increments combo', () => {
    useGameStore.getState().answerCorrect('forest')
    expect(useGameStore.getState().combo).toBe(1)
  })
  it('adds diamonds', () => {
    useGameStore.getState().answerCorrect('forest')
    expect(useGameStore.getState().diamonds).toBeGreaterThan(10)
  })
  it('updates maxCombo', () => {
    useGameStore.getState().answerCorrect('forest')
    useGameStore.getState().answerCorrect('forest')
    useGameStore.getState().answerCorrect('forest')
    expect(useGameStore.getState().maxCombo).toBe(3)
  })
  it('switches screen to reward', () => {
    useGameStore.getState().answerCorrect('forest')
    expect(useGameStore.getState().currentScreen).toBe('reward')
  })
  it('applies comboMultiplier for nether (2x)', () => {
    useGameStore.setState({ diamonds: 0 })
    useGameStore.getState().answerCorrect('nether')
    // nether multiplier 2.0, base reward 1 diamond → 2
    expect(useGameStore.getState().diamonds).toBe(2)
  })
})

describe('answerIncorrect', () => {
  it('does NOT reset combo', () => {
    useGameStore.getState().answerCorrect('forest')
    useGameStore.getState().answerCorrect('forest')
    useGameStore.getState().answerIncorrect()
    expect(useGameStore.getState().combo).toBe(2)
  })
  it('increments totalAttempts', () => {
    useGameStore.getState().answerIncorrect()
    expect(useGameStore.getState().totalAttempts).toBe(1)
  })
})

describe('buyItem', () => {
  it('deducts diamonds on purchase', () => {
    useGameStore.setState({ diamonds: 50 })
    const item = SHOP_ITEMS.find(i => i.id === 'sword_stone')!
    useGameStore.getState().buyItem(item)
    expect(useGameStore.getState().diamonds).toBe(30)
  })
  it('adds item to ownedItems', () => {
    useGameStore.setState({ diamonds: 50 })
    const item = SHOP_ITEMS.find(i => i.id === 'sword_stone')!
    useGameStore.getState().buyItem(item)
    expect(useGameStore.getState().ownedItems).toContain('sword_stone')
  })
  it('returns false if not enough diamonds', () => {
    useGameStore.setState({ diamonds: 0 })
    const item = SHOP_ITEMS.find(i => i.id === 'sword_stone')!
    const result = useGameStore.getState().buyItem(item)
    expect(result).toBe(false)
  })
  it('returns false if already owned', () => {
    useGameStore.setState({ diamonds: 100 })
    const item = SHOP_ITEMS.find(i => i.id === 'sword_wood')!
    const result = useGameStore.getState().buyItem(item)
    expect(result).toBe(false)
  })
})

describe('unlockWorld', () => {
  it('deducts cost and adds world', () => {
    useGameStore.setState({ diamonds: 50 })
    useGameStore.getState().unlockWorld('cave', 30)
    expect(useGameStore.getState().diamonds).toBe(20)
    expect(useGameStore.getState().unlockedWorlds).toContain('cave')
  })
  it('returns false if insufficient diamonds', () => {
    useGameStore.setState({ diamonds: 5 })
    const result = useGameStore.getState().unlockWorld('cave', 30)
    expect(result).toBe(false)
  })
})
```

- [ ] **Step 2: Run to confirm failures**

```bash
npm run test:run
```

Expected: FAIL — gameStore not found.

- [ ] **Step 3: Create the store**

```ts
// src/store/gameStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState, Screen, ShopItem } from '../data/types'
import { COMBO_REWARDS, SHOWCASE_SLOTS, getComboLevel } from '../data/config'
import { WORLDS } from '../data/worlds'

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentScreen: 'home' as Screen,
      currentWorldId: null,
      combo: 0,
      maxCombo: 0,
      diamonds: 10,
      emeralds: 0,
      stars: 0,
      unlockedWorlds: ['forest'],
      ownedItems: ['sword_wood'],
      showcaseSlots: Array<string | null>(SHOWCASE_SLOTS).fill(null),
      totalCorrect: 0,
      totalAttempts: 0,
      sessionsPlayed: 0,

      navigateTo: (screen: Screen) => set({ currentScreen: screen }),

      enterWorld: (worldId: string) =>
        set({ currentWorldId: worldId, currentScreen: 'game' }),

      answerCorrect: (worldId: string) => {
        const s = get()
        const world = WORLDS.find(w => w.id === worldId)
        const multiplier = world?.comboMultiplier ?? 1
        const newCombo = s.combo + 1
        const level = getComboLevel(newCombo)
        const base = COMBO_REWARDS[level]
        set({
          combo: newCombo,
          maxCombo: Math.max(s.maxCombo, newCombo),
          diamonds: s.diamonds + Math.round((base.diamonds ?? 0) * multiplier),
          emeralds: s.emeralds + Math.round((base.emeralds ?? 0) * multiplier),
          stars: s.stars + Math.round((base.stars ?? 0) * multiplier),
          totalCorrect: s.totalCorrect + 1,
          totalAttempts: s.totalAttempts + 1,
          currentScreen: 'reward',
        })
      },

      answerIncorrect: () =>
        set(s => ({ totalAttempts: s.totalAttempts + 1 })),

      resetCombo: () => set({ combo: 0 }),

      buyItem: (item: ShopItem) => {
        const s = get()
        if (s.ownedItems.includes(item.id)) return false
        const { diamonds = 0, emeralds = 0, stars = 0 } = item.cost
        if (s.diamonds < diamonds || s.emeralds < emeralds || s.stars < stars) return false
        set({
          diamonds: s.diamonds - diamonds,
          emeralds: s.emeralds - emeralds,
          stars: s.stars - stars,
          ownedItems: [...s.ownedItems, item.id],
        })
        return true
      },

      addToShowcase: (itemId: string, slot: number) =>
        set(s => {
          const slots = [...s.showcaseSlots]
          slots[slot] = itemId
          return { showcaseSlots: slots }
        }),

      unlockWorld: (worldId: string, cost: number) => {
        const s = get()
        if (s.diamonds < cost || s.unlockedWorlds.includes(worldId)) return false
        set({
          diamonds: s.diamonds - cost,
          unlockedWorlds: [...s.unlockedWorlds, worldId],
        })
        return true
      },
    }),
    { name: 'educraft-game-v1' }
  )
)
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run
```

Expected: all store tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/store/gameStore.ts tests/gameStore.test.ts
git commit -m "feat: add Zustand game store with persist and tests"
```

---

## Task 7: Hooks — useTask & useCombo

**Files:**
- Create: `src/hooks/useTask.ts`
- Create: `src/hooks/useCombo.ts`

- [ ] **Step 1: Create useCombo (pure utility, no React)**

```ts
// src/hooks/useCombo.ts
import { ComboLevel, getComboLevel } from '../data/config'

export interface ComboInfo {
  level: ComboLevel
  label: string
  flames: number
  color: string
}

export function getComboInfo(combo: number): ComboInfo {
  const level = getComboLevel(combo)
  const map: Record<ComboLevel, ComboInfo> = {
    base:       { level, label: '',             flames: 0, color: '#ffffff' },
    fire:       { level, label: '🔥 COMBO x2',  flames: 1, color: '#ff9f43' },
    doubleFire: { level, label: '🔥🔥 COMBO x3', flames: 2, color: '#ff6348' },
    mania:      { level, label: '🔥🔥🔥 MÁNIE!', flames: 3, color: '#ffd700' },
  }
  return map[level]
}
```

- [ ] **Step 2: Create useTask hook**

```ts
// src/hooks/useTask.ts
import { useState, useCallback, useRef } from 'react'
import { Task, TaskType } from '../data/types'
import { TASK_GENERATORS } from '../data/tasks'
import { TASKS_BEFORE_EASY } from '../data/config'
import { getWorld } from '../data/worlds'

export interface UseTaskReturn {
  task: Task | null
  nextTask: () => void
  checkAnswer: (answer: number | string) => boolean
}

export function useTask(worldId: string): UseTaskReturn {
  const world = getWorld(worldId)
  const taskCountRef = useRef(0)
  const lastTypeRef = useRef<TaskType | null>(null)

  const generateNext = useCallback((): Task => {
    if (!world) throw new Error(`World "${worldId}" not found`)
    taskCountRef.current++

    // Every TASKS_BEFORE_EASY tasks, insert an easier one
    if (taskCountRef.current % TASKS_BEFORE_EASY === 0) {
      const easyRange: [number, number] = [
        world.numberRange[0],
        Math.ceil((world.numberRange[0] + world.numberRange[1]) / 2),
      ]
      const easyTypes: TaskType[] = ['counting', 'tapNumber']
      const t = easyTypes[Math.floor(Math.random() * easyTypes.length)]
      return TASK_GENERATORS[t](easyRange, world.biome)
    }

    // Avoid repeating last type
    const available = world.taskTypes.filter(t => t !== lastTypeRef.current)
    const chosen = available[Math.floor(Math.random() * available.length)]
    lastTypeRef.current = chosen
    return TASK_GENERATORS[chosen](world.numberRange, world.biome)
  }, [world, worldId])

  const [task, setTask] = useState<Task | null>(() =>
    world ? generateNext() : null
  )

  const nextTask = useCallback(() => setTask(generateNext()), [generateNext])

  const checkAnswer = useCallback(
    (answer: number | string) => task !== null && String(answer) === String(task.correctAnswer),
    [task]
  )

  return { task, nextTask, checkAnswer }
}
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useTask.ts src/hooks/useCombo.ts
git commit -m "feat: add useTask and useCombo hooks"
```

---

## Task 8: Global CSS theme & index.html

**Files:**
- Modify: `index.html`
- Replace: `src/styles.css`

- [ ] **Step 1: Add Google Font to index.html**

Replace the entire `index.html` with:

```html
<!doctype html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#2d6d44" />
    <meta name="description" content="EduCraft — matematická hra pro prvňáky" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
    <link rel="icon" type="image/svg+xml" href="/icons/app-icon.svg" />
    <link rel="apple-touch-icon" href="/icons/app-icon.svg" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <title>EduCraft</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Replace styles.css**

```css
/* src/styles.css */
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; width: 100%; overflow: hidden; }
body {
  font-family: 'Press Start 2P', 'Courier New', monospace;
  background: #0d1b0f;
  color: #ffffff;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* ── CSS Variables ── */
:root {
  --mc-bg:       #0d1b0f;
  --mc-surface:  #1a2e1a;
  --mc-border:   #2d6d44;
  --mc-green:    #5dfc8c;
  --mc-gold:     #ffd700;
  --mc-diamond:  #5de8fc;
  --mc-emerald:  #50f090;
  --mc-red:      #ff6b6b;
  --mc-text:     #ffffff;
  --mc-muted:    #8a9a8a;
  --radius:      6px;
  --hud-height:  56px;
}

/* ── App shell ── */
#root {
  display: flex;
  flex-direction: column;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
}

/* ── Screen wrapper ── */
.screen {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

/* ── Pixel Button ── */
.pixel-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: var(--mc-surface);
  border: 3px solid var(--mc-border);
  border-radius: var(--radius);
  color: var(--mc-text);
  font-family: inherit;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  transition: border-color 0.1s, background 0.1s, transform 0.08s;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.pixel-btn:active { transform: scale(0.95); }
.pixel-btn.primary {
  background: var(--mc-border);
  border-color: var(--mc-green);
  color: #fff;
}
.pixel-btn.gold {
  background: #3a2a00;
  border-color: var(--mc-gold);
  color: var(--mc-gold);
}
.pixel-btn.danger {
  background: #3a0000;
  border-color: var(--mc-red);
  color: var(--mc-red);
}
.pixel-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}
.pixel-btn.big {
  width: 100%;
  padding: 18px;
  font-size: 14px;
}

/* ── HUD ── */
.hud {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--hud-height);
  background: #0a150a;
  border-bottom: 2px solid var(--mc-border);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 12px;
}
.hud-currency {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--mc-gold);
}
.hud-currency span { font-size: 9px; }
.hud-combo {
  margin-left: auto;
  font-size: 10px;
  color: var(--mc-green);
}

/* ── Combo bar ── */
.combo-bar-wrap {
  height: 6px;
  background: #0a150a;
  border-bottom: 1px solid var(--mc-border);
}
.combo-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--mc-border), var(--mc-green));
  transition: width 0.3s ease;
}

/* ── World card ── */
.world-card {
  background: var(--mc-surface);
  border: 3px solid var(--mc-border);
  border-radius: 8px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  transition: border-color 0.15s, transform 0.1s;
}
.world-card:active { transform: scale(0.97); }
.world-card.locked {
  opacity: 0.55;
  cursor: not-allowed;
}
.world-card .world-icon { font-size: 40px; }
.world-card .world-name { font-size: 10px; text-align: center; }
.world-card .world-cost {
  font-size: 9px;
  color: var(--mc-diamond);
  display: flex;
  align-items: center;
  gap: 4px;
}
.world-card .lock-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 16px;
}

/* ── Task area ── */
.task-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  gap: 20px;
}
.task-question {
  font-size: 13px;
  text-align: center;
  line-height: 1.8;
  color: var(--mc-gold);
}

/* ── Object grid ── */
.object-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 10px;
  background: var(--mc-surface);
  border: 2px solid var(--mc-border);
  border-radius: var(--radius);
  min-width: 180px;
}
.object-grid span { font-size: 32px; }

/* ── Answer grid (number options) ── */
.answer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 320px;
}
.answer-btn {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  background: var(--mc-surface);
  border: 3px solid var(--mc-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: border-color 0.1s, background 0.1s, transform 0.08s;
  touch-action: manipulation;
}
.answer-btn:active { transform: scale(0.93); }
.answer-btn.correct { border-color: var(--mc-green); background: #0d3020; }
.answer-btn.wrong   { border-color: var(--mc-red);   background: #300d0d; }

/* ── Compare task ── */
.compare-row {
  display: flex;
  align-items: center;
  gap: 20px;
}
.compare-box {
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  background: var(--mc-surface);
  border: 3px solid var(--mc-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: border-color 0.1s, transform 0.08s;
  touch-action: manipulation;
}
.compare-box:active { transform: scale(0.95); }

/* ── Find grid ── */
.find-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
  max-width: 320px;
}
.find-btn {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: var(--mc-surface);
  border: 3px solid var(--mc-border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: border-color 0.1s, transform 0.08s;
  touch-action: manipulation;
}
.find-btn:active { transform: scale(0.93); }

/* ── Drag Drop ── */
.drag-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}
.drag-source {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  min-height: 80px;
  padding: 12px;
  background: var(--mc-surface);
  border: 2px solid var(--mc-border);
  border-radius: var(--radius);
  width: 100%;
  max-width: 320px;
}
.drag-item {
  font-size: 32px;
  cursor: grab;
  touch-action: none;
}
.drag-item:active { cursor: grabbing; }
.drop-zone {
  min-height: 100px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: #0d2a0d;
  border: 3px dashed var(--mc-green);
  border-radius: var(--radius);
  position: relative;
}
.drop-zone.over { background: #0d3a0d; border-color: var(--mc-gold); }
.drop-zone-label {
  position: absolute;
  bottom: 4px;
  right: 8px;
  font-size: 9px;
  color: var(--mc-muted);
}

/* ── Reward screen ── */
.reward-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 30px 20px;
}
.reward-title {
  font-size: 18px;
  color: var(--mc-green);
  text-shadow: 0 0 20px var(--mc-green);
}
.reward-combo-label {
  font-size: 12px;
  padding: 8px 16px;
  border-radius: var(--radius);
  border: 2px solid currentColor;
}
.gem-burst-row {
  display: flex;
  gap: 12px;
  font-size: 32px;
}

/* ── Shop ── */
.shop-tabs {
  display: flex;
  gap: 4px;
  padding: 10px 12px 0;
  overflow-x: auto;
  scrollbar-width: none;
}
.shop-tabs::-webkit-scrollbar { display: none; }
.shop-tab {
  flex-shrink: 0;
  padding: 8px 12px;
  font-size: 9px;
  background: var(--mc-surface);
  border: 2px solid var(--mc-border);
  border-radius: var(--radius) var(--radius) 0 0;
  cursor: pointer;
  color: var(--mc-muted);
  font-family: inherit;
}
.shop-tab.active { border-color: var(--mc-green); color: #fff; background: #1e3a1e; }
.shop-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px;
}
.shop-item-card {
  background: var(--mc-surface);
  border: 2px solid var(--mc-border);
  border-radius: var(--radius);
  padding: 10px 6px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.1s, transform 0.08s;
  touch-action: manipulation;
}
.shop-item-card:active { transform: scale(0.95); }
.shop-item-card.owned   { border-color: var(--mc-gold); }
.shop-item-card.locked  { opacity: 0.45; cursor: not-allowed; }
.shop-item-card.epic    { border-color: #9b59b6; }
.shop-item-card.legendary { border-color: #ff6b35; }
.shop-item-icon { font-size: 28px; display: block; margin-bottom: 6px; }
.shop-item-name { font-size: 7px; color: var(--mc-muted); margin-bottom: 4px; }
.shop-item-price { font-size: 8px; color: var(--mc-diamond); }
.shop-item-owned { font-size: 8px; color: var(--mc-gold); }

/* ── Showcase ── */
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 12px;
}
.showcase-slot {
  aspect-ratio: 1;
  background: var(--mc-surface);
  border: 2px solid var(--mc-border);
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  cursor: pointer;
  transition: border-color 0.1s;
}
.showcase-slot.filled { border-color: var(--mc-green); }
.showcase-slot.empty  { border-style: dashed; opacity: 0.45; font-size: 16px; color: var(--mc-muted); }
.progress-bar-wrap { margin: 0 12px 12px; }
.progress-bar-track {
  height: 8px;
  background: #0a150a;
  border: 1px solid var(--mc-border);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}
.progress-bar-fill { height: 100%; background: linear-gradient(90deg, var(--mc-border), var(--mc-green)); }
.progress-bar-label { font-size: 8px; color: var(--mc-muted); text-align: center; }

/* ── Profile ── */
.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid var(--mc-border);
  font-size: 10px;
}
.stat-row .label { color: var(--mc-muted); }
.stat-row .value { color: var(--mc-gold); }

/* ── Nav bar (bottom) ── */
.bottom-nav {
  position: sticky;
  bottom: 0;
  z-index: 100;
  background: #0a150a;
  border-top: 2px solid var(--mc-border);
  display: flex;
  justify-content: space-around;
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));
}
.nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  font-size: 20px;
  padding: 4px 20px;
  cursor: pointer;
  background: none;
  border: none;
  font-family: inherit;
  color: var(--mc-muted);
  transition: color 0.1s;
  touch-action: manipulation;
}
.nav-btn.active { color: var(--mc-green); }
.nav-btn span { font-size: 7px; }

/* ── Section title ── */
.section-title {
  font-size: 11px;
  color: var(--mc-gold);
  padding: 14px 12px 8px;
  border-bottom: 1px solid var(--mc-border);
}

/* ── Utility ── */
.text-center { text-align: center; }
.mt-auto { margin-top: auto; }
.p-12 { padding: 12px; }
.gap-8 { gap: 8px; }
.flex-col { display: flex; flex-direction: column; }
.flex-center { display: flex; align-items: center; justify-content: center; }
```

- [ ] **Step 3: Start dev server and check blank green screen loads**

```bash
npm run dev
```

Open http://localhost:5173 — expect a dark green blank page (App.tsx is still a stub).

- [ ] **Step 4: Commit**

```bash
git add index.html src/styles.css
git commit -m "feat: add Minecraft pixel CSS theme and Press Start 2P font"
```

---

## Task 9: UI primitives — PixelButton, WorldCard, GemBurst

**Files:**
- Create: `src/components/ui/PixelButton.tsx`
- Create: `src/components/ui/WorldCard.tsx`
- Create: `src/components/ui/GemBurst.tsx`

- [ ] **Step 1: Create PixelButton**

```tsx
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
```

- [ ] **Step 2: Create WorldCard**

```tsx
// src/components/ui/WorldCard.tsx
import { motion } from 'framer-motion'
import { World } from '../../data/types'

interface Props {
  world: World
  unlocked: boolean
  onPress: () => void
}

export function WorldCard({ world, unlocked, onPress }: Props) {
  return (
    <motion.div
      className={`world-card ${unlocked ? '' : 'locked'}`}
      style={{ borderColor: unlocked ? world.accentColor : undefined }}
      whileTap={unlocked ? { scale: 0.96 } : {}}
      onClick={unlocked ? onPress : undefined}
    >
      {!unlocked && <span className="lock-badge">🔒</span>}
      <span className="world-icon">{world.icon}</span>
      <span className="world-name">{world.name}</span>
      {!unlocked && (
        <span className="world-cost">
          💎 {world.unlockCost}
        </span>
      )}
    </motion.div>
  )
}
```

- [ ] **Step 3: Create GemBurst (animated gem particles)**

```tsx
// src/components/ui/GemBurst.tsx
import { motion } from 'framer-motion'

interface GemParticle {
  emoji: string
  count: number
}

interface Props {
  gems: GemParticle[]
}

export function GemBurst({ gems }: Props) {
  return (
    <div className="gem-burst-row">
      {gems.map(({ emoji, count }, i) =>
        count > 0 ? (
          <motion.div
            key={emoji}
            initial={{ scale: 0, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ delay: i * 0.12, type: 'spring', stiffness: 300 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
          >
            <span style={{ fontSize: 36 }}>{emoji}</span>
            <span style={{ fontSize: 10, color: '#ffd700' }}>+{count}</span>
          </motion.div>
        ) : null
      )}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add PixelButton, WorldCard, GemBurst UI primitives"
```

---

## Task 10: HUD components

**Files:**
- Create: `src/components/hud/HUD.tsx`
- Create: `src/components/hud/ComboBar.tsx`

- [ ] **Step 1: Create ComboBar**

```tsx
// src/components/hud/ComboBar.tsx
import { motion } from 'framer-motion'
import { COMBO_THRESHOLDS } from '../../data/config'

interface Props {
  combo: number
}

export function ComboBar({ combo }: Props) {
  const pct = Math.min((combo / COMBO_THRESHOLDS.mania) * 100, 100)
  return (
    <div className="combo-bar-wrap">
      <motion.div
        className="combo-bar-fill"
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create HUD**

```tsx
// src/components/hud/HUD.tsx
import { useGameStore } from '../../store/gameStore'
import { getComboInfo } from '../../hooks/useCombo'
import { ComboBar } from './ComboBar'

export function HUD() {
  const { diamonds, emeralds, stars, combo } = useGameStore()
  const info = getComboInfo(combo)

  return (
    <>
      <div className="hud">
        <div className="hud-currency">💎 <span>{diamonds}</span></div>
        <div className="hud-currency" style={{ color: 'var(--mc-emerald)' }}>💚 <span>{emeralds}</span></div>
        {stars > 0 && (
          <div className="hud-currency" style={{ color: '#fff' }}>⭐ <span>{stars}</span></div>
        )}
        {combo > 0 && (
          <div className="hud-combo" style={{ color: info.color }}>
            {info.label || `🔥 ${combo}`}
          </div>
        )}
      </div>
      <ComboBar combo={combo} />
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/hud/
git commit -m "feat: add HUD and ComboBar components"
```

---

## Task 11: HomeScreen

**Files:**
- Create: `src/components/screens/HomeScreen.tsx`

- [ ] **Step 1: Create HomeScreen**

```tsx
// src/components/screens/HomeScreen.tsx
import { motion } from 'framer-motion'
import { WORLDS } from '../../data/worlds'
import { useGameStore } from '../../store/gameStore'
import { WorldCard } from '../ui/WorldCard'
import { HUD } from '../hud/HUD'
import { PixelButton } from '../ui/PixelButton'

export function HomeScreen() {
  const { unlockedWorlds, diamonds, enterWorld, unlockWorld, navigateTo } = useGameStore()

  function handleWorldPress(worldId: string, cost: number) {
    const isUnlocked = unlockedWorlds.includes(worldId)
    if (isUnlocked) {
      enterWorld(worldId)
    } else if (diamonds >= cost) {
      unlockWorld(worldId, cost)
    }
  }

  return (
    <div className="screen" style={{ background: 'var(--mc-bg)' }}>
      <HUD />
      <div className="section-title">Vyber svět 🌍</div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          padding: '12px',
          flex: 1,
        }}
      >
        {WORLDS.map((world, i) => (
          <motion.div
            key={world.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <WorldCard
              world={world}
              unlocked={unlockedWorlds.includes(world.id)}
              onPress={() => handleWorldPress(world.id, world.unlockCost)}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="bottom-nav">
        <button className="nav-btn active">
          <span>🌍</span><span>Světy</span>
        </button>
        <button className="nav-btn" onClick={() => navigateTo('shop')}>
          <span>🏪</span><span>Obchod</span>
        </button>
        <button className="nav-btn" onClick={() => navigateTo('profile')}>
          <span>👤</span><span>Profil</span>
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Wire into App.tsx temporarily to verify**

```tsx
// src/App.tsx  (temporary — will be replaced in Task 16)
import { HomeScreen } from './components/screens/HomeScreen'

export default function App() {
  return <HomeScreen />
}
```

- [ ] **Step 3: Start dev server and visually verify**

```bash
npm run dev
```

Open http://localhost:5173 — expect:
- Dark green background
- HUD at top with 💎 10
- 4 world cards in 2×2 grid (Příroda unlocked, rest locked with 🔒)
- Bottom nav with 3 buttons

- [ ] **Step 4: Commit**

```bash
git add src/components/screens/HomeScreen.tsx src/App.tsx
git commit -m "feat: add HomeScreen with world selection grid"
```

---

## Task 12: Simple task components

**Files:**
- Create: `src/components/tasks/CountingTask.tsx`
- Create: `src/components/tasks/TapNumberTask.tsx`
- Create: `src/components/tasks/CompareTask.tsx`
- Create: `src/components/tasks/MultiChoiceTask.tsx`

All task components share this interface:
```ts
interface TaskProps {
  task: Task
  onAnswer: (answer: number | string) => void
}
```

- [ ] **Step 1: Create CountingTask**

```tsx
// src/components/tasks/CountingTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function CountingTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  function handleSelect(opt: number) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div className="object-grid">
        {task.objects?.map((obj, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.04, type: 'spring' }}
          >
            {obj}
          </motion.span>
        ))}
      </div>
      <div className="answer-grid">
        {task.options?.map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(opt)}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create TapNumberTask**

```tsx
// src/components/tasks/TapNumberTask.tsx
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function TapNumberTask({ task, onAnswer }: Props) {
  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', maxWidth: 320 }}>
        {task.options?.map((opt, i) => (
          <motion.button
            key={opt}
            className="answer-btn"
            style={{ width: 72, height: 72, fontSize: 24 }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => onAnswer(opt)}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create CompareTask**

```tsx
// src/components/tasks/CompareTask.tsx
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function CompareTask({ task, onAnswer }: Props) {
  const [a, b] = task.options ?? [0, 0]
  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div className="compare-row">
        <motion.div className="compare-box" whileTap={{ scale: 0.9 }} onClick={() => onAnswer(a)}>
          {a}
        </motion.div>
        <span style={{ fontSize: 28, color: 'var(--mc-muted)' }}>VS</span>
        <motion.div className="compare-box" whileTap={{ scale: 0.9 }} onClick={() => onAnswer(b)}>
          {b}
        </motion.div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create MultiChoiceTask**

```tsx
// src/components/tasks/MultiChoiceTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function MultiChoiceTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  function handleSelect(opt: number) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      {task.objects && (
        <div className="object-grid">
          {task.objects.map((obj, i) => (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04, type: 'spring' }}>
              {obj}
            </motion.span>
          ))}
        </div>
      )}
      <div className="answer-grid">
        {task.options?.map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(opt)}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/tasks/CountingTask.tsx src/components/tasks/TapNumberTask.tsx \
        src/components/tasks/CompareTask.tsx src/components/tasks/MultiChoiceTask.tsx
git commit -m "feat: add CountingTask, TapNumberTask, CompareTask, MultiChoiceTask"
```

---

## Task 13: MathTask & FindTask

**Files:**
- Create: `src/components/tasks/MathTask.tsx`
- Create: `src/components/tasks/FindTask.tsx`

- [ ] **Step 1: Create MathTask**

```tsx
// src/components/tasks/MathTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function MathTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)

  function handleSelect(opt: number) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <motion.p
        className="task-question"
        style={{ fontSize: 22, letterSpacing: 4 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {task.question}
      </motion.p>
      <div className="answer-grid">
        {task.options?.map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            style={{ fontSize: 26 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(opt)}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create FindTask**

```tsx
// src/components/tasks/FindTask.tsx
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function FindTask({ task, onAnswer }: Props) {
  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div className="find-grid">
        {task.options?.map((opt, i) => (
          <motion.button
            key={`${opt}-${i}`}
            className="find-btn"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.88 }}
            onClick={() => onAnswer(opt)}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/tasks/MathTask.tsx src/components/tasks/FindTask.tsx
git commit -m "feat: add MathTask and FindTask components"
```

---

## Task 14: DragDropTask

**Files:**
- Create: `src/components/tasks/DragDropTask.tsx`

This is the most complex task. Strategy: each source item is a `motion.div` with `drag`. On `onDragEnd`, check if the pointer landed inside the drop zone rect. If yes, "consume" the item (remove from source, add to basket). Auto-check when basket count matches `dragTarget`. If over-dropped, shake the basket and reset.

- [ ] **Step 1: Create DragDropTask**

```tsx
// src/components/tasks/DragDropTask.tsx
import { useRef, useState } from 'react'
import { motion, useAnimation, PanInfo } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function DragDropTask({ task, onAnswer }: Props) {
  const target = task.dragTarget ?? Number(task.correctAnswer)
  const totalObjects = task.objects?.length ?? target + 3
  const emoji = task.objects?.[0] ?? '⭐'

  const [sourceIds, setSourceIds] = useState<number[]>(() =>
    Array.from({ length: totalObjects }, (_, i) => i)
  )
  const [basketCount, setBasketCount] = useState(0)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const basketControls = useAnimation()

  function isOverDropZone(point: { x: number; y: number }): boolean {
    const rect = dropZoneRef.current?.getBoundingClientRect()
    if (!rect) return false
    return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
  }

  async function handleDragEnd(id: number, _e: unknown, info: PanInfo) {
    if (!isOverDropZone(info.point)) return

    const newBasket = basketCount + 1
    setSourceIds(ids => ids.filter(i => i !== id))
    setBasketCount(newBasket)

    if (newBasket > target) {
      // Too many — shake and reset
      await basketControls.start({
        x: [0, -10, 10, -8, 8, 0],
        transition: { duration: 0.4 },
      })
      setSourceIds(Array.from({ length: totalObjects }, (_, i) => i))
      setBasketCount(0)
      return
    }

    if (newBasket === target) {
      setTimeout(() => onAnswer(newBasket), 300)
    }
  }

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>

      {/* Source pool */}
      <div className="drag-source">
        {sourceIds.map(id => (
          <motion.div
            key={id}
            className="drag-item"
            drag
            dragSnapToOrigin
            dragElastic={0.2}
            onDragEnd={(e, info) => handleDragEnd(id, e, info)}
            whileDrag={{ scale: 1.25, zIndex: 50 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Drop zone */}
      <motion.div
        ref={dropZoneRef}
        className="drop-zone"
        animate={basketControls}
      >
        {Array.from({ length: basketCount }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ fontSize: 28 }}
          >
            {emoji}
          </motion.span>
        ))}
        <span className="drop-zone-label">
          {basketCount} / {target}
        </span>
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tasks/DragDropTask.tsx
git commit -m "feat: add DragDropTask with Framer Motion touch drag"
```

---

## Task 15: TaskRenderer & GameScreen

**Files:**
- Create: `src/components/tasks/TaskRenderer.tsx`
- Create: `src/components/screens/GameScreen.tsx`

- [ ] **Step 1: Create TaskRenderer**

```tsx
// src/components/tasks/TaskRenderer.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '../../data/types'
import { CountingTask } from './CountingTask'
import { TapNumberTask } from './TapNumberTask'
import { CompareTask } from './CompareTask'
import { MultiChoiceTask } from './MultiChoiceTask'
import { MathTask } from './MathTask'
import { FindTask } from './FindTask'
import { DragDropTask } from './DragDropTask'

interface Props {
  task: Task
  onAnswer: (answer: number | string) => void
}

export function TaskRenderer({ task, onAnswer }: Props) {
  const inner = (() => {
    switch (task.type) {
      case 'counting':    return <CountingTask    task={task} onAnswer={onAnswer} />
      case 'tapNumber':   return <TapNumberTask   task={task} onAnswer={onAnswer} />
      case 'compare':     return <CompareTask     task={task} onAnswer={onAnswer} />
      case 'multiChoice': return <MultiChoiceTask task={task} onAnswer={onAnswer} />
      case 'math':        return <MathTask        task={task} onAnswer={onAnswer} />
      case 'find':        return <FindTask        task={task} onAnswer={onAnswer} />
      case 'dragDrop':    return <DragDropTask    task={task} onAnswer={onAnswer} />
    }
  })()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={task.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.2 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {inner}
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Create GameScreen**

```tsx
// src/components/screens/GameScreen.tsx
import { useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { useTask } from '../../hooks/useTask'
import { HUD } from '../hud/HUD'
import { TaskRenderer } from '../tasks/TaskRenderer'
import { PixelButton } from '../ui/PixelButton'

export function GameScreen() {
  const { currentWorldId, answerCorrect, answerIncorrect, navigateTo, resetCombo } = useGameStore()
  const worldId = currentWorldId ?? 'forest'
  const { task, nextTask, checkAnswer } = useTask(worldId)
  const shakeControls = useAnimation()
  const hasAnswered = useRef(false)

  async function handleAnswer(answer: number | string) {
    if (hasAnswered.current) return
    hasAnswered.current = true

    if (checkAnswer(answer)) {
      answerCorrect(worldId)
      // RewardScreen will be shown by App — nextTask called when returning
    } else {
      answerIncorrect()
      await shakeControls.start({
        x: [0, -12, 12, -10, 10, -6, 6, 0],
        transition: { duration: 0.5 },
      })
      hasAnswered.current = false
    }
  }

  function handleBackHome() {
    resetCombo()
    navigateTo('home')
  }

  if (!task) return null

  return (
    <div className="screen" style={{ background: 'var(--mc-bg)' }}>
      <HUD />
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', gap: 8 }}>
        <PixelButton onClick={handleBackHome} style={{ padding: '8px 12px', fontSize: 10 }}>
          ← Domů
        </PixelButton>
      </div>
      <motion.div
        animate={shakeControls}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <TaskRenderer
          task={task}
          onAnswer={handleAnswer}
        />
      </motion.div>
    </div>
  )
}

// Note: GameScreen remounts after RewardScreen (AnimatePresence mode="wait" + key="game"),
// so useTask reinitialises automatically with a fresh task on every return from reward.
```

- [ ] **Step 3: Commit**

```bash
git add src/components/tasks/TaskRenderer.tsx src/components/screens/GameScreen.tsx
git commit -m "feat: add TaskRenderer and GameScreen"
```

---

## Task 16: RewardScreen

**Files:**
- Create: `src/components/screens/RewardScreen.tsx`

- [ ] **Step 1: Create RewardScreen**

```tsx
// src/components/screens/RewardScreen.tsx
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { getComboInfo } from '../../hooks/useCombo'
import { GemBurst } from '../ui/GemBurst'
import { REWARD_SCREEN_DURATION } from '../../data/config'
import { COMBO_REWARDS, getComboLevel } from '../../data/config'

interface Props {
  onDone: () => void
}

export function RewardScreen({ onDone }: Props) {
  const { combo, currentWorldId } = useGameStore()
  const info = getComboInfo(combo)
  const level = getComboLevel(combo)
  const rewards = COMBO_REWARDS[level]

  // Auto-return after REWARD_SCREEN_DURATION
  useEffect(() => {
    const t = setTimeout(onDone, REWARD_SCREEN_DURATION)
    return () => clearTimeout(t)
  }, [onDone])

  const gems = [
    { emoji: '💎', count: rewards.diamonds ?? 0 },
    { emoji: '💚', count: rewards.emeralds ?? 0 },
    { emoji: '⭐', count: rewards.stars ?? 0 },
  ]

  return (
    <motion.div
      className="screen reward-screen"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      style={{ background: 'var(--mc-bg)' }}
    >
      <motion.p
        className="reward-title"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
      >
        SPRÁVNĚ! ✓
      </motion.p>

      {combo > 2 && (
        <motion.div
          className="reward-combo-label"
          style={{ color: info.color, borderColor: info.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 260 }}
        >
          {info.label}
        </motion.div>
      )}

      <GemBurst gems={gems} />
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/screens/RewardScreen.tsx
git commit -m "feat: add RewardScreen with GemBurst animation"
```

---

## Task 17: ShopScreen

**Files:**
- Create: `src/components/screens/ShopScreen.tsx`

- [ ] **Step 1: Create ShopScreen**

```tsx
// src/components/screens/ShopScreen.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'
import { ShopItem, ItemCategory } from '../../data/types'
import { HUD } from '../hud/HUD'

const CATEGORIES: { id: ItemCategory | 'all'; label: string }[] = [
  { id: 'all',         label: '🎒 Vše'     },
  { id: 'weapon',      label: '⚔️ Zbraně'  },
  { id: 'armor',       label: '🛡️ Brnění'  },
  { id: 'trophy',      label: '🏆 Trofeje' },
  { id: 'decoration',  label: '✨ Deko'    },
  { id: 'rare',        label: '🌟 Vzácné'  },
]

function costLabel(item: ShopItem): string {
  const { diamonds = 0, emeralds = 0, stars = 0 } = item.cost
  const parts: string[] = []
  if (diamonds) parts.push(`💎 ${diamonds}`)
  if (emeralds) parts.push(`💚 ${emeralds}`)
  if (stars)    parts.push(`⭐ ${stars}`)
  return parts.join(' ')
}

function canAfford(item: ShopItem, diamonds: number, emeralds: number, stars: number): boolean {
  return (item.cost.diamonds ?? 0) <= diamonds &&
         (item.cost.emeralds ?? 0) <= emeralds &&
         (item.cost.stars    ?? 0) <= stars
}

export function ShopScreen() {
  const [activeTab, setActiveTab] = useState<ItemCategory | 'all'>('all')
  const { diamonds, emeralds, stars, ownedItems, showcaseSlots, buyItem, addToShowcase, navigateTo } = useGameStore()

  const visible = activeTab === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter(i => i.category === activeTab)

  function handleBuy(item: ShopItem) {
    if (ownedItems.includes(item.id)) return
    const ok = buyItem(item)
    if (ok) {
      // Auto-place in first empty showcase slot
      const emptySlot = showcaseSlots.findIndex(s => s === null)
      if (emptySlot !== -1) addToShowcase(item.id, emptySlot)
    }
  }

  const owned = ownedItems.length
  const total = SHOP_ITEMS.length

  return (
    <div className="screen" style={{ background: 'var(--mc-bg)' }}>
      <HUD />
      <div className="section-title">🏪 Obchod</div>

      {/* Tabs */}
      <div className="shop-tabs">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`shop-tab ${activeTab === cat.id ? 'active' : ''}`}
            onClick={() => setActiveTab(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="shop-grid" style={{ overflowY: 'auto', flex: 1 }}>
        <AnimatePresence>
          {visible.map((item, i) => {
            const owned2 = ownedItems.includes(item.id)
            const affordable = canAfford(item, diamonds, emeralds, stars)
            return (
              <motion.div
                key={item.id}
                className={[
                  'shop-item-card',
                  owned2 ? 'owned' : '',
                  !owned2 && !affordable ? 'locked' : '',
                  item.rarity === 'epic' ? 'epic' : '',
                  item.rarity === 'legendary' ? 'legendary' : '',
                ].join(' ')}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleBuy(item)}
              >
                <span className="shop-item-icon">{item.icon}</span>
                <div className="shop-item-name">{item.name}</div>
                {owned2
                  ? <div className="shop-item-owned">✓ mám</div>
                  : <div className="shop-item-price">{costLabel(item)}</div>
                }
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Showcase */}
      <div className="section-title">🖼️ Vitrína</div>
      <div className="showcase-grid">
        {showcaseSlots.map((itemId, slot) => {
          const item = itemId ? SHOP_ITEMS.find(i => i.id === itemId) : null
          return (
            <motion.div
              key={slot}
              className={`showcase-slot ${item ? 'filled' : 'empty'}`}
              whileTap={{ scale: 0.9 }}
            >
              {item ? item.icon : '?'}
            </motion.div>
          )
        })}
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${(owned / total) * 100}%` }} />
        </div>
        <div className="progress-bar-label">{owned} z {total} předmětů</div>
      </div>

      <div className="bottom-nav">
        <button className="nav-btn" onClick={() => navigateTo('home')}>
          <span>🌍</span><span>Světy</span>
        </button>
        <button className="nav-btn active">
          <span>🏪</span><span>Obchod</span>
        </button>
        <button className="nav-btn" onClick={() => navigateTo('profile')}>
          <span>👤</span><span>Profil</span>
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/screens/ShopScreen.tsx
git commit -m "feat: add ShopScreen with tabs and showcase"
```

---

## Task 18: ProfileScreen

**Files:**
- Create: `src/components/screens/ProfileScreen.tsx`

- [ ] **Step 1: Create ProfileScreen**

```tsx
// src/components/screens/ProfileScreen.tsx
import { motion } from 'framer-motion'
import { useGameStore } from '../../store/gameStore'
import { SHOP_ITEMS } from '../../data/shopItems'
import { WORLDS } from '../../data/worlds'
import { HUD } from '../hud/HUD'

export function ProfileScreen() {
  const { totalCorrect, totalAttempts, maxCombo, sessionsPlayed, unlockedWorlds, ownedItems, showcaseSlots, navigateTo } = useGameStore()
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

  return (
    <div className="screen" style={{ background: 'var(--mc-bg)' }}>
      <HUD />
      <div className="section-title">👤 Profil</div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        {/* Stats */}
        <div className="stat-row"><span className="label">Správných odpovědí</span><span className="value">{totalCorrect}</span></div>
        <div className="stat-row"><span className="label">Přesnost</span><span className="value">{accuracy} %</span></div>
        <div className="stat-row"><span className="label">Nejlepší combo</span><span className="value">🔥 {maxCombo}</span></div>
        <div className="stat-row"><span className="label">Odehraných sezení</span><span className="value">{sessionsPlayed}</span></div>
        <div className="stat-row"><span className="label">Odemčené světy</span><span className="value">{unlockedWorlds.length} / {WORLDS.length}</span></div>
        <div className="stat-row"><span className="label">Sbírka</span><span className="value">{ownedItems.length} / {SHOP_ITEMS.length}</span></div>

        {/* Full showcase */}
        <div className="section-title" style={{ marginTop: 8 }}>🖼️ Moje vitrína</div>
        <motion.div
          className="showcase-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {showcaseSlots.map((itemId, slot) => {
            const item = itemId ? SHOP_ITEMS.find(i => i.id === itemId) : null
            return (
              <motion.div
                key={slot}
                className={`showcase-slot ${item ? 'filled' : 'empty'}`}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: slot * 0.04 }}
              >
                {item ? item.icon : '?'}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Worlds progress */}
        <div className="section-title">🌍 Světy</div>
        {WORLDS.map(world => (
          <div key={world.id} className="stat-row">
            <span className="label">{world.icon} {world.name}</span>
            <span className="value" style={{ color: unlockedWorlds.includes(world.id) ? 'var(--mc-green)' : 'var(--mc-muted)' }}>
              {unlockedWorlds.includes(world.id) ? '✓ Odemčeno' : '🔒'}
            </span>
          </div>
        ))}
      </div>

      <div className="bottom-nav">
        <button className="nav-btn" onClick={() => navigateTo('home')}>
          <span>🌍</span><span>Světy</span>
        </button>
        <button className="nav-btn" onClick={() => navigateTo('shop')}>
          <span>🏪</span><span>Obchod</span>
        </button>
        <button className="nav-btn active">
          <span>👤</span><span>Profil</span>
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/screens/ProfileScreen.tsx
git commit -m "feat: add ProfileScreen with stats and showcase"
```

---

## Task 19: App.tsx routing with AnimatePresence

**Files:**
- Replace: `src/App.tsx`

- [ ] **Step 1: Replace App.tsx with full router**

```tsx
// src/App.tsx
import { useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './store/gameStore'
import { HomeScreen } from './components/screens/HomeScreen'
import { GameScreen } from './components/screens/GameScreen'
import { RewardScreen } from './components/screens/RewardScreen'
import { ShopScreen } from './components/screens/ShopScreen'
import { ProfileScreen } from './components/screens/ProfileScreen'

const SLIDE = {
  initial:  { opacity: 0, x: 60 },
  animate:  { opacity: 1, x: 0  },
  exit:     { opacity: 0, x: -60 },
  transition: { duration: 0.22, ease: 'easeInOut' },
}

export default function App() {
  const { currentScreen, currentWorldId, navigateTo } = useGameStore()

  const handleRewardDone = useCallback(() => {
    navigateTo('game')
  }, [navigateTo])

  return (
    <div style={{ position: 'relative', height: '100dvh', overflow: 'hidden', maxWidth: 480, margin: '0 auto' }}>
      <AnimatePresence mode="wait">
        {currentScreen === 'home' && (
          <motion.div key="home" className="screen" {...SLIDE}>
            <HomeScreen />
          </motion.div>
        )}
        {currentScreen === 'game' && currentWorldId && (
          <motion.div key="game" className="screen" {...SLIDE}>
            <GameScreen />
          </motion.div>
        )}
        {currentScreen === 'reward' && (
          <motion.div key="reward" className="screen" {...SLIDE}>
            <RewardScreen onDone={handleRewardDone} />
          </motion.div>
        )}
        {currentScreen === 'shop' && (
          <motion.div key="shop" className="screen" {...SLIDE}>
            <ShopScreen />
          </motion.div>
        )}
        {currentScreen === 'profile' && (
          <motion.div key="profile" className="screen" {...SLIDE}>
            <ProfileScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Start dev server and do a full manual test**

```bash
npm run dev
```

Test the following golden path:
1. Open http://localhost:5173 — HomeScreen loads, 💎 10 in HUD
2. Tap "Příroda" — GameScreen opens with a task
3. Answer correctly — RewardScreen flashes (0.8s), auto-returns to GameScreen
4. Answer 3 in a row — combo shows 🔥 COMBO x2 in HUD
5. Tap "← Domů" — returns to HomeScreen
6. Tap 🏪 — ShopScreen opens, sword_wood shows ✓
7. Buy Kamenný meč (need 20 💎, start with 10 so play a few rounds first)
8. Tap 👤 — ProfileScreen shows stats

- [ ] **Step 3: Run all tests**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: wire full screen router with AnimatePresence"
```

---

## Task 20: PWA verification & GameScreen nextTask fix

**Files:**
- Modify: `src/components/screens/GameScreen.tsx` — reset `hasAnswered` after RewardScreen returns

- [ ] **Step 1: Fix GameScreen — reset hasAnswered ref when task changes**

The `hasAnswered` ref must reset when the screen returns from RewardScreen and a new task is shown. Add a `useEffect` that resets it when `task.id` changes:

In `GameScreen.tsx`, add this import and effect:

```tsx
import { useRef, useEffect } from 'react'
```

Add after the `shakeControls` line:

```tsx
useEffect(() => {
  hasAnswered.current = false
}, [task?.id])
```

- [ ] **Step 2: Verify offline PWA**

```bash
npm run build && npm run preview
```

Open http://localhost:4173, open DevTools → Application → Service Workers. Verify:
- SW is registered and active
- Manifest is detected (green check in Application → Manifest)
- In Network tab, throttle to Offline — reload page — app still works

- [ ] **Step 3: Add .superpowers to .gitignore**

```bash
echo ".superpowers/" >> .gitignore
```

- [ ] **Step 4: Run full test suite one final time**

```bash
npm run test:run
```

Expected: all tests PASS.

- [ ] **Step 5: Final commit**

```bash
git add src/components/screens/GameScreen.tsx .gitignore
git commit -m "fix: reset hasAnswered on task change, add .superpowers to gitignore"
```

---

---

## Task 21: Sound system

**Files:**
- Create: `src/audio/sounds.ts`
- Modify: `src/store/gameStore.ts` (add `muted` field + `setMuted` action)
- Modify: `src/data/types.ts` (add `muted: boolean` + `setMuted` to GameState)
- Modify: `src/components/hud/HUD.tsx` (add mute toggle button)

All sounds generated programmatically via Web Audio API — no MP3 files, works fully offline.

- [ ] **Step 1: Add `muted` state to types.ts**

In `src/data/types.ts`, add to GameState interface:

```ts
muted: boolean
setMuted: (muted: boolean) => void
```

- [ ] **Step 2: Create sound system**

```ts
// src/audio/sounds.ts

let _muted = false

function ctx(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)()
}

function beep(frequency: number, duration: number, type: OscillatorType = 'square', volume = 0.15): void {
  if (_muted) return
  try {
    const ac = ctx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = type
    osc.frequency.setValueAtTime(frequency, ac.currentTime)
    gain.gain.setValueAtTime(volume, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration)
    osc.start(ac.currentTime)
    osc.stop(ac.currentTime + duration)
  } catch {
    // AudioContext blocked (e.g. autoplay policy) — silent fail
  }
}

export function setMuted(muted: boolean): void {
  _muted = muted
}

export function isMuted(): boolean {
  return _muted
}

export const playSound = {
  correct(): void {
    beep(660, 0.12, 'sine', 0.18)
    setTimeout(() => beep(880, 0.15, 'sine', 0.15), 80)
  },
  wrong(): void {
    beep(220, 0.2, 'square', 0.08)
  },
  combo(): void {
    beep(440, 0.08, 'sine')
    setTimeout(() => beep(554, 0.08, 'sine'), 90)
    setTimeout(() => beep(659, 0.15, 'sine'), 180)
  },
  mania(): void {
    [440, 554, 659, 880].forEach((f, i) =>
      setTimeout(() => beep(f, 0.1, 'sine', 0.2), i * 80)
    )
  },
  reward(): void {
    [523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => beep(f, 0.12, 'sine', 0.18), i * 100)
    )
  },
  unlock(): void {
    [392, 523, 659, 784, 1046].forEach((f, i) =>
      setTimeout(() => beep(f, 0.1, 'sine', 0.2), i * 80)
    )
  },
  wheel(): void {
    let delay = 0
    for (let i = 0; i < 8; i++) {
      const freq = 300 + i * 40
      setTimeout(() => beep(freq, 0.06, 'square', 0.1), delay)
      delay += 60 + i * 30  // slowing down
    }
  },
}
```

- [ ] **Step 3: Update gameStore.ts — add muted state**

In `src/store/gameStore.ts`, add to the initial state and persist:

```ts
// Add to initial state object:
muted: false,

// Add action:
setMuted: (muted: boolean) => {
  set({ muted })
  setMutedSound(muted)  // import { setMuted as setMutedSound } from '../audio/sounds'
},
```

Add import at top of gameStore.ts:
```ts
import { setMuted as setMutedSound } from '../audio/sounds'
```

- [ ] **Step 4: Wire sounds into GameScreen**

In `src/components/screens/GameScreen.tsx`, import and call sounds:

```tsx
import { playSound } from '../../audio/sounds'
import { getComboLevel } from '../../data/config'

// In handleAnswer, after checkAnswer:
if (correct) {
  const level = getComboLevel(combo + 1)
  if (level === 'mania') playSound.mania()
  else if (level === 'fire' || level === 'doubleFire') playSound.combo()
  else playSound.correct()
  answerCorrect(worldId)
} else {
  playSound.wrong()
  answerIncorrect()
  // ... shake animation
}
```

In `src/components/screens/RewardScreen.tsx`, add at the top of the component:
```tsx
useEffect(() => { playSound.reward() }, [])
```

- [ ] **Step 5: Add mute toggle to HUD.tsx**

In `src/components/hud/HUD.tsx`, add mute button:

```tsx
const { diamonds, emeralds, stars, combo, muted, setMuted } = useGameStore()

// Add to HUD JSX after existing content:
<button
  onClick={() => setMuted(!muted)}
  style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: 'var(--mc-muted)' }}
  aria-label={muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}
>
  {muted ? '🔇' : '🔊'}
</button>
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/audio/sounds.ts src/data/types.ts src/store/gameStore.ts \
        src/components/hud/HUD.tsx src/components/screens/GameScreen.tsx \
        src/components/screens/RewardScreen.tsx
git commit -m "feat: add Web Audio sound system with mute toggle"
```

---

## Task 22: Adaptive difficulty

**Files:**
- Create: `src/hooks/useAdaptiveDifficulty.ts`
- Create: `tests/useAdaptiveDifficulty.test.ts`
- Modify: `src/components/screens/GameScreen.tsx` (use adaptive range)
- Modify: `src/hooks/useTask.ts` (accept optional range override)

The hook tracks correct/incorrect answers for the current world session and adjusts the number range to keep the child in the flow zone.

- [ ] **Step 1: Write failing tests**

```ts
// tests/useAdaptiveDifficulty.test.ts
import { describe, it, expect } from 'vitest'
import { getAdaptedRange } from '../src/hooks/useAdaptiveDifficulty'

const BASE: [number, number] = [1, 10]

describe('getAdaptedRange', () => {
  it('returns base range when no attempts yet', () => {
    expect(getAdaptedRange(BASE, 0, 0)).toEqual([1, 10])
  })
  it('returns base range when accuracy is in flow zone (60-90%)', () => {
    expect(getAdaptedRange(BASE, 7, 10)).toEqual([1, 10])
  })
  it('narrows to lower half when accuracy < 60%', () => {
    const result = getAdaptedRange(BASE, 2, 10)
    expect(result[0]).toBe(1)
    expect(result[1]).toBeLessThanOrEqual(6)
  })
  it('shifts to upper half when accuracy > 90%', () => {
    const result = getAdaptedRange(BASE, 10, 10)
    expect(result[0]).toBeGreaterThanOrEqual(5)
    expect(result[1]).toBe(10)
  })
  it('always returns range where min < max', () => {
    const tiny: [number, number] = [1, 2]
    const result = getAdaptedRange(tiny, 10, 10)
    expect(result[0]).toBeLessThan(result[1])
  })
})
```

- [ ] **Step 2: Run to confirm failures**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run test:run
```

Expected: FAIL — `getAdaptedRange` not found.

- [ ] **Step 3: Create the hook**

```ts
// src/hooks/useAdaptiveDifficulty.ts
import { useState, useCallback } from 'react'

/** Pure function — testable without React */
export function getAdaptedRange(
  base: [number, number],
  correct: number,
  attempts: number
): [number, number] {
  if (attempts < 5) return base                      // not enough data yet
  const [min, max] = base
  const mid = Math.ceil((min + max) / 2)
  const accuracy = correct / attempts

  if (accuracy < 0.6) {
    // Too hard — narrow to lower half
    const upperBound = Math.max(min + 1, mid)
    return [min, upperBound]
  }
  if (accuracy > 0.9) {
    // Too easy — shift to upper half
    const lowerBound = Math.min(max - 1, mid)
    return [lowerBound, max]
  }
  return base
}

export interface UseAdaptiveDifficultyReturn {
  adaptedRange: [number, number]
  recordCorrect: () => void
  recordIncorrect: () => void
  reset: () => void
}

export function useAdaptiveDifficulty(base: [number, number]): UseAdaptiveDifficultyReturn {
  const [correct, setCorrect] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const recordCorrect = useCallback(() => {
    setCorrect(c => c + 1)
    setAttempts(a => a + 1)
  }, [])

  const recordIncorrect = useCallback(() => {
    setAttempts(a => a + 1)
  }, [])

  const reset = useCallback(() => {
    setCorrect(0)
    setAttempts(0)
  }, [])

  return {
    adaptedRange: getAdaptedRange(base, correct, attempts),
    recordCorrect,
    recordIncorrect,
    reset,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run
```

Expected: all adaptive difficulty tests PASS.

- [ ] **Step 5: Update useTask to accept optional range override**

In `src/hooks/useTask.ts`, modify the function signature:

```ts
export function useTask(worldId: string, rangeOverride?: [number, number]): UseTaskReturn {
  const world = getWorld(worldId)
  // Replace all uses of world.numberRange with:
  const effectiveRange = rangeOverride ?? world?.numberRange ?? [1, 5]
  // Use effectiveRange instead of world.numberRange in generateNext
```

In `generateNext`, replace `world.numberRange` with `effectiveRange` and also replace the easy range calculation:
```ts
const easyRange: [number, number] = [
  effectiveRange[0],
  Math.ceil((effectiveRange[0] + effectiveRange[1]) / 2),
]
```

- [ ] **Step 6: Wire into GameScreen**

In `src/components/screens/GameScreen.tsx`:

```tsx
import { useAdaptiveDifficulty } from '../../hooks/useAdaptiveDifficulty'

// Inside GameScreen component, after worldId line:
const world = getWorld(worldId)
const { adaptedRange, recordCorrect, recordIncorrect } = useAdaptiveDifficulty(
  world?.numberRange ?? [1, 5]
)
const { task, nextTask, checkAnswer } = useTask(worldId, adaptedRange)

// In handleAnswer:
if (checkAnswer(answer)) {
  recordCorrect()
  // ... rest of correct handler
} else {
  recordIncorrect()
  // ... rest of wrong handler
}
```

Add import: `import { getWorld } from '../../data/worlds'`

- [ ] **Step 7: Verify TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Step 8: Commit**

```bash
git add src/hooks/useAdaptiveDifficulty.ts tests/useAdaptiveDifficulty.test.ts \
        src/hooks/useTask.ts src/components/screens/GameScreen.tsx
git commit -m "feat: add adaptive difficulty — tracks accuracy and adjusts number range"
```

---

## Task 23: Lucky Wheel — Kolo štěstí

Příležitostná bonusová odměna. Spouští se maximálně 3× za session, nikdy pravidelně.

**Files:**
- Create: `src/hooks/useLuckyWheel.ts`
- Create: `src/components/ui/LuckyWheel.tsx`
- Modify: `src/data/types.ts` (add `wheelSpinsToday`, `totalCorrectSession` to GameState)
- Modify: `src/store/gameStore.ts` (add wheel state + `triggerWheel`, `dismissWheel`, `collectWheelReward`)
- Modify: `src/components/screens/GameScreen.tsx` (show LuckyWheel overlay)

- [ ] **Step 1: Add wheel fields to types.ts**

In `src/data/types.ts`, add to GameState:

```ts
wheelSpinsToday: number        // max 3 per session
totalCorrectSession: number    // resets each session, used for wheel trigger
wheelPending: boolean          // true when wheel should be shown
triggerWheel: () => void
dismissWheel: () => void
collectWheelReward: (reward: WheelReward) => void
```

Add new type above GameState:

```ts
export interface WheelReward {
  label: string
  diamonds?: number
  emeralds?: number
  stars?: number
  itemId?: string   // for random shop item reward
}
```

- [ ] **Step 2: Create useLuckyWheel hook**

```ts
// src/hooks/useLuckyWheel.ts
// Determines when to trigger the Lucky Wheel

export const WHEEL_REWARDS: WheelReward[] = [
  { label: '💎 +3',  diamonds: 3 },
  { label: '💎 +6',  diamonds: 6 },
  { label: '💚 +4',  emeralds: 4 },
  { label: '⭐ +1',  stars: 1 },
  { label: '🎁 Překvapení', itemId: 'random' },
]

// Import WheelReward from types
import { WheelReward } from '../data/types'
export { WheelReward }

export function shouldTriggerWheel(
  totalCorrectSession: number,
  wheelSpinsToday: number,
  isFirstCombo10: boolean
): boolean {
  if (wheelSpinsToday >= 3) return false
  if (isFirstCombo10) return true
  // Random trigger: roughly every 15-25 correct answers, not guaranteed
  if (totalCorrectSession > 0 && totalCorrectSession % 20 === 0) {
    return Math.random() < 0.6   // 60% chance at the checkpoint
  }
  return false
}

export function pickRandomReward(ownedItems: string[]): WheelReward {
  // For 'random' itemId, pick a shop item the child doesn't own yet
  // This is resolved in the store when collecting the reward
  const idx = Math.floor(Math.random() * WHEEL_REWARDS.length)
  return WHEEL_REWARDS[idx]
}
```

- [ ] **Step 3: Update gameStore.ts**

Add to initial state:
```ts
wheelSpinsToday: 0,
totalCorrectSession: 0,
wheelPending: false,
```

Add actions:
```ts
triggerWheel: () => set({ wheelPending: true }),

dismissWheel: () => set(s => ({
  wheelPending: false,
  wheelSpinsToday: s.wheelSpinsToday + 1,
})),

collectWheelReward: (reward: WheelReward) => {
  const s = get()
  // Resolve 'random' item
  let resolvedItemId: string | undefined
  if (reward.itemId === 'random') {
    const available = SHOP_ITEMS.filter(i => !s.ownedItems.includes(i.id))
    if (available.length > 0) {
      resolvedItemId = available[Math.floor(Math.random() * available.length)].id
    }
  }
  set(prev => ({
    diamonds: prev.diamonds + (reward.diamonds ?? 0),
    emeralds: prev.emeralds + (reward.emeralds ?? 0),
    stars: prev.stars + (reward.stars ?? 0),
    ownedItems: resolvedItemId ? [...prev.ownedItems, resolvedItemId] : prev.ownedItems,
    wheelPending: false,
    wheelSpinsToday: prev.wheelSpinsToday + 1,
  }))
},
```

Add import at top: `import { SHOP_ITEMS } from '../data/shopItems'`

- [ ] **Step 4: Create LuckyWheel component**

```tsx
// src/components/ui/LuckyWheel.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { WheelReward } from '../../data/types'
import { WHEEL_REWARDS } from '../../hooks/useLuckyWheel'
import { playSound } from '../../audio/sounds'

interface Props {
  onCollect: (reward: WheelReward) => void
}

const SEGMENT_COLORS = ['#2d6d44', '#1a3d88', '#6d2d44', '#6d5a2d', '#2d4d6d']

export function LuckyWheel({ onCollect }: Props) {
  const [spinning, setSpinning] = useState(false)
  const [resultIdx, setResultIdx] = useState<number | null>(null)
  const [rotation, setRotation] = useState(0)

  const segmentAngle = 360 / WHEEL_REWARDS.length

  function spin() {
    if (spinning || resultIdx !== null) return
    const picked = Math.floor(Math.random() * WHEEL_REWARDS.length)
    // Spin at least 4 full rotations, land on picked segment
    const targetAngle = 360 * 5 + (360 - picked * segmentAngle - segmentAngle / 2)
    setSpinning(true)
    setRotation(prev => prev + targetAngle)
    playSound.wheel()
    setTimeout(() => {
      setSpinning(false)
      setResultIdx(picked)
    }, 2200)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 24, padding: 24,
      }}
    >
      <p style={{ fontSize: 14, color: '#ffd700', fontFamily: 'inherit' }}>
        🎡 KOLO ŠTĚSTÍ!
      </p>

      {/* Wheel */}
      <div style={{ position: 'relative', width: 240, height: 240 }}>
        {/* Pointer */}
        <div style={{
          position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
          fontSize: 24, zIndex: 10,
        }}>▼</div>

        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            width: 240, height: 240,
            borderRadius: '50%',
            border: '4px solid #ffd700',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <svg viewBox="0 0 100 100" width="240" height="240">
            {WHEEL_REWARDS.map((reward, i) => {
              const startAngle = (i * segmentAngle - 90) * (Math.PI / 180)
              const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180)
              const x1 = 50 + 50 * Math.cos(startAngle)
              const y1 = 50 + 50 * Math.sin(startAngle)
              const x2 = 50 + 50 * Math.cos(endAngle)
              const y2 = 50 + 50 * Math.sin(endAngle)
              const midAngle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180)
              const tx = 50 + 32 * Math.cos(midAngle)
              const ty = 50 + 32 * Math.sin(midAngle)
              return (
                <g key={i}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={SEGMENT_COLORS[i % SEGMENT_COLORS.length]}
                    stroke="#0d1b0f"
                    strokeWidth="0.5"
                  />
                  <text
                    x={tx} y={ty}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize="8" fill="#fff"
                    transform={`rotate(${i * segmentAngle + segmentAngle / 2}, ${tx}, ${ty})`}
                    style={{ fontFamily: 'monospace' }}
                  >
                    {reward.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </motion.div>
      </div>

      {/* Spin / Collect button */}
      {resultIdx === null ? (
        <motion.button
          whileTap={{ scale: 0.93 }}
          onClick={spin}
          disabled={spinning}
          style={{
            padding: '14px 32px', fontSize: 14,
            background: '#2d6d44', border: '3px solid #5dfc8c',
            borderRadius: 6, color: '#fff', cursor: 'pointer',
            fontFamily: 'inherit', opacity: spinning ? 0.6 : 1,
          }}
        >
          {spinning ? '...' : '🎡 TOČIT!'}
        </motion.button>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
        >
          <p style={{ fontSize: 18, color: '#ffd700', fontFamily: 'inherit' }}>
            {WHEEL_REWARDS[resultIdx].label}
          </p>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => onCollect(WHEEL_REWARDS[resultIdx!])}
            style={{
              padding: '14px 32px', fontSize: 12,
              background: '#7a5c00', border: '3px solid #ffd700',
              borderRadius: 6, color: '#ffd700', cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            ✓ VZÍT ODMĚNU
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}
```

- [ ] **Step 5: Wire LuckyWheel into GameScreen**

In `src/components/screens/GameScreen.tsx`:

```tsx
import { LuckyWheel } from '../ui/LuckyWheel'
import { shouldTriggerWheel } from '../../hooks/useLuckyWheel'

// Destructure from store:
const { ..., wheelPending, wheelSpinsToday, totalCorrectSession, triggerWheel, collectWheelReward } = useGameStore()

// After a correct answer (inside handleAnswer, after answerCorrect call):
const newSession = totalCorrectSession + 1
const newCombo = combo + 1
if (shouldTriggerWheel(newSession, wheelSpinsToday, newCombo === 10)) {
  // Delay wheel until after reward screen
  setTimeout(triggerWheel, REWARD_SCREEN_DURATION + 200)
}

// In JSX, after TaskRenderer, add the overlay:
{wheelPending && (
  <LuckyWheel onCollect={collectWheelReward} />
)}
```

Also add `totalCorrectSession: s.totalCorrectSession + 1` to the `answerCorrect` action in gameStore.ts.

- [ ] **Step 6: Verify TypeScript compiles**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft && npx tsc --noEmit
```

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useLuckyWheel.ts src/components/ui/LuckyWheel.tsx \
        src/data/types.ts src/store/gameStore.ts \
        src/components/screens/GameScreen.tsx
git commit -m "feat: add Lucky Wheel — occasional bonus reward, max 3x per session"
```

---

## Summary

| Task | Delivers |
|---|---|
| 1 | framer-motion, zustand, vitest configured |
| 2 | All TypeScript types |
| 3 | Config system + combo level tests |
| 4 | Worlds data + shop items + story strings |
| 5 | 7 task generators + tests |
| 6 | Zustand store + persist + tests |
| 7 | useTask + useCombo hooks |
| 8 | CSS Minecraft theme + Press Start 2P font |
| 9 | PixelButton, WorldCard, GemBurst |
| 10 | HUD + ComboBar |
| 11 | HomeScreen with world unlock |
| 12 | CountingTask, TapNumber, Compare, MultiChoice |
| 13 | MathTask, FindTask |
| 14 | DragDropTask (Framer Motion drag + touch) |
| 15 | TaskRenderer + GameScreen |
| 16 | RewardScreen + GemBurst animation |
| 17 | ShopScreen (tabs + showcase + buy flow) |
| 18 | ProfileScreen (stats + vitrína) |
| 19 | App.tsx full router + AnimatePresence |
| 20 | PWA validation + hasAnswered fix |
| 21 | Sound system (Web Audio API, mute toggle) |
| 22 | Adaptive difficulty (accuracy tracking, range adjustment) |
| 23 | Lucky Wheel (occasional, max 3×/session, never "miss") |
