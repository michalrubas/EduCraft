# Language Tasks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Přidat 3 jazykové typy úkolů (missingLetter, diacritics, wordOrder) jako novou LangSkillId větev ZPD systému vedle stávající matematiky.

**Architecture:** Nový `LangSkillId` union + `LANG_SKILL_TREE` v `skills.ts` zrcadlí existující math systém. Statický dataset slov v `langWords.ts`. Generátory v `skills.ts` pomocí `generateLangTask(skillId)`. `useTask.ts` dispatchuje lang typy stejně jako `math`/`mathMultiply`. Dva nové světy bez `numberRange`.

**Tech Stack:** React 18, TypeScript, Zustand persist (migration), Framer Motion, Vitest

---

## File map

**Nové soubory:**
- `src/data/langWords.ts` — `LangWord` interface + `LANG_WORDS` statický dataset
- `src/components/tasks/MissingLetterTask.tsx` — component pro missingLetter
- `src/components/tasks/DiacriticsTask.tsx` — component pro diacritics
- `src/components/tasks/WordOrderTask.tsx` — component pro wordOrder (tap-to-place)
- `tests/langTasks.test.ts` — testy generátorů

**Upravované soubory:**
- `src/data/types.ts` — LangSkillId, 3 nové TaskType, `letters?`, `options`, `Biome`, `World.numberRange?`, `updateSkillMastery`
- `src/data/skills.ts` — LangSkillConfig, LANG_SKILL_TREE, LANG_SKILL_DOMAINS, selectLangSkill, generateLangTask + helpers, extend createInitialProgress / checkUnlocks / applyMasteryDecay
- `src/data/tasks.ts` — BIOME_OBJECTS pro village/castle, TASK_GENERATORS stubs
- `src/data/worlds.ts` — světy village + castle
- `src/hooks/useTask.ts` — dispatch lang typů, skip easy insert pro lang světy
- `src/components/tasks/TaskRenderer.tsx` — 3 nové case + importy
- `src/store/gameStore.ts` — persist migration (version 1), updateSkillMastery typ

---

## Task 1: Extend `types.ts`

**Files:**
- Modify: `src/data/types.ts`

- [ ] **Step 1: Přidej LangSkillId, rozšiř TaskType, Task, Biome, World, GameState**

Najdi a nahraď tyto bloky v `src/data/types.ts`:

```ts
// BYLO:
export type TaskType =
  | 'counting'
  | 'tapNumber'
  | 'compare'
  | 'multiChoice'
  | 'dragDrop'
  | 'find'
  | 'math'
  | 'mathMultiply'

// BUDE:
export type LangSkillId =
  | 'letter_missing_easy'
  | 'letter_missing_hard'
  | 'diacritics_basic'
  | 'diacritics_hard'
  | 'word_order_short'
  | 'word_order_long'

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
```

```ts
// BYLO:
export type Biome = 'forest' | 'cave' | 'snow' | 'desert' | 'ocean' | 'jungle' | 'tnt' | 'nether' | 'end'

// BUDE:
export type Biome = 'forest' | 'cave' | 'snow' | 'desert' | 'ocean' | 'jungle' | 'tnt' | 'nether' | 'end' | 'village' | 'castle'
```

```ts
// BYLO:
export type MathSkillId = ...

// Přidej ZA MathSkillId definici:
export type SkillId = MathSkillId | LangSkillId
```

```ts
// BYLO:
export type StudentProgress = Record<MathSkillId, SkillState>

// BUDE:
export type StudentProgress = Record<MathSkillId | LangSkillId, SkillState>
```

```ts
// BYLO v Task interface:
  skillId?: MathSkillId
  ...
  options?: number[]

// BUDE:
  skillId?: MathSkillId | LangSkillId
  ...
  options?: (number | string)[]
  letters?: string[]   // pro wordOrder: scramblovaná písmena
```

```ts
// BYLO v World interface:
  numberRange: [number, number]

// BUDE:
  numberRange?: [number, number]
```

```ts
// BYLO v GameState:
  updateSkillMastery: (skillId: MathSkillId, isCorrect: boolean) => void

// BUDE:
  updateSkillMastery: (skillId: MathSkillId | LangSkillId, isCorrect: boolean) => void
```

- [ ] **Step 2: Ověř TypeScript**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft
npx tsc --noEmit 2>&1 | head -40
```

Očekávané chyby: stížnosti na `World` ve `worlds.ts` (chybí nové biomy) a na `TASK_GENERATORS` (chybí nové typy) — ty opravíme v dalších tascích. Typové chyby v `types.ts` samotném by neměly být.

- [ ] **Step 3: Commit**

```bash
git add src/data/types.ts
git commit -m "feat(types): add LangSkillId, 3 lang TaskTypes, extend Task/World/Biome"
```

---

## Task 2: Create `langWords.ts`

**Files:**
- Create: `src/data/langWords.ts`

- [ ] **Step 1: Vytvoř soubor se statickým datasetem**

```ts
// src/data/langWords.ts

