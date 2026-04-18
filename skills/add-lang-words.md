# Skill: Add Czech words to the word list

File: `src/data/langWords.ts` — append to the `LANG_WORDS` array.

Words feed three task types: `missingLetter`, `diacritics`, `wordOrder`. Each word can serve one or more of these types depending on its shape and which optional fields it has.

---

## Which task types use which words

| Task type | Requires |
|---|---|
| `missingLetter` | `isAsciiWord(word) === true` AND matching `difficulty` |
| `wordOrder` | `isAsciiWord(word) === true` AND matching `difficulty` |
| `diacritics` | `diacritics` field present AND matching `difficulty` |

`isAsciiWord` returns `true` only when the word contains **no diacritics** (`/^[a-z]+$/`).  
A word with diacritics (e.g. `'kůň'`) is automatically excluded from missingLetter and wordOrder — it can only serve diacritics tasks.

---

## Difficulty mapping

Difficulty in `langWords` maps directly to skill IDs:

| `difficulty` | missingLetter skill | wordOrder skill |
|---|---|---|
| `'easy'` | `letter_missing_easy` | `word_order_short` |
| `'hard'` | `letter_missing_hard` | `word_order_long` |

Target word lengths:
- `'easy'` → **3–4 letters** (missingLetter/wordOrder) or short words with diacritics
- `'hard'` → **5–6 letters** (missingLetter/wordOrder) or harder diacritics words
- `'medium'` → currently unused by skill selection; avoid unless you add a new skill for it

---

## Schema

```ts
{
  word: string,          // lowercase, correct spelling: 'strom', 'kůň'
  emoji: string,         // decorative only — not used for guessing
  syllables: number,     // count syllables: 'pes' = 1, 'ko-za' = 2, 'jab-lko' = 2
  difficulty: 'easy' | 'medium' | 'hard',
  biome?: string,        // optional hint for theming (not used in logic currently)
  diacritics?: {
    correct: string,     // the correct form: 'kůň'
    wrong: string[],     // exactly 2 wrong variants — common misspellings
  },
}
```

---

## Adding words for missingLetter / wordOrder

These words must be ASCII (no diacritics). The missing letter is picked randomly from any position.

```ts
// Easy: 3–4 letters
{ word: 'rok',    emoji: '📅', syllables: 1, difficulty: 'easy' },
{ word: 'hora',   emoji: '⛰️', syllables: 2, difficulty: 'easy' },

// Hard: 5–6 letters
{ word: 'skala',  emoji: '🪨', syllables: 3, difficulty: 'hard' },
{ word: 'traktor',emoji: '🚜', syllables: 2, difficulty: 'hard' },
```

Rules:
- Word must be recognizable to a 6–10 year old Czech child
- No proper nouns, no abbreviations
- Prefer concrete nouns (animals, objects, nature) over abstract words
- For wordOrder: the word must be shuffleable — `'pes'` → `['P','E','S']` scrambled

---

## Adding words for diacritics

The `word` field should contain the correct form (with diacritics). The `diacritics.correct` field repeats it. The `diacritics.wrong` array must have **exactly 2** wrong variants.

```ts
// Easy diacritics
{
  word: 'píseň', emoji: '🎵', syllables: 2, difficulty: 'easy',
  diacritics: { correct: 'píseň', wrong: ['pisen', 'písén'] },
},

// Hard diacritics
{
  word: 'průvod', emoji: '🎉', syllables: 2, difficulty: 'hard',
  diacritics: { correct: 'průvod', wrong: ['pruvod', 'průvůd'] },
},
```

### Designing wrong variants

Wrong variants must be plausible mistakes a child would make — not random strings.

| Pattern | Example |
|---|---|
| Strip all diacritics | `'kůň'` → `'kun'` |
| Wrong diacritic (háček vs. čárka) | `'kůň'` → `'kúň'` |
| Extra/missing diacritic elsewhere | `'jídlo'` → `'jídló'` |
| Swap long/short vowel | `'léto'` → `'létó'` |

Always produce exactly 2 wrong items. The generator shuffles all three options.

---

## Words that serve both missingLetter and diacritics

Not possible. If a word has diacritics, `isAsciiWord` returns `false` and it's excluded from missingLetter/wordOrder automatically. Keep the two pools separate.

---

## Checklist before committing

- [ ] `word` is lowercase, correctly spelled Czech
- [ ] `difficulty: 'easy'` → word is 3–4 letters (for ASCII words)
- [ ] `difficulty: 'hard'` → word is 5–6 letters (for ASCII words)
- [ ] Diacritics words: `wrong` array has exactly 2 items
- [ ] Wrong variants are plausible child mistakes, not random strings
- [ ] No proper nouns, no words a typical 6–10 year old wouldn't know
- [ ] Run `npm run build` — TypeScript validates the `LangWord` shape
