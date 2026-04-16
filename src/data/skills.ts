// src/data/skills.ts
//
// Kognitivní model: obtížnost aritmetiky NENÍ dána velikostí čísel, ale strukturou operace.
// 500+500 je kognitivně stejně těžké jako 5+5 (jen pochopení řádů navíc).
// 17+8 je reálně těžší než obojí — vyžaduje přechod přes desítku (regrouping).
//
// Proto jsou dovednosti definovány strukturou operace, nikoli rozsahem čísel.

import { MathSkillId, LangSkillId, SkillState, StudentProgress, Task } from './types'
import { LANG_WORDS, isAsciiWord } from './langWords'

function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface SkillConfig {
  id: MathSkillId
  name: string
  icon: string
  description: string
  prerequisites: { id: MathSkillId; minMastery: number }[]
}

export const SKILL_TREE: SkillConfig[] = [
  {
    id: 'add_no_regroup',
    name: 'Sčítání (bez přechodu)',
    icon: '➕',
    description: '2+3, 12+5 — výsledek nepřekračuje desítku',
    prerequisites: [],
  },
  {
    id: 'complements_10',
    name: 'Doplňky do 10',
    icon: '🔟',
    description: '3+7=10, 6+4=10 — základ pro přechod přes desítku',
    prerequisites: [{ id: 'add_no_regroup', minMastery: 0.6 }],
  },
  {
    id: 'add_regroup',
    name: 'Sčítání (přechod přes desítku)',
    icon: '➕',
    description: '7+5=12, 17+8=25 — vyžaduje přeskupení (regrouping)',
    prerequisites: [{ id: 'complements_10', minMastery: 0.7 }],
  },
  {
    id: 'sub_no_regroup',
    name: 'Odčítání (bez přechodu)',
    icon: '➖',
    description: '8-3, 15-4 — výsledek v rámci stejné desítky',
    prerequisites: [{ id: 'add_no_regroup', minMastery: 0.7 }],
  },
  {
    id: 'sub_regroup',
    name: 'Odčítání (přechod přes desítku)',
    icon: '➖',
    description: '12-7=5, 23-8=15 — vyžaduje půjčení (borrowing)',
    prerequisites: [
      { id: 'add_regroup',    minMastery: 0.6 },
      { id: 'sub_no_regroup', minMastery: 0.7 },
    ],
  },
  {
    id: 'add_sub_mix',
    name: 'Mix +/−',
    icon: '🔢',
    description: 'Kombinace sčítání a odčítání s přechodem i bez',
    prerequisites: [
      { id: 'add_regroup', minMastery: 0.7 },
      { id: 'sub_regroup', minMastery: 0.7 },
    ],
  },
  // --- Násobilka ---
  {
    id: 'mul_easy',
    name: 'Násobilka 2, 5, 10',
    icon: '✖️',
    description: '2×3=6, 5×4=20 — vzorové tabulky s pravidelným rytmem',
    prerequisites: [{ id: 'add_regroup', minMastery: 0.7 }],
  },
  {
    id: 'mul_medium',
    name: 'Násobilka 3, 4, 6',
    icon: '✖️',
    description: '3×4=12, 6×7=42 — odvozené tabulky',
    prerequisites: [{ id: 'mul_easy', minMastery: 0.7 }],
  },
  {
    id: 'mul_hard',
    name: 'Násobilka 7, 8, 9',
    icon: '✖️',
    description: '7×8=56, 9×6=54 — nejtěžší tabulky, vyžadují pamětní znalost',
    prerequisites: [{ id: 'mul_medium', minMastery: 0.7 }],
  },
]

export interface LangSkillConfig {
  id: LangSkillId
  name: string
  icon: string
  description: string
  prerequisites: { id: LangSkillId; minMastery: number }[]
}

