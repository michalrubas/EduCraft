import { describe, it, expect, beforeEach } from 'vitest'
import { getOrCreateChildId } from '../hooks/useSupabaseSync'

describe('getOrCreateChildId', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('generates a UUID and stores it on first call', () => {
    const id = getOrCreateChildId()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    expect(localStorage.getItem('educraft-child-id')).toBe(id)
  })

  it('returns the same ID on subsequent calls', () => {
    const id1 = getOrCreateChildId()
    const id2 = getOrCreateChildId()
    expect(id1).toBe(id2)
  })

  it('reads existing ID from localStorage', () => {
    localStorage.setItem('educraft-child-id', 'existing-id-123')
    const id = getOrCreateChildId()
    expect(id).toBe('existing-id-123')
  })
})
