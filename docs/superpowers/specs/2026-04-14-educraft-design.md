# EduCraft — Design Specification

**Datum:** 2026-04-14  
**Projekt:** EduCraft — matematická hra pro prvňáky v Minecraft stylu  
**Stack:** React 18 + TypeScript + Vite + Framer Motion + Zustand  
**PWA:** Manifest + Service Worker (již existuje v projektu)

---

## 1. Cíl

Vytvořit plně funkční PWA, která proměňuje procvičování matematiky v zábavnou hru pro děti prvního stupně. Hra má Minecraft/pixelový vizuální styl, odměňuje správné odpovědi drahokamy a combo bonusy a motivuje sběratelstvím předmětů ve vitríně.

---

## 2. Klíčová rozhodnutí

| Téma | Rozhodnutí |
|---|---|
| Jazyk | Čeština (primární), překlad ponechán otevřený pro budoucnost |
| Navigace | Světy/Biomy — dítě odemyká nové světy |
| Odměny | Combo systém — série správných odpovědí = rostoucí bonus |
| Obchod | Sbírková vitrína — album-style s prázdnými sloty |
| Drag & Drop | Plný drag & drop s touch podporou (Framer Motion) |
| Persistence | localStorage via Zustand persist middleware |
| Databáze | Není — localStorage dostačuje pro v1 (Supabase jako budoucí rozšíření) |

---

## 3. Architektura & struktura souborů

```
src/
├── main.tsx                  # vstupní bod, SW registrace
├── App.tsx                   # root router (Hra / Obchod / Profil)
├── styles.css                # globální Minecraft pixel theme
│
├── store/
│   └── gameStore.ts          # Zustand store — veškerý herní stav
│
├── data/
│   ├── worlds.ts             # definice světů a jejich úkolů
│   ├── tasks.ts              # generátory úkolů pro každý typ
│   ├── shopItems.ts          # všechny předměty v obchodě
│   └── config.ts             # globální konstanty (combo, ceny, obtížnost)
│
├── components/
│   ├── hud/
│   │   ├── HUD.tsx           # horní lišta (💎 combo, level, měna)
│   │   └── ComboBar.tsx      # vizuální combo counter s animací
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx    # výběr světa
│   │   ├── GameScreen.tsx    # aktivní úkol
│   │   ├── RewardScreen.tsx  # animace odměny po správné odpovědi
│   │   ├── ShopScreen.tsx    # vitrína / obchod
│   │   └── ProfileScreen.tsx # sbírka, statistiky
│   │
│   ├── tasks/
│   │   ├── TaskRenderer.tsx  # přepínač typů úkolů (switch na taskType)
│   │   ├── CountingTask.tsx  # počítání objektů
│   │   ├── TapNumberTask.tsx # najdi číslo
│   │   ├── CompareTask.tsx   # větší / menší
│   │   ├── MultiChoiceTask.tsx # 3 možnosti
│   │   ├── DragDropTask.tsx  # drag & drop (Framer Motion)
│   │   ├── FindTask.tsx      # najdi správný blok/číslo
│   │   └── MathTask.tsx      # sčítání a odečítání
│   │
│   └── ui/
│       ├── PixelButton.tsx   # stylovaný Minecraft button
│       ├── GemBurst.tsx      # animace gemů při odměně
│       └── WorldCard.tsx     # karta světa na HomeScreen
│
└── hooks/
    ├── useTask.ts            # generuje úkoly, vyhodnocuje odpovědi
    └── useCombo.ts           # sleduje combo, počítá bonus
```

---

## 4. Datové modely

### TaskType

```ts
type TaskType =
  | 'counting'      // počítání objektů
  | 'tapNumber'     // najdi číslo
  | 'compare'       // větší / menší
  | 'multiChoice'   // 3 možnosti
  | 'dragDrop'      // drag & drop
  | 'find'          // najdi správný blok
  | 'math'          // sčítání / odečítání
```

Přidání nového typu = nový string v union + nová komponenta + 1 řádek v TaskRenderer.

### World

```ts
interface World {
  id: string
  name: string                    // "Příroda", "Jeskyně"
  icon: string                    // emoji
  biome: 'forest' | 'cave' | 'snow' | 'nether'
  taskTypes: TaskType[]
  numberRange: [number, number]   // [1, 5], [1, 10], [1, 20]
  unlockCost: number              // diamanty (0 = odemčen od začátku)
  comboMultiplier: number         // 1.0 = základní
}
```