export const LANG_SKILL_TREE: LangSkillConfig[] = [
  {
    id: 'letter_missing_easy',
    name: 'Chybějící písmeno (lehké)',
    icon: '🔤',
    description: '3–4 písmenná slova s chybějícím písmenem',
    prerequisites: [],
  },
  {
    id: 'letter_missing_hard',
    name: 'Chybějící písmeno (těžké)',
    icon: '🔤',
    description: '5–6 písmenná slova s chybějícím písmenem',
    prerequisites: [{ id: 'letter_missing_easy', minMastery: 0.6 }],
  },
  {
    id: 'diacritics_basic',
    name: 'Háčky a čárky (základní)',
    icon: '✍️',
    description: 'Správný tvar jednoduchých slov s diakritikou',
    prerequisites: [],
  },
  {
    id: 'diacritics_hard',
    name: 'Háčky a čárky (pokročilé)',
    icon: '✍️',
    description: 'Složitější slova s diakritikou',
    prerequisites: [{ id: 'diacritics_basic', minMastery: 0.6 }],
  },
  {
    id: 'word_order_short',
    name: 'Pořadí písmen (krátká)',
    icon: '🔀',
    description: 'Seřaď 3–4 písmena do slova',
    prerequisites: [],
  },
  {
    id: 'word_order_long',
    name: 'Pořadí písmen (delší)',
    icon: '🔀',
    description: 'Seřaď 5–6 písmen do slova',
    prerequisites: [{ id: 'word_order_short', minMastery: 0.6 }],
  },
]

export const LANG_SKILL_DOMAINS: Record<'missing_letter' | 'diacritics' | 'word_order', LangSkillId[]> = {
  missing_letter: ['letter_missing_easy', 'letter_missing_hard'],
  diacritics:     ['diacritics_basic', 'diacritics_hard'],
  word_order:     ['word_order_short', 'word_order_long'],
}

// Skupiny skillů per task type — aby math a mathMultiply nevybíraly ze sdílených skillů
export const SKILL_DOMAINS: Record<'add_sub' | 'multiply', MathSkillId[]> = {
  add_sub:  ['add_no_regroup', 'complements_10', 'add_regroup', 'sub_no_regroup', 'sub_regroup', 'add_sub_mix'],
  multiply: ['mul_easy', 'mul_medium', 'mul_hard'],
}

// ---------------------------------------------------------------------------
// Generátory — každý generuje příklady s konkrétní STRUKTUROU, ne rozsahem
// ---------------------------------------------------------------------------

// Sčítání bez přechodu přes desítku: a+b kde a%10 + b%10 < 10
// Příklady: 2+3=5, 12+5=17, 23+6=29
function genAddNoRegroup(): { a: number; b: number; ans: number } {
  const a = ri(1, 19)
  const aUnits = a % 10
  // kolik zbývá do konce desítky (bez dosažení)
  const room = aUnits === 0 ? 8 : 9 - aUnits
  const b = ri(1, Math.max(1, room))
  return { a, b, ans: a + b }
}

// Doplňky do 10: a + (10−a) = 10
// Příklady: 3+7, 4+6, 1+9, 5+5
function genComplements10(): { a: number; b: number; ans: number } {
  const a = ri(1, 9)
  const b = 10 - a
  return { a, b, ans: 10 }
}

// Sčítání s přechodem přes desítku: a+b kde a%10 + b%10 >= 10
// Příklady: 7+5=12, 17+8=25, 9+3=12
function genAddRegroup(): { a: number; b: number; ans: number } {
  // opakuj dokud nenajdeme příklad s carry
  let a: number, b: number
  let attempts = 0
  do {
    a = ri(5, 19)
    const aUnits = a % 10 === 0 ? 10 : a % 10
    // b musí mít dost jednotek, aby součet jednotek ≥ 10
    const minBUnits = Math.max(1, 10 - aUnits + 1)
    b = ri(minBUnits, 9)
    attempts++
  } while (attempts < 20)
  return { a, b, ans: a + b }
}

