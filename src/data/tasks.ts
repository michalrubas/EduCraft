// src/data/tasks.ts
import { Task, TaskType, Biome } from './types'
import { ENG_WORDS } from './engWords'

const ENG_POOL = ENG_WORDS.filter(w => w.difficulty === 'easy')

const BIOME_OBJECTS: Record<Biome, string[]> = {
  forest: ['🌾', '🪵', '🍎', '🐑', '🐄', '🍄'],
  cave:   ['💎', '⛏️', '🪨', '🥇', '🦇', '🪔'],
  snow:   ['🧊', '❄️', '🐺', '🐟', '⛄', '🎣'],
  desert: ['🐪', '🌵', '🐍', '🦂', '🏺', '☀️'],
  ocean:  ['🐬', '🐟', '🐚', '🦀', '🦈', '⚓'],
  jungle: ['🦜', '🍌', '🐒', '🐆', '🥭', '🐍'],
  tnt:    ['/assets/blocks/Tnt.PNG'], 
  nether: ['🔥', '💀', '🧱', '⚡', '🌋', '🐷'],
  end:    ['💹', '🔅', '❗️', '❓', '🔱', '⻰'],
  village: ['🏠', '🌻', '🐓', '🌾', '🪵', '🐄'],
  castle:  ['🏰', '⚔️', '🛡️', '🗝️', '👑', '🐉'],
  graveyard: ['💀', '👻', '🕷️', '🦇', '🪦', '🌑'],
  library:   ['📚', '📖', '🪄', '🔮', '✨', '🕯️'],
  diamond_cave: ['💎', '⛏️', '🪨', '💠', '🔷', '🪙'],
  axolotl:   ['🦎', '🐠', '🪸', '🫧', '🐚', '🌊'],
  mushroom:   ['🍄', '🐄', '🌺', '🪵', '🟤', '🌿'],
  bedrock:    ['🪨', '🔥', '💀', '⚡', '🧱', '🌋'],
}

function ri(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9)
}

function fourOptions(correct: number, min: number, max: number): number[] {
  const set = new Set<number>([correct])
  const offsets = [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7]
  for (const off of offsets) {
    const n = correct + off
    if (n >= min && n <= max) set.add(n)
    if (set.size >= 4) break
  }
  // Range too narrow — fill from any value in range
  for (let n = min; n <= max && set.size < 4; n++) set.add(n)
  return shuffle([...set])
}

export function generateCountingTask(range: [number, number], biome: string): Task {
  const [min, max] = range
  const count = ri(min, max)
  const objs = BIOME_OBJECTS[biome as Biome] ?? BIOME_OBJECTS.forest
  const obj = objs[ri(0, objs.length - 1)]
  return {
    id: uid(),
    type: 'counting',
    question: 'Kolik věciček vidíš?',
    visualCount: count,
    objects: Array(count).fill(obj),
    options: fourOptions(count, min, max),
    correctAnswer: count,
  }
}

export function generateTapNumberTask(range: [number, number]): Task {
  const [min, max] = range
  const target = ri(min, max)
  const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const distractors = shuffle(pool.filter(n => n !== target)).slice(0, Math.min(5, pool.length - 1))
  return {
    id: uid(),
    type: 'tapNumber',
    question: `Najdi číslo ${target}!`,
    options: shuffle([target, ...distractors]),
    correctAnswer: target,
  }
}

export function generateCompareTask(range: [number, number]): Task {
  const [min, max] = range
  let a = ri(min, max)
  let b = ri(min, max)
  let attempts = 0
  while (a === b && attempts < 20) { b = ri(min, max); attempts++ }
  if (a === b) b = a < max ? a + 1 : a - 1
  return {
    id: uid(),
    type: 'compare',
    question: 'Které číslo je větší?',
    options: [a, b],
    correctAnswer: Math.max(a, b),
  }
}

export function generateWhereMoreTask(_range: [number, number], biome: string): Task {
  const objs = BIOME_OBJECTS[biome as Biome] ?? BIOME_OBJECTS.forest
  const obj = objs[ri(0, objs.length - 1)]
  const a = ri(2, 9)
  let b: number
  if (Math.random() < 0.25) {
    b = a
  } else {
    do { b = ri(2, 9) } while (b === a)
  }
  const correct = a > b ? '>' : a < b ? '<' : '='
  return {
    id: uid(),
    type: 'whereMore',
    question: 'Kde je víc?',
    objects: Array(a).fill(obj),
    objectsB: Array(b).fill(obj),
    options: ['<', '=', '>'],
    correctAnswer: correct,
  }
}

export function generateMultiChoiceTask(range: [number, number], biome: string): Task {
  const [min, max] = range
  const count = ri(min, max)
  const objs = BIOME_OBJECTS[biome as Biome] ?? BIOME_OBJECTS.forest
  const obj = objs[ri(0, objs.length - 1)]
  return {
    id: uid(),
    type: 'multiChoice',
    question: 'Kolik je to?',
    visualCount: count,
    objects: Array(count).fill(obj),
    options: fourOptions(count, min, max),
    correctAnswer: count,
  }
}

