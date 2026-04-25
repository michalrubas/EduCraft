# Endgame Content: 4 Worlds, 5 Items, 5 Badges

## Overview

Expand EduCraft with endgame content: four new worlds harder than End, five exclusive shop-only legendary items, and five new badges. All new worlds use a full mix of all task types — difficulty is driven by the skill system, not world-specific task selection.

---

## 1. Four New Worlds

All worlds share the same task type mix with equal-ish weights across all categories (math, language, english, utility):

```ts
taskTypes: [
  { type: 'math', weight: 3 }, { type: 'mathMultiply', weight: 3 },
  { type: 'missingLetter', weight: 2 }, { type: 'diacritics', weight: 2 },
  { type: 'wordOrder', weight: 2 }, { type: 'engPicture', weight: 2 },
  { type: 'engWord', weight: 2 }, { type: 'runner', weight: 2 },
  { type: 'compare', weight: 1 }, { type: 'find', weight: 1 },
  { type: 'dragDrop', weight: 1 },
]
```

Note: `numberRange` is a fallback — the skill system determines actual difficulty based on player mastery.

### 1.1 Diamantova jeskyne

| Field | Value |
|---|---|
| id | `diamond_cave` |
| name | `Diamantova jeskyne` |
| icon | `⛏️💎` |
| blockColor | `#1a6b8a` |
| biome | `diamond_cave` |
| numberRange | `[50, 200]` |
| unlockCost | `15000` (diamonds) |
| comboMultiplier | `3.5` |
| bgColor | `#040d14` |
| accentColor | `#4af0fc` |
| story | `Hluboko pod zemi se trpyti diamanty. Vyres vsechny ulohy a odnes si poklad!` |

### 1.2 Axolotl doupe

| Field | Value |
|---|---|
| id | `axolotl` |
| name | `Axolotl doupe` |
| icon | `🦎` |
| blockColor | `#e87da0` |
| biome | `axolotl` |
| numberRange | `[80, 300]` |
| unlockCost | `25000` (diamonds) |
| comboMultiplier | `4.0` |
| bgColor | `#140810` |
| accentColor | `#ff8fbf` |
| story | `Roztomili axolotli te provedou podvodni risi. Ale pozor, ulohy jsou zapeklite!` |

### 1.3 Houbovy ostrov

| Field | Value |
|---|---|
| id | `mushroom` |
| name | `Houbovy ostrov` |
| icon | `🍄` |
| blockColor | `#8b4545` |
| biome | `mushroom` |
| numberRange | `[100, 500]` |
| unlockCost | `40000` (diamonds) |
| comboMultiplier | `4.5` |
| bgColor | `#140505` |
| accentColor | `#ff6060` |
| story | `Tajemny ostrov plny obrich hub. Kazda houba skryva tezsi a tezsi ulohu!` |

### 1.4 Strecha Netheru

| Field | Value |
|---|---|
| id | `bedrock` |
| name | `Strecha Netheru` |
| icon | `/assets/blocks/Bedrock.PNG` |
| blockColor | `#3a3a3a` |
| biome | `bedrock` |
| numberRange | `[100, 999]` |
| unlockCost | `60000` (diamonds) |
| comboMultiplier | `5.0` |
| bgColor | `#0a0a0a` |
| accentColor | `#808080` |
| story | `Nad Netherem je neproniknutelna vrstva bedrocku. Jen absolutni mistr se sem dostane.` |

### Type changes

Extend `Biome` type in `types.ts`:
```ts
export type Biome = ... | 'diamond_cave' | 'axolotl' | 'mushroom' | 'bedrock'
```

---

## 2. Five Shop-Only Legendary Items

These items cannot be won from the Lucky Wheel. A new optional `shopOnly?: boolean` field on `ShopItem` controls this.

| id | name | icon | category | rarity | cost |
|---|---|---|---|---|---|
| `netherite_sword` | Netheritovy mec | ⚔️ | weapon | legendary | 80 stars + 2000 diamonds |
| `ender_pearl` | Ender perla | 🟣 | rare | legendary | 60 stars + 1500 diamonds |
| `beacon` | Beacon | 🔮 | decoration | legendary | 100 stars |
| `dragon_armor` | Draci brneni | 🐉 | armor | legendary | 70 stars + 1000 emeralds |
| `nether_star` | Nether Star | ✨ | rare | legendary | 120 stars |

### Type changes

Add `shopOnly` to `ShopItem` in `types.ts`:
```ts
export interface ShopItem {
  // ... existing fields
  shopOnly?: boolean
}
```

### Lucky Wheel & Mystery Chest exclusion

In `gameStore.ts`, both `collectWheelReward` (line ~140) and `collectChestReward` (line ~164) resolve `itemId: 'random'` by picking from `SHOP_ITEMS`. Both must add `!i.shopOnly` to the filter:
```ts
const available = SHOP_ITEMS.filter(i => !s.ownedItems.includes(i.id) && !i.shopOnly)
```

---

## 3. Five New Badges

| id | name | icon | description | condition |
|---|---|---|---|---|
| `unlock_diamond_cave` | Diamantovy hornik | ⛏️ | Odemkni Diamantovou jeskyni. | `s.unlockedWorlds.includes('diamond_cave')` |
| `unlock_axolotl` | Axolotl pritel | 🦎 | Odemkni Axolotl doupe. | `s.unlockedWorlds.includes('axolotl')` |
| `unlock_mushroom` | Houbovy kral | 🍄 | Odemkni Houbovy ostrov. | `s.unlockedWorlds.includes('mushroom')` |
| `master_all` | Mistr vseho | 🏅 | Odpovez celkove na 2000 otazek spravne. | `s.totalCorrect >= 2000` |
| `combo_25` | Combo legenda | ⚡ | Dosahni komba 25 bez chyby. | `s.maxCombo >= 25` |

---

## Files to modify

1. **`src/data/types.ts`** — extend `Biome` union, add `shopOnly?: boolean` to `ShopItem`
2. **`src/data/worlds.ts`** — append 4 new world definitions
3. **`src/data/shopItems.ts`** — append 5 new items with `shopOnly: true`
4. **`src/data/badges.ts`** — append 5 new badge definitions
5. **`src/store/gameStore.ts`** — filter `shopOnly` items from random wheel reward selection
