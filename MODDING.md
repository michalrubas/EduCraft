# AdiCraft – Průvodce úpravami hry

Tento dokument popisuje přesná místa v kódu kde upravovat herní mechaniky.
Vše co potřebuješ je textový editor (VS Code) a znalost, kde co hledat.

---

## Obsah

1. [Odměny za správnou odpověď](#1-odmeny-za-spravnou-odpoved)
2. [Progresivní obtížnost a odměny per svět](#2-progresivni-obtiznost-a-odmeny-per-svet)
3. [Přidání nového světa](#3-pridani-noveho-sveta)
4. [Objekty v počítacích úkolech](#4-objekty-v-pocitacich-ukolech)
5. [Úprava truhel (Mystery Chest)](#5-uprava-truhel-mystery-chest)
6. [Kolo štěstí (Lucky Wheel)](#6-kolo-stesti-lucky-wheel)
7. [Přidání položek do obchodu](#7-pridani-polozek-do-obchodu)
8. [Měnový systém](#8-menovy-system)
9. [Délka herní obrazovky a komba](#9-delka-herni-obrazovky-a-komba)

---

## 1. Odměny za správnou odpověď

**Soubor:** `src/data/config.ts`

```ts
export const COMBO_REWARDS = {
  base:       { diamonds: 1 },               // 1–2 správně v řadě  → +1 💰
  fire:       { diamonds: 2 },               // 3–4 správně v řadě  → +2 💰
  doubleFire: { diamonds: 3, emeralds: 1 },  // 5–9 správně v řadě  → +3 💰 +1 💎
  mania:      { diamonds: 5, emeralds: 2, stars: 1 }, // 10+ v řadě → +5 💰 +2 💎 +1 ⬛
}
```

- `diamonds` = 💰 penízky (nejběžnější měna)
- `emeralds` = 💎 diamanty (střední měna)
- `stars`    = ⬛ netherite (nejcennější)

**Kdy se přechází na vyšší level** – v témž souboru:

```ts
export const COMBO_THRESHOLDS = {
  fire:       3,   // od 3. správné odpovědi v řadě
  doubleFire: 5,   // od 5.
  mania:      10,  // od 10. – a pak série končí a hráč dostane kolo štěstí + jde domů
}
```

---

## 2. Progresivní obtížnost a odměny per svět

**Soubor:** `src/data/worlds.ts`

Každý svět má **dvě nastavení** která ho dělají těžším a hodnotnějším:

### `numberRange` – rozsah čísel v úkolech

```ts
{ id: 'forest', numberRange: [1, 5],  ... }  // počítá do 5
{ id: 'cave',   numberRange: [1, 10], ... }  // počítá do 10
{ id: 'snow',   numberRange: [1, 10], ... }  // počítá do 10
{ id: 'nether', numberRange: [1, 20], ... }  // počítá do 20
```

Chceš-li svět s příklady do 50, dej `numberRange: [1, 50]`.

### `comboMultiplier` – násobič odměn

```ts
{ id: 'forest', comboMultiplier: 1.0, ... }  // x1 – základní odměny
{ id: 'cave',   comboMultiplier: 1.5, ... }  // x1.5 – o 50 % víc
{ id: 'snow',   comboMultiplier: 1.75, ... } // x1.75
{ id: 'nether', comboMultiplier: 2.0, ... }  // x2 – dvojnásobné odměny
```

Výsledná odměna = `COMBO_REWARDS[level].diamonds * comboMultiplier` (zaokrouhleno).

**Příklad:** Hráč má kombo 5 (doubleFire) v Netheru:
`3 * 2.0 = 6 💰` a `1 * 2.0 = 2 💎` za odpověď.

### `taskTypes` – typy otázek

```ts
taskTypes: ['counting', 'tapNumber', 'compare', 'multiChoice', 'dragDrop', 'find', 'math']
```

Typy které můžeš použít:

| Typ | Popis |
|-----|-------|
| `counting` | Spočítej předměty na obrazovce |
| `tapNumber` | Najdi číslo v mřížce čísel |
| `compare` | Které číslo je větší? |
| `multiChoice` | Vyber správnou odpověď ze tří |
| `dragDrop` | Přetáhni správný počet do košíku |
| `find` | Najdi číslo v mřížce (jako tapNumber) |
| `math` | Sčítání a odčítání (+/−) |

Doporučené progresivní nastavení:
```ts
forest: ['counting', 'tapNumber', 'compare', 'multiChoice']          // nejlehčí
cave:   ['counting', 'math', 'multiChoice', 'dragDrop']
snow:   ['math', 'find', 'compare', 'dragDrop']
nether: ['math', 'multiChoice', 'find', 'dragDrop']                  // nejtěžší
```

---

## 3. Přidání nového světa

### Krok 1 – přidej biome do `src/data/types.ts`

```ts
export type Biome = 'forest' | 'cave' | 'snow' | 'nether' | 'jungle'
//                                                             ^^^^^^ přidej sem
```

### Krok 2 – přidej objekty do `src/data/tasks.ts`

```ts
const BIOME_OBJECTS: Record<Biome, string[]> = {
  // ... existující světy ...
  jungle: ['🌴', '🐒', '🦜', '🍌', '🐍', '🌺'],  // přidej
}
```

### Krok 3 – přidej svět do `src/data/worlds.ts`

```ts
{
  id: 'jungle',
  name: 'Džungle',
  icon: '🌴',
  blockColor: '#2d7a1b',    // hex barva bloku na kartě světa
  biome: 'jungle',          // musí odpovídat klíči v BIOME_OBJECTS
  taskTypes: ['counting', 'math', 'multiChoice', 'dragDrop'],
  numberRange: [1, 15],
  unlockCost: 90,           // cena v 💰; 0 = odemknutý od začátku
  comboMultiplier: 1.8,
  bgColor: '#0a1f08',       // barva pozadí herní obrazovky
  accentColor: '#39d353',   // barva ohraničení na kartě světa
  story: 'Průzkum džungle čeká! Počítej opice a vyhni se hadům.',
},
```

To je vše. Svět se automaticky zobrazí v menu, odemkne se po zaplacení a generuje úkoly.

---

## 4. Objekty v počítacích úkolech

**Soubor:** `src/data/tasks.ts`, konstanta `BIOME_OBJECTS`

Každý svět má 6 emoji které se náhodně zobrazují v úkolech počítání.
Použij emoji které odpovídají Minecraftu a jsou pro děti rozpoznatelné.

```ts
const BIOME_OBJECTS: Record<Biome, string[]> = {
  forest: ['🌾', '🪵', '🍎', '🐑', '🐄', '🍄'],
  cave:   ['💎', '⛏️', '🪨', '🥇', '🦇', '🪔'],
  snow:   ['🧊', '❄️', '🐺', '🐟', '⛄', '🎣'],
  nether: ['🔥', '💀', '🧱', '⚡', '🌋', '🐷'],
}
```

Maximální počet předmětů v drag-drop úkolu je nastaven na **6**:

```ts
// src/data/tasks.ts, funkce generateDragDropTask:
const MAX_DRAG_TARGET = 6
const target = ri(min, Math.min(max, MAX_DRAG_TARGET))
```

---

## 5. Úprava truhel (Mystery Chest)

**Soubor:** `src/components/ui/MysteryChest.tsx`

### Pravděpodobnost typů truhel

```ts
function pickChestType(): ChestType {
  const roll = Math.random()
  if (roll < 0.50) return 'bronze'   // 50 %
  if (roll < 0.80) return 'silver'   // 30 %
  if (roll < 0.95) return 'gold'     // 15 %
  return 'diamond'                    //  5 %
}
```

### Odměny v každé truhlě

```ts
const CHEST_TIERS = {
  bronze: {
    label: '🥉 Bronzová truhla',
    color: '#cd7f32',
    bgColor: '#3d2010',
    rewards: [
      { label: '💰 +5',  diamonds: 5 },   // diamonds = penízky (💰)
      { label: '💰 +8',  diamonds: 8 },
      { label: '💰 +12', diamonds: 12 },
    ],
  },
  silver: { rewards: [
    { label: '💰 +20', diamonds: 20 },
    { label: '💎 +1',  emeralds: 1 },    // emeralds = diamanty (💎)
    { label: '🎁 Předmět', itemId: 'random' },  // náhodný item z obchodu
  ]},
  gold: { rewards: [
    { label: '💎 +2',  emeralds: 2 },
    { label: '💎 +3',  emeralds: 3 },
    { label: '💰 +30', diamonds: 30 },
    { label: '🎁 Předmět', itemId: 'random' },
  ]},
  diamond: { rewards: [
    { label: '💎 +5',  emeralds: 5 },
    { label: '⬛ +1',  stars: 1 },       // stars = netherite (⬛)
    { label: '💰 +50', diamonds: 50 },
    { label: '🎁 Vzácný předmět', itemId: 'random' },
  ]},
}
```

### Kdy se truhla zobrazí

**Soubor:** `src/components/screens/GameScreen.tsx`

```ts
} else if (newSession % 15 === 0) {
  setTimeout(triggerChest, delay)
}
```

`15` = truhla se zobrazí každých 15 správných odpovědí v rámci sezení.
Kolo štěstí má přednost (je v podmínce `if`, truhla v `else if`).

---

## 6. Kolo štěstí (Lucky Wheel)

**Soubor:** `src/hooks/useLuckyWheel.ts`

### Odměny na kole

```ts
export const WHEEL_REWARDS: WheelReward[] = [
  { label: '💰 +3',  diamonds: 3 },
  { label: '💰 +6',  diamonds: 6 },
  { label: '💎 +4',  emeralds: 4 },
  { label: '⬛ +1',  stars: 1 },
  { label: '🎁 Překvapení', itemId: 'random' },
]
```

### Kdy se kolo zobrazí

```ts
export function shouldTriggerWheel(totalCorrectSession, wheelSpinsToday, isFirstCombo10) {
  if (wheelSpinsToday >= 3) return false  // max 3× za sezení (resetuje se při vstupu do světa)
  if (isFirstCombo10) return true         // vždy po sérii 10 správných odpovědí
  if (totalCorrectSession % 20 === 0) return Math.random() < 0.6  // 60% šance každých 20 odpovědí
}
```

Změn `>= 3` na `>= 5` pokud chceš více kol za sezení.
Změn `% 20` na `% 10` pokud chceš kolo častěji.

---

## 7. Přidání položek do obchodu

**Soubor:** `src/data/shopItems.ts`

```ts
{ 
  id: 'magic_wand',           // unikátní ID
  name: 'Kouzelná hůlka',     // zobrazovaný název
  icon: '🪄',                 // emoji
  category: 'weapon',         // weapon | armor | trophy | decoration | rare
  cost: { diamonds: 45 },     // diamonds=💰, emeralds=💎, stars=⬛
  rarity: 'epic',             // common | rare | epic | legendary
},
```

Kategorie ovlivňuje pouze záložku v obchodě. Vzácnost (`rarity`) mění barvu ohraničení karty:
- `common` = zelená
- `rare` = modrá  
- `epic` = fialová
- `legendary` = oranžová

---

## 8. Měnový systém

Hra má 3 měny. V kódu se jmenují jinak než vizuálně:

| Vizuál | Kód (store/shopItems) | Popis |
|--------|----------------------|-------|
| 💰 penízky | `diamonds` | Nejběžnější – vyděláš za každou odpověď |
| 💎 diamanty | `emeralds` | Střední – z komba, kola, truhel |
| ⬛ netherite | `stars` | Nejcennější – jen z diamantových truhel a mania komba |

**Pozor:** V `shopItems.ts` a `COMBO_REWARDS` používej názvy polí v kódu (`diamonds`, `emeralds`, `stars`), ne vizuální emoji.

---

## 9. Délka herní obrazovky a komba

**Soubor:** `src/data/config.ts`

```ts
// Jak dlouho visí obrazovka "SPRÁVNĚ!" (ms); hráč může přeskočit tlačítkem
export const REWARD_SCREEN_DURATION = 2000

// Počet správných odpovědí za sebou pro každý level komba
export const COMBO_THRESHOLDS = {
  fire:       3,   // 🔥 oheň
  doubleFire: 5,   // 🔥🔥 dvojitý oheň
  mania:      10,  // ⚡ manie – po 10 v řadě přijde kolo štěstí a návrat domů
}
```

Zvýšíš-li `mania` na 15, série trvá déle než dojde kolo štěstí.

---

## Rychlý přehled souborů

```
src/
├── data/
│   ├── config.ts        ← odměny, délky, prahy komba
│   ├── worlds.ts        ← světy, obtížnost, ceny, multiplikátory
│   ├── tasks.ts         ← objekty v úkolech, max drag-drop
│   ├── shopItems.ts     ← položky v obchodě
│   └── types.ts         ← přidání nového biome
├── components/
│   └── ui/
│       ├── MysteryChest.tsx   ← typy a odměny truhel
│       └── LuckyWheel.tsx     ← vizuál kola štěstí
└── hooks/
    └── useLuckyWheel.ts ← odměny a podmínky kola štěstí
```