// Odčítání bez přechodu: a-b kde a%10 >= b%10 (žádné půjčování)
// Příklady: 8-3=5, 15-4=11, 29-6=23
function genSubNoRegroup(): { a: number; b: number; ans: number } {
  const a = ri(5, 29)
  const aUnits = a % 10
  const b = ri(1, Math.max(1, aUnits === 0 ? 0 : aUnits - 1))
  // pokud aUnits=0, přeskočíme na jiný příklad
  if (aUnits === 0) return genSubNoRegroup()
  return { a, b, ans: a - b }
}

// Odčítání s přechodem: a-b kde a%10 < b%10 (půjčování nutné)
// Příklady: 12-7=5, 23-8=15, 30-4=26
function genSubRegroup(): { a: number; b: number; ans: number } {
  let a: number, b: number
  let attempts = 0
  do {
    a = ri(11, 30)
    const aUnits = a % 10
    // b musí mít více jednotek než a (pak je nutné půjčení)
    const minBUnits = aUnits + 1
    if (minBUnits > 9) { attempts++; continue }
    b = ri(minBUnits, 9)
    attempts++
  } while (attempts < 20)
  if (!b!) b = 7  // fallback
  return { a, b, ans: a - b }
}

// Násobilka 2, 5, 10 — vzorové tabulky s pravidelným rytmem
function genMulEasy(): { a: number; b: number; ans: number } {
  const tables = [2, 5, 10]
  const a = tables[Math.floor(Math.random() * tables.length)]
  const b = ri(2, 10)
  return { a, b, ans: a * b }
}

// Násobilka 3, 4, 6 — odvozené tabulky
function genMulMedium(): { a: number; b: number; ans: number } {
  const tables = [3, 4, 6]
  const a = tables[Math.floor(Math.random() * tables.length)]
  const b = ri(2, 10)
  return { a, b, ans: a * b }
}

// Násobilka 7, 8, 9 — vyžadují pamětní znalost
function genMulHard(): { a: number; b: number; ans: number } {
  const tables = [7, 8, 9]
  const a = tables[Math.floor(Math.random() * tables.length)]
  const b = ri(2, 9)
  return { a, b, ans: a * b }
}

// Smart distraktory reflektují typické chyby pro danou strukturu
function smartDistractors(correct: number, skillId: MathSkillId, a?: number): number[] {
  const cands = new Set<number>()

  // Obecné: ±1 (off-by-one)
  if (correct + 1 <= 50) cands.add(correct + 1)
  if (correct - 1 > 0) cands.add(correct - 1)

  if (skillId === 'add_regroup' || skillId === 'add_sub_mix') {
    // Typická chyba: ignorování přenosu — hráč sečte jen jednotky
    // Např. 7+5: místo 12 napíše 2 (jen 7+5 mod 10). Přidáme jako distraktor.
    if (correct - 10 > 0) cands.add(correct - 10)
  }

  if (skillId === 'sub_regroup' || skillId === 'add_sub_mix') {
    // Typická chyba: odečte naopak (menší od většího v jednotkách)
    // Např. 12-7: místo 5 hráč spočítá 7-2=5... nebo 12-7 jako 2-7→7-2=5, to je shoda
    // Reálnější: výsledek o 10 větší (zapomene půjčit)
    if (correct + 10 <= 50) cands.add(correct + 10)
  }

  if (skillId === 'complements_10') {
    // Typická chyba: o 1 vedle doplňku (3+8 místo 3+7)
    cands.add(correct + 1)
    if (correct - 1 > 0) cands.add(correct - 1)
  }

  if (skillId === 'mul_easy' || skillId === 'mul_medium' || skillId === 'mul_hard') {
    // Typická chyba 1: sčítání místo násobení (a + b místo a × b)
    if (a !== undefined) cands.add(a + (correct / a))  // přidá a+b (pokud b = correct/a)
    // Typická chyba 2: o jeden řádek tabulky (zapomněl ±1 v násobiteli)
    if (a !== undefined && correct + a <= 100) cands.add(correct + a)
    if (a !== undefined && correct - a > 0)    cands.add(correct - a)
  }

  cands.delete(correct)
  const arr = [...cands].filter(n => n > 0)

  // Doplnění pokud stále nemáme 2 distraktory
  let offset = 2
  while (arr.length < 2 && offset < 15) {
    const c = correct + offset
    if (!arr.includes(c) && c !== correct) arr.push(c)
    offset++
  }

  return shuffle(arr).slice(0, 2)
}

