# Runner Task — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `runner` task type — Guitar Hero–style three-lane scroller where the child taps the lane containing the correct answer before the red wall from the left reaches it.

**Architecture:** New `TaskType 'runner'` routed explicitly in `useTask.ts` (like `missingLetter`). Generators live in a dedicated `runnerGenerators.ts`. The component uses CSS `@keyframes` for animation (no re-renders during play) with durations computed from `RUNNER_CONFIG` and the world's `comboMultiplier`.

**Tech Stack:** React, TypeScript, CSS keyframe animation, Zustand (read-only for world lookup), Vitest

---

## File Map

| Action | File | What changes |
|--------|------|-------------|
| Modify | `src/data/types.ts` | add `'runner'` to `TaskType` union |
| Modify | `src/data/config.ts` | add `RUNNER_CONFIG` object |
| **Create** | `src/data/runnerGenerators.ts` | three generator functions |
| Modify | `src/data/tasks.ts` | add stub entry for `runner` in `TASK_GENERATORS` |
| Modify | `src/hooks/useTask.ts` | add explicit routing for `'runner'` |
| Modify | `src/styles.css` | add runner CSS classes + keyframes |
| **Create** | `src/components/tasks/RunnerTask.tsx` | the component |
| Modify | `src/components/tasks/TaskRenderer.tsx` | add `case 'runner'` |
| Modify | `src/data/worlds.ts` | add runner to `forest`, `village`, `desert` |
| **Create** | `src/test/runnerGenerators.test.ts` | generator unit tests |
| **Create** | `modding.md` | runner configuration guide |

---

### Task 1: Type + Config

**Files:**
- Modify: `src/data/types.ts`
- Modify: `src/data/config.ts`

- [ ] **Step 1: Add `'runner'` to TaskType union in `src/data/types.ts`**

Find the line:
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
```
Replace with:
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
```

- [ ] **Step 2: Add `RUNNER_CONFIG` to `src/data/config.ts`**

Append at the end of the file:
```ts
// Runner task configuration — adjust these to tune difficulty and feel
export const RUNNER_CONFIG = {
  /** Total animation duration at 1× speed (comboMultiplier = 1.0), in ms.
   *  Both the block slide and the wall timeout use this value. */
  duration: 5000,
  /** Minimum duration regardless of world speed multiplier, in ms. */
  minDuration: 2500,
  /** Delay between each lane's block appearing, in ms.
   *  Creates a staggered "Guitar Hero" entry effect. */
  staggerDelay: 400,
  /** Number of answer lanes. Changing this also requires updating generators. */
  laneCount: 3,
} as const
```

- [ ] **Step 3: Run build to check no TS errors so far**

```bash
npm run build 2>&1 | tail -20
```
Expected: error about missing `runner` key in `TASK_GENERATORS` (fine — fixed in Task 2).

---

### Task 2: Generators

**Files:**
- Create: `src/data/runnerGenerators.ts`
- Modify: `src/data/tasks.ts`
- Modify: `src/hooks/useTask.ts`

- [ ] **Step 1: Write the failing test file**

Create `src/test/runnerGenerators.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import {
  generateRunnerMath,
  generateRunnerCompare,
  generateRunnerLanguage,
} from '../data/runnerGenerators'

describe('generateRunnerMath', () => {
  it('returns a runner task with exactly 3 options', () => {
    const task = generateRunnerMath([1, 10])
    expect(task.type).toBe('runner')
    expect(task.options).toHaveLength(3)
    expect(task.question).toMatch(/[+−×]/)
  })

  it('correctAnswer is one of the options', () => {
    for (let i = 0; i < 20; i++) {
      const task = generateRunnerMath([1, 20])
      expect(task.options).toContain(task.correctAnswer)
    }
  })
})

describe('generateRunnerCompare', () => {
  it('returns a runner task with exactly 3 distinct options', () => {
    const task = generateRunnerCompare([5, 30])
    expect(task.type).toBe('runner')
    expect(task.options).toHaveLength(3)
    const unique = new Set(task.options)
    expect(unique.size).toBe(3)
  })

  it('correctAnswer is the largest option', () => {
    for (let i = 0; i < 20; i++) {
      const task = generateRunnerCompare([1, 50])
      const max = Math.max(...(task.options as number[]))
      expect(task.correctAnswer).toBe(max)
    }
  })
})

describe('generateRunnerLanguage', () => {
  it('returns a runner task with exactly 3 options', () => {
    const task = generateRunnerLanguage()
    expect(task.type).toBe('runner')
    expect(task.options).toHaveLength(3)
  })

  it('correctAnswer is one of the options', () => {
    for (let i = 0; i < 20; i++) {
      const task = generateRunnerLanguage()
      expect(task.options).toContain(task.correctAnswer)
    }
  })
})
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
npm run test:run 2>&1 | tail -20
```
Expected: FAIL — `Cannot find module '../data/runnerGenerators'`