### Task

```ts
interface Task {
  id: string
  type: TaskType
  question: string
  visualCount?: number
  options?: number[]              // pro multiChoice
  correctAnswer: number | string
  objects?: string[]              // emoji objektů ['⭐','⭐','⭐']
}
```

### GameState (Zustand)

```ts
interface GameState {
  currentScreen: 'home' | 'game' | 'reward' | 'shop' | 'profile'
  currentWorldId: string | null
  combo: number
  maxCombo: number
  diamonds: number
  emeralds: number
  stars: number
  unlockedWorlds: string[]
  ownedItems: string[]
  showcaseSlots: (string | null)[]  // 8 slotů
  totalCorrect: number
  totalAttempts: number
  sessionsPlayed: number
}
```

### ShopItem

```ts
interface ShopItem {
  id: string
  name: string
  icon: string
  category: 'weapon' | 'armor' | 'trophy' | 'decoration' | 'rare'
  cost: { diamonds?: number; emeralds?: number; stars?: number }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  description?: string
}
```

---

## 5. Konfigurační systém (`src/data/config.ts`)

Vše konfigurovatelné bez zásahu do komponent:

```ts
// Combo prahy
export const COMBO_THRESHOLDS = {
  fire: 3,
  doubleFire: 5,
  mania: 10,
}

// Odměny za combo úrovně
export const COMBO_REWARDS = {
  base:        { diamonds: 1 },
  fire:        { diamonds: 2 },
  doubleFire:  { diamonds: 3, emeralds: 1 },
  mania:       { diamonds: 5, emeralds: 2, stars: 1 },
}

// Ceny odemknutí světů
export const WORLD_UNLOCK_COSTS = {
  forest: 0,
  cave: 30,
  snow: 60,
  nether: 120,
}
```

**Princip:** Komponenty nikdy neobsahují pevná čísla ani texty — vše čtou z `data/`. Změna obtížnosti = změna čísla v `config.ts` nebo `worlds.ts`.

---

## 6. Herní smyčka

```
HomeScreen
  → klepnutí na svět
  → GameScreen
    → generuje Task (useTask hook)
      → správná odpověď:
          combo++
          přičti gemy dle COMBO_REWARDS
          RewardScreen (0.8s, automatický návrat)
          nový Task
      → špatná odpověď:
          combo se NERESETUJE
          jemné zatřesení ("zkus znovu")
          stejný úkol zůstane na obrazovce
```

**Pravidlo:** Combo se resetuje pouze při opuštění světa nebo ukončení session — nikdy při chybě. Prvňák nesmí být frustrován ztrátou.

### Generování úkolů (`useTask.ts`)

1. Ze světa vezmi `taskTypes` a `numberRange`
2. Vyber náhodný `taskType` (s váhami — oblíbené typy častěji)
3. Vygeneruj `Task` pomocí generátoru z `tasks.ts`
4. Po každých 5 úkolech zařaď jeden "lehčí" — definice: typ `counting` nebo `tapNumber` s čísly z dolní poloviny `numberRange` (prevence frustrace)
5. Nikdy neopakuj stejný úkol dvakrát za sebou

---

## 7. Combo systém

| Combo | Vizuál | Odměna |
|---|---|---|
| 1–2 | ✓ | 💎 1 |
| 3–4 | 🔥 COMBO x2 | 💎 2 |
| 5–9 | 🔥🔥 COMBO x3 | 💎 3 + 💚 1 |
| 10+ | 🔥🔥🔥 MÁNIE! | 💎 5 + 💚 2 + ⭐ 1 |

`ComboBar.tsx` — vizuální lišta s Framer Motion spring animací narůstá s každou správnou odpovědí.

`comboMultiplier` světa násobí základní odměnu z `COMBO_REWARDS`: `finalReward = baseReward * world.comboMultiplier`. Těžší světy (Nether: 2.0) tak dávají dvojnásobné gemy za stejné combo.

---

## 8. Světy (počáteční sada)

