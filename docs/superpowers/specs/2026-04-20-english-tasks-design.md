# English Vocabulary Tasks — Design Spec

**Date:** 2026-04-20  
**Status:** Approved

---

## Summary

Two new simple task types for English vocabulary learning, targeting Czech children aged 6–10 who are complete beginners. Visual-first approach: emoji are the primary learning anchor.

---

## Data: `src/data/engWords.ts` (new file)

```ts
export interface EngWord {
  english: string       // "dog"
  czech: string         // "pes"
  emoji: string         // "🐶"
  difficulty: 'easy' | 'medium' | 'hard'
  category: 'animals' | 'food' | 'nature' | 'objects' | 'colors'
}
```

Initial word list: ~30–40 `easy` words (concrete nouns with clear emoji — animals, food, nature, common objects). Medium/hard categories left empty, reserved for Phase 2 skill-routing.

Distractors for both generators are drawn from same difficulty level in the same word list.

---

## Task Type 1: `engPicture`

**Interaction:** Big emoji displayed at top, 3 English word buttons below.  
**Question text:** "Co je to anglicky?"  
**Answer:** Player taps one of 3 word buttons (1 correct + 2 distractors).  
**Component:** `src/components/tasks/EngPictureTask.tsx`  
**Generator:** `generateEngPictureTask()` in `src/data/tasks.ts`

```
    🐶
Co je to anglicky?
[ dog ]  [ cat ]  [ fish ]
```

---

## Task Type 2: `engWord`

**Interaction:** English word shown at top, 4 emoji buttons in a 2×2 grid.  
**Question text:** "Klepni na správný obrázek"  
**Answer:** Player taps the matching emoji (1 correct + 3 distractors).  
**Component:** `src/components/tasks/EngWordTask.tsx`  
**Generator:** `generateEngWordTask()` in `src/data/tasks.ts`

```
🔤 dog
Klepni na správný obrázek
[ 🐶 ]  [ 🐱 ]
[ 🐟 ]  [ 🐸 ]
```

---

## Generators

Both generators live in `src/data/tasks.ts` and are registered in `TASK_GENERATORS`.  
Both are **simple** (not skill-routed) — random word selection, no mastery tracking.

`generateEngPictureTask(range, biome)`:
- Pick random `EngWord` from easy pool
- Pick 2 distractor English words from same pool (different words)
- Shuffle options
- Return `Task` with `type: 'engPicture'`, `question`, `objects: [emoji]`, `options: [str, str, str]`, `correctAnswer`

`generateEngWordTask(range, biome)`:
- Pick random `EngWord` from easy pool
- Pick 3 distractor emojis from same pool
- Shuffle options
- Return `Task` with `type: 'engWord'`, `question`, `options: [emoji, emoji, emoji, emoji]`, `correctAnswer`

---

## New World: Library

```ts
{
  id: 'library',
  name: 'Knihovna',
  icon: '📚',
  blockColor: '#6b4c1e',
  biome: 'library',
  taskTypes: [
    { type: 'engPicture', weight: 5 },
    { type: 'engWord', weight: 4 },
    { type: 'wordOrder', weight: 1 },
  ],
  numberRange: [1, 10],
  unlockCost: 400,
  unlockCurrency: 'diamonds',
  comboMultiplier: 1.3,
  bgColor: '#1a1005',
  accentColor: '#d4a017',
  story: 'Starý knihovník potřebuje pomoct s katalogem. Nauč se anglická slova a odemkni tajemné regály.',
}
```

Positioned between forest (0) and jungle (150) in difficulty — unlockCost 400 is intentionally accessible.

---

## Forest World Changes

Add to existing Forest `taskTypes` with low weight (ochutnávka):

```ts
{ type: 'engPicture', weight: 1 },
{ type: 'engWord', weight: 1 },
```

---

## Files Changed

| File | Change |
|------|--------|
| `src/data/types.ts` | Add `'engPicture'` and `'engWord'` to `TaskType` union |
| `src/data/engWords.ts` | New file — `EngWord` interface + word list |
| `src/data/tasks.ts` | Add `generateEngPictureTask`, `generateEngWordTask`, register in `TASK_GENERATORS` |
| `src/components/tasks/EngPictureTask.tsx` | New component |
| `src/components/tasks/EngWordTask.tsx` | New component |
| `src/components/tasks/TaskRenderer.tsx` | Add cases for both new types |
| `src/data/worlds.ts` | Add Library world, add low-weight entries to Forest |

---

## Out of Scope (Phase 2)

- Skill routing / ZPD mastery for English tasks
- Medium/hard difficulty words
- `EngSkillId` types in `types.ts`

See [docs/FEATURES.md](../FEATURES.md) — section "Anglická slovíčka".
