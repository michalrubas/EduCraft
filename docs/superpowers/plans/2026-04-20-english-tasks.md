# English Vocabulary Tasks — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new simple task types (`engPicture` and `engWord`) for English vocabulary learning, backed by a new word list, two new components, and wired into the existing Library world + Forest world.

**Architecture:** Simple (non-skill-routed) generators in `tasks.ts` pick random words from `engWords.ts`. Two new React components follow the existing `answer-btn` pattern. Library world already exists in `worlds.ts` — we extend its `taskTypes`. Forest world gets low-weight entries as a preview.

**Tech Stack:** TypeScript, React, Framer Motion, Vitest, existing CSS classes (`task-area`, `task-question`, `answer-grid`, `answer-btn`, `correct`, `wrong`)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/data/types.ts` | Modify | Add `'engPicture'` and `'engWord'` to `TaskType` union |
| `src/data/engWords.ts` | Create | `EngWord` interface + ~35 easy English words |
| `src/data/tasks.ts` | Modify | `generateEngPictureTask`, `generateEngWordTask`, register both in `TASK_GENERATORS` |
| `src/components/tasks/EngPictureTask.tsx` | Create | Emoji → pick English word (3 buttons) |
| `src/components/tasks/EngWordTask.tsx` | Create | English word → pick emoji (2×2 grid) |
| `src/components/tasks/TaskRenderer.tsx` | Modify | Add `case 'engPicture'` and `case 'engWord'` |
| `src/data/worlds.ts` | Modify | Add `engPicture`/`engWord` to Library; add low-weight entries to Forest |
| `tests/tasks.test.ts` | Modify | Tests for both new generators |

---

### Task 1: Add new task types to the union

**Files:**
- Modify: `src/data/types.ts`

- [ ] **Step 1: Add to `TaskType` union**

Open `src/data/types.ts`. The `TaskType` union currently ends with `| 'runner'`. Add two new entries:

```ts
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
  | 'runner'
  | 'engPicture'
  | 'engWord'
```

- [ ] **Step 2: Verify build catches exhaustive switch errors**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build 2>&1 | grep -E "error|engPicture|engWord"
```

Expected: TypeScript errors about missing cases in `TaskRenderer.tsx` and `TASK_GENERATORS`. This is correct — they'll be fixed in later tasks.

- [ ] **Step 3: Commit**

```bash
git add src/data/types.ts
git commit -m "feat(eng): add engPicture and engWord to TaskType union"
```

---

### Task 2: Create the English word list

**Files:**
- Create: `src/data/engWords.ts`

- [ ] **Step 1: Create `src/data/engWords.ts`**