| Svět | Biome | Úkoly | Čísla | Odemknutí |
|---|---|---|---|---|
| 🌱 Příroda | forest | counting, tapNumber, compare, multiChoice | 1–5 | zdarma |
| 🔥 Jeskyně | cave | counting, math, multiChoice, dragDrop | 1–10 | 💎 30 |
| ❄️ Sněžné království | snow | math, find, compare, dragDrop | 1–10 | 💎 60 |
| ⚡ Nether | nether | math, multiChoice, find, dragDrop | 1–20 | 💎 120 |

---

## 9. Typy úkolů (počáteční sada)

| Typ | Popis | Obtížnost |
|---|---|---|
| `counting` | Spočítej objekty, vyber správné číslo | ⭐ |
| `tapNumber` | Najdi číslo mezi nabídkou | ⭐ |
| `compare` | Větší / menší (dvě čísla nebo skupiny) | ⭐⭐ |
| `multiChoice` | 3 možnosti, 1 správná | ⭐⭐ |
| `dragDrop` | Přetáhni správný počet objektů | ⭐⭐ |
| `find` | Najdi správný blok/číslo/symbol | ⭐⭐ |
| `math` | Sčítání a odečítání | ⭐⭐⭐ |

---

## 10. Obchod & vitrína

### Obchod
- Záložky: Zbraně, Brnění, Trofeje, Vzácné
- Koupený předmět se označí ✓ a přejde do vitríny
- Vzácné předměty (fialový/oranžový rámeček) vyžadují hvězdy (⭐)

### Vitrína
- 8 viditelných slotů (rozšiřitelné)
- Prázdné sloty jako albem samolepek — motivace doplnit
- Progress bar: "5 z 24 předmětů"

### Přidání předmětu
```ts
// src/data/shopItems.ts — stačí přidat objekt:
{ id: 'ruby', name: 'Rubín', icon: '🔴', category: 'rare',
  cost: { stars: 5 }, rarity: 'legendary' }
```

---

## 11. Animace & vizuální feedback

- **Framer Motion AnimatePresence** — slide in/out přechody mezi obrazovkami
- **RewardScreen** — 0.8s gem burst animace, automatický návrat (dítě nečeká)
- **ComboBar** — spring animace při každé správné odpovědi
- **Chyba** — shake animace (zatřesení), žádný trest, žádný reset combo
- **GemBurst** — gemy animovaně přilétají na HUD counter

---

## 12. PWA

- Manifest: `/public/manifest.webmanifest` (již existuje)
- Service Worker: `/public/sw.js` (již existuje, cache-first strategie)
- SW registrace: `src/pwa.ts` (již existuje)
- Offline: všechna herní data jsou v kódu (žádné externí API)
- Instalace na plochu: podporováno

---

## 13. Persistence

Zustand `persist` middleware ukládá celý `GameState` do `localStorage`. Dítě pokračuje přesně tam, kde skončilo. Migrace dat: verzovaný klíč `educraft-game-v1`.

---

## 14. Herní design principy (engagement)

Hra implementuje následující principy motivace a engagementu:

### Okamžitá zpětná vazba
Dítě okamžitě vidí výsledek — správná odpověď spustí zelenou animaci + gem burst, chybná jemné zatřesení. Žádné čekání na konci testu. Toto je jeden z nejsilnějších herních taháků.

### Krátké micro-úkoly s jasným cílem
Každý úkol je samostatná mini-mise: "najdi 7", "vyber větší", "přetáhni 3 bloky". Udržuje tempo, snadno srozumitelné i pro malé děti. Žádné dlouhé levely.

### Sbírání a collectibles
Diamanty, smaragdy, hvězdy, předměty do vitríny — sběratelský loop je extrémně návykový a podporuje opakovaný návrat do hry.

### Volba a autonomie
Dítě si volí svět, vidí co je odemčené a co zbývá. Autonomy-supportive design zvyšuje motivaci (v literatuře opakovaně potvrzeno).

### Adaptivní obtížnost
Systém sleduje úspěšnost dítěte per-svět. Pokud klesne pod 60 %, dočasně zúží `numberRange` na spodní polovinu. Pokud přesáhne 90 %, více preferuje horní část rozsahu. Dítě zůstává v "flow zóně" — nejde to moc lehce ani moc těžce.