export interface LangWord {
  word: string          // lowercase, správný pravopis: "strom", "kůň"
  emoji: string         // dekorativní, ne pro hádání
  syllables: number
  difficulty: 'easy' | 'medium' | 'hard'
  biome?: string
  diacritics?: {
    correct: string     // správný tvar: "kůň", "jídlo"
    wrong: string[]     // 2 špatné varianty
  }
}

/** Vrátí true pro slova bez háčků a čárek (vhodná pro missingLetter a wordOrder) */
export function isAsciiWord(word: string): boolean {
  return /^[a-z]+$/.test(word)
}

export const LANG_WORDS: LangWord[] = [
  // --- Easy: 3–4 písmenná slova bez diakritiky ---
  { word: 'hora',  emoji: '⛰️',  syllables: 2, difficulty: 'easy' },
  { word: 'ryba',  emoji: '🐟',  syllables: 2, difficulty: 'easy' },
  { word: 'koza',  emoji: '🐐',  syllables: 2, difficulty: 'easy' },
  { word: 'voda',  emoji: '💧',  syllables: 2, difficulty: 'easy' },
  { word: 'vlak',  emoji: '🚂',  syllables: 1, difficulty: 'easy' },
  { word: 'pole',  emoji: '🌾',  syllables: 2, difficulty: 'easy' },
  { word: 'most',  emoji: '🌉',  syllables: 1, difficulty: 'easy' },
  { word: 'pero',  emoji: '✏️',  syllables: 2, difficulty: 'easy' },

  // --- Medium: 5–6 písmenná slova bez diakritiky ---
  { word: 'strom',  emoji: '🌲', syllables: 1, difficulty: 'medium', biome: 'forest' },
  { word: 'kozel',  emoji: '🐐', syllables: 2, difficulty: 'medium' },
  { word: 'robot',  emoji: '🤖', syllables: 2, difficulty: 'medium' },
  { word: 'motor',  emoji: '⚙️', syllables: 2, difficulty: 'medium' },
  { word: 'kaktus', emoji: '🌵', syllables: 2, difficulty: 'medium' },
  { word: 'kostel', emoji: '⛪', syllables: 2, difficulty: 'medium' },

  // --- Hard: 6 písmenná slova bez diakritiky ---
  { word: 'hrdina', emoji: '🦸', syllables: 3, difficulty: 'hard' },
  { word: 'raketa', emoji: '🚀', syllables: 3, difficulty: 'hard' },
  { word: 'lopata', emoji: '🪣', syllables: 3, difficulty: 'hard' },
  { word: 'komoda', emoji: '🪑', syllables: 3, difficulty: 'hard' },

  // --- Easy diacritics ---
  {
    word: 'kůň', emoji: '🐴', syllables: 1, difficulty: 'easy',
    diacritics: { correct: 'kůň', wrong: ['kun', 'kúň'] },
  },
  {
    word: 'dům', emoji: '🏠', syllables: 1, difficulty: 'easy',
    diacritics: { correct: 'dům', wrong: ['dum', 'dúm'] },
  },
  {
    word: 'jídlo', emoji: '🍽️', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'jídlo', wrong: ['jidlo', 'jídló'] },
  },
  {
    word: 'léto', emoji: '☀️', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'léto', wrong: ['leto', 'létó'] },
  },

  // --- Medium diacritics ---
  {
    word: 'vítr', emoji: '💨', syllables: 1, difficulty: 'medium',
    diacritics: { correct: 'vítr', wrong: ['vitr', 'vítŕ'] },
  },
  {
    word: 'světlo', emoji: '💡', syllables: 2, difficulty: 'medium',
    diacritics: { correct: 'světlo', wrong: ['svetlo', 'světlô'] },
  },
  {
    word: 'zima', emoji: '❄️', syllables: 2, difficulty: 'medium',
    diacritics: { correct: 'zima', wrong: ['zíma', 'zímá'] },
  },
  {
    word: 'modrý', emoji: '🔵', syllables: 2, difficulty: 'medium',
    diacritics: { correct: 'modrý', wrong: ['modry', 'módry'] },
  },

  // --- Hard diacritics ---
  {
    word: 'líný', emoji: '😴', syllables: 2, difficulty: 'hard',
    diacritics: { correct: 'líný', wrong: ['liny', 'líny'] },
  },
  {
    word: 'mít', emoji: '🤲', syllables: 1, difficulty: 'hard',
    diacritics: { correct: 'mít', wrong: ['mit', 'míd'] },
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/data/langWords.ts
git commit -m "feat(data): add langWords static dataset (LangWord, LANG_WORDS)"
```

---

## Task 3: TDD — Lang task generators

**Files:**
- Create: `tests/langTasks.test.ts`
- Modify: `src/data/skills.ts`

### 3a — Write failing tests

- [ ] **Step 1: Vytvoř test soubor**

```ts
// tests/langTasks.test.ts
import { describe, it, expect } from 'vitest'
import { generateLangTask, selectLangSkill, createInitialProgress } from '../src/data/skills'

// missingLetter
describe('generateLangTask(letter_missing_easy)', () => {
  it('returns type missingLetter', () => {
    expect(generateLangTask('letter_missing_easy').type).toBe('missingLetter')
  })
  it('question contains underscore', () => {
    for (let i = 0; i < 10; i++) {
      expect(generateLangTask('letter_missing_easy').question).toContain('_')
    }
  })
  it('options contain correctAnswer', () => {
    for (let i = 0; i < 10; i++) {
      const t = generateLangTask('letter_missing_easy')
      expect(t.options).toContain(t.correctAnswer)
    }
  })
  it('has 4 options', () => {
    expect(generateLangTask('letter_missing_easy').options).toHaveLength(4)
  })
  it('correctAnswer is a single uppercase letter', () => {
    for (let i = 0; i < 10; i++) {
      const t = generateLangTask('letter_missing_easy')
      expect(typeof t.correctAnswer).toBe('string')
      expect((t.correctAnswer as string)).toHaveLength(1)
      expect((t.correctAnswer as string)).toMatch(/[A-Z]/)
    }
  })
})

// diacritics
describe('generateLangTask(diacritics_basic)', () => {
  it('returns type diacritics', () => {
    expect(generateLangTask('diacritics_basic').type).toBe('diacritics')
  })
  it('options contain correctAnswer', () => {
    for (let i = 0; i < 10; i++) {
      const t = generateLangTask('diacritics_basic')
      expect(t.options).toContain(t.correctAnswer)
    }
  })
  it('has 3 options', () => {
    expect(generateLangTask('diacritics_basic').options).toHaveLength(3)
  })
})

// wordOrder
describe('generateLangTask(word_order_short)', () => {
  it('returns type wordOrder', () => {
    expect(generateLangTask('word_order_short').type).toBe('wordOrder')
  })
  it('letters contain same chars as correctAnswer', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateLangTask('word_order_short')
      const sorted = (t.letters as string[]).sort().join('')
      const expected = (t.correctAnswer as string).split('').sort().join('')
      expect(sorted).toBe(expected)
    }
  })
  it('has no options field', () => {
    expect(generateLangTask('word_order_short').options).toBeUndefined()
  })
  it('letters field is defined', () => {
    expect(generateLangTask('word_order_short').letters).toBeDefined()
  })
})

