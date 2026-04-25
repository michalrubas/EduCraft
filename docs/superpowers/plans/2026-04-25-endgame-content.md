# Endgame Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 endgame worlds, 5 shop-only legendary items, and 5 badges to EduCraft.

**Architecture:** Data-only additions to existing arrays/types. One behavioral change: filter `shopOnly` items from random reward resolution in gameStore. No new components or screens needed.

**Tech Stack:** TypeScript, Zustand, Vitest

**Spec:** `docs/superpowers/specs/2026-04-25-endgame-content-design.md`

---

### Task 1: Extend types

**Files:**
- Modify: `src/data/types.ts:26` (Biome type)
- Modify: `src/data/types.ts:104-111` (ShopItem interface)

- [ ] **Step 1: Extend Biome type**

In `src/data/types.ts`, line 26, replace:
```ts
export type Biome = 'forest' | 'cave' | 'snow' | 'desert' | 'ocean' | 'jungle' | 'tnt' | 'nether' | 'end' | 'village' | 'castle' | 'graveyard' | 'library'
```
with:
```ts
export type Biome = 'forest' | 'cave' | 'snow' | 'desert' | 'ocean' | 'jungle' | 'tnt' | 'nether' | 'end' | 'village' | 'castle' | 'graveyard' | 'library' | 'diamond_cave' | 'axolotl' | 'mushroom' | 'bedrock'
```

- [ ] **Step 2: Add shopOnly to ShopItem**

In `src/data/types.ts`, line 104-111, replace:
```ts
export interface ShopItem {
  id: string
  name: string
  icon: string
  category: ItemCategory
  cost: { diamonds?: number; emeralds?: number; stars?: number }
  rarity: ItemRarity
}
```
with:
```ts
export interface ShopItem {
  id: string
  name: string
  icon: string
  category: ItemCategory
  cost: { diamonds?: number; emeralds?: number; stars?: number }
  rarity: ItemRarity
  shopOnly?: boolean
}
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/data/types.ts
git commit -m "feat: extend Biome type and add shopOnly to ShopItem"
```

---

### Task 2: Add 4 new worlds

**Files:**
- Modify: `src/data/worlds.ts:241` (append before closing `]`)

- [ ] **Step 1: Add world definitions**

In `src/data/worlds.ts`, insert before the closing `]` on line 242 (after the library world object ending on line 241):

```ts
  {
    id: 'diamond_cave',
    name: 'Diamantová jeskyně',
    icon: '⛏️💎',
    blockColor: '#1a6b8a',
    biome: 'diamond_cave',
    taskTypes: [
      { type: 'math', weight: 3 }, { type: 'mathMultiply', weight: 3 },
      { type: 'missingLetter', weight: 2 }, { type: 'diacritics', weight: 2 },
      { type: 'wordOrder', weight: 2 }, { type: 'engPicture', weight: 2 },
      { type: 'engWord', weight: 2 }, { type: 'runner', weight: 2 },
      { type: 'compare', weight: 1 }, { type: 'find', weight: 1 },
      { type: 'dragDrop', weight: 1 },
    ],
    numberRange: [50, 200],
    unlockCost: 15000,
    comboMultiplier: 3.5,
    bgColor: '#040d14',
    accentColor: '#4af0fc',
    story: 'Hluboko pod zemí se třpytí diamanty. Vyřeš všechny úlohy a odnes si poklad!',
  },
  {
    id: 'axolotl',
    name: 'Axolotl doupě',
    icon: '🦎',
    blockColor: '#e87da0',
    biome: 'axolotl',
    taskTypes: [
      { type: 'math', weight: 3 }, { type: 'mathMultiply', weight: 3 },
      { type: 'missingLetter', weight: 2 }, { type: 'diacritics', weight: 2 },
      { type: 'wordOrder', weight: 2 }, { type: 'engPicture', weight: 2 },
      { type: 'engWord', weight: 2 }, { type: 'runner', weight: 2 },
      { type: 'compare', weight: 1 }, { type: 'find', weight: 1 },
      { type: 'dragDrop', weight: 1 },
    ],
    numberRange: [80, 300],
    unlockCost: 25000,
    comboMultiplier: 4.0,
    bgColor: '#140810',
    accentColor: '#ff8fbf',
    story: 'Roztomilí axolotli tě provedou podvodní říší. Ale pozor, úlohy jsou zákeřné!',
  },
  {
    id: 'mushroom',
    name: 'Houbový ostrov',
    icon: '🍄',
    blockColor: '#8b4545',
    biome: 'mushroom',
    taskTypes: [
      { type: 'math', weight: 3 }, { type: 'mathMultiply', weight: 3 },
      { type: 'missingLetter', weight: 2 }, { type: 'diacritics', weight: 2 },
      { type: 'wordOrder', weight: 2 }, { type: 'engPicture', weight: 2 },
      { type: 'engWord', weight: 2 }, { type: 'runner', weight: 2 },
      { type: 'compare', weight: 1 }, { type: 'find', weight: 1 },
      { type: 'dragDrop', weight: 1 },
    ],
    numberRange: [100, 500],
    unlockCost: 40000,
    comboMultiplier: 4.5,
    bgColor: '#140505',
    accentColor: '#ff6060',
    story: 'Tajemný ostrov plný obřích hub. Každá houba skrývá těžší a těžší úlohu!',
  },
  {
    id: 'bedrock',
    name: 'Střecha Netheru',
    icon: '/assets/blocks/Bedrock.PNG',
    blockColor: '#3a3a3a',
    biome: 'bedrock',
    taskTypes: [
      { type: 'math', weight: 3 }, { type: 'mathMultiply', weight: 3 },
      { type: 'missingLetter', weight: 2 }, { type: 'diacritics', weight: 2 },
      { type: 'wordOrder', weight: 2 }, { type: 'engPicture', weight: 2 },
      { type: 'engWord', weight: 2 }, { type: 'runner', weight: 2 },
      { type: 'compare', weight: 1 }, { type: 'find', weight: 1 },
      { type: 'dragDrop', weight: 1 },
    ],
    numberRange: [100, 999],
    unlockCost: 60000,
    comboMultiplier: 5.0,
    bgColor: '#0a0a0a',
    accentColor: '#808080',
    story: 'Nad Netherem je neproniknutelná vrstva bedrocku. Jen absolutní mistr se sem dostane.',
  },
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/data/worlds.ts
git commit -m "feat: add 4 endgame worlds (diamond_cave, axolotl, mushroom, bedrock)"
```