### Příběh a mise (story framing)
Každý svět má krátký příběhový kontext — "Zachraň vesnici od hladu!", "Prozkoum temnou jeskyni!", "Přežij sněžnou bouři!". Matematika se stává součástí dobrodružství, ne školním testem. Data: pole `story` v `World` objektu.

### Zvuky a atmosféra
Minimalistický zvukový systém (Web Audio API, bez externích souborů, funguje offline):
- `correct` — příjemný tón při správné odpovědi
- `wrong` — jemný nízký tón (ne trestající)
- `combo` — stoupající sequence při combo fire/mania
- `reward` — fanfára při RewardScreen
- `wheel` — tikot při Lucky Wheel
- Zvuky lze vypnout v nastavení (mute tlačítko v HUD)

### Průzkum a odemykání
Locked světy s viditelnou cenou = jasný cíl. Odemknutí nového světa = malý svátek (animace + fanfára).

### Customizace
Vitrína, sběratelské předměty, showcase — hra je "vaše". Výzkumy ukazují, že customizace zvyšuje motivaci vracet se.

### Viditelný progres
ComboBar, showcase progress bar "X z Y předmětů", odemčené světy — dítě vždy ví, jak daleko je a kam míří.

---

## 15. Lucky Wheel — Kolo štěstí

Příležitostná bonusová odměna s překvapivým efektem. Záměrně **ne** pravidelná, aby nevznikal gambling vibe.

### Trigger podmínky (max 3× za session)
- Poprvé dosáhne combo 10 (uvítací bonus)
- Náhodně každých 15–25 správných odpovědí (ne garantováno, průměr ~1 za 20)
- Po odemknutí nového světa

### UI
- Fullscreen overlay (Framer Motion)
- Rotující kolo se 5 klíny (Framer Motion rotatace s decelerací)
- Výsledný klín se vybere předem, animace je čistě vizuální
- Tap pro roztočení → animace ~2s → výsledek → pokračovat

### Výhry (vždy jedna z pěti — nikdy "miss")
| Klín | Odměna |
|---|---|
| 💎 Malý bonus | +3 diamanty |
| 💎 Střední bonus | +6 diamantů |
| 💚 Smaragdy | +4 smaragdy |
| ⭐ Hvězda | +1 hvězda |
| 🎁 Překvapení | Náhodný předmět ze shopu (pokud ho dítě nemá) |

### Implementace
- Komponenta: `src/components/ui/LuckyWheel.tsx`
- Trigger logika: `src/hooks/useLuckyWheel.ts` (sleduje počítadlo, vrací `{ shouldSpin, triggerSpin, dismissSpin }`)
- Store: přidá `wheelSpinsToday: number` do GameState
- GameScreen: zobrazí LuckyWheel overlay pokud `shouldSpin === true`

---

## 16. Zvukový systém

```ts
// src/audio/sounds.ts
// Web Audio API — žádné soubory, funguje offline
export function playSound(type: 'correct' | 'wrong' | 'combo' | 'reward' | 'wheel' | 'unlock'): void
export function setMuted(muted: boolean): void
export function isMuted(): boolean
```

Zvuky jsou generovány programaticky pomocí `OscillatorNode` — krátké tóny, žádné MP3 soubory. Ideální pro PWA offline.

---

## 17. Adaptivní obtížnost

```ts
// src/hooks/useAdaptiveDifficulty.ts
// Sleduje sessionCorrect a sessionAttempts
// Vrací adaptedRange: [number, number]

// Logika:
// accuracy < 60% → [min, ceil((min+max)/2)]   (zúžení na spodní polovinu)
// accuracy > 90% → [floor((min+max)/2), max]   (preferuje horní polovinu)
// jinak          → world.numberRange             (beze změny)
```

`useTask` přijme `adaptedRange` jako volitelný parametr a použije ho místo `world.numberRange`.

---

## 18. Budoucí rozšíření (mimo scope v1)

- Supabase sync pro multi-device a rodičovský dashboard
- Nové vzdělávací oblasti (hodiny, geometrie, písmenka)
- Více jazyků (i18n připraveno strukturou dat)
- Denní výzvy a streak systém
- Multiplayer / soutěž s kamarádem
- Hudba na pozadí (ambient Minecraft soundtrack)
