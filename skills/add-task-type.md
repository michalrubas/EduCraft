# Skill: Add a new task type

A task type is a distinct question format shown in the game screen. Adding one touches 4 files. The critical decision is whether the new type is **simple** (generated from a number range) or **skill-routed** (driven by the ZPD skill system).

---

## Decision: simple vs. skill-routed

| Type | When to use | Examples |
|---|---|---|
| **Simple** | Task depends on `numberRange` and biome objects | `counting`, `tapNumber`, `compare`, `find`, `dragDrop` |
| **Skill-routed** | Task difficulty is determined by student's mastery, not a number range | `math`, `mathMultiply`, `missingLetter`, `diacritics`, `wordOrder` |

Skill-routed types require extra wiring in `useTask.ts`. If unsure, start simple.

---

## Step 1 — Add to the type union

File: `src/data/types.ts`

```ts
export type TaskType =
  | 'counting'
  | ...
  | 'yourTaskType'   // add here
```

---

## Step 2 — Write the generator

**Simple task** → add to `src/data/tasks.ts`:

```ts
export function generateYourTask(range: [number, number], biome: string): Task {
  const [min, max] = range
  const objs = BIOME_OBJECTS[biome as Biome] ?? BIOME_OBJECTS.forest
  // ... generate question, options, correctAnswer
  return {
    id: uid(),
    type: 'yourTaskType',
    question: 'Otázka v češtině?',
    options: [...],          // array of number | string choices
    correctAnswer: answer,
  }
}
```

Then register it in the `TASK_GENERATORS` map at the bottom of `tasks.ts`:
```ts
export const TASK_GENERATORS: Record<TaskType, (range: [number, number], biome: string) => Task> = {
  counting:    generateCountingTask,
  ...
  yourTaskType: generateYourTask,   // add here
}
```

**Skill-routed task** → add the generator to `src/data/skills.ts` instead (see `add-skill.md`). The generator should return a `Task` with `skillId` set and `type` set to your new type.

### Task shape reference

```ts
{
  id: uid(),               // always uid()
  type: 'yourTaskType',    // must match TaskType
  skillId?: SkillId,       // only for skill-routed tasks
  question: string,        // Czech, shown above the answer area
  visualCount?: number,    // for counting-style tasks
  options?: (number | string)[],   // answer choices (3 is standard)
  correctAnswer: number | string,  // must be === one of options
  objects?: string[],      // emoji/image array for visual tasks
  letters?: string[],      // for wordOrder only: scrambled letters
}
```

---

## Step 3 — Build the React component

Create `src/components/tasks/YourTask.tsx`:

```tsx
import { Task } from '../../data/types'

interface Props {
  task: Task
  onAnswer: (answer: number | string) => void
}

export function YourTask({ task, onAnswer }: Props) {
  // Call onAnswer(value) when the player submits.
  // For button-based answers: add a short delay (~300ms) before calling onAnswer
  // so the player sees the selection feedback before the screen transitions.
  // See MathTask.tsx for the standard button pattern.
  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      {/* your UI */}
    </div>
  )
}
```

Use existing CSS classes: `task-area`, `task-question`, `answer-grid`, `answer-btn`, `correct`, `wrong`.

---

## Step 4 — Register in TaskRenderer

File: `src/components/tasks/TaskRenderer.tsx`

```tsx
import { YourTask } from './YourTask'

// In the switch:
case 'yourTaskType': return <YourTask task={task} onAnswer={onAnswer} />
```

---

## Step 5 — Wire routing (skill-routed types only)

File: `src/hooks/useTask.ts`

Simple tasks are handled automatically via `TASK_GENERATORS`. Skill-routed types need explicit routing:

```ts
if (chosen === 'yourTaskType') {
  return generateLangTask(selectLangSkill(studentProgress, 'your_domain'))
  // or: generateSkillTask(selectSkill(studentProgress, 'your_domain'))
}
```

Add this block alongside the existing `if (chosen === 'math')` etc. blocks, before the final `TASK_GENERATORS[chosen](...)` fallback.

---

## Step 6 — Add to worlds

File: `src/data/worlds.ts`

For each world where the new type should appear, add it to `taskTypes`:

```ts
taskTypes: [
  { type: 'yourTaskType', weight: 3 },
  'math',
  // ...
]
```

Weight 1–3 for supplemental types, 4–7 for the primary focus of the world.

---

## Verification checklist

- [ ] `yourTaskType` added to `TaskType` union in `types.ts`
- [ ] Generator written and returns a valid `Task` object
- [ ] Simple: registered in `TASK_GENERATORS` in `tasks.ts`
- [ ] Skill-routed: routing added in `useTask.ts`
- [ ] Component created in `components/tasks/`
- [ ] Case added in `TaskRenderer.tsx`
- [ ] Added to at least one world's `taskTypes` in `worlds.ts`
- [ ] Run `npm run build` — no TypeScript errors (exhaustive switch in TaskRenderer will catch missing cases)
- [ ] Run `npm run dev`, enter a world with the new type, verify task renders and answer feedback works