```ts
// src/data/engWords.ts

export interface EngWord {
  english: string
  czech: string
  emoji: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'animals' | 'food' | 'nature' | 'objects' | 'colors'
}

export const ENG_WORDS: EngWord[] = [
  // Animals
  { english: 'dog',      czech: 'pes',       emoji: '🐶', difficulty: 'easy', category: 'animals' },
  { english: 'cat',      czech: 'kočka',     emoji: '🐱', difficulty: 'easy', category: 'animals' },
  { english: 'fish',     czech: 'ryba',      emoji: '🐟', difficulty: 'easy', category: 'animals' },
  { english: 'bird',     czech: 'pták',      emoji: '🐦', difficulty: 'easy', category: 'animals' },
  { english: 'cow',      czech: 'kráva',     emoji: '🐄', difficulty: 'easy', category: 'animals' },
  { english: 'pig',      czech: 'prase',     emoji: '🐷', difficulty: 'easy', category: 'animals' },
  { english: 'frog',     czech: 'žába',      emoji: '🐸', difficulty: 'easy', category: 'animals' },
  { english: 'bear',     czech: 'medvěd',    emoji: '🐻', difficulty: 'easy', category: 'animals' },
  { english: 'rabbit',   czech: 'králík',    emoji: '🐰', difficulty: 'easy', category: 'animals' },
  { english: 'duck',     czech: 'kachna',    emoji: '🦆', difficulty: 'easy', category: 'animals' },
  { english: 'horse',    czech: 'kůň',       emoji: '🐴', difficulty: 'easy', category: 'animals' },
  { english: 'snake',    czech: 'had',       emoji: '🐍', difficulty: 'easy', category: 'animals' },
  // Food
  { english: 'apple',    czech: 'jablko',    emoji: '🍎', difficulty: 'easy', category: 'food' },
  { english: 'banana',   czech: 'banán',     emoji: '🍌', difficulty: 'easy', category: 'food' },
  { english: 'bread',    czech: 'chleba',    emoji: '🍞', difficulty: 'easy', category: 'food' },
  { english: 'milk',     czech: 'mléko',     emoji: '🥛', difficulty: 'easy', category: 'food' },
  { english: 'egg',      czech: 'vejce',     emoji: '🥚', difficulty: 'easy', category: 'food' },
  { english: 'cake',     czech: 'dort',      emoji: '🎂', difficulty: 'easy', category: 'food' },
  { english: 'pizza',    czech: 'pizza',     emoji: '🍕', difficulty: 'easy', category: 'food' },
  // Nature
  { english: 'tree',     czech: 'strom',     emoji: '🌳', difficulty: 'easy', category: 'nature' },
  { english: 'flower',   czech: 'květ',      emoji: '🌸', difficulty: 'easy', category: 'nature' },
  { english: 'sun',      czech: 'slunce',    emoji: '☀️', difficulty: 'easy', category: 'nature' },
  { english: 'moon',     czech: 'měsíc',     emoji: '🌙', difficulty: 'easy', category: 'nature' },
  { english: 'star',     czech: 'hvězda',    emoji: '⭐', difficulty: 'easy', category: 'nature' },
  { english: 'fire',     czech: 'oheň',      emoji: '🔥', difficulty: 'easy', category: 'nature' },
  { english: 'water',    czech: 'voda',      emoji: '💧', difficulty: 'easy', category: 'nature' },
  { english: 'snow',     czech: 'sníh',      emoji: '❄️', difficulty: 'easy', category: 'nature' },
  { english: 'mountain', czech: 'hora',      emoji: '⛰️', difficulty: 'easy', category: 'nature' },
  // Objects
  { english: 'book',     czech: 'kniha',     emoji: '📖', difficulty: 'easy', category: 'objects' },
  { english: 'ball',     czech: 'míč',       emoji: '⚽', difficulty: 'easy', category: 'objects' },
  { english: 'house',    czech: 'dům',       emoji: '🏠', difficulty: 'easy', category: 'objects' },
  { english: 'car',      czech: 'auto',      emoji: '🚗', difficulty: 'easy', category: 'objects' },
  { english: 'key',      czech: 'klíč',      emoji: '🗝️', difficulty: 'easy', category: 'objects' },
  { english: 'hat',      czech: 'klobouk',   emoji: '🎩', difficulty: 'easy', category: 'objects' },
  { english: 'bag',      czech: 'taška',     emoji: '🎒', difficulty: 'easy', category: 'objects' },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/data/engWords.ts
git commit -m "feat(eng): add EngWord interface and easy word list"
```

---

### Task 3: Write failing tests, then generators

**Files:**
- Modify: `tests/tasks.test.ts`
- Modify: `src/data/tasks.ts`

- [ ] **Step 1: Write failing tests in `tests/tasks.test.ts`**

Add at the top of the file:
```ts
import {
  generateEngPictureTask,
  generateEngWordTask,
} from '../src/data/tasks'
```

Add at the end of the file:

```ts
describe('generateEngPictureTask', () => {
  it('returns correct type', () => {
    expect(generateEngPictureTask([1, 10], 'library').type).toBe('engPicture')
  })
  it('has 3 options', () => {
    const t = generateEngPictureTask([1, 10], 'library')
    expect(t.options).toHaveLength(3)
  })
  it('options contain correctAnswer', () => {
    const t = generateEngPictureTask([1, 10], 'library')
    expect(t.options).toContain(t.correctAnswer)
  })
  it('all options are distinct', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateEngPictureTask([1, 10], 'library')
      const unique = new Set(t.options)
      expect(unique.size).toBe(3)
    }
  })
  it('has objects array with one emoji', () => {
    const t = generateEngPictureTask([1, 10], 'library')
    expect(t.objects).toHaveLength(1)
    expect(typeof t.objects![0]).toBe('string')
  })
})

describe('generateEngWordTask', () => {
  it('returns correct type', () => {
    expect(generateEngWordTask([1, 10], 'library').type).toBe('engWord')
  })
  it('has 4 options', () => {
    const t = generateEngWordTask([1, 10], 'library')
    expect(t.options).toHaveLength(4)
  })
  it('options contain correctAnswer', () => {
    const t = generateEngWordTask([1, 10], 'library')
    expect(t.options).toContain(t.correctAnswer)
  })
  it('all options are distinct', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateEngWordTask([1, 10], 'library')
      const unique = new Set(t.options)
      expect(unique.size).toBe(4)
    }
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run test:run 2>&1 | tail -20
```

