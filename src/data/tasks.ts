// src/data/tasks.ts
import { Task, TaskType, Biome } from './types'

const BIOME_OBJECTS: Record<Biome, string[]> = {
  forest: ['🌾', '🪵', '🍎', '🐑', '🐄', '🍄'],   // wheat, log, apple, sheep, cow, mushroom
  cave:   ['💎', '⛏️', '🪨', '🥇', '🦇', '🪔'],   // diamond, pickaxe, stone, gold, bat, lantern
  snow:   ['🧊', '❄️', '🐺', '🐟', '⛄', '🎣'],    // ice, snowflake, wolf, fish, snowman, rod
  nether: ['🔥', '💀', '🧱', '⚡', '🌋', '🐷'],    // fire, skull, brick, blaze, lava, piglin
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

function threeOptions(correct: number, min: number, max: number): number[] {
  const w1 = correct < max ? correct + 1 : correct - 1
  let w2 = correct > min + 1 ? correct - 2 : correct + 2
  if (w2 === w1) w2 = correct + 3 <= max ? correct + 3 : correct - 3
  return shuffle([correct, w1, w2])
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
    options: threeOptions(count, min, max),
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
    options: threeOptions(count, min, max),
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
      options: threeOptions(ans, 1, max * 2),
      correctAnswer: ans,
    }
  } else {
    const a = ri(2, max)
    const b = ri(1, a - 1)
    const ans = a - b
    return {
      id: uid(), type: 'math',
      question: `${a} − ${b} = ?`,
      options: threeOptions(ans, 0, max),
      correctAnswer: ans,
    }
  }
}

export function generateDragDropTask(range: [number, number], biome: string): Task {
  const [min, max] = range
  const target = ri(min, max)
  const objs = BIOME_OBJECTS[biome as Biome] ?? BIOME_OBJECTS.forest
  const obj = objs[ri(0, objs.length - 1)]
  const poolSize = Math.min(target + 2, 8)
  return {
    id: uid(),
    type: 'dragDrop',
    question: `Přetáhni ${target}× ${obj} do košíku`,
    dragTarget: target,
    visualCount: target,
    objects: Array(poolSize).fill(obj),
    correctAnswer: target,
  }
}

export function generateFindTask(range: [number, number]): Task {
  const [min, max] = range
  const target = ri(min, max)
  const gridSize = ri(4, 9)
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

export type TaskGenerator = (range: [number, number], biome: string) => Task

export const TASK_GENERATORS: Record<TaskType, TaskGenerator> = {
  counting:    (r, b) => generateCountingTask(r, b),
  tapNumber:   (r)    => generateTapNumberTask(r),
  compare:     (r)    => generateCompareTask(r),
  multiChoice: (r, b) => generateMultiChoiceTask(r, b),
  math:        (r)    => generateMathTask(r),
  dragDrop:    (r, b) => generateDragDropTask(r, b),
  find:        (r)    => generateFindTask(r),
}
