// src/data/runnerGenerators.ts
// Runner task generators — one function per question category.
// Each always returns exactly 3 options (RUNNER_CONFIG.laneCount).

import { Task } from './types'
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

/** Generates arithmetic expression (add/subtract) with 3 answer choices. */
export function generateRunnerMath(range: [number, number]): Task {
  const [, max] = range
  const isAdd = Math.random() > 0.4
  let question: string
  let correct: number

  if (isAdd) {
    const a = ri(1, Math.max(1, Math.floor(max * 0.7)))
    const b = ri(1, Math.max(1, max - a))
    correct = a + b
    question = `${a} + ${b} = ?`
  } else {
    const a = ri(2, max)
    const b = ri(1, a - 1)
    correct = a - b
    question = `${a} − ${b} = ?`
  }

  const w1 = correct < max * 2 ? correct + 1 : correct - 1
  let w2 = correct > 2 ? correct - 2 : correct + 3
  if (w2 === w1) w2 = correct + 2

  return {
    id: uid(),
    type: 'runner',
    question,
    options: shuffle([correct, w1, w2]),
    correctAnswer: correct,
  }
}

/** Generates "which number is biggest?" with 3 distinct numbers as options. */
export function generateRunnerCompare(range: [number, number]): Task {
  const [min, max] = range
  const nums = new Set<number>()
  let attempts = 0
  while (nums.size < 3 && attempts < 30) {
    nums.add(ri(min, max))
    attempts++
  }
  // fallback: ensure 3 distinct values
  while (nums.size < 3) nums.add(Math.max(...nums) + 1)

  const options = shuffle([...nums]) as number[]
  const correct = Math.max(...options)

  return {
    id: uid(),
    type: 'runner',
    question: 'Které číslo je největší?',
    options,
    correctAnswer: correct,
  }
}

const VOWELS = ['A', 'E', 'I', 'O', 'U']
const CONSONANTS = ['B', 'D', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'Z']

/** Generates a missing-letter question with exactly 3 letter choices. */
export function generateRunnerLanguage(): Task {
  const pool = LANG_WORDS.filter(w => isAsciiWord(w.word))
  const word = pool[Math.floor(Math.random() * pool.length)]
  const letters = word.word.toUpperCase().split('')
  const pos = Math.floor(Math.random() * letters.length)
  const correct = letters[pos]
  const question = letters.map((l, i) => (i === pos ? '_' : l)).join('')
  const letterPool = VOWELS.includes(correct) ? VOWELS.filter(l => l !== correct) : CONSONANTS.filter(l => l !== correct)
  const wrongs = shuffle(letterPool).slice(0, 2)

  return {
    id: uid(),
    type: 'runner',
    question,
    options: shuffle([correct, wrongs[0], wrongs[1]]),
    correctAnswer: correct,
  }
}