export function generateSkillTask(skillId: MathSkillId): Task {
  let a: number, b: number, ans: number, question: string

  switch (skillId) {
    case 'add_no_regroup': {
      ;({ a, b, ans } = genAddNoRegroup())
      question = `${a} + ${b} = ?`
      break
    }
    case 'complements_10': {
      ;({ a, b, ans } = genComplements10())
      // Někdy ptej se na chybějící číslo, ne jen na výsledek
      if (Math.random() < 0.5) {
        question = `${a} + ? = 10`
        // correctAnswer = b, ale options musí být čísla
        return {
          id: uid(), type: 'math', skillId,
          question,
          options: shuffle([b, ...smartDistractors(b, skillId)]),
          correctAnswer: b,
        }
      }
      question = `${a} + ${b} = ?`
      break
    }
    case 'add_regroup': {
      ;({ a, b, ans } = genAddRegroup())
      question = `${a} + ${b} = ?`
      break
    }
    case 'sub_no_regroup': {
      ;({ a, b, ans } = genSubNoRegroup())
      question = `${a} − ${b} = ?`
      break
    }
    case 'sub_regroup': {
      ;({ a, b, ans } = genSubRegroup())
      question = `${a} − ${b} = ?`
      break
    }
    case 'add_sub_mix': {
      const isAdd = Math.random() > 0.4
      if (isAdd) {
        ;({ a, b, ans } = Math.random() > 0.5 ? genAddRegroup() : genAddNoRegroup())
        question = `${a} + ${b} = ?`
      } else {
        ;({ a, b, ans } = Math.random() > 0.5 ? genSubRegroup() : genSubNoRegroup())
        question = `${a} − ${b} = ?`
      }
      break
    }
    case 'mul_easy': {
      ;({ a, b, ans } = genMulEasy())
      question = `${a} × ${b} = ?`
      break
    }
    case 'mul_medium': {
      ;({ a, b, ans } = genMulMedium())
      question = `${a} × ${b} = ?`
      break
    }
    case 'mul_hard': {
      ;({ a, b, ans } = genMulHard())
      question = `${a} × ${b} = ?`
      break
    }
  }

  // Násobilka předá `a` pro chytřejší distraktory (řádek tabulky)
  const isMul = skillId === 'mul_easy' || skillId === 'mul_medium' || skillId === 'mul_hard'
  const taskType = isMul ? 'mathMultiply' : 'math'

  return {
    id: uid(), type: taskType, skillId,
    question: question!,
    options: shuffle([ans!, ...smartDistractors(ans!, skillId, isMul ? a : undefined)]),
    correctAnswer: ans!,
  }
}

// ---------------------------------------------------------------------------
// Lang task generators
// ---------------------------------------------------------------------------

