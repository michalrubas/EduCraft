# Runner Task — Design Spec

**Datum:** 2026-04-19  
**Stav:** schváleno

---

## Shrnutí

Nový task type `runner` — Guitar Hero / scroll-lane mini-hra. Tři horizontální pruhy, v každém jede blok zprava doleva s jednou odpovědí. Hráč tapne pruh se správnou odpovědí dříve, než ho přejede zeď zleva (timeout). Funguje pro matematiku, porovnávání i jazyk.

---

## Datový model

Task interface se **nemění**. Runner používá existující pole:

```ts
{
  type: 'runner',
  question: '6 + 7 = ?',     // zobrazeno nahoře
  options: [11, 13, 8],       // vždy přesně 3 — jedna na každou dráhu
  correctAnswer: 13
}
```

Do `TaskType` union v `types.ts` přibyde `'runner'`.

---

## Konfigurace (`src/data/config.ts`)

```ts
export const RUNNER_CONFIG = {
  baseDuration: 5000,   // ms — doba letu bloku (nejpomalejší svět)
  minDuration: 2500,    // ms — maximální rychlost
  speedStep: 300,       // ms — zkrácení za každý level světa
  staggerDelay: 400,    // ms — rozestup mezi bloky (nepřijedou naráz)
  wallDuration: 6000,   // ms — čas než zeď přijede (= timeout)
  laneCount: 3,         // počet dráh
}
```

Efektivní rychlost bloku se dále zkrátí proporcionálně k `world.comboMultiplier`.

---

## Generátory (`src/data/runnerGenerators.ts`)

Tři funkce, každá vrací `Task` s `type: 'runner'`:

| Funkce | Otázka | Dráhy |
|--------|--------|-------|
| `generateRunnerMath(range)` | aritmetický výraz | 1 správná + 2 plausibilní čísla |
| `generateRunnerCompare(range)` | „Které číslo je největší?" | 3 různá čísla |
| `generateRunnerLanguage()` | „Doplň písmeno: p_s" | 3 písmena/slova |

`generateRunnerLanguage` interně použije logiku z existujícího `missingLetter` a `diacritics` generátoru — nevyrábí vlastní slovník.

---

## Komponenta (`src/components/tasks/RunnerTask.tsx`)

### Vizuální layout

```
┌──────────────────────────────────────┐
│  6 + 7 = ?                           │  ← otázka (task-question class)
├──────────────────────────────────────┤
│ ████░░░░░░ [  11  ] ──────────►      │  ← pruh 1
│ ██░░░░░░░░ [  13  ] ────────►        │  ← pruh 2
│ █████░░░░░ [   8  ] ──────►          │  ← pruh 3
│ ←zeď
└──────────────────────────────────────┘
```

### Animace

- Bloky jedou CSS `@keyframes` (`translateX(110vw → -20px)`) — bez framer-motion, žádné re-rendery
- `animation-delay` per pruh: `index * staggerDelay` ms
- Zeď = `position: absolute; left: 0;` s CSS `@keyframes` šířka roste z 0 na 100% za `wallDuration` ms
- Délka animace bloků: `max(minDuration, baseDuration - worldLevel * speedStep)`, dále zkrácena faktorem `comboMultiplier`

### Interakce

- Každý pruh = `<button>` přes celou šířku a výšku pruhu
- Tap = `onAnswer(options[i])`, animace se zastaví (`animation-play-state: paused`)
- Timeout (zeď dojede) = `onAnswer('')` (vždy špatná odpověď)

### Props

```ts
interface Props {
  task: Task
  onAnswer: (answer: number | string) => void
  worldLevel?: number       // 0–8, určuje rychlost
  comboMultiplier?: number  // z world.comboMultiplier
}
```

---

## Integrace

### `TaskRenderer.tsx`

```ts
case 'runner': return <RunnerTask task={task} onAnswer={onAnswer} />
```

### `useTask.ts`

Runner task se generuje v existujícím switch na základě `task.type === 'runner'`, volá příslušný generátor podle biome/world kontextu.

### Doporučené světy pro první nasazení

| Svět | Proč | Generátor |
|------|------|-----------|
| `forest` | úvodní svět, math | `generateRunnerMath` |
| `village` | jazykový svět | `generateRunnerLanguage` |
| `desert` | porovnávání | `generateRunnerCompare` |

Přidat do `taskTypes`: `{ type: 'runner', weight: 2 }`.

---

## modding.md

Přidat sekci **Runner task** s:
- Tabulkou `RUNNER_CONFIG` hodnot + doporučené rozsahy
- Jak přidat runner do světa (1 řádek v `worlds.ts`)
- Jak změnit rychlost per svět
- Jak přidat nový typ otázky do runneru