- [ ] **Step 3: Create `src/data/runnerGenerators.ts`**

```ts
// src/data/runnerGenerators.ts
// Runner task generators — one function per question category.
// Each always returns exactly 3 options (RUNNER_CONFIG.laneCount).

import { Task } from './types'
import { LANG_WORDS, isAsciiWord } from './langWords'

function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Generates arithmetic expression (add/subtract) with 3 answer choices. */
export function generateRunnerMath(range: [number, number]): Task {
  const [, max] = range
  const isAdd = Math.random() > 0.4
  let question: string
  let correct: number

  if (isAdd) {
    const a = ri(1, Math.max(1, Math.floor(max * 0.7)))
    const b = ri(1, Math.max(1, max - a))
    correct = a + b
    question = `${a} + ${b} = ?`
  } else {
    const a = ri(2, max)
    const b = ri(1, a - 1)
    correct = a - b
    question = `${a} − ${b} = ?`
  }

  const w1 = correct < max * 2 ? correct + 1 : correct - 1
  let w2 = correct > 2 ? correct - 2 : correct + 3
  if (w2 === w1) w2 = correct + 2

  return {
    id: uid(),
    type: 'runner',
    question,
    options: shuffle([correct, w1, w2]),
    correctAnswer: correct,
  }
}

/** Generates "which number is biggest?" with 3 distinct numbers as options. */
export function generateRunnerCompare(range: [number, number]): Task {
  const [min, max] = range
  const nums = new Set<number>()
  let attempts = 0
  while (nums.size < 3 && attempts < 30) {
    nums.add(ri(min, max))
    attempts++
  }
  // fallback: ensure 3 distinct values
  while (nums.size < 3) nums.add(Math.max(...nums) + 1)

  const options = shuffle([...nums]) as number[]
  const correct = Math.max(...options)

  return {
    id: uid(),
    type: 'runner',
    question: 'Které číslo je největší?',
    options,
    correctAnswer: correct,
  }
}

const VOWELS = ['A', 'E', 'I', 'O', 'U']
const CONSONANTS = ['B', 'D', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z']

/** Generates a missing-letter question with exactly 3 letter choices. */
export function generateRunnerLanguage(): Task {
  const pool = LANG_WORDS.filter(w => isAsciiWord(w.word))
  const word = pool[Math.floor(Math.random() * pool.length)]
  const letters = word.word.toUpperCase().split('')
  const pos = Math.floor(Math.random() * letters.length)
  const correct = letters[pos]
  const question = letters.map((l, i) => (i === pos ? '_' : l)).join('')
  const letterPool = VOWELS.includes(correct) ? VOWELS : CONSONANTS
  const wrongs = shuffle(letterPool.filter(l => l !== correct)).slice(0, 2)

  return {
    id: uid(),
    type: 'runner',
    question,
    options: shuffle([correct, wrongs[0], wrongs[1]]),
    correctAnswer: correct,
  }
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
npm run test:run 2>&1 | tail -20
```
Expected: `runnerGenerators.test.ts` — all 6 tests PASS

- [ ] **Step 5: Add stub entry for `runner` in `TASK_GENERATORS` in `src/data/tasks.ts`**

Find the closing brace of `TASK_GENERATORS`:
```ts
  wordOrder:     () => { throw new Error('wordOrder: use generateLangTask()') },
}
```
Replace with:
```ts
  wordOrder:     () => { throw new Error('wordOrder: use generateLangTask()') },
  // runner is routed explicitly in useTask.ts — this stub satisfies the Record type
  runner:        () => { throw new Error('runner: use routing in useTask.ts') },
}
```