export function generateMathTask(range: [number, number]): Task {
  const [, max] = range
  const isAdd = Math.random() > 0.4
  if (isAdd) {
    const a = ri(1, Math.max(1, Math.floor(max * 0.7)))
    const b = ri(1, Math.max(1, max - a))
    const ans = a + b
    return {
      id: uid(), type: 'math',
      question: `${a} + ${b} = ?`,
      options: fourOptions(ans, 1, max * 2),
      correctAnswer: ans,
    }
  } else {
    const a = ri(2, max)
    const b = ri(1, a - 1)
    const ans = a - b
    return {
      id: uid(), type: 'math',
      question: `${a} − ${b} = ?`,
      options: fourOptions(ans, 0, max),
      correctAnswer: ans,
    }
  }
}

const MAX_DRAG_TARGET = 6

export function generateDragDropTask(range: [number, number], biome: string): Task {
  const [min, max] = range
  // Clamp both ends so ri() always receives min ≤ max
  const cappedMin = Math.min(min, MAX_DRAG_TARGET)
  const cappedMax = Math.min(max, MAX_DRAG_TARGET)
  const target = ri(cappedMin, cappedMax)
  const objs = BIOME_OBJECTS[biome as Biome] ?? BIOME_OBJECTS.forest
  const obj = objs[ri(0, objs.length - 1)]
  const poolSize = target + 2  // always exactly 2 extras, pool > target guaranteed
  const isUrl = obj.startsWith('/') || obj.startsWith('http')
  return {
    id: uid(),
    type: 'dragDrop',
    question: isUrl ? `Přetáhni ${target} kostek do košíku` : `Přetáhni ${target}× ${obj} do košíku`,
    dragTarget: target,
    visualCount: target,
    objects: Array(poolSize).fill(obj),
    correctAnswer: target,
  }
}

export function generateFindTask(range: [number, number]): Task {
  const [min, max] = range
  const target = ri(min, max)
  const gridSize = ri(5, 10)
  const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const distractors = shuffle(pool.filter(n => n !== target)).slice(0, Math.min(gridSize - 1, pool.length - 1))
  return {
    id: uid(),
    type: 'find',
    question: `Najdi číslo ${target}`,
    options: shuffle([target, ...distractors]),
    correctAnswer: target,
  }
}

export function generateEngPictureTask(_range: [number, number], _biome: string): Task {
  const idx = ri(0, ENG_POOL.length - 1)
  const word = ENG_POOL[idx]
  const others = ENG_POOL.filter((_, i) => i !== idx)
  const distractors = shuffle(others).slice(0, 3).map(w => w.english)
  return {
    id: uid(),
    type: 'engPicture',
    question: 'Co je to anglicky?',
    objects: [word.emoji],
    options: shuffle([word.english, ...distractors]),
    correctAnswer: word.english,
  }
}

export function generateEngWordTask(_range: [number, number], _biome: string): Task {
  const idx = ri(0, ENG_POOL.length - 1)
  const word = ENG_POOL[idx]
  const others = ENG_POOL.filter((_, i) => i !== idx)
  const distractors = shuffle(others).slice(0, 3).map(w => w.emoji)
  return {
    id: uid(),
    type: 'engWord',
    question: word.english,
    options: shuffle([word.emoji, ...distractors]),
    correctAnswer: word.emoji,
  }
}

export type TaskGenerator = (range: [number, number], biome: string) => Task

export const TASK_GENERATORS: Record<TaskType, TaskGenerator> = {
  counting:      (r, b) => generateCountingTask(r, b),
  tapNumber:     (r)    => generateTapNumberTask(r),
  compare:       (r)    => generateCompareTask(r),
  whereMore:     (r, b) => generateWhereMoreTask(r, b),
  multiChoice:   (r, b) => generateMultiChoiceTask(r, b),
  math:          (r)    => generateMathTask(r),
  dragDrop:      (r, b) => generateDragDropTask(r, b),
  find:          (r)    => generateFindTask(r),
  // mathMultiply se generuje přes skill systém v useTask; toto je fallback
  mathMultiply:  (r)    => generateMathTask(r),
  // Lang task types are dispatched via generateLangTask() in useTask.ts — these are never called
  missingLetter: () => { throw new Error('missingLetter: use generateLangTask()') },
  diacritics:    () => { throw new Error('diacritics: use generateLangTask()') },
  wordOrder:     () => { throw new Error('wordOrder: use generateLangTask()') },
  // runner is routed explicitly in useTask.ts — this stub satisfies the Record type
  runner:        () => { throw new Error('runner: use routing in useTask.ts') },
  engPicture:    (r, b) => generateEngPictureTask(r, b),
  engWord:       (r, b) => generateEngWordTask(r, b),
}