---

### Task 3: Add 5 shop-only legendary items

**Files:**
- Modify: `src/data/shopItems.ts:44` (append before closing `]`)

- [ ] **Step 1: Add item definitions**

In `src/data/shopItems.ts`, insert before the closing `]` on line 45 (after `diamond_cape` on line 44):

```ts
  // Shop-only legendary items (cannot be won from wheel/chest)
  { id: 'netherite_sword', name: 'Netheritový meč',  icon: '⚔️', category: 'weapon',     cost: { stars: 80, diamonds: 2000 },   rarity: 'legendary', shopOnly: true },
  { id: 'ender_pearl',    name: 'Ender perla',       icon: '🟣', category: 'rare',       cost: { stars: 60, diamonds: 1500 },   rarity: 'legendary', shopOnly: true },
  { id: 'beacon',         name: 'Beacon',            icon: '🔮', category: 'decoration', cost: { stars: 100 },                  rarity: 'legendary', shopOnly: true },
  { id: 'dragon_armor',   name: 'Dračí brnění',      icon: '🐉', category: 'armor',      cost: { stars: 70, emeralds: 1000 },   rarity: 'legendary', shopOnly: true },
  { id: 'nether_star',    name: 'Nether Star',       icon: '✨', category: 'rare',       cost: { stars: 120 },                  rarity: 'legendary', shopOnly: true },
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/data/shopItems.ts
git commit -m "feat: add 5 shop-only legendary items"
```

---

### Task 4: Filter shopOnly items from wheel and chest rewards

**Files:**
- Modify: `src/store/gameStore.ts:140` (collectWheelReward)
- Modify: `src/store/gameStore.ts:164` (collectChestReward)

- [ ] **Step 1: Update collectWheelReward filter**

In `src/store/gameStore.ts`, line 140, replace:
```ts
          const available = SHOP_ITEMS.filter(i => !s.ownedItems.includes(i.id))
```
with:
```ts
          const available = SHOP_ITEMS.filter(i => !s.ownedItems.includes(i.id) && !i.shopOnly)
```

- [ ] **Step 2: Update collectChestReward filter**

In `src/store/gameStore.ts`, line 164, replace:
```ts
          const available = SHOP_ITEMS.filter(i => !s.ownedItems.includes(i.id))
```
with:
```ts
          const available = SHOP_ITEMS.filter(i => !s.ownedItems.includes(i.id) && !i.shopOnly)
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/store/gameStore.ts
git commit -m "feat: exclude shopOnly items from wheel and chest random rewards"
```

---

### Task 5: Add 5 new badges

**Files:**
- Modify: `src/data/badges.ts:85` (append before closing `]`)

- [ ] **Step 1: Add badge definitions**

In `src/data/badges.ts`, insert before the closing `]` on line 86 (after the `unlock_library` badge ending on line 85):

```ts
  {
    id: 'unlock_diamond_cave',
    name: 'Diamantový horník',
    description: 'Odemkni Diamantovou jeskyni.',
    icon: '⛏️',
    condition: s => s.unlockedWorlds.includes('diamond_cave'),
  },
  {
    id: 'unlock_axolotl',
    name: 'Axolotl přítel',
    description: 'Odemkni Axolotl doupě.',
    icon: '🦎',
    condition: s => s.unlockedWorlds.includes('axolotl'),
  },
  {
    id: 'unlock_mushroom',
    name: 'Houbový král',
    description: 'Odemkni Houbový ostrov.',
    icon: '🍄',
    condition: s => s.unlockedWorlds.includes('mushroom'),
  },
  {
    id: 'master_all',
    name: 'Mistr všeho',
    description: 'Odpověz celkově na 2000 otázek správně.',
    icon: '🏅',
    condition: s => s.totalCorrect >= 2000,
  },
  {
    id: 'combo_25',
    name: 'Combo legenda',
    description: 'Dosáhni komba 25 bez chyby.',
    icon: '⚡',
    condition: s => s.maxCombo >= 25,
  },
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/data/badges.ts
git commit -m "feat: add 5 new badges (3 world unlocks, master_all, combo_25)"
```

---

### Task 6: Build and smoke test

- [ ] **Step 1: Run full type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 2: Run tests**

Run: `npm run test:run`
Expected: all tests pass

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: build succeeds

- [ ] **Step 4: Start dev server and verify**

Run: `npm run dev`
Verify:
- Home screen shows all worlds including the 4 new ones at the bottom
- New worlds show correct icons, names, and unlock costs
- Shop shows the 5 new legendary items
- Profile shows new badges (locked state)