// selectLangSkill
describe('selectLangSkill', () => {
  it('returns fallback when no skills unlocked', () => {
    const progress = createInitialProgress()
    // lock everything manually
    const locked = { ...progress }
    locked['letter_missing_easy'] = { ...locked['letter_missing_easy'], unlocked: false }
    expect(selectLangSkill(locked, 'missing_letter')).toBe('letter_missing_easy')
  })
  it('returns a valid LangSkillId for each domain', () => {
    const progress = createInitialProgress()
    const validMissing = ['letter_missing_easy', 'letter_missing_hard']
    const validDiac = ['diacritics_basic', 'diacritics_hard']
    const validOrder = ['word_order_short', 'word_order_long']
    expect(validMissing).toContain(selectLangSkill(progress, 'missing_letter'))
    expect(validDiac).toContain(selectLangSkill(progress, 'diacritics'))
    expect(validOrder).toContain(selectLangSkill(progress, 'word_order'))
  })
})

// createInitialProgress
describe('createInitialProgress with lang skills', () => {
  it('includes all LangSkillId keys', () => {
    const p = createInitialProgress()
    const langKeys: string[] = [
      'letter_missing_easy', 'letter_missing_hard',
      'diacritics_basic', 'diacritics_hard',
      'word_order_short', 'word_order_long',
    ]
    for (const key of langKeys) {
      expect(p[key as keyof typeof p]).toBeDefined()
    }
  })
  it('letter_missing_easy is unlocked by default', () => {
    expect(createInitialProgress()['letter_missing_easy'].unlocked).toBe(true)
  })
  it('letter_missing_hard is locked by default', () => {
    expect(createInitialProgress()['letter_missing_hard'].unlocked).toBe(false)
  })
})
```

- [ ] **Step 2: Spusť testy — musí failovat**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft
npx vitest run tests/langTasks.test.ts 2>&1 | tail -20
```

Očekávaný výsledek: chyby importu (`generateLangTask` neexistuje) nebo TypeScript chyby.