- [ ] **Step 6: Add routing for `'runner'` in `src/hooks/useTask.ts`**

Add these imports at the top of the file (after existing imports):
```ts
import { generateRunnerMath, generateRunnerCompare, generateRunnerLanguage } from '../data/runnerGenerators'
```

Then, inside `generateNext`, find the block:
```ts
    if (chosen === 'wordOrder') {
      return generateLangTask(selectLangSkill(studentProgress, 'word_order'))
    }

    return TASK_GENERATORS[chosen](effectiveRange, world.biome)
```
Replace with:
```ts
    if (chosen === 'wordOrder') {
      return generateLangTask(selectLangSkill(studentProgress, 'word_order'))
    }
    if (chosen === 'runner') {
      const LANG_BIOMES = ['village', 'castle', 'library', 'graveyard']
      const COMPARE_BIOMES = ['desert']
      if (LANG_BIOMES.includes(world.biome)) return generateRunnerLanguage()
      if (COMPARE_BIOMES.includes(world.biome)) return generateRunnerCompare(effectiveRange)
      return generateRunnerMath(effectiveRange)
    }

    return TASK_GENERATORS[chosen](effectiveRange, world.biome)
```

- [ ] **Step 7: Run build to confirm no TS errors**

```bash
npm run build 2>&1 | tail -20
```
Expected: no errors (or only unrelated warnings).

- [ ] **Step 8: Commit**

```bash
git add src/data/types.ts src/data/config.ts src/data/runnerGenerators.ts src/data/tasks.ts src/hooks/useTask.ts src/test/runnerGenerators.test.ts
git commit -m "feat(runner): add runner task type, config, and generators"
```

---

### Task 3: CSS

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Append runner styles to `src/styles.css`**

Append at the very end of the file:
```css
/* ── Runner task ── */
.runner-track {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  padding: 8px 0;
}

.runner-wall {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: linear-gradient(to right, rgba(255, 50, 50, 0.3), transparent);
  border-left: 3px solid var(--mc-red);
  border-radius: 4px;
  pointer-events: none;
  z-index: 1;
  animation: runner-wall-grow var(--runner-wall-dur) linear forwards;
}

.runner-wall--paused {
  animation-play-state: paused;
}

@keyframes runner-wall-grow {
  from { width: 0; }
  to   { width: 100%; }
}

.runner-lane {
  flex: 1;
  min-height: 60px;
  background: #0d1e30;
  border: 2px solid #1a3a5a;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.runner-lane:active:not([disabled]) { transform: scale(0.98); }
.runner-lane.correct { border-color: var(--mc-green); background: #0d2010; }
.runner-lane.wrong   { border-color: var(--mc-red);   background: #300d0d; }

.runner-block {
  position: absolute;
  right: -90px;
  top: 50%;
  transform: translateY(-50%);
  background: #1a5a8a;
  border: 2px solid #3a8abf;
  border-radius: 4px;
  padding: 6px 18px;
  color: #fff;
  font-size: 20px;
  font-weight: 800;
  white-space: nowrap;
  animation: runner-block-slide var(--runner-block-dur) linear var(--runner-block-delay) both;
}

@keyframes runner-block-slide {
  0%   { right: -90px; }
  18%  { right: 55%; }
  82%  { right: 10%; }
  100% { right: calc(100% + 90px); }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles.css
git commit -m "feat(runner): add runner lane CSS and keyframe animations"
```

---

### Task 4: RunnerTask Component

**Files:**
- Create: `src/components/tasks/RunnerTask.tsx`

- [ ] **Step 1: Create `src/components/tasks/RunnerTask.tsx`**

