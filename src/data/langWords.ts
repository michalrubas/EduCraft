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
  // --- Easy: 3–5 písmenná slova bez diakritiky ---
  { word: 'hora',  emoji: '⛰️',  syllables: 2, difficulty: 'easy' },
  { word: 'ryba',  emoji: '🐟',  syllables: 2, difficulty: 'easy' },
  { word: 'koza',  emoji: '🐐',  syllables: 2, difficulty: 'easy' },
  { word: 'voda',  emoji: '💧',  syllables: 2, difficulty: 'easy' },
  { word: 'vlak',  emoji: '🚂',  syllables: 1, difficulty: 'easy' },
  { word: 'pole',  emoji: '🌾',  syllables: 2, difficulty: 'easy' },
  { word: 'most',  emoji: '🌉',  syllables: 1, difficulty: 'easy' },
  { word: 'pero',  emoji: '✏️',  syllables: 2, difficulty: 'easy' },
  { word: 'pes',     emoji: '🐶', syllables: 1, difficulty: 'easy' },
  { word: 'kočka',   emoji: '🐱', syllables: 2, difficulty: 'easy' },
  { word: 'strom',   emoji: '🌳', syllables: 1, difficulty: 'easy' },
  { word: 'les',     emoji: '🌲', syllables: 1, difficulty: 'easy' },
  { word: 'dům',     emoji: '🏠', syllables: 1, difficulty: 'easy' },
  { word: 'auto',    emoji: '🚗', syllables: 2, difficulty: 'easy' },
  { word: 'bota',    emoji: '👟', syllables: 2, difficulty: 'easy' },
  { word: 'kniha',   emoji: '📖', syllables: 2, difficulty: 'easy' },
  { word: 'škola',   emoji: '🏫', syllables: 2, difficulty: 'easy' },
  { word: 'stůl',    emoji: '🪑', syllables: 1, difficulty: 'easy' },
  { word: 'okno',    emoji: '🪟', syllables: 2, difficulty: 'easy' },
  { word: 'míč',     emoji: '⚽', syllables: 1, difficulty: 'easy' },
  { word: 'slunce',  emoji: '☀️', syllables: 2, difficulty: 'easy' },
  { word: 'měsíc',   emoji: '🌙', syllables: 2, difficulty: 'easy' },
  { word: 'řeka',    emoji: '🏞️', syllables: 2, difficulty: 'easy' },
  { word: 'louka',   emoji: '🌼', syllables: 2, difficulty: 'easy' },
  { word: 'tráva',   emoji: '🌿', syllables: 2, difficulty: 'easy' },
  { word: 'jablko',  emoji: '🍎', syllables: 3, difficulty: 'easy' },
  { word: 'medvěd',  emoji: '🐻', syllables: 2, difficulty: 'easy' },
  { word: 'pták',    emoji: '🐦', syllables: 1, difficulty: 'easy' },
  { word: 'sníh',    emoji: '❄️', syllables: 1, difficulty: 'easy' },
  { word: 'med',     emoji: '🍯', syllables: 1, difficulty: 'easy' },
  { word: 'třešeň',  emoji: '🍒', syllables: 2, difficulty: 'easy' },
  // nové easy
  { word: 'noc',   emoji: '🌙', syllables: 1, difficulty: 'easy' },
  { word: 'den',   emoji: '☀️', syllables: 1, difficulty: 'easy' },
  { word: 'rok',   emoji: '📅', syllables: 1, difficulty: 'easy' },
  { word: 'nos',   emoji: '👃', syllables: 1, difficulty: 'easy' },
  { word: 'lev',   emoji: '🦁', syllables: 1, difficulty: 'easy' },
  { word: 'sob',   emoji: '🦌', syllables: 1, difficulty: 'easy' },
  { word: 'kos',   emoji: '🐦', syllables: 1, difficulty: 'easy' },
  { word: 'rak',   emoji: '🦀', syllables: 1, difficulty: 'easy' },
  { word: 'kapr',  emoji: '🐟', syllables: 1, difficulty: 'easy' },
  { word: 'slon',  emoji: '🐘', syllables: 1, difficulty: 'easy' },
  { word: 'drak',  emoji: '🐉', syllables: 1, difficulty: 'easy' },
  { word: 'krab',  emoji: '🦀', syllables: 1, difficulty: 'easy' },
  { word: 'mrak',  emoji: '☁️', syllables: 1, difficulty: 'easy' },
  { word: 'skok',  emoji: '🏃', syllables: 1, difficulty: 'easy' },
  { word: 'kost',  emoji: '🦴', syllables: 1, difficulty: 'easy' },
  { word: 'plot',  emoji: '🪵', syllables: 1, difficulty: 'easy' },
  { word: 'kolo',  emoji: '🚲', syllables: 2, difficulty: 'easy' },
  { word: 'ruka',  emoji: '💪', syllables: 2, difficulty: 'easy' },
  { word: 'noha',  emoji: '🦵', syllables: 2, difficulty: 'easy' },
  { word: 'sova',  emoji: '🦉', syllables: 2, difficulty: 'easy' },
  { word: 'vosa',  emoji: '🐝', syllables: 2, difficulty: 'easy' },
  { word: 'mapa',  emoji: '🗺️', syllables: 2, difficulty: 'easy' },
  { word: 'nota',  emoji: '🎵', syllables: 2, difficulty: 'easy' },

  // --- Medium: 5–6 písmenná slova bez diakritiky ---
  { word: 'strom',  emoji: '🌲', syllables: 1, difficulty: 'medium', biome: 'forest' },
  { word: 'kozel',  emoji: '🐐', syllables: 2, difficulty: 'medium' },
  { word: 'robot',  emoji: '🤖', syllables: 2, difficulty: 'medium' },
  { word: 'motor',  emoji: '⚙️', syllables: 2, difficulty: 'medium' },
  { word: 'kaktus', emoji: '🌵', syllables: 2, difficulty: 'medium' },
  { word: 'kostel', emoji: '⛪', syllables: 2, difficulty: 'medium' },

  // --- Hard: 5–7 písmenná slova bez diakritiky ---
  { word: 'hrdina', emoji: '🦸', syllables: 3, difficulty: 'hard' },
  { word: 'raketa', emoji: '🚀', syllables: 3, difficulty: 'hard' },
  { word: 'lopata', emoji: '🪣', syllables: 3, difficulty: 'hard' },
  { word: 'komoda', emoji: '🪑', syllables: 3, difficulty: 'hard' },
  { word: 'kometa', emoji: '☄️', syllables: 3, difficulty: 'hard' },
  { word: 'kaktus', emoji: '🌵', syllables: 2, difficulty: 'hard' },
  { word: 'tablet', emoji: '📱', syllables: 2, difficulty: 'hard' },
  { word: 'magnet', emoji: '🧲', syllables: 2, difficulty: 'hard' },
  { word: 'housle', emoji: '🎻', syllables: 2, difficulty: 'hard' },
  { word: 'kostka', emoji: '🧊', syllables: 2, difficulty: 'hard' },
  { word: 'slunce', emoji: '☀️', syllables: 2, difficulty: 'hard' },
  { word: 'obloha', emoji: '☁️', syllables: 3, difficulty: 'hard' },
  { word: 'cirkus', emoji: '🎪', syllables: 2, difficulty: 'hard' },
  { word: 'tvaroh', emoji: '🥣', syllables: 2, difficulty: 'hard' },
  { word: 'truhla', emoji: '📦', syllables: 2, difficulty: 'hard' },
  // nové hard
  { word: 'stopa',  emoji: '🐾', syllables: 2, difficulty: 'hard' },
  { word: 'sopka',  emoji: '🌋', syllables: 2, difficulty: 'hard' },
  { word: 'kobra',  emoji: '🐍', syllables: 2, difficulty: 'hard' },
  { word: 'panda',  emoji: '🐼', syllables: 2, difficulty: 'hard' },
  { word: 'palma',  emoji: '🌴', syllables: 2, difficulty: 'hard' },
  { word: 'lampa',  emoji: '💡', syllables: 2, difficulty: 'hard' },
  { word: 'kapsa',  emoji: '👖', syllables: 2, difficulty: 'hard' },
  { word: 'banka',  emoji: '🏦', syllables: 2, difficulty: 'hard' },
  { word: 'karta',  emoji: '🃏', syllables: 2, difficulty: 'hard' },
  { word: 'mozek',  emoji: '🧠', syllables: 2, difficulty: 'hard' },
  { word: 'kamen',  emoji: '🪨', syllables: 2, difficulty: 'hard' },
  { word: 'barva',  emoji: '🎨', syllables: 2, difficulty: 'hard' },
  { word: 'krtek',  emoji: '🐭', syllables: 2, difficulty: 'hard' },
  { word: 'kotel',  emoji: '⚙️', syllables: 2, difficulty: 'hard' },
  { word: 'balon',  emoji: '🎈', syllables: 2, difficulty: 'hard' },
  { word: 'beton',  emoji: '🧱', syllables: 2, difficulty: 'hard' },
  { word: 'bratr',  emoji: '👦', syllables: 2, difficulty: 'hard' },
  { word: 'kostra', emoji: '💀', syllables: 2, difficulty: 'hard' },
  { word: 'sestra', emoji: '👧', syllables: 2, difficulty: 'hard' },

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
  {
    word: 'máma', emoji: '👩', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'máma', wrong: ['mama', 'mámá'] },
  },
  {
    word: 'táta', emoji: '👨', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'táta', wrong: ['tata', 'tátá'] },
  },
  {
    word: 'škola', emoji: '🏫', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'škola', wrong: ['skola', 'škóla'] },
  },
  {
    word: 'žába', emoji: '🐸', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'žába', wrong: ['zaba', 'žabá'] },
  },
  {
    word: 'čaj', emoji: '🍵', syllables: 1, difficulty: 'easy',
    diacritics: { correct: 'čaj', wrong: ['caj', 'čáj'] },
  },
  {
    word: 'řeka', emoji: '🏞️', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'řeka', wrong: ['reka', 'řéka'] },
  },
  {
    word: 'měsíc', emoji: '🌙', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'měsíc', wrong: ['mesic', 'měsic'] },
  },
  {
    word: 'kůže', emoji: '🧴', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'kůže', wrong: ['kuze', 'kuže'] },
  },
  {
    word: 'růže', emoji: '🌹', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'růže', wrong: ['ruze', 'ruže'] },
  },
  {
    word: 'klíč', emoji: '🔑', syllables: 1, difficulty: 'easy',
    diacritics: { correct: 'klíč', wrong: ['klic', 'klič'] },
  },
  {
    word: 'písek', emoji: '🏖️', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'písek', wrong: ['pisek', 'píšek'] },
  },
  {
    word: 'víno', emoji: '🍷', syllables: 2, difficulty: 'easy',
    diacritics: { correct: 'víno', wrong: ['vino', 'vínó'] },
  },
  {
    word: 'kůl', emoji: '🪵', syllables: 1, difficulty: 'easy',
    diacritics: { correct: 'kůl', wrong: ['kul', 'kúl'] },
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