### 3b — Implementace v `skills.ts`

- [ ] **Step 3: Přidej importy na vrchol `src/data/skills.ts`**

```ts
// BYLO:
import { MathSkillId, SkillState, StudentProgress, Task } from './types'

// BUDE:
import { MathSkillId, LangSkillId, SkillState, StudentProgress, Task } from './types'
import { LANG_WORDS, isAsciiWord } from './langWords'
```

- [ ] **Step 4: Přidej `LangSkillConfig` interface a `LANG_SKILL_TREE` za SKILL_TREE blok**

Přidej za řádek `]` ukončující `SKILL_TREE`:

```ts
export interface LangSkillConfig {
  id: LangSkillId
  name: string
  icon: string
  description: string
  prerequisites: { id: LangSkillId; minMastery: number }[]
}

export const LANG_SKILL_TREE: LangSkillConfig[] = [
  {
    id: 'letter_missing_easy',
    name: 'Chybějící písmeno (lehké)',
    icon: '🔤',
    description: '3–4 písmenná slova s chybějícím písmenem',
    prerequisites: [],
  },
  {
    id: 'letter_missing_hard',
    name: 'Chybějící písmeno (těžké)',
    icon: '🔤',
    description: '5–6 písmenná slova s chybějícím písmenem',
    prerequisites: [{ id: 'letter_missing_easy', minMastery: 0.6 }],
  },
  {
    id: 'diacritics_basic',
    name: 'Háčky a čárky (základní)',
    icon: '✍️',
    description: 'Správný tvar jednoduchých slov s diakritikou',
    prerequisites: [],
  },
  {
    id: 'diacritics_hard',
    name: 'Háčky a čárky (pokročilé)',
    icon: '✍️',
    description: 'Složitější slova s diakritikou',
    prerequisites: [{ id: 'diacritics_basic', minMastery: 0.6 }],
  },
  {
    id: 'word_order_short',
    name: 'Pořadí písmen (krátká)',
    icon: '🔀',
    description: 'Seřaď 3–4 písmena do slova',
    prerequisites: [],
  },
  {
    id: 'word_order_long',
    name: 'Pořadí písmen (delší)',
    icon: '🔀',
    description: 'Seřaď 5–6 písmen do slova',
    prerequisites: [{ id: 'word_order_short', minMastery: 0.6 }],
  },
]

export const LANG_SKILL_DOMAINS: Record<'missing_letter' | 'diacritics' | 'word_order', LangSkillId[]> = {
  missing_letter: ['letter_missing_easy', 'letter_missing_hard'],
  diacritics:     ['diacritics_basic', 'diacritics_hard'],
  word_order:     ['word_order_short', 'word_order_long'],
}
```

- [ ] **Step 5: Přidej `selectLangSkill` za stávající `selectSkill` funkci**

```ts
export function selectLangSkill(
  progress: StudentProgress,
  domain: 'missing_letter' | 'diacritics' | 'word_order',
): LangSkillId {
  const domainIds = LANG_SKILL_DOMAINS[domain]
  const unlocked = LANG_SKILL_TREE.filter(s => domainIds.includes(s.id) && progress[s.id]?.unlocked)
  const fallbacks: Record<typeof domain, LangSkillId> = {
    missing_letter: 'letter_missing_easy',
    diacritics:     'diacritics_basic',
    word_order:     'word_order_short',
  }
  if (unlocked.length === 0) return fallbacks[domain]

  const mastered = unlocked.filter(s => progress[s.id].mastery > 0.75)
  if (mastered.length > 0 && Math.random() < 0.25) {
    return mastered[Math.floor(Math.random() * mastered.length)].id
  }

  const zpd = unlocked.filter(s => {
    const m = progress[s.id].mastery
    return m >= 0.2 && m <= 0.75
  })
  if (zpd.length > 0) {
    return zpd[Math.floor(Math.random() * zpd.length)].id
  }

  return [...unlocked].sort((a, b) => progress[a.id].mastery - progress[b.id].mastery)[0].id
}
```

- [ ] **Step 6: Přidej soukromé generátory a `generateLangTask` za `generateSkillTask`**