```tsx
// src/components/tasks/RunnerTask.tsx
import { useEffect, useRef, useState } from 'react'
import { Task } from '../../data/types'
import { RUNNER_CONFIG } from '../../data/config'
import { useGameStore } from '../../store/gameStore'
import { getWorld } from '../../data/worlds'

interface Props {
  task: Task
  onAnswer: (answer: number | string) => void
}

export function RunnerTask({ task, onAnswer }: Props) {
  const currentWorldId = useGameStore(s => s.currentWorldId)
  const world = currentWorldId ? getWorld(currentWorldId) : null
  const multiplier = world?.comboMultiplier ?? 1

  const effectiveDur = Math.max(
    RUNNER_CONFIG.minDuration,
    Math.round(RUNNER_CONFIG.duration / multiplier),
  )
  // wall expires slightly after the last block fully enters, giving the player a fair window
  const wallDur = effectiveDur + RUNNER_CONFIG.staggerDelay * (RUNNER_CONFIG.laneCount - 1)

  const [answered, setAnswered] = useState(false)
  const [selectedLane, setSelectedLane] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setAnswered(false)
    setSelectedLane(null)
    timerRef.current = setTimeout(() => {
      setAnswered(true)
      onAnswer('')   // timeout counts as wrong answer
    }, wallDur)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task.id])

  function handleTap(index: number) {
    if (answered) return
    if (timerRef.current) clearTimeout(timerRef.current)
    setAnswered(true)
    setSelectedLane(index)
    setTimeout(() => onAnswer(task.options![index]), 300)
  }

  const options = task.options ?? []

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div
        className="runner-track"
        style={{ '--runner-wall-dur': `${wallDur}ms` } as React.CSSProperties}
      >
        <div className={`runner-wall${answered ? ' runner-wall--paused' : ''}`} />
        {options.map((opt, i) => {
          const laneClass = answered && selectedLane === i
            ? (opt === task.correctAnswer ? ' correct' : ' wrong')
            : ''
          return (
            <button
              key={i}
              className={`runner-lane${laneClass}`}
              style={{
                '--runner-block-dur': `${effectiveDur}ms`,
                '--runner-block-delay': `${i * RUNNER_CONFIG.staggerDelay}ms`,
              } as React.CSSProperties}
              onClick={() => handleTap(i)}
              disabled={answered}
            >
              <span className="runner-block">{opt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run build to confirm no TS errors**

```bash
npm run build 2>&1 | tail -20
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/tasks/RunnerTask.tsx
git commit -m "feat(runner): add RunnerTask component"
```

---

### Task 5: Wire + Worlds

**Files:**
- Modify: `src/components/tasks/TaskRenderer.tsx`
- Modify: `src/data/worlds.ts`

- [ ] **Step 1: Add `case 'runner'` to `src/components/tasks/TaskRenderer.tsx`**

Add import at the top alongside the other task imports:
```ts
import { RunnerTask } from './RunnerTask'
```

In the switch statement, find:
```ts
      case 'wordOrder':     return <WordOrderTask      task={task} onAnswer={onAnswer} />
```
Add after it:
```ts
      case 'runner':        return <RunnerTask         task={task} onAnswer={onAnswer} />
```

- [ ] **Step 2: Add runner to three worlds in `src/data/worlds.ts`**

In the `forest` world, find:
```ts
    taskTypes: ['counting', 'tapNumber', 'compare', 'multiChoice', { type: 'math', weight: 5 },
      { type: 'wordOrder', weight: 2 }
    ],
```
Replace with:
```ts
    taskTypes: ['counting', 'tapNumber', 'compare', 'multiChoice', { type: 'math', weight: 5 },
      { type: 'wordOrder', weight: 2 }, { type: 'runner', weight: 2 }
    ],
```

In the `desert` world, find:
```ts
    taskTypes: ['find', 'compare', { type: 'math', weight: 6 }, 'multiChoice'],
```
Replace with:
```ts
    taskTypes: ['find', 'compare', { type: 'math', weight: 6 }, 'multiChoice', { type: 'runner', weight: 2 }],
```

In the `village` world, find:
```ts
    taskTypes: [
      { type: 'missingLetter', weight: 3 },
      { type: 'wordOrder', weight: 2 },
    ],
```
Replace with:
```ts
    taskTypes: [
      { type: 'missingLetter', weight: 3 },
      { type: 'wordOrder', weight: 2 },
      { type: 'runner', weight: 2 },
    ],
```

- [ ] **Step 3: Run full test + build**

```bash
npm run test:run && npm run build 2>&1 | tail -30
```
Expected: all tests PASS, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/tasks/TaskRenderer.tsx src/data/worlds.ts
git commit -m "feat(runner): wire RunnerTask into renderer and add to forest/desert/village worlds"
```

