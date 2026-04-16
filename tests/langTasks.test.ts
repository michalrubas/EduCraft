// tests/langTasks.test.ts
import { describe, it, expect } from 'vitest'
import { generateLangTask, selectLangSkill, createInitialProgress } from '../src/data/skills'

// missingLetter
describe('generateLangTask(letter_missing_easy)', () => {
  it('returns type missingLetter', () => {
    expect(generateLangTask('letter_missing_easy').type).toBe('missingLetter')
  })
  it('question contains underscore', () => {
    for (let i = 0; i < 10; i++) {
      expect(generateLangTask('letter_missing_easy').question).toContain('_')
    }
  })
  it('options contain correctAnswer', () => {
    for (let i = 0; i < 10; i++) {
      const t = generateLangTask('letter_missing_easy')
      expect(t.options).toContain(t.correctAnswer)
    }
  })
  it('has 4 options', () => {
    expect(generateLangTask('letter_missing_easy').options).toHaveLength(4)
  })
  it('correctAnswer is a single uppercase letter', () => {
    for (let i = 0; i < 10; i++) {
      const t = generateLangTask('letter_missing_easy')
      expect(typeof t.correctAnswer).toBe('string')
      expect((t.correctAnswer as string)).toHaveLength(1)
      expect((t.correctAnswer as string)).toMatch(/[A-Z]/)
    }
  })
})

// diacritics
describe('generateLangTask(diacritics_basic)', () => {
  it('returns type diacritics', () => {
    expect(generateLangTask('diacritics_basic').type).toBe('diacritics')
  })
  it('options contain correctAnswer', () => {
    for (let i = 0; i < 10; i++) {
      const t = generateLangTask('diacritics_basic')
      expect(t.options).toContain(t.correctAnswer)
    }
  })
  it('has 3 options', () => {
    expect(generateLangTask('diacritics_basic').options).toHaveLength(3)
  })
})

// wordOrder
describe('generateLangTask(word_order_short)', () => {
  it('returns type wordOrder', () => {
    expect(generateLangTask('word_order_short').type).toBe('wordOrder')
  })
  it('letters contain same chars as correctAnswer', () => {
    for (let i = 0; i < 20; i++) {
      const t = generateLangTask('word_order_short')
      const sorted = (t.letters as string[]).sort().join('')
      const expected = (t.correctAnswer as string).split('').sort().join('')
      expect(sorted).toBe(expected)
    }
  })
  it('has no options field', () => {
    expect(generateLangTask('word_order_short').options).toBeUndefined()
  })
  it('letters field is defined', () => {
    expect(generateLangTask('word_order_short').letters).toBeDefined()
  })
})

// selectLangSkill
describe('selectLangSkill', () => {
  it('returns fallback when no skills unlocked', () => {
    const progress = createInitialProgress()
    // lock everything manually
    const locked = { ...progress }
    locked['letter_missing_easy'] = { ...locked['letter_missing_easy'], unlocked: false }
    expect(selectLangSkill(locked, 'missing_letter')).toBe('letter_missing_easy')
  })
  it('returns a valid LangSkillId for each domain', () => {
    const progress = createInitialProgress()
    const validMissing = ['letter_missing_easy', 'letter_missing_hard']
    const validDiac = ['diacritics_basic', 'diacritics_hard']
    const validOrder = ['word_order_short', 'word_order_long']
    expect(validMissing).toContain(selectLangSkill(progress, 'missing_letter'))
    expect(validDiac).toContain(selectLangSkill(progress, 'diacritics'))
    expect(validOrder).toContain(selectLangSkill(progress, 'word_order'))
  })
})

// createInitialProgress
describe('createInitialProgress with lang skills', () => {
  it('includes all LangSkillId keys', () => {
    const p = createInitialProgress()
    const langKeys: string[] = [
      'letter_missing_easy', 'letter_missing_hard',
      'diacritics_basic', 'diacritics_hard',
      'word_order_short', 'word_order_long',
    ]
    for (const key of langKeys) {
      expect(p[key as keyof typeof p]).toBeDefined()
    }
  })
  it('letter_missing_easy is unlocked by default', () => {
    expect(createInitialProgress()['letter_missing_easy'].unlocked).toBe(true)
  })
  it('letter_missing_hard is locked by default', () => {
    expect(createInitialProgress()['letter_missing_hard'].unlocked).toBe(false)
  })
})