```ts
// ---------------------------------------------------------------------------
// Lang task generators
// ---------------------------------------------------------------------------

const VOWELS = ['A', 'E', 'I', 'O', 'U']
const CONSONANTS = ['B', 'D', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z']

function genMissingLetter(skillId: LangSkillId): Task {
  const diff = skillId === 'letter_missing_easy' ? 'easy' : 'hard'
  const pool = LANG_WORDS.filter(w => isAsciiWord(w.word) && w.difficulty === diff)
  const word = pool[Math.floor(Math.random() * pool.length)]
  const letters = word.word.toUpperCase().split('')
  const pos = Math.floor(Math.random() * letters.length)
  const correct = letters[pos]
  const question = letters.map((l, i) => i === pos ? '_' : l).join('')
  const letterPool = VOWELS.includes(correct) ? VOWELS : CONSONANTS
  const wrongs = shuffle(letterPool.filter(l => l !== correct)).slice(0, 3)
  return {
    id: uid(), type: 'missingLetter', skillId,
    question,
    options: shuffle([correct, ...wrongs]),
    correctAnswer: correct,
  }
}

function genDiacritics(skillId: LangSkillId): Task {
  const diff = skillId === 'diacritics_basic' ? 'easy' : 'hard'
  const pool = LANG_WORDS.filter(w => w.diacritics && w.difficulty === diff)
  const word = pool[Math.floor(Math.random() * pool.length)]
  const { correct, wrong } = word.diacritics!
  return {
    id: uid(), type: 'diacritics', skillId,
    question: 'Správný tvar?',
    options: shuffle([correct, ...wrong]),
    correctAnswer: correct,
  }
}

function genWordOrder(skillId: LangSkillId): Task {
  const diff = skillId === 'word_order_short' ? 'easy' : 'hard'
  const pool = LANG_WORDS.filter(w => isAsciiWord(w.word) && w.difficulty === diff)
  const word = pool[Math.floor(Math.random() * pool.length)]
  const correct = word.word.toUpperCase()
  const letters = correct.split('')
  // ensure at least one shuffle-change
  let shuffled = shuffle([...letters])
  let attempts = 0
  while (shuffled.join('') === correct && attempts < 5) {
    shuffled = shuffle([...letters])
    attempts++
  }
  return {
    id: uid(), type: 'wordOrder', skillId,
    question: 'Seřaď písmena do slova',
    letters: shuffled,
    correctAnswer: correct,
  }
}

export function generateLangTask(skillId: LangSkillId): Task {
  switch (skillId) {
    case 'letter_missing_easy':
    case 'letter_missing_hard':
      return genMissingLetter(skillId)
    case 'diacritics_basic':
    case 'diacritics_hard':
      return genDiacritics(skillId)
    case 'word_order_short':
    case 'word_order_long':
      return genWordOrder(skillId)
  }
}
```

- [ ] **Step 7: Rozšiř `createInitialProgress` — přidej lang skills**

Najdi:
```ts
export function createInitialProgress(): StudentProgress {
  const progress: Partial<StudentProgress> = {}
  for (const skill of SKILL_TREE) {
    progress[skill.id] = {
      mastery: 0,
      unlocked: skill.prerequisites.length === 0,
      attempts: 0,
      lastPracticed: 0,
    } satisfies SkillState
  }
  return progress as StudentProgress
}
```

Nahraď:
```ts
export function createInitialProgress(): StudentProgress {
  const progress: Partial<StudentProgress> = {}
  for (const skill of SKILL_TREE) {
    progress[skill.id] = { mastery: 0, unlocked: skill.prerequisites.length === 0, attempts: 0, lastPracticed: 0 } satisfies SkillState
  }
  for (const skill of LANG_SKILL_TREE) {
    progress[skill.id] = { mastery: 0, unlocked: skill.prerequisites.length === 0, attempts: 0, lastPracticed: 0 } satisfies SkillState
  }
  return progress as StudentProgress
}
```

- [ ] **Step 8: Rozšiř `checkUnlocks` — přidej lang smyčku**

Najdi v `checkUnlocks`:
```ts
  for (const skill of SKILL_TREE) {
    if (next[skill.id].unlocked) continue
    const prereqsMet = skill.prerequisites.every(
      p => next[p.id].mastery >= p.minMastery
    )
    if (prereqsMet) {
      next[skill.id] = { ...next[skill.id], unlocked: true }
      updated = true
    }
  }

  return updated ? next : progress
```

Přidej před `return`:
```ts
  for (const skill of LANG_SKILL_TREE) {
    if (next[skill.id]?.unlocked) continue
    const prereqsMet = skill.prerequisites.every(
      p => (next[p.id]?.mastery ?? 0) >= p.minMastery
    )
    if (prereqsMet) {
      next[skill.id] = { ...(next[skill.id] ?? { mastery: 0, unlocked: false, attempts: 0, lastPracticed: 0 }), unlocked: true }
      updated = true
    }
  }
```

- [ ] **Step 9: Oprav type cast v `applyMasteryDecay`**

Najdi:
```ts
  for (const skillId of Object.keys(progress) as MathSkillId[]) {
```

Nahraď:
```ts
  for (const skillId of Object.keys(progress) as (MathSkillId | LangSkillId)[]) {
```

- [ ] **Step 10: Spusť testy — musí projít**

```bash
npx vitest run tests/langTasks.test.ts 2>&1 | tail -20
```