---

### Task 6: modding.md

**Files:**
- Create: `modding.md`

- [ ] **Step 1: Create `modding.md` at project root**

```markdown
# EduCraft Modding Guide

Reference for configuring and extending EduCraft without touching game logic.

---

## Runner Task

The `runner` task type is a three-lane scroller. The child reads the math or language question at the top, watches blocks slide in from the right, and taps the lane with the correct answer before the red wall from the left reaches the end.

### Configuration — `src/data/config.ts`

All runner behaviour is controlled by `RUNNER_CONFIG`:

| Field | Default | Effect | Recommended range |
|-------|---------|--------|-------------------|
| `duration` | `5000` | Total animation time (ms) at 1× speed (comboMultiplier = 1.0). Both block travel and wall timeout scale with this value. | 3000–7000 |
| `minDuration` | `2500` | Floor: animation never goes faster than this, regardless of world multiplier. | 1500–3500 |
| `staggerDelay` | `400` | Time (ms) between each lane's block appearing. Creates the staggered Guitar Hero entry. | 200–600 |
| `laneCount` | `3` | Number of lanes. **Changing this requires updating the generators** (always produce `laneCount` options). | Keep at 3 |

**Speed formula:** `effectiveDuration = max(minDuration, round(duration / world.comboMultiplier))`

Example: `forest` has `comboMultiplier = 1.0` → 5000 ms. `nether` has `comboMultiplier = 2.5` → 2000 ms (clamped to `minDuration = 2500`).

### Adding Runner to a World

In `src/data/worlds.ts`, add `{ type: 'runner', weight: N }` to any world's `taskTypes`:

```ts
taskTypes: [
  { type: 'math', weight: 5 },
  { type: 'runner', weight: 2 },   // ← add this
],
```

**Weight guide:** 1–2 for a spice task, 4–6 for the world's main focus.

**Which generator fires** depends on the world's `biome`:

| Biome | Generator | Question type |
|-------|-----------|---------------|
| `village`, `castle`, `library`, `graveyard` | `generateRunnerLanguage` | Missing letter (Czech) |
| `desert` | `generateRunnerCompare` | Largest number |
| Everything else | `generateRunnerMath` | Addition / subtraction |

To change this routing, edit the `if (chosen === 'runner')` block in `src/hooks/useTask.ts`.

### Adding a New Runner Question Type

1. Write a new generator in `src/data/runnerGenerators.ts` following this signature:
   ```ts
   export function generateRunnerXxx(range?: [number, number]): Task {
     return {
       id: uid(),
       type: 'runner',
       question: '...',
       options: /* exactly 3 items */ [...],
       correctAnswer: /* one of options */ ...,
     }
   }
   ```
2. Add the biome routing in `src/hooks/useTask.ts`:
   ```ts
   if (chosen === 'runner') {
     const XXX_BIOMES = ['yourBiome']
     if (XXX_BIOMES.includes(world.biome)) return generateRunnerXxx(effectiveRange)
     // ... existing branches
   }
   ```

### Tuning Speed Per World

There is no per-world speed override field — speed is determined by `RUNNER_CONFIG.duration` and the world's `comboMultiplier`. To make runner faster in a specific world without changing its multiplier, lower `RUNNER_CONFIG.duration` globally or add a dedicated world-level field in `World` (requires updating `src/data/types.ts`).
```

- [ ] **Step 2: Commit**

```bash
git add modding.md
git commit -m "docs: add modding.md with runner task configuration guide"
```

---

## Verification Checklist

Run these after all tasks are complete:

- [ ] `npm run test:run` — all tests pass
- [ ] `npm run build` — no TypeScript errors
- [ ] `npm run dev` → enter **Příroda** (forest) world → runner task appears, blocks animate, tap correct lane → green feedback, combo increases
- [ ] Enter **Poušť** (desert) → runner shows "Které číslo je největší?" with 3 number lanes
- [ ] Enter **Vesnice** (village) → runner shows missing-letter question (e.g. `P_S`)
- [ ] Let the wall reach the end without tapping → combo resets (wrong answer)
- [ ] On a fast world (Nether/End) verify animation is noticeably faster than forest
