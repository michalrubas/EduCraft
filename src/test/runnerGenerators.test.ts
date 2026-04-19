import { describe, it, expect } from 'vitest'
import {
  generateRunnerMath,
  generateRunnerCompare,
  generateRunnerLanguage,
} from '../data/runnerGenerators'

describe('generateRunnerMath', () => {
  it('returns a runner task with exactly 3 options', () => {
    const task = generateRunnerMath([1, 10])
    expect(task.type).toBe('runner')
    expect(task.options).toHaveLength(3)
    expect(task.question).toMatch(/[+−×]/)
  })

  it('correctAnswer is one of the options', () => {
    for (let i = 0; i < 20; i++) {
      const task = generateRunnerMath([1, 20])
      expect(task.options).toContain(task.correctAnswer)
    }
  })
})

describe('generateRunnerCompare', () => {
  it('returns a runner task with exactly 3 distinct options', () => {
    const task = generateRunnerCompare([5, 30])
    expect(task.type).toBe('runner')
    expect(task.options).toHaveLength(3)
    const unique = new Set(task.options)
    expect(unique.size).toBe(3)
  })

  it('correctAnswer is the largest option', () => {
    for (let i = 0; i < 20; i++) {
      const task = generateRunnerCompare([1, 50])
      const max = Math.max(...(task.options as number[]))
      expect(task.correctAnswer).toBe(max)
    }
  })
})

describe('generateRunnerLanguage', () => {
  it('returns a runner task with exactly 3 options', () => {
    const task = generateRunnerLanguage()
    expect(task.type).toBe('runner')
    expect(task.options).toHaveLength(3)
  })

  it('correctAnswer is one of the options', () => {
    for (let i = 0; i < 20; i++) {
      const task = generateRunnerLanguage()
      expect(task.options).toContain(task.correctAnswer)
    }
  })
})