const VOWELS = ['A', 'E', 'I', 'O', 'U']
const CONSONANTS = ['B', 'D', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z']

function genMissingLetter(skillId: LangSkillId): Task {
  const diff = skillId === 'letter_missing_easy' ? 'easy' : 'hard'
  const pool = LANG_WORDS.filter(w => isAsciiWord(w.word) && w.difficulty === diff)
  const word = pool[Math.floor(Math.random() * pool.length)]
  const letters = word.word.toUpperCase().split('')
  const pos = Math.floor(Math.random() * letters.length)
  const correct = letters[pos]
  const question = letters.map((l, i) => i === pos ? '_' : l).join('')
  const letterPool = VOWELS.includes(correct) ? VOWELS : CONSONANTS
  const wrongs = shuffle(letterPool.filter(l => l !== correct)).slice(0, 3)
  return {
    id: uid(), type: 'missingLetter', skillId,
    question,
    options: shuffle([correct, ...wrongs]),
    correctAnswer: correct,
  }
}

function genDiacritics(skillId: LangSkillId): Task {
  const diff = skillId === 'diacritics_basic' ? 'easy' : 'hard'
  const pool = LANG_WORDS.filter(w => w.diacritics && w.difficulty === diff)
  const word = pool[Math.floor(Math.random() * pool.length)]
  const { correct, wrong } = word.diacritics!
  return {
    id: uid(), type: 'diacritics', skillId,
    question: 'Správný tvar?',
    options: shuffle([correct, ...wrong]),
    correctAnswer: correct,
  }
}

function genWordOrder(skillId: LangSkillId): Task {
  const diff = skillId === 'word_order_short' ? 'easy' : 'hard'
  const pool = LANG_WORDS.filter(w => isAsciiWord(w.word) && w.difficulty === diff)
  const word = pool[Math.floor(Math.random() * pool.length)]
  const correct = word.word.toUpperCase()
  const letters = correct.split('')
  let shuffled = shuffle([...letters])
  let attempts = 0
  while (shuffled.join('') === correct && attempts < 5) {
    shuffled = shuffle([...letters])
    attempts++
  }
  return {
    id: uid(), type: 'wordOrder', skillId,
    question: 'Seřaď písmena do slova',
    letters: shuffled,
    correctAnswer: correct,
  }
}

export function generateLangTask(skillId: LangSkillId): Task {
  switch (skillId) {
    case 'letter_missing_easy':
    case 'letter_missing_hard':
      return genMissingLetter(skillId)
    case 'diacritics_basic':
    case 'diacritics_hard':
      return genDiacritics(skillId)
    case 'word_order_short':
    case 'word_order_long':
      return genWordOrder(skillId)
  }
}

// ---------------------------------------------------------------------------
// ZPD výběr dovednosti
// ---------------------------------------------------------------------------

// domain: 'add_sub' pro task type 'math', 'multiply' pro 'mathMultiply'
export function selectSkill(progress: StudentProgress, domain: 'add_sub' | 'multiply' = 'add_sub'): MathSkillId {
  const domainIds = SKILL_DOMAINS[domain]
  const unlocked = SKILL_TREE.filter(s => domainIds.includes(s.id) && progress[s.id].unlocked)
  const fallback = domain === 'multiply' ? 'mul_easy' : 'add_no_regroup'
  if (unlocked.length === 0) return fallback

  // 25 % šance na opakování zvládnuté dovednosti (upevnění paměti)
  const mastered = unlocked.filter(s => progress[s.id].mastery > 0.75)
  if (mastered.length > 0 && Math.random() < 0.25) {
    return mastered[Math.floor(Math.random() * mastered.length)].id
  }

  // ZPD zóna: aktivní učení (0.2–0.75)
  const zpd = unlocked.filter(s => {
    const m = progress[s.id].mastery
    return m >= 0.2 && m <= 0.75
  })
  if (zpd.length > 0) {
    return zpd[Math.floor(Math.random() * zpd.length)].id
  }

  // Záloha: nejméně zvládnutá odemčená dovednost
  return [...unlocked].sort((a, b) => progress[a.id].mastery - progress[b.id].mastery)[0].id
}

export function selectLangSkill(
  progress: StudentProgress,
  domain: 'missing_letter' | 'diacritics' | 'word_order',
): LangSkillId {
  const domainIds = LANG_SKILL_DOMAINS[domain]
  const unlocked = LANG_SKILL_TREE.filter(s => domainIds.includes(s.id) && progress[s.id]?.unlocked)
  const fallbacks: Record<typeof domain, LangSkillId> = {
    missing_letter: 'letter_missing_easy',
    diacritics:     'diacritics_basic',
    word_order:     'word_order_short',
  }
  if (unlocked.length === 0) return fallbacks[domain]

  const mastered = unlocked.filter(s => progress[s.id].mastery > 0.75)
  if (mastered.length > 0 && Math.random() < 0.25) {
    return mastered[Math.floor(Math.random() * mastered.length)].id
  }

  const zpd = unlocked.filter(s => {
    const m = progress[s.id].mastery
    return m >= 0.2 && m <= 0.75
  })
  if (zpd.length > 0) {
    return zpd[Math.floor(Math.random() * zpd.length)].id
  }

  return [...unlocked].sort((a, b) => progress[a.id].mastery - progress[b.id].mastery)[0].id
}

// ---------------------------------------------------------------------------
// Aktualizace zvládnutí (asymetrická křivka učení)
// ---------------------------------------------------------------------------

export function updateMastery(current: number, isCorrect: boolean): number {
  const next = isCorrect
    ? current + (1 - current) * 0.1   // nárůst se zpomaluje blíže k 1.0
    : current * 0.85                   // pokles je rychlejší (nutnost opakování)
  return Math.min(1, Math.max(0, next))
}

// ---------------------------------------------------------------------------
// Odemykání dovedností podle prerekvizit
// ---------------------------------------------------------------------------

export function checkUnlocks(progress: StudentProgress): StudentProgress {
  let updated = false
  const next = { ...progress }

  for (const skill of SKILL_TREE) {
    if (next[skill.id].unlocked) continue
    const prereqsMet = skill.prerequisites.every(
      p => next[p.id].mastery >= p.minMastery
    )
    if (prereqsMet) {
      next[skill.id] = { ...next[skill.id], unlocked: true }
      updated = true
    }
  }

  for (const skill of LANG_SKILL_TREE) {
    if (next[skill.id]?.unlocked) continue
    const prereqsMet = skill.prerequisites.every(
      p => (next[p.id]?.mastery ?? 0) >= p.minMastery
    )
    if (prereqsMet) {
      next[skill.id] = { ...(next[skill.id] ?? { mastery: 0, unlocked: false, attempts: 0, lastPracticed: 0 }), unlocked: true }
      updated = true
    }
  }

  return updated ? next : progress
}

// ---------------------------------------------------------------------------
// Počáteční stav
// ---------------------------------------------------------------------------

export function createInitialProgress(): StudentProgress {
  const progress: Partial<StudentProgress> = {}
  for (const skill of SKILL_TREE) {
    progress[skill.id] = { mastery: 0, unlocked: skill.prerequisites.length === 0, attempts: 0, lastPracticed: 0 } satisfies SkillState
  }
  for (const skill of LANG_SKILL_TREE) {
    progress[skill.id] = { mastery: 0, unlocked: skill.prerequisites.length === 0, attempts: 0, lastPracticed: 0 } satisfies SkillState
  }
  return progress as StudentProgress
}

// ---------------------------------------------------------------------------
// Křivka zapomínání (pasivní, bez notifikací)
// ---------------------------------------------------------------------------
// Mastery klesá o ~3 % za den bez praxe. Po 7 dnech: 0.85 → ~0.67 (zpět v ZPD).
// Floor 0.05 — dítě nikdy nezapomene vše. Cap 30 dní — delší absence = stejný efekt.

const DECAY_RATE = 0.97   // koeficient poklesu za den
const DECAY_MAX_DAYS = 30 // maximální počet dní pro výpočet
const DECAY_FLOOR = 0.05  // minimum mastery po poklesu

export function applyMasteryDecay(progress: StudentProgress, now = Date.now()): StudentProgress {
  const MS_PER_DAY = 86_400_000
  let changed = false
  const next = { ...progress }

  for (const skillId of Object.keys(progress) as (MathSkillId | LangSkillId)[]) {
    const skill = progress[skillId]
    if (!skill.unlocked) continue
    const last = skill.lastPracticed ?? 0
    if (last === 0) continue // nikdy necvičeno → žádný decay

    const daysSince = Math.min(DECAY_MAX_DAYS, (now - last) / MS_PER_DAY)
    if (daysSince < 0.5) continue // méně než 12 hodin → skip

    const decayed = Math.max(DECAY_FLOOR, skill.mastery * Math.pow(DECAY_RATE, daysSince))
    if (Math.abs(decayed - skill.mastery) > 0.001) {
      next[skillId] = { ...skill, mastery: decayed }
      changed = true
    }
  }

  return changed ? next : progress
}