Expected: errors about `generateEngPictureTask` and `generateEngWordTask` not being exported.

- [ ] **Step 3: Add generators to `src/data/tasks.ts`**

Add this import at the top of `tasks.ts` (after existing imports):

```ts
import { ENG_WORDS } from './engWords'
```

Add the two generator functions before the `TASK_GENERATORS` export:

```ts
export function generateEngPictureTask(_range: [number, number], _biome: string): Task {
  const pool = ENG_WORDS.filter(w => w.difficulty === 'easy')
  const idx = ri(0, pool.length - 1)
  const word = pool[idx]
  const others = pool.filter((_, i) => i !== idx)
  const distractors = shuffle(others).slice(0, 2).map(w => w.english)
  return {
    id: uid(),
    type: 'engPicture',
    question: 'Co je to anglicky?',
    objects: [word.emoji],
    options: shuffle([word.english, ...distractors]),
    correctAnswer: word.english,
  }
}

export function generateEngWordTask(_range: [number, number], _biome: string): Task {
  const pool = ENG_WORDS.filter(w => w.difficulty === 'easy')
  const idx = ri(0, pool.length - 1)
  const word = pool[idx]
  const others = pool.filter((_, i) => i !== idx)
  const distractors = shuffle(others).slice(0, 3).map(w => w.emoji)
  return {
    id: uid(),
    type: 'engWord',
    question: word.english,
    options: shuffle([word.emoji, ...distractors]),
    correctAnswer: word.emoji,
  }
}
```

Then register both in `TASK_GENERATORS`. The existing record ends with `runner`. Add two more entries:

```ts
export const TASK_GENERATORS: Record<TaskType, TaskGenerator> = {
  counting:      (r, b) => generateCountingTask(r, b),
  tapNumber:     (r)    => generateTapNumberTask(r),
  compare:       (r)    => generateCompareTask(r),
  multiChoice:   (r, b) => generateMultiChoiceTask(r, b),
  math:          (r)    => generateMathTask(r),
  dragDrop:      (r, b) => generateDragDropTask(r, b),
  find:          (r)    => generateFindTask(r),
  mathMultiply:  (r)    => generateMathTask(r),
  missingLetter: () => { throw new Error('missingLetter: use generateLangTask()') },
  diacritics:    () => { throw new Error('diacritics: use generateLangTask()') },
  wordOrder:     () => { throw new Error('wordOrder: use generateLangTask()') },
  runner:        () => { throw new Error('runner: use routing in useTask.ts') },
  engPicture:    (r, b) => generateEngPictureTask(r, b),
  engWord:       (r, b) => generateEngWordTask(r, b),
}
```