Očekávané: všechny testy zelené.

- [ ] **Step 11: Spusť všechny testy**

```bash
npx vitest run 2>&1 | tail -20
```

Očekávané: žádné regrese.

- [ ] **Step 12: Commit**

```bash
git add src/data/skills.ts tests/langTasks.test.ts
git commit -m "feat(skills): add LangSkillId tree, selectLangSkill, generateLangTask"
```

---

## Task 4: Extend `tasks.ts`

**Files:**
- Modify: `src/data/tasks.ts`

- [ ] **Step 1: Přidej village a castle do BIOME_OBJECTS**

Najdi `const BIOME_OBJECTS`:
```ts
  end:    ['💹', '🔅', '❗️', '❓', '🔱', '⻰'],
```

Přidej za `end`:
```ts
  village: ['🏠', '🌻', '🐓', '🌾', '🪵', '🐄'],
  castle:  ['🏰', '⚔️', '🛡️', '🗝️', '👑', '🐉'],
```

- [ ] **Step 2: Rozšiř TASK_GENERATORS o stubs pro nové typy**

Najdi konec `export const TASK_GENERATORS`:
```ts
  mathMultiply:  (r)    => generateMathTask(r),
}
```

Přidej před `}`:
```ts
  // Lang task types are dispatched via generateLangTask() in useTask.ts — these are never called
  missingLetter: () => { throw new Error('missingLetter: use generateLangTask()') },
  diacritics:    () => { throw new Error('diacritics: use generateLangTask()') },
  wordOrder:     () => { throw new Error('wordOrder: use generateLangTask()') },
```

- [ ] **Step 3: Ověř TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "tasks.ts" | head -10
```

Očekávané: žádné chyby v tasks.ts.

- [ ] **Step 4: Commit**

```bash
git add src/data/tasks.ts
git commit -m "feat(tasks): add village/castle biome objects, lang task stubs"
```

---

## Task 5: Extend `useTask.ts`

**Files:**
- Modify: `src/hooks/useTask.ts`

- [ ] **Step 1: Přidej importy**

Najdi:
```ts
import { selectSkill, generateSkillTask } from '../data/skills'
```

Nahraď:
```ts
import { selectSkill, generateSkillTask, selectLangSkill, generateLangTask } from '../data/skills'
```

- [ ] **Step 2: Přidej lang dispatch a oprav easy-task insert**

Najdi:
```ts
    // Every TASKS_BEFORE_EASY tasks, insert an easier one to prevent frustration
    if (taskCountRef.current % TASKS_BEFORE_EASY === 0) {
      const easyRange: [number, number] = [
        effectiveRange[0],
        Math.ceil((effectiveRange[0] + effectiveRange[1]) / 2),
      ]
      const easyTypes: TaskType[] = ['counting', 'tapNumber']
      const t = easyTypes[Math.floor(Math.random() * easyTypes.length)]
      return TASK_GENERATORS[t](easyRange, world.biome)
    }
```

Nahraď:
```ts
    // Easy-task insert only for math worlds (lang worlds have no numberRange)
    if (taskCountRef.current % TASKS_BEFORE_EASY === 0 && world.numberRange) {
      const easyRange: [number, number] = [
        effectiveRange[0],
        Math.ceil((effectiveRange[0] + effectiveRange[1]) / 2),
      ]
      const easyTypes: TaskType[] = ['counting', 'tapNumber']
      const t = easyTypes[Math.floor(Math.random() * easyTypes.length)]
      return TASK_GENERATORS[t](easyRange, world.biome)
    }
```

Najdi:
```ts
    // Math tasks go through the skill system for personalized difficulty
    if (chosen === 'math') {
      const skillId = selectSkill(studentProgress, 'add_sub')
      return generateSkillTask(skillId)
    }
    if (chosen === 'mathMultiply') {
      const skillId = selectSkill(studentProgress, 'multiply')
      return generateSkillTask(skillId)
    }
```

Přidej za `mathMultiply` blok:
```ts
    if (chosen === 'missingLetter') {
      return generateLangTask(selectLangSkill(studentProgress, 'missing_letter'))
    }
    if (chosen === 'diacritics') {
      return generateLangTask(selectLangSkill(studentProgress, 'diacritics'))
    }
    if (chosen === 'wordOrder') {
      return generateLangTask(selectLangSkill(studentProgress, 'word_order'))
    }
```

- [ ] **Step 3: Ověř TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "useTask" | head -10
```

