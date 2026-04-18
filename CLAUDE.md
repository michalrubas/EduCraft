# Project Overview

EduCraft (package name: `adicraft`) is a Minecraft-themed educational game for Czech primary school children. Players earn in-game currency by solving math and language tasks, unlock Minecraft-style worlds, and spend rewards in a shop. Mobile-first SPA deployed on Vercel with optional Supabase sync for parent visibility.

- Target audience: ages 6–10, Czech language throughout the UI
- Offline-capable: Supabase sync is optional — the app must fully work without it
- Single-device child profile identified by a UUID stored in `localStorage`

---

# Development

```bash
npm run dev          # Vite dev server (localhost:5173)
npm run build        # tsc -b && vite build
npm run test:run     # vitest run (CI-safe, --passWithNoTests)
```

Optional env vars (app degrades gracefully without them):
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

# Architecture

Single-page app. Screen routing is Zustand state (`currentScreen`) — no React Router.

| Path | Responsibility |
|------|---------------|
| `src/store/gameStore.ts` | Single Zustand store — all game state and actions |
| `src/data/types.ts` | All TypeScript types and interfaces |
| `src/data/skills.ts` | Skill tree, ZPD selection, task generators, mastery/decay logic |
| `src/data/tasks.ts` | Task generators for non-skill task types |
| `src/data/worlds.ts` | World definitions (task types, rewards, unlock costs) |
| `src/data/config.ts` | Global constants (combo thresholds, rewards, currencies) |
| `src/data/langWords.ts` | Czech word list for language tasks |
| `src/components/screens/` | One component per screen |
| `src/components/tasks/` | One component per task type, rendered by `TaskRenderer` |
| `src/hooks/useTask.ts` | Task selection + skill routing per world |
| `src/hooks/useSupabaseSync.ts` | Debounced Supabase snapshot sync |

Screen flow: `home → game → reward → game` (loop). Shop and Profile from Home. `/parent` is a standalone ParentDashboard route.

State is persisted via Zustand `persist` to `localStorage` key `adicraft-game-v1`. The `migrate` function handles schema evolution.

---

# Domain Rules

## Skill system
- Mastery is `0.0–1.0`. ZPD window is `0.2–0.75`. Never hardcode these outside `skills.ts`.
- `updateMastery()` is asymmetric by design: correct `+10% of remaining gap`, wrong `×0.85`.
- `applyMasteryDecay()` runs once per session on `enterWorld()`, not per answer.
- Skills unlock only via `checkUnlocks()`. Never set `unlocked: true` directly in state.
- Task difficulty is determined by **operation structure, not number range** (e.g. regrouping in addition, not size of operands).

## Currency
Three currencies: `diamonds` (common), `emeralds` (mid), `stars` (rare). All rewards flow through `answerCorrect()` — never mutate currency fields directly. `comboMultiplier` per world scales both currency and XP.

## Worlds
- `forest` is always unlocked (`unlockCost: 0`). Do not change this.
- `taskTypes` uses weighted entries: `{ type: 'math', weight: 5 }` = 5× more likely than an unweighted type.

## Supabase
- Client is `null` when env vars are absent — every call must guard with `if (!supabase) return`.
- The `child_snapshots` table stores `{ child_id: uuid, snapshot: jsonb }`. Shape is `SnapshotPayload` in `useSupabaseSync.ts`. Do not write to Supabase outside this hook.

## Do not modify
- `vercel.json` rewrite rule — required for SPA routing
- `persist` key `adicraft-game-v1` — changing it wipes all user progress
- `CHILD_ID_KEY` in `useSupabaseSync.ts` — changing it breaks parent dashboard linkage

## Extending the system

For multi-file operations, read the corresponding skill file before making any changes:

| Task | Skill file |
|---|---|
| Add a new world or biome | `skills/add-world.md` |
| Add a new skill to the skill tree | `skills/add-skill.md` |
| Add a new task type | `skills/add-task-type.md` |
| Add Czech words to the word list | `skills/add-lang-words.md` |

For operations not covered by a skill:
- **New state field:** add to `GameState`, initialize in store, update `migrate()` in `gameStore.ts`.
- **New badge:** append to `BADGES` in `badges.ts` — condition receives full `GameState`.
