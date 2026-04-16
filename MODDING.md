# AdiCraft – Průvodce úpravami hry

Tento dokument popisuje přesná místa v kódu kde upravovat herní mechaniky.
Vše co potřebuješ je textový editor (VS Code) a znalost, kde co hledat.

git checkout main
git merge feat/language-tasks-wip
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
10. [Ovlivnění obtížnosti úkolů](#10-ovlivneni-obtiznosti-ukolu)
11. [Přidání nového typu úkolu (např. doplňování slov)](#11-pridani-noveho-typu-ukolu-napr-doplnovani-slov)
12. [Systém matematických dovedností (Skill Tree)](#12-system-matematickych-dovednosti-skill-tree)
13. [Vlastní ikony místo emoji](#13-vlastni-ikony-misto-emoji)
14. [Debugging a sledování hodnot za běhu](#14-debugging-a-sledovani-hodnot-za-behu)

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

## 10. Ovlivnění obtížnosti úkolů

Obtížnost můžeš ladit na několika místech:

### 1. Rozsah čísel per svět (`numberRange`)
**Soubor:** `src/data/worlds.ts`
```ts
{ id: 'cave', numberRange: [5, 20], ... }
```
Všechny úkoly (počítání, porovnání, matematika) generují čísla z tohoto rozsahu.

### 2. Adaptivní obtížnost (automatická)
**Soubor:** `src/hooks/useAdaptiveDifficulty.ts`

Hra sleduje posledních N odpovědí a upravuje rozsah čísel:
- Mnoho správných → rozsah se zvětšuje (až na maximum světa)
- Mnoho chyb → rozsah se zmenšuje

Parametry k ladění:
```ts
const WINDOW_SIZE = 5  // kolik posledních odpovědí se sleduje
const STEP = 2         // o kolik se rozsah posune při každé úpravě
const THRESHOLD = 0.6  // pokud je přesnost nad 60 %, rozsah roste
```

### 3. Matematický strom dovedností (ZPD systém)
**Soubor:** `src/data/skills.ts`

Matematické úkoly se automaticky přizpůsobují hráčovým dovednostem:
- Každá dovednost má zvládnutí (`mastery`) od 0.0 do 1.0
- Nová dovednost se odemkne, jakmile hráč zvládne předpoklady
- Úkoly preferují dovednosti v „zóně proximálního rozvoje" (zvládnutí 0.2–0.75)

Prahy pro odemčení:
```ts
add_1_5     → odemčena od začátku (základní sčítání do 5)
add_1_10    → odemčena když add_1_5 ≥ 70 %
sub_1_10    → odemčena když add_1_5 ≥ 60 %
add_1_20    → odemčena když add_1_10 ≥ 70 %
sub_1_20    → odemčena když sub_1_10 ≥ 70 %
add_sub_mix → odemčena když add_1_20 ≥ 70 % A sub_1_20 ≥ 70 %
```

Chceš snazší nebo těžší prahy? Uprav `minMastery` v `SKILL_TREE`.

### 4. Lehčí úkoly po sérii
**Soubor:** `src/data/config.ts`, konstanta `TASKS_BEFORE_EASY`
```ts
export const TASKS_BEFORE_EASY = 7 // každý 7. úkol je lehčí (počítání/tapNumber)
```
Snížením na 4 dostane hráč odpočinek častěji.

### 5. Velikost mřížky v "Najdi číslo"
**Soubor:** `src/data/tasks.ts`, funkce `generateFindTask`
```ts
const gridSize = ri(5, 10) // hráč hledá mezi 5 až 10 čísly
```
Změň na `ri(12, 18)` pro opravdu těžké hledání.

### 6. Počet předmětů v drag-drop
**Soubor:** `src/data/tasks.ts`, konstanta `MAX_DRAG_TARGET`
```ts
const MAX_DRAG_TARGET = 6 // víc než 6 se do košíku špatně vejde vizuálně
```

---

## 11. Přidání nového typu úkolu

Chceš-li přidat úplně nový typ úkolu (češtinu, písmena, barvy, ...), postupuj vždy takto:

### Krok 1 – Definuj typ v `src/data/types.ts`
```ts
export type TaskType = 
  | 'math' | 'counting' // ... existující
  | 'wordComplete'      // ← tvůj nový typ
  | 'letterGuess'       // ← nebo další
```

Pokud úkol vrací textové odpovědi (ne čísla), `options` a `correctAnswer` to již podporují:
```ts
export interface Task {
  options?: number[]          // jen čísla, pokud potřebuješ text:
  // přidej:
  textOptions?: string[]      // nebo rovnou změň options na (number | string)[]
  correctAnswer: number | string  // string already works
}
```

### Krok 2 – Vytvoř generátor v `src/data/tasks.ts`

**Příklad: doplňování slov**
```ts
export function generateWordCompleteTask(): Task {
  const WORDS = [
    { display: 'M_MA', answer: 'A', hint: 'zvíře' },
    { display: 'T_TA', answer: 'A', hint: 'zvíře' },
    { display: 'L_SA', answer: 'I', hint: 'zvíře' },
    { display: 'K_T',  answer: 'O', hint: 'zvíře' },
  ]
  const w = WORDS[Math.floor(Math.random() * WORDS.length)]
  return {
    id: uid(),
    type: 'wordComplete',
    question: `Doplň písmenko: ${w.display}`,
    options: ['A', 'E', 'I', 'O', 'U'].map(l => l.charCodeAt(0)), // hack: store char codes
    correctAnswer: w.answer,
  }
}
```

**Příklad: hádání prvního písmene**
```ts
export function generateLetterGuessTask(): Task {
  const ITEMS = [
    { word: 'JABLKO',  firstLetter: 'J' },
    { word: 'BANÁN',   firstLetter: 'B' },
    { word: 'MRKEV',   firstLetter: 'M' },
    { word: 'JAHODA',  firstLetter: 'J' },
  ]
  const item = ITEMS[Math.floor(Math.random() * ITEMS.length)]
  const distractors = ['A', 'K', 'D', 'L', 'P', 'S']
    .filter(l => l !== item.firstLetter)
    .slice(0, 3)
  return {
    id: uid(),
    type: 'letterGuess',
    question: `Jaký písmenem začíná: ${item.word}?`,
    options: shuffle([item.firstLetter, ...distractors]).map(l => l.charCodeAt(0)),
    correctAnswer: item.firstLetter,
  }
}
```

Přidej generátor do `TASK_GENERATORS` na konci souboru:
```ts
export const TASK_GENERATORS: Record<TaskType, TaskGenerator> = {
  // ... existující
  wordComplete: () => generateWordCompleteTask(),
  letterGuess:  () => generateLetterGuessTask(),
}
```

### Krok 3 – Vytvoř komponentu v `src/components/tasks/`
Inspiruj se v `MathTask.tsx`. Musí přijímat `task: Task` a volat `onAnswer(správnáHodnota)`.

```tsx
// src/components/tasks/WordCompleteTask.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Task } from '../../data/types'

export function WordCompleteTask({ task, onAnswer }: { task: Task; onAnswer: (a: number | string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const letters = ['A', 'E', 'I', 'O', 'U']  // nebo z task.options

  function handleSelect(letter: string) {
    setSelected(letter)
    setTimeout(() => { setSelected(null); onAnswer(letter) }, 300)
  }

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>
      <div className="answer-grid">
        {letters.map(l => (
          <motion.button
            key={l}
            className={`answer-btn ${selected === l ? (l === task.correctAnswer ? 'correct' : 'wrong') : ''}`}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleSelect(l)}
          >
            {l}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
```

### Krok 4 – Zaregistruj v `TaskRenderer.tsx`
```ts
case 'wordComplete': return <WordCompleteTask task={task} onAnswer={onAnswer} />
case 'letterGuess':  return <WordCompleteTask task={task} onAnswer={onAnswer} /> // sdílená komponenta
```

### Krok 5 – Povol typ ve světě
```ts
// src/data/worlds.ts
{ id: 'forest', taskTypes: ['counting', 'tapNumber', 'wordComplete'], ... }
```

### Poznámka k jazykovým úkolům
Jazykové úkoly nepotřebují `numberRange` – generátor si spravuje vlastní pole slov.
Pokud chceš slovní zásobu měnit per biome (jiné na lese, jiné v jeskyni), přidej parametr `biome` do generátoru a vyber správné pole podle biome.

---

## 12. Systém matematických dovedností (Skill Tree)

Hra obsahuje adaptivní systém dovedností, který přizpůsobuje matematické úkoly aktuální úrovni hráče. Funguje automaticky – hráč žádné menu nevidí, systém si vše řídí sám v pozadí.

### Proč ne jen „větší čísla = těžší"?

Velikost čísla **nedefinuje kognitivní složitost** aritmetiky:

- `5 + 5 = 10` a `500 + 500 = 1000` jsou kognitivně skoro stejné (jen pochopení řádů navíc)
- `17 + 8 = 25` je reálně mnohem těžší — vyžaduje **přechod přes desítku (regrouping)**

Proto jsou dovednosti v tomto systému definovány **strukturou operace**, ne rozsahem čísel.
Hráč s mastery na `add_no_regroup` dostane příklady bez přechodu bez ohledu na velikost čísel.
Teprve na `add_regroup` se mu začnou generovat příklady kde jednotky přetékají přes desítku.

### Přehled dovedností

| ID | Název | Příklady | Prerekvizity |
|----|-------|----------|--------------|
| `add_no_regroup` | Sčítání bez přechodu | 2+3=5, 12+5=17 | — (vždy odemčeno) |
| `complements_10` | Doplňky do 10 | 3+7=10, 6+4=10 | add_no_regroup ≥ 60 % |
| `add_regroup` | Sčítání s přechodem přes desítku | 7+5=12, 17+8=25 | complements_10 ≥ 70 % |
| `sub_no_regroup` | Odčítání bez přechodu | 8-3=5, 15-4=11 | add_no_regroup ≥ 70 % |
| `sub_regroup` | Odčítání s přechodem (borrowing) | 12-7=5, 23-8=15 | add_regroup ≥ 60 % + sub_no_regroup ≥ 70 % |
| `add_sub_mix` | Mix sčítání a odčítání | kombinace | add_regroup ≥ 70 % + sub_regroup ≥ 70 % |

### Strom závislostí

```
add_no_regroup  (základ: sčítání bez přechodu přes desítku)
  │
  ├── complements_10  (doplňky do 10 — klíč k pochopení přenosu)
  │     └── add_regroup  (sčítání s přechodem: 7+5=12, 17+8=25)
  │           └─────────────────────────────────────┐
  │                                                  ▼
  └── sub_no_regroup  (odčítání bez přechodu)   add_sub_mix
        └── sub_regroup  (odčítání s půjčením) ────┘
```

**Proč doplňky do 10 jako mezistupeň?**
Aby hráč zvládl `17 + 8 = 25`, musí vědět, že `7 + 3 = 10` (doplněk), a pak přidat zbývající `5`.
Bez pevných doplňků do 10 hráč regrouping nezvládne — proto je `complements_10` prerekvizita.

### Jak funguje výběr dovednosti (ZPD)

Každá dovednost má **zvládnutí** (`mastery`) od 0.0 do 1.0:

```
0.0 ──── 0.2 ──────────── 0.75 ──── 1.0
 nové    ZPD (aktivní učení)  zvládnuto  perfektní
```

Algoritmus při každém matematickém příkladu:
1. **ZPD zóna (mastery 0.2–0.75)** → preferovány, hráč se aktivně učí
2. **Pod ZPD (mastery < 0.2)** → záloha, pokud žádná ZPD dovednost neexistuje
3. **25% šance na review** (mastery > 0.75) → upevnění paměti zvládnutých dovedností

### Jak funguje aktualizace zvládnutí

Asymetrická křivka — nárůst se zpomaluje, pokles je rychlejší:

```
Správná odpověď: mastery = mastery + (1 − mastery) × 0.1
Špatná odpověď:  mastery = mastery × 0.85
```

Proč asymetrie? Zapomenutí je rychlejší než naučení — odpovídá reálnému fungování paměti.

### Kde je kód

**Soubor:** `src/data/skills.ts`

| Co | Kde v souboru |
|----|---------------|
| Definice dovedností | konstanta `SKILL_TREE` |
| Generátory příkladů | funkce `genAddNoRegroup()`, `genAddRegroup()`, ... |
| Generování úkolu | funkce `generateSkillTask()` |
| Výběr dovednosti | funkce `selectSkill()` |
| Aktualizace zvládnutí | funkce `updateMastery()` |
| Odemykání nových | funkce `checkUnlocks()` |

**Soubor:** `src/data/types.ts` – typ `MathSkillId` definuje seznam platných ID dovedností.

---

### Přidání nové dovednosti

Příklad: násobení jednociferných čísel.

#### Krok 1 – Přidej ID do `src/data/types.ts`

```ts
export type MathSkillId =
  | 'add_no_regroup'
  | 'complements_10'
  | 'add_regroup'
  | 'sub_no_regroup'
  | 'sub_regroup'
  | 'add_sub_mix'
  | 'multiplication'   // ← přidej sem
```

#### Krok 2 – Přidej dovednost do `SKILL_TREE` v `src/data/skills.ts`

Definuj pedagogické zařazení: kdy se odemkne a proč.

```ts
{
  id: 'multiplication',
  name: 'Násobení',
  icon: '✖️',
  description: '2×3=6, 4×5=20 — opakované sčítání',
  prerequisites: [
    // Násobení je opakované sčítání — hráč musí umět sčítání s přechodem
    { id: 'add_regroup', minMastery: 0.7 },
  ],
},
```

#### Krok 3 – Přidej generátor příkladů do `skills.ts`

Vždy přemýšlej o **struktuře operace**, ne jen o rozsahu čísel:

```ts
function genMultiplication(): { a: number; b: number; ans: number } {
  // Tabulky 2–5: kognitivně dostupné, lze odvodit sčítáním
  const a = ri(2, 5)
  const b = ri(2, 9)
  return { a, b, ans: a * b }
}
```

#### Krok 4 – Zaregistruj v `generateSkillTask()`

```ts
case 'multiplication': {
  const { a, b, ans } = genMultiplication()
  question = `${a} × ${b} = ?`
  // smartDistractors přidáš níže
  break
}
```

#### Krok 5 – Přidej chytré distraktory do `smartDistractors()`

Pro každou dovednost přemýšlej, **jakou chybu hráč typicky dělá**:

```ts
if (skillId === 'multiplication') {
  // Typická chyba 1: sčítání místo násobení (a + b místo a × b)
  cands.add(a + b)   // potřebuješ parametry a, b — předej je do funkce
  // Typická chyba 2: off-by-one tabulky (zapamatoval špatně)
  cands.add(ans + a) // přidá nebo ubere jeden „řádek" tabulky
  cands.add(ans - a)
}
```

> Pozn.: aktuálně `smartDistractors` bere jen `correct` a `skillId`. Pokud potřebuješ operandy pro chytřejší distraktory, přidej parametry `a` a `b` do signatury a aktualizuj všechna volání.

To je vše. Dovednost se automaticky:
- Zobrazí v profilu hráče (zamčená, dokud nejsou splněny prerekvizity)
- Odemkne jakmile hráč dosáhne požadovaného zvládnutí předpokladů
- Zařadí do ZPD výběru

---

### Úprava prahů pro odemčení

```ts
// src/data/skills.ts, SKILL_TREE:
{ id: 'sub_no_regroup', prerequisites: [{ id: 'add_no_regroup', minMastery: 0.6 }] }
//                                                                            ^^^
//                               změna z 0.7 → 0.6 = odemkne se dříve
```

Obecná pravidla:
- **0.5–0.6** = hráč zvládá, ale ještě ne jistě → vhodné pro paralelní dovednosti
- **0.7** = solidní základ → vhodné pro dovednosti které přímo staví na předchozí
- **0.8+** = velmi jisté zvládnutí → použij pro složité přechody (regrouping → násobení)

### Úprava rychlosti učení

**Soubor:** `src/data/skills.ts`, funkce `updateMastery`

```ts
export function updateMastery(current: number, isCorrect: boolean): number {
  const next = isCorrect
    ? current + (1 - current) * 0.1   // ← zvyš na 0.15 pro rychlejší postup
    : current * 0.85                   // ← zvyš na 0.92 pro mírnější penalizaci
  return Math.min(1, Math.max(0, next))
}
```

| Scénář | Správná odpověď | Špatná odpověď |
|--------|----------------|----------------|
| Pomalé učení (výzva) | `× 0.08` | `× 0.80` |
| **Výchozí** | **× 0.10** | **× 0.85** |
| Rychlé učení (malé děti) | `× 0.15` | `× 0.92` |

### Úprava ZPD zóny

**Soubor:** `src/data/skills.ts`, funkce `selectSkill`

```ts
const zpd = unlocked.filter(s => {
  const m = progress[s.id].mastery
  return m >= 0.2 && m <= 0.75   // ← uprav hranice ZPD zde
})
```

- Rozšíř na `0.1 – 0.80` pokud chceš, aby hráč trénoval základy déle před přechodem
- Zúžení na `0.3 – 0.70` způsobí, že hráč přeskočí na novou dovednost dřív

---

## 13. Vlastní ikony místo emoji

Emoji jsou praktická, ale na některých systémech vypadají jinak nebo nejsou rozpoznatelná.
Pokud chceš použít vlastní PNG obrázky (pixelart, Minecraft ikony, fotky), postupuj takto:

### Krok 1 – Ulož obrázky do `public/icons/`

```
public/
└── icons/
    ├── wheat.png
    ├── log.png
    ├── apple.png
    └── ...
```

Doporučená velikost: 64×64 px nebo 128×128 px (čtvercové).

### Krok 2 – Uprav `BIOME_OBJECTS` v `src/data/tasks.ts`

Místo emoji stringů použij cesty k obrázkům:
```ts
const BIOME_OBJECTS: Record<Biome, string[]> = {
  forest: ['/icons/wheat.png', '/icons/log.png', '/icons/apple.png', '/icons/sheep.png'],
  cave:   ['/icons/diamond.png', '/icons/pickaxe.png', '/icons/stone.png'],
  // ...
}
```

### Krok 3 – Uprav vykreslování objektů v komponentách

**`src/components/tasks/CountingTask.tsx`** – změň `<span>` na `<img>`:
```tsx
{task.objects?.map((obj, i) => (
  obj.startsWith('/') || obj.startsWith('http')
    ? <img key={i} src={obj} alt="" style={{ width: 40, height: 40 }} />
    : <span key={i}>{obj}</span>
))}
```

Stejnou změnu proveď v `MultiChoiceTask.tsx` a `DragDropTask.tsx` – jsou to jediná tři místa kde se `task.objects` vykreslují.

### Krok 4 – Zkontroluj velikost obrázků

V CSS souboru `src/index.css` nebo přímo v komponentě nastav velikost:
```css
.object-grid img {
  width: 48px;
  height: 48px;
  image-rendering: pixelated; /* zachová pixelart ostrost */
}
```

### Smíchání emoji a obrázků

Můžeš mít v jednom poli i emoji i obrázky – podmínka `obj.startsWith('/')` je rozliší automaticky. Takže lesní svět může mít část emoji a část PNG bez konfliktů.

---

## 14. Debugging a sledování hodnot za běhu

Tři způsoby jak sledovat herní stav (mastery, komba, měny, ...) při lokálním vývoji.
Debug panel a Redux DevTools fungují **jen při `npm run dev`** — v produkčním buildu neexistují.

---

### Způsob 1 – Debug panel přímo ve hře (nejrychlejší)

Po spuštění `npm run dev` se v pravém dolním rohu herní obrazovky zobrazí zelené tlačítko **🧠 Skills**.

Co panel ukazuje:
- Každou dovednost — zamčená nebo odemčená
- Mastery bar (červená 0–30 %, žlutá 30–70 %, zelená 70–100 %)
- Počet pokusů
- Tlačítka `+correct` / `+wrong` — simulují správnou/špatnou odpověď bez hraní

Soubor: `src/components/dev/SkillDebugPanel.tsx`
Zobrazení v GameScreen: `{import.meta.env.DEV && <SkillDebugPanel />}`
→ v `npm run build` se celý panel vykompiluje pryč, do produkce se nedostane.

---

### Způsob 2 – Redux DevTools (živé sledování všech akcí)

**Krok 1** – nainstaluj rozšíření prohlížeče:
- Chrome/Edge: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- Firefox: hledej „Redux DevTools" v doplňcích

**Krok 2** – spusť `npm run dev`, otevři DevTools (F12) → záložka **Redux**

Co tam vidíš:
- Každou akci v reálném čase (`updateSkillMastery`, `answerCorrect`, `unlockWorld`, ...)
- Celý stav (`studentProgress`, `diamonds`, `combo`, ...) po každé akci
- Diff — co přesně se změnilo
- Možnost „time travel" — vrátit stav do libovolného předchozího bodu

Store je pojmenovaný **AdiCraft** (nastaveno v `gameStore.ts` v devtools middlewaru).

---

### Způsob 3 – LocalStorage (celý persistovaný stav)

DevTools → záložka **Application** → **Local Storage** → `localhost:5173` → klíč `adicraft-game-v1`

Obsahuje celý serializovaný stav hry včetně `studentProgress`. Po každé akci se hodnota aktualizuje (je potřeba kliknout na záznam pro refresh hodnoty).

**Reset hry** (smaže veškerý postup):
```
Application → Local Storage → pravý klik na adicraft-game-v1 → Delete
```
nebo přímo v konzoli:
```js
localStorage.removeItem('adicraft-game-v1'); location.reload()
```

**Ruční nastavení mastery** z konzole (bez hraní):
```js
// Přečti stav
JSON.parse(localStorage.getItem('adicraft-game-v1')).state.studentProgress

// Nastav konkrétní dovednost na 80 %
const s = JSON.parse(localStorage.getItem('adicraft-game-v1'))
s.state.studentProgress.add_regroup.mastery = 0.8
s.state.studentProgress.add_regroup.unlocked = true
localStorage.setItem('adicraft-game-v1', JSON.stringify(s))
location.reload()
```

---

### Způsob 4 – Konzole prohlížeče (přímý přístup ke storu)

Store je přístupný z konzole přes window (jen v dev):

```js
// Přidej do src/main.tsx pro dev přístup:
// if (import.meta.env.DEV) window.__store = useGameStore

// Pak v konzoli:
window.__store.getState().studentProgress
window.__store.getState().updateSkillMastery('add_regroup', true)
```

Nebo bez window hacku — stav vždy přečteš přes LocalStorage (Způsob 3).

---

### Co sledovat při testování skill systému

| Co chceš ověřit | Jak |
|-----------------|-----|
| Odemknutí nové dovednosti | Debug panel → mastery dosáhne prahu → tlačítko přestane být šedé |
| Správný výběr ZPD | Redux DevTools → akce `updateSkillMastery` → zkontroluj který `skillId` se vrátil v dalším tasku |
| Rychlost učení | Debug panel → klikej `+correct` opakovaně, sleduj jak mastery roste |
| Reset při chybě | `+wrong` několikrát → mastery klesá o 15 % z aktuální hodnoty |
| Persistence přes reload | LocalStorage → zavři tab, otevři znovu, hodnoty musí zůstat |

---

## Rychlý přehled souborů

```
src/
├── data/
│   ├── config.ts        ← odměny, délky, prahy komba, TASKS_BEFORE_EASY
│   ├── worlds.ts        ← světy, obtížnost, ceny, multiplikátory
│   ├── tasks.ts         ← objekty v úkolech, max drag-drop, BIOME_OBJECTS
│   ├── skills.ts        ← matematický strom dovedností (ZPD systém)
│   ├── shopItems.ts     ← položky v obchodě
│   └── types.ts         ← přidání nového biome, nového TaskType
├── components/
│   ├── tasks/           ← komponenty pro každý typ úkolu
│   └── ui/
│       ├── MysteryChest.tsx   ← typy a odměny truhel
│       └── LuckyWheel.tsx     ← vizuál kola štěstí
└── hooks/
    ├── useAdaptiveDifficulty.ts ← adaptivní rozsah čísel per svět
    └── useLuckyWheel.ts         ← odměny a podmínky kola štěstí
```
