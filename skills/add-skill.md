# Skill: Add a new skill to the skill tree

Adding a skill touches 3 files across 7+ locations. Missing any step silently breaks the system — mastery state won't exist, `checkUnlocks()` won't fire, or existing users' localStorage will be in an invalid shape.

Decide first: **math skill** (`MathSkillId`) or **language skill** (`LangSkillId`)?

---

## Step 1 — Add the ID to the type union

File: `src/data/types.ts`

Math skill → add to `MathSkillId`:
```ts
export type MathSkillId =
  | 'add_no_regroup'
  | ...
  | 'your_new_skill'   // add here
```

Language skill → add to `LangSkillId`:
```ts
export type LangSkillId =
  | 'letter_missing_easy'
  | ...
  | 'your_new_skill'   // add here
```

---

## Step 2 — Register in the skill tree

File: `src/data/skills.ts`

Math skill → append to `SKILL_TREE`:
```ts
{
  id: 'your_new_skill',
  name: 'Název pro rodiče',      // Czech, shown in ParentDashboard
  icon: '➕',
  description: 'Co dítě procvičuje — pro rodiče srozumitelně.',
  prerequisites: [
    { id: 'existing_skill_id', minMastery: 0.7 },
    // empty array [] = unlocked from the start
  ],
},
```

Language skill → append to `LANG_SKILL_TREE` (same shape, `id` is `LangSkillId`).

### Prerequisites guide

- Entry skill (no gate): `prerequisites: []`
- Requires one parent: `[{ id: 'parent_id', minMastery: 0.6 }]` — 0.6 = solidly learning
- Requires two parents: list both — both must be met simultaneously
- `minMastery: 0.7` = nearly mastered; use for skills that build directly on top

---

## Step 3 — Add to the domain map

File: `src/data/skills.ts`

Math skills must be placed in exactly one domain so `selectSkill()` can find them:

```ts
export const SKILL_DOMAINS: Record<'add_sub' | 'multiply', MathSkillId[]> = {
  add_sub:  ['add_no_regroup', ..., 'your_new_skill'],  // addition/subtraction skills
  multiply: ['mul_easy', 'mul_medium', 'mul_hard'],      // multiplication skills
}
```

Language skills → add to `LANG_SKILL_DOMAINS` in the appropriate domain group:

```ts
export const LANG_SKILL_DOMAINS: Record<'missing_letter' | 'diacritics' | 'word_order', LangSkillId[]> = {
  missing_letter: ['letter_missing_easy', 'letter_missing_hard', 'your_new_skill'],
  // or diacritics / word_order
}
```

---

## Step 4 — Write the task generator

File: `src/data/skills.ts`

**Math skill** — add a generator function and a case in `generateSkillTask()`:

```ts
// Generator function (add near other generators):
function genYourNewSkill(): { a: number; b: number; ans: number } {
  // Generate a and b so the operation matches the skill's cognitive structure.
  // Do NOT just pick random numbers — the difficulty must reflect operation type.
  const a = ri(MIN, MAX)
  const b = ri(MIN, MAX)
  return { a, b, ans: a + b }
}

// In the generateSkillTask() switch:
case 'your_new_skill': {
  ;({ a, b, ans } = genYourNewSkill())
  question = `${a} + ${b} = ?`
  break
}
```

If the new skill needs custom distractors, add a case in `smartDistractors()`:
```ts
if (skillId === 'your_new_skill') {
  // Add skill-specific wrong answers that reflect real child mistakes
  if (correct - 10 > 0) cands.add(correct - 10)
}
```

**Language skill** — add a generator function and a case in `generateLangTask()`:

```ts
// In generateLangTask() switch:
case 'your_new_skill':
  return genMissingLetter(skillId)  // or genDiacritics / genWordOrder
```

If none of the existing generators fit, write a new one following the pattern of `genMissingLetter()`.

---

## Step 5 — Initialize default state

File: `src/data/skills.ts`, inside `createInitialProgress()`:

The function loops over `SKILL_TREE` and `LANG_SKILL_TREE` automatically — **no manual change needed here** as long as you added the skill to the correct tree in Step 2.

Verify the loop covers your new tree:
```ts
for (const skill of SKILL_TREE) { ... }      // math skills
for (const skill of LANG_SKILL_TREE) { ... } // lang skills
```

---

## Step 6 — Update the store migration

File: `src/store/gameStore.ts`, inside the `migrate` function.

This is critical. Existing users' localStorage does not have your new skill. Without migration, `studentProgress['your_new_skill']` is `undefined` and the app crashes silently.

```ts
migrate: (old: unknown) => {
  const state = old as Record<string, unknown>
  const existingProgress = (state.studentProgress ?? {}) as Record<string, SkillState>

  // Add default for your new skill:
  const newSkillDefault: SkillState = {
    mastery: 0,
    unlocked: false,  // true only if prerequisites: []
    attempts: 0,
    lastPracticed: 0,
  }

  return {
    ...state,
    studentProgress: {
      your_new_skill: newSkillDefault,
      ...existingProgress,  // existing data wins (preserves user progress)
    },
  }
},
```

Also increment `version` by 1 in the persist config:
```ts
persist(..., { name: 'adicraft-game-v1', version: 2 })  // was 1
```

---

## Verification checklist

- [ ] `your_new_skill` added to `MathSkillId` or `LangSkillId` in `types.ts`
- [ ] Entry added to `SKILL_TREE` or `LANG_SKILL_TREE` in `skills.ts`
- [ ] Added to the correct domain in `SKILL_DOMAINS` or `LANG_SKILL_DOMAINS`
- [ ] Generator function written
- [ ] Case added in `generateSkillTask()` or `generateLangTask()` switch
- [ ] `migrate()` updated and `version` bumped
- [ ] Run `npm run build` — no TypeScript errors
- [ ] Run `npm run test:run` — all tests pass
- [ ] Open app, clear localStorage (`adicraft-game-v1`), verify skill appears in `SkillDebugPanel` (dev only)
- [ ] Verify the skill is reachable: set prerequisite skills' mastery ≥ threshold → skill unlocks