Očekávané: žádné chyby.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useTask.ts
git commit -m "feat(useTask): dispatch lang task types via selectLangSkill/generateLangTask"
```

---

## Task 6: `MissingLetterTask.tsx`

**Files:**
- Create: `src/components/tasks/MissingLetterTask.tsx`

- [ ] **Step 1: Vytvoř komponent**

```tsx
// src/components/tasks/MissingLetterTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function MissingLetterTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <p style={{ fontSize: 12, color: '#aaa', marginBottom: 4, textAlign: 'center' }}>
        Doplň chybějící písmeno
      </p>
      <p className="task-question" style={{ fontSize: 36, letterSpacing: 8, fontFamily: 'monospace' }}>
        {task.question}
      </p>
      <div className="answer-grid">
        {(task.options as string[]).map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(opt)}
            style={{ fontSize: 22, fontWeight: 'bold' }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tasks/MissingLetterTask.tsx
git commit -m "feat(ui): add MissingLetterTask component"
```

---

## Task 7: `DiacriticsTask.tsx`

**Files:**
- Create: `src/components/tasks/DiacriticsTask.tsx`

- [ ] **Step 1: Vytvoř komponent**

```tsx
// src/components/tasks/DiacriticsTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function DiacriticsTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div className="answer-grid" style={{ flexDirection: 'column', gap: 10 }}>
        {(task.options as string[]).map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(opt)}
            style={{ fontSize: 20, width: '100%', maxWidth: 240 }}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tasks/DiacriticsTask.tsx
git commit -m "feat(ui): add DiacriticsTask component"
```

---

## Task 8: `WordOrderTask.tsx`

**Files:**
- Create: `src/components/tasks/WordOrderTask.tsx`

- [ ] **Step 1: Vytvoř komponent**

```tsx
// src/components/tasks/WordOrderTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function WordOrderTask({ task, onAnswer }: Props) {
  const total = (task.correctAnswer as string).length
  const [placed, setPlaced] = useState<string[]>([])
  const [usedIndices, setUsedIndices] = useState<number[]>([])

  function handlePick(idx: number) {
    if (usedIndices.includes(idx)) return
    const letter = task.letters![idx]
    const newPlaced = [...placed, letter]
    const newUsed = [...usedIndices, idx]
    setPlaced(newPlaced)
    setUsedIndices(newUsed)
    if (newPlaced.length === total) {
      setTimeout(() => onAnswer(newPlaced.join('')), 400)
    }
  }

  function handleRemoveLast() {
    if (placed.length === 0) return
    setPlaced(placed.slice(0, -1))
    setUsedIndices(usedIndices.slice(0, -1))
  }

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>

      {/* Answer slots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 44, height: 52,
              border: '2px solid var(--mc-accent, #5dfc8c)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 'bold',
              background: placed[i] ? 'var(--mc-accent, #5dfc8c)' : 'transparent',
              color: placed[i] ? '#000' : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            {placed[i] ?? ''}
          </div>
        ))}
      </div>

      {/* Source letters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
        {task.letters!.map((letter, idx) => (
          <motion.button
            key={idx}
            className="answer-btn"
            whileTap={{ scale: 0.9 }}
            onClick={() => handlePick(idx)}
            style={{
              width: 48, fontSize: 22, fontWeight: 'bold',
              opacity: usedIndices.includes(idx) ? 0.2 : 1,
              pointerEvents: usedIndices.includes(idx) ? 'none' : 'auto',
            }}
          >
            {letter}
          </motion.button>
        ))}
      </div>

      <motion.button
        className="pixel-btn"
        onClick={handleRemoveLast}
        disabled={placed.length === 0}
        whileTap={{ scale: 0.95 }}
        style={{ opacity: placed.length === 0 ? 0.4 : 1 }}
      >
        ↺ Zpět
      </motion.button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tasks/WordOrderTask.tsx
git commit -m "feat(ui): add WordOrderTask component (tap-to-place)"
```

---

## Task 9: Extend `TaskRenderer.tsx`

**Files:**
- Modify: `src/components/tasks/TaskRenderer.tsx`

- [ ] **Step 1: Přidej importy**

Najdi:
```ts
import { DragDropTask } from './DragDropTask'
```

Přidej za:
```ts
import { MissingLetterTask } from './MissingLetterTask'
import { DiacriticsTask }    from './DiacriticsTask'
import { WordOrderTask }     from './WordOrderTask'
```

- [ ] **Step 2: Přidej 3 nové case do switch**

Najdi:
```ts
      case 'dragDrop':     return <DragDropTask    task={task} onAnswer={onAnswer} />
```

Přidej za:
```ts
      case 'missingLetter': return <MissingLetterTask task={task} onAnswer={onAnswer} />
      case 'diacritics':    return <DiacriticsTask    task={task} onAnswer={onAnswer} />
      case 'wordOrder':     return <WordOrderTask      task={task} onAnswer={onAnswer} />
```

- [ ] **Step 3: Ověř TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Očekávané: žádné chyby.

- [ ] **Step 4: Spusť všechny testy**

```bash
npx vitest run 2>&1 | tail -10
```

Očekávané: všechny zelené.

- [ ] **Step 5: Commit**

```bash
git add src/components/tasks/TaskRenderer.tsx
git commit -m "feat(ui): wire MissingLetter, Diacritics, WordOrder into TaskRenderer"
```

---

## Task 10: Add language worlds

**Files:**
- Modify: `src/data/worlds.ts`

- [ ] **Step 1: Přidej village a castle světy**

Na konec `WORLDS` array přidej:

```ts
  {
    id: 'village',
    name: 'Vesnice',
    icon: '🏠',
    blockColor: '#8b6914',
    biome: 'village',
    taskTypes: [
      { type: 'missingLetter', weight: 3 },
      { type: 'wordOrder', weight: 2 },
    ],
    unlockCost: 80,
    comboMultiplier: 1.1,
    bgColor: '#1a1005',
    accentColor: '#f0c060',
    story: 'Vesničané potřebují pomoc s dopisy! Sprav chyby v jejich zprávách.',
  },
  {
    id: 'castle',
    name: 'Hrad',
    icon: '🏰',
    blockColor: '#888888',
    biome: 'castle',
    taskTypes: [
      { type: 'diacritics', weight: 3 },
      { type: 'missingLetter', weight: 2 },
      { type: 'wordOrder', weight: 1 },
    ],
    unlockCost: 200,
    comboMultiplier: 1.4,
    bgColor: '#0d0d14',
    accentColor: '#a0a0ff',
    story: 'Starý hrad skrývá tajné zprávy. Rozluštíš správný pravopis?',
  },
```

- [ ] **Step 2: Ověř TypeScript**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Očekávané: žádné chyby.

- [ ] **Step 3: Commit**

```bash
git add src/data/worlds.ts
git commit -m "feat(worlds): add village and castle language worlds"
```

---

## Task 11: Store migration

**Files:**
- Modify: `src/store/gameStore.ts`

- [ ] **Step 1: Přidej import LangSkillId a LANG_SKILL_TREE**

Najdi v importech:
```ts
import { createInitialProgress, checkUnlocks, updateMastery } from '../data/skills'
```

Nahraď:
```ts
import { createInitialProgress, checkUnlocks, updateMastery, LANG_SKILL_TREE } from '../data/skills'
```

Najdi:
```ts
import { GameState, Screen, ShopItem, MathSkillId } from '../data/types'
```

Nahraď:
```ts
import { GameState, Screen, ShopItem, MathSkillId, LangSkillId, SkillState } from '../data/types'
```

- [ ] **Step 2: Změň typ v `updateSkillMastery`**

Najdi:
```ts
      updateSkillMastery: (skillId: MathSkillId, isCorrect: boolean) => {
```

Nahraď:
```ts
      updateSkillMastery: (skillId: MathSkillId | LangSkillId, isCorrect: boolean) => {
```

- [ ] **Step 3: Přidej `version` a `migrate` do persist konfigurace**

Najdi:
```ts
    { name: 'adicraft-game-v1' }
```

Nahraď:
```ts
    {
      name: 'adicraft-game-v1',
      version: 1,
      migrate: (old: unknown) => {
        const state = old as Record<string, unknown>
        const existingProgress = (state.studentProgress ?? {}) as Record<string, SkillState>
        const langDefaults: Record<string, SkillState> = {}
        for (const skill of LANG_SKILL_TREE) {
          langDefaults[skill.id] = { mastery: 0, unlocked: skill.prerequisites.length === 0, attempts: 0, lastPracticed: 0 }
        }
        return { ...state, studentProgress: { ...langDefaults, ...existingProgress } }
      },
    }
```

- [ ] **Step 4: Ověř TypeScript a testy**

```bash
npx tsc --noEmit 2>&1 | head -20
npx vitest run 2>&1 | tail -10
```

Očekávané: 0 chyb TypeScript, všechny testy zelené.

- [ ] **Step 5: Commit**

```bash
git add src/store/gameStore.ts
git commit -m "feat(store): updateSkillMastery accepts LangSkillId, add v1 migration for lang skills"
```

---

## Finální smoke test

- [ ] **Spusť dev server a otestuj**

```bash
npm run dev
```

1. Otevři aplikaci v prohlížeči
2. Klikni na svět **Vesnice** → ověř, že se zobrazují `missingLetter` a `wordOrder` tasky
3. Klikni na svět **Hrad** → ověř `diacritics`, `missingLetter`, `wordOrder`
4. Ověř, že existující matematické světy stále fungují
5. Zkontroluj konzoli — žádné JS chyby

- [ ] **Final commit (pokud jsou nějaké drobné opravy)**

```bash
git add -p   # stage jen relevantní změny
git commit -m "fix: smoke test fixes"
```
