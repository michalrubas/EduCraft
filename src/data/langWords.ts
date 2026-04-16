// src/data/langWords.ts

export interface LangWord {
  word: string          // lowercase, správný pravopis: "strom", "kůň"
  emoji: string         // dekorativní, ne pro hádání
  syllables: number
  difficulty: 'easy' | 'medium' | 'hard'
  biome?: string
  diacritics?: {
    correct: string     // správný tvar: "kůň", "jídlo"
    wrong: string[]     // 2 špatné varianty
  }
}

/** Vrátí true pro slova bez háčků a čárek (vhodná pro missingLetter a wordOrder) */
export function isAsciiWord(word: string): boolean {
  return /^[a-z]+$/.test(word)
}

export const LANG_WORDS: LangWord[] = [
  // --- Easy: 3–4 písmenná slova bez diakritiky ---
  { word: 'hora',  emoji: '⛰️',  syllables: 2, difficulty: 'easy' },
  { word: 'ryba',  emoji: '🐟',  syllables: 2, difficulty: 'easy' },
  { word: 'koza',  emoji: '🐐',  syllables: 2, difficulty: 'easy' },
  { word: 'voda',  emoji: '💧',  syllables: 2, difficulty: 'easy' },
  { word: 'vlak',  emoji: '🚂',  syllables: 1, difficulty: 'easy' },
  { word: 'pole',  emoji: '🌾',  syllables: 2, difficulty: 'easy' },
  { word: 'most',  emoji: '🌉',  syllables: 1, difficulty: 'easy' },
  { word: 'pero',  emoji: '✏️',  syllables: 2, difficulty: 'easy' },

  // --- Medium: 5–6 písmenná slova bez diakritiky ---
  { word: 'strom',  emoji: '🌲', syllables: 1, difficulty: 'medium', biome: 'forest' },
  { word: 'kozel',  emoji: '🐐', syllables: 2, difficulty: 'medium' },
  { word: 'robot',  emoji: '🤖', syllables: 2, difficulty: 'medium' },
  { word: 'motor',  emoji: '⚙️', syllables: 2, difficulty: 'medium' },
  { word: 'kaktus', emoji: '🌵', syllables: 2, difficulty: 'medium' },
  { word: 'kostel', emoji: '⛪', syllables: 2, difficulty: 'medium' },

  // --- Hard: 6 písmenná slova bez diakritiky ---
  { word: 'hrdina', emoji: '🦸', syllables: 3, difficulty: 'hard' },
  { word: 'raketa', emoji: '🚀', syllables: 3, difficulty: 'hard' },
  { word: 'lopata', emoji: '🪣', syllables: 3, difficulty: 'hard' },
  { word: 'komoda', emoji: '🪑', syllables: 3, difficulty: 'hard' },

  // --- Easy diacritics ---
  {
    word: 'kůň', emoji: '🐴', syllables: 1, difficulty: 'easy',
    diacritics: { correct: 'kůň', wrong: ['kun', 'kúň'] },
  },
  {
    word: 'dům', emoji: '🏠', syllables: 1, difficulty: 'easy',
    diacritics: { correct: 'dům', wrong: ['dum', 'dúm'] },
  },
  {
    word: 'jídlo', emoji: '🍽️', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'jídlo', wrong: ['jidlo', 'jídló'] },
  },
  {
    word: 'léto', emoji: '☀️', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'léto', wrong: ['leto', 'létó'] },
  },

  // --- Medium diacritics ---
  {
    word: 'vítr', emoji: '💨', syllables: 1, difficulty: 'medium',
    diacritics: { correct: 'vítr', wrong: ['vitr', 'vítŕ'] },
  },
  {
    word: 'světlo', emoji: '💡', syllables: 2, difficulty: 'medium',
    diacritics: { correct: 'světlo', wrong: ['svetlo', 'světlô'] },
  },
  {
    word: 'zima', emoji: '❄️', syllables: 2, difficulty: 'medium',
    diacritics: { correct: 'zima', wrong: ['zíma', 'zímá'] },
  },
  {
    word: 'modrý', emoji: '🔵', syllables: 2, difficulty: 'medium',
    diacritics: { correct: 'modrý', wrong: ['modry', 'módry'] },
  },

  // --- Hard diacritics ---
  {
    word: 'líný', emoji: '😴', syllables: 2, difficulty: 'hard',
    diacritics: { correct: 'líný', wrong: ['liny', 'líny'] },
  },
  {
    word: 'mít', emoji: '🤲', syllables: 1, difficulty: 'hard',
    diacritics: { correct: 'mít', wrong: ['mit', 'míd'] },
  },
]
