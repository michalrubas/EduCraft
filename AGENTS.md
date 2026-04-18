# Agent Workflow

## Before making changes

- Read the full file before editing — skill IDs are referenced across `types.ts`, `skills.ts`, `gameStore.ts`, and `ParentDashboard.tsx`. Partial reads cause missed dependencies.
- Prefer targeted edits. Do not reformat or restructure code you didn't need to touch.

## After making changes

- Logic changes in `skills.ts`, `gameStore.ts`, or `useSupabaseSync.ts` → run `npm run test:run`.
- UI changes → run `npm run dev` and test the affected screen manually. Type-check does not confirm UI correctness.

## When to ask

Ask before:
- Adding a new npm dependency
- Changing the Supabase schema
- Altering the `persist` key or version in `gameStore.ts`

Don't ask before:
- Fixing a bug in existing logic
- Adding a world, shop item, or badge following established data patterns
- Writing tests for existing behavior

---

# Debugging

- Zustand devtools: store name is `AdiCraft`
- Persisted state: `localStorage` key `adicraft-game-v1`
- Supabase sync: logs errors to console only in `import.meta.env.DEV`
- Skill state: inspect `studentProgress` in the store — mastery per skill ID, unlock status, last practiced timestamp
- If a skill never unlocks: check its prerequisites in `SKILL_TREE`/`LANG_SKILL_TREE` and whether `checkUnlocks()` is being called after `updateSkillMastery()`
