// tests/tasks.test.ts
import { describe, it, expect } from 'vitest'
import {
  generateCountingTask,
  generateTapNumberTask,
  generateCompareTask,
  generateMultiChoiceTask,
  generateMathTask,
  generateDragDropTask,
  generateFindTask,
  generateEngPictureTask,
  generateEngWordTask,
} from '../src/data/tasks'

const RANGE: [number, number] = [1, 5]

describe('generateCountingTask', () => {
  it('returns correct type', () => {
    const t = generateCountingTask(RANGE, 'forest')
    expect(t.type).toBe('counting')
  })
  it('visualCount is within range', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateCountingTask(RANGE, 'forest')
      expect(t.visualCount).toBeGreaterThanOrEqual(1)
      expect(t.visualCount).toBeLessThanOrEqual(5)
    }
  })
  it('options contain correctAnswer', () => {
    const t = generateCountingTask(RANGE, 'forest')
    expect(t.options).toContain(t.correctAnswer)
  })
  it('has 3 options', () => {
    const t = generateCountingTask(RANGE, 'forest')
    expect(t.options).toHaveLength(3)
  })
})

describe('generateTapNumberTask', () => {
  it('returns correct type', () => {
    expect(generateTapNumberTask(RANGE).type).toBe('tapNumber')
  })
  it('options contain correctAnswer', () => {
    const t = generateTapNumberTask(RANGE)
    expect(t.options).toContain(t.correctAnswer)
  })
})

describe('generateCompareTask', () => {
  it('returns correct type', () => {
    expect(generateCompareTask(RANGE).type).toBe('compare')
  })
  it('correctAnswer is the larger of the two options', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateCompareTask(RANGE)
      const max = Math.max(...(t.options as number[]))
      expect(Number(t.correctAnswer)).toBe(max)
    }
  })
  it('two options are never equal', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateCompareTask(RANGE)
      expect(t.options![0]).not.toBe(t.options![1])
    }
  })
})

describe('generateMathTask', () => {
  it('returns correct type', () => {
    expect(generateMathTask(RANGE).type).toBe('math')
  })
  it('correctAnswer is within valid range', () => {
    for (let i = 0; i < 30; i++) {
      const t = generateMathTask([1, 10])
      expect(Number(t.correctAnswer)).toBeGreaterThanOrEqual(0)
      expect(Number(t.correctAnswer)).toBeLessThanOrEqual(20)
    }
  })
  it('has 3 options', () => {
    expect(generateMathTask(RANGE).options).toHaveLength(3)
  })
})

describe('generateDragDropTask', () => {
  it('returns correct type', () => {
    expect(generateDragDropTask(RANGE, 'forest').type).toBe('dragDrop')
  })
  it('dragTarget matches correctAnswer', () => {
    const t = generateDragDropTask(RANGE, 'forest')
    expect(t.dragTarget).toBe(Number(t.correctAnswer))
  })
})

describe('generateFindTask', () => {
  it('returns correct type', () => {
    expect(generateFindTask(RANGE).type).toBe('find')
  })
  it('options contain correctAnswer', () => {
    const t = generateFindTask(RANGE)
    expect(t.options).toContain(t.correctAnswer)
  })
})

describe('generateEngPictureTask', () => {
  it('returns correct type', () => {
    expect(generateEngPictureTask([1, 10], 'library').type).toBe('engPicture')
  })
  it('has 3 options', () => {
    const t = generateEngPictureTask([1, 10], 'library')
    expect(t.options).toHaveLength(3)
  })
  it('options contain correctAnswer', () => {
    const t = generateEngPictureTask([1, 10], 'library')
    expect(t.options).toContain(t.correctAnswer)
  })
  it('all options are distinct', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateEngPictureTask([1, 10], 'library')
      const unique = new Set(t.options)
      expect(unique.size).toBe(3)
    }
  })
  it('has objects array with one emoji', () => {
    const t = generateEngPictureTask([1, 10], 'library')
    expect(t.objects).toHaveLength(1)
    expect(typeof t.objects![0]).toBe('string')
  })
})

describe('generateEngWordTask', () => {
  it('returns correct type', () => {
    expect(generateEngWordTask([1, 10], 'library').type).toBe('engWord')
  })
  it('has 4 options', () => {
    const t = generateEngWordTask([1, 10], 'library')
    expect(t.options).toHaveLength(4)
  })
  it('options contain correctAnswer', () => {
    const t = generateEngWordTask([1, 10], 'library')
    expect(t.options).toContain(t.correctAnswer)
  })
  it('all options are distinct', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateEngWordTask([1, 10], 'library')
      const unique = new Set(t.options)
      expect(unique.size).toBe(4)
    }
  })
})
