# Design: Jazykové úkoly (Language Tasks)

**Datum:** 2026-04-16  
**Status:** Schváleno

---

## Přehled

Rozšíření EduCraft o jazykové úkoly (český jazyk) jako nová skill větev vedle stávající matematiky. Tři typy úkolů: chybějící písmeno, diakritika, pořadí písmen. Data jsou statická (bez live AI generování).

---

## Typy úkolů

| type | Popis | Příklad |
|------|-------|---------|
| `missingLetter` | Slovo s chybějícím písmenem, doplň ho | „STR_M" → O / A / E / I |
| `diacritics` | Vyber správný tvar slova s/bez háčků a čárek | „hrad" / „hrád" / „hrâd" |
| `wordOrder` | Seřaď scramblovaná písmena do slova | S T O M R → STROM |

`firstLetter` (hádání emoji → písmeno) bylo **vyřazeno** — emoji může být nejednoznačné pro děti.

---

## Skill tree rozšíření

### Nový typ `LangSkillId`

```ts
export type LangSkillId =
  | 'letter_missing_easy'     // chybějící písmeno, 3–4 písmenná slova
  | 'letter_missing_hard'     // chybějící písmeno, 5+ písmenných slov
  | 'diacritics_basic'        // háčky/čárky na jednoduchých slovech
  | 'diacritics_hard'         // delší/složitější slova s diakritikou
  | 'word_order_short'        // seřazení 3–4 písmen
  | 'word_order_long'         // seřazení 5–6 písmen
```

### Rozšíření existujících typů

```ts
// types.ts
export type StudentProgress = Record<MathSkillId | LangSkillId, SkillState>

// Task.skillId rozšíříme:
skillId?: MathSkillId | LangSkillId

// Task.options rozšíříme (byl number[]):
options?: (number | string)[]
```

ZPD logika (mastery 0–1, odemykání, výběr skillů) zůstává beze změny — funguje pro obě větve.

---

## Datová vrstva

### Nový soubor `src/data/langWords.ts`

```ts
export interface LangWord {
  word: string          // "STROM" — vždy uppercase, bez diakritiky
  display: string       // "strom" — pro zobrazení hráči
  emoji: string         // "🌲" — dekorativní, ne pro hádání
  syllables: number     // počet slabik (pro případný budoucí syllableCount task)
  difficulty: 'easy' | 'medium' | 'hard'
  biome?: string        // volitelná vazba na biom světa
  diacritics?: {
    correct: string     // správný tvar (může být shodný s display)
    wrong: string[]     // 2 špatné varianty pro multiChoice
  }
}
```

Slova bez diakritiky `diacritics` pole nemají — task generator je pro diacritics tasky přeskočí.

Cíl: ~150 slov pro MVP, pokrývající easy/medium/hard a hlavní biomy.

### Build-time AI generátor (budoucnost)

Až bude potřeba rozšířit dataset, napíšeme standalone skript (`scripts/generate-lang-words.ts`), který zavolá Claude API a vygeneruje/obohatí slova do JSON. Výstup se zkontroluje ručně a commitne. Live generování za runtime se **nepoužívá**.

---

## Task shapes

Všechny typy staví na existující `Task` interface. `wordOrder` nepotřebuje `options` — UI je drag-and-drop.

```ts
// missingLetter
{
  type: 'missingLetter',
  question: 'STR_M',       // slovo s '_' na místě chybějícího písmene
  options: ['O','A','E','I'],
  correctAnswer: 'O',
}

// diacritics
{
  type: 'diacritics',
  question: 'Správný tvar?',
  options: ['hrad','hrád','hrâd'],
  correctAnswer: 'hrad',
}

// wordOrder
{
  type: 'wordOrder',
  question: 'Seřaď písmena do slova',
  letters: ['S','T','O','M','R'],  // nové pole — scramblovaná písmena
  correctAnswer: 'STROM',
}
```

Nutné přidat `letters?: string[]` do `Task` interface.

---

## Rozšíření typu `Biome`

`Biome` union v `types.ts` dostane dvě nové hodnoty:

```ts
export type Biome = 'forest' | 'cave' | 'snow' | 'desert' | 'ocean'
  | 'jungle' | 'tnt' | 'nether' | 'end'
  | 'village' | 'castle'   // nové
```

`BIOME_OBJECTS` v `tasks.ts` dostane záznamy pro oba nové biomy (dekorativní emoji, nepoužívají se pro hádání).

---

## World interface

`numberRange` je math-specific — jazykové světy ho nepotřebují. Uděláme optional:

```ts
// Bylo: numberRange: [number, number]
numberRange?: [number, number]
```

Task generátory pro lang tasky dostávají obtížnost z `LangSkillId` (easy/medium/hard), ne z numberRange.

### Nové světy (minimálně 2 pro MVP)

```ts
{ id: 'village', name: 'Vesnice', biome: 'village',
  taskTypes: [
    { type: 'missingLetter', weight: 3 },
    { type: 'wordOrder', weight: 2 },
  ],
  unlockCost: 80, comboMultiplier: 1.1 }

{ id: 'castle', name: 'Hrad', biome: 'castle',
  taskTypes: [
    { type: 'diacritics', weight: 3 },
    { type: 'missingLetter', weight: 2 },
    { type: 'wordOrder', weight: 1 },
  ],
  unlockCost: 150, comboMultiplier: 1.3 }
```

---

## Nové komponenty

| Komponenta | Popis |
|-----------|-------|
| `MissingLetterTask.tsx` | Zobrazí slovo s `_`, 4 tlačítka s písmeny |
| `DiacriticsTask.tsx` | 3 tlačítka s variantami slova |
| `WordOrderTask.tsx` | Drag-and-drop písmen do správného pořadí (vzor: existující `DragDropTask`) |

Komponenty jdou do `src/components/tasks/`.

---

## Co se nemění

- Kombo systém, odměny, shop, profil — beze změny
- ZPD logika v `skills.ts` — beze změny (funguje pro LangSkillId automaticky)
- Matematické světy a tasky — beze změny
- `gameStore` — minimální změny (jen `updateSkillMastery` přijme širší typ)
