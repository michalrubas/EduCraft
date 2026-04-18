# Skill: Add a new world / biome

Adding a world touches at most 3 files. HomeScreen renders all worlds automatically — no changes there.

---

## Step 1 — Register the biome type (only if new biome ID)

File: `src/data/types.ts`, line with `export type Biome = ...`

Add the new biome name to the union:

```ts
export type Biome = 'forest' | 'cave' | 'snow' | ... | 'YOUR_BIOME'
```

Skip this step if you're reusing an existing biome ID (e.g. a second `desert` world).

---

## Step 2 — Add the world definition

File: `src/data/worlds.ts` — append to the `WORLDS` array before the closing `]`.

```ts
{
  id: 'WORLD_ID',            // unique string, snake_case, used as key everywhere
  name: 'Název světa',       // Czech display name
  icon: '🌋',                // emoji OR '/assets/blocks/Name.PNG' for custom block icon
  blockColor: '#rrggbb',     // dominant color for the world card block
  biome: 'YOUR_BIOME',       // must match Biome type
  taskTypes: [               // see Task type reference below
    { type: 'math', weight: 5 },
    'compare',
  ],
  numberRange: [10, 50],     // OMIT entirely for language-only worlds (village, castle pattern)
  unlockCost: 1000,          // 0 = always unlocked (only forest)
  unlockCurrency: 'diamonds', // omit = defaults to 'diamonds'; set 'emeralds' for lang worlds
  comboMultiplier: 2.0,      // scales currency rewards AND xp; see multiplier guide below
  bgColor: '#rrggbb',        // dark background color for the world card
  accentColor: '#rrggbb',    // bright highlight / glow color for the world card
  story: 'Krátký příběh světa v češtině pro dítě. Motivuje ke vstupu.',
},
```

### Task type reference

| TaskType | Description |
|---|---|
| `'counting'` | Count objects visually |
| `'tapNumber'` | Tap the right number |
| `'compare'` | Greater / less / equal |
| `'multiChoice'` | Multiple choice question |
| `'dragDrop'` | Drag item to correct group |
| `'find'` | Find target object among distractors |
| `'math'` | Addition/subtraction via skill system (ZPD) |
| `'mathMultiply'` | Multiplication via skill system (ZPD) |
| `'missingLetter'` | Fill missing letter in a word |
| `'diacritics'` | Pick correct diacritical form |
| `'wordOrder'` | Reorder scrambled letters |

Use `{ type: TaskType, weight: N }` to increase probability. Unweighted entries default to weight 1.

Language worlds (no `numberRange`): use only `missingLetter`, `diacritics`, `wordOrder`.  
Math worlds: always include at least one of `math` or `mathMultiply` with a higher weight (3–7).

### comboMultiplier guide

| World difficulty | Suggested multiplier |
|---|---|
| Beginner (first world) | 1.0 |
| Easy | 1.1 – 1.3 |
| Medium | 1.5 – 2.0 |
| Hard | 2.2 – 2.5 |
| Endgame | 3.0 |

### unlockCost guide

Math worlds scale with `comboMultiplier`. Language worlds use `emeralds`.

| Multiplier | Suggested diamonds cost |
|---|---|
| 1.0 | 0 (free) |
| 1.2 | 150 |
| 1.5 | 300 |
| 1.8 | 500 |
| 2.0 | 900 |
| 2.2 | 1500 |
| 2.5 | 2500 |
| 3.0 | 5000 |

---

## Step 3 — Add a world-specific badge (optional)

File: `src/data/badges.ts` — append to the `BADGES` array.

```ts
{
  id: 'unlock_WORLD_ID',
  name: 'Název odznaku',
  description: 'Odemkni svět X.',
  icon: '🌋',
  condition: s => s.unlockedWorlds.includes('WORLD_ID'),
},
```

Only add if the world has narrative significance. Not every world needs a badge.

---

## Verification checklist

- [ ] `id` is unique across all entries in `WORLDS`
- [ ] `biome` value exists in the `Biome` type in `types.ts`
- [ ] Language world → no `numberRange`, `unlockCurrency: 'emeralds'`
- [ ] Math world → has `numberRange`, at least one weighted `math`/`mathMultiply` entry
- [ ] `unlockCost: 0` is used only for `forest`
- [ ] `story` is written in Czech
- [ ] Run `npm run build` — no TypeScript errors
- [ ] Run `npm run dev`, open HomeScreen — new world card appears in the grid
- [ ] Tap the world card — if locked, shows shake animation; if affordable, unlocks and enters game
- [ ] Tasks appear correctly in game (no blank screens)