- [ ] **Step 4: Run tests — all must pass**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run test:run 2>&1 | tail -20
```

Expected: all tests pass, no failures.

- [ ] **Step 5: Commit**

```bash
git add src/data/tasks.ts tests/tasks.test.ts
git commit -m "feat(eng): add generateEngPictureTask and generateEngWordTask with tests"
```

---

### Task 4: Create `EngPictureTask` component

**Files:**
- Create: `src/components/tasks/EngPictureTask.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/tasks/EngPictureTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function EngPictureTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ textAlign: 'center', fontSize: 96, lineHeight: 1.1, marginBottom: 8 }}
      >
        {task.objects?.[0]}
      </motion.div>
      <p className="task-question">{task.question}</p>
      <div className="answer-grid">
        {task.options?.map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            style={{ fontSize: 20, fontWeight: 'bold', letterSpacing: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(String(opt))}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build 2>&1 | grep -E "EngPicture|error TS"
```

Expected: no errors about `EngPictureTask`.

- [ ] **Step 3: Commit**

```bash
git add src/components/tasks/EngPictureTask.tsx
git commit -m "feat(eng): add EngPictureTask component"
```

---

### Task 5: Create `EngWordTask` component

**Files:**
- Create: `src/components/tasks/EngWordTask.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/tasks/EngWordTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function EngWordTask({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(opt: string) {
    setSelected(opt)
    setTimeout(() => { setSelected(null); onAnswer(opt) }, 300)
  }

  return (
    <div className="task-area">
      <motion.p
        className="task-question"
        style={{ fontSize: 42, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 4 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {task.question}
      </motion.p>
      <p style={{ textAlign: 'center', color: '#aaa', fontSize: 14, marginBottom: 16 }}>
        Klepni na správný obrázek
      </p>
      <div
        className="answer-grid"
        style={{ gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 260, margin: '0 auto' }}
      >
        {task.options?.map(opt => (
          <motion.button
            key={opt}
            className={`answer-btn ${selected === opt ? (opt === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            style={{ fontSize: 48, padding: '16px 0', lineHeight: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(String(opt))}
          >
            {opt}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build 2>&1 | grep -E "EngWord|error TS"
```

Expected: no errors about `EngWordTask`.

- [ ] **Step 3: Commit**

```bash
git add src/components/tasks/EngWordTask.tsx
git commit -m "feat(eng): add EngWordTask component"
```

---

### Task 6: Wire both components into TaskRenderer

**Files:**
- Modify: `src/components/tasks/TaskRenderer.tsx`

- [ ] **Step 1: Add imports and switch cases**

Add imports after the existing `RunnerTask` import:

```tsx
import { EngPictureTask } from './EngPictureTask'
import { EngWordTask }    from './EngWordTask'
```

Add cases at the end of the switch (before the closing `}`):

```tsx
case 'engPicture': return <EngPictureTask task={task} onAnswer={onAnswer} />
case 'engWord':    return <EngWordTask    task={task} onAnswer={onAnswer} />
```

- [ ] **Step 2: Build must pass with zero TypeScript errors**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build 2>&1 | grep "error TS"
```

Expected: no output (zero errors). The exhaustive switch in `TaskRenderer` is now satisfied.

- [ ] **Step 3: Commit**

```bash
git add src/components/tasks/TaskRenderer.tsx
git commit -m "feat(eng): register EngPictureTask and EngWordTask in TaskRenderer"
```

---

### Task 7: Add task types to worlds

**Files:**
- Modify: `src/data/worlds.ts`

- [ ] **Step 1: Extend Library world's `taskTypes`**

The Library world (`id: 'library'`) currently has:
```ts
taskTypes: [
  { type: 'wordOrder', weight: 1 },
],
```

Replace with:
```ts
taskTypes: [
  { type: 'engPicture', weight: 5 },
  { type: 'engWord',    weight: 4 },
  { type: 'wordOrder',  weight: 1 },
],
```

- [ ] **Step 2: Add low-weight entries to Forest world**

The Forest world (`id: 'forest'`) currently has:
```ts
taskTypes: ['counting', 'tapNumber', 'compare', 'multiChoice', { type: 'math', weight: 5 },
   { type: 'wordOrder', weight: 2 }, { type: 'runner', weight: 2 }
 ],
```

Replace with:
```ts
taskTypes: [
  'counting', 'tapNumber', 'compare', 'multiChoice',
  { type: 'math',       weight: 5 },
  { type: 'wordOrder',  weight: 2 },
  { type: 'runner',     weight: 2 },
  { type: 'engPicture', weight: 1 },
  { type: 'engWord',    weight: 1 },
],
```

- [ ] **Step 3: Build and tests pass**

```bash
cd /Users/michalrubas/Apps/Minecraft/EduCraft && npm run build 2>&1 | grep "error TS" && npm run test:run 2>&1 | tail -10
```

Expected: zero build errors, all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/data/worlds.ts
git commit -m "feat(eng): add engPicture and engWord to Library and Forest worlds"
```

---

## Verification

After all tasks are done:

1. `npm run build` — zero TypeScript errors
2. `npm run test:run` — all tests pass
3. `npm run dev` — open app, enter Forest world, verify both task types appear and answer feedback works
4. Enter Library world, verify it's dominated by English tasks
