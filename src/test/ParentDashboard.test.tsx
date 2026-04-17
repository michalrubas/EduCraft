import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ParentDashboard from '../components/screens/ParentDashboard'

const mockLimit = vi.fn()

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: mockLimit,
          }),
        }),
      }),
    }),
  },
}))

describe('ParentDashboard', () => {
  beforeEach(() => {
    localStorage.clear()
    mockLimit.mockResolvedValue({
      data: [
        {
          synced_at: '2026-04-17T10:00:00Z',
          snapshot: {
            level: 5,
            xp: 500,
            combo: 0,
            maxCombo: 15,
            diamonds: 42,
            emeralds: 7,
            stars: 1,
            totalCorrect: 100,
            totalAttempts: 120,
            sessionsPlayed: 8,
            totalCorrectSession: 15,
            unlockedWorlds: ['forest'],
            ownedItems: ['sword_wood'],
            showcaseSlots: [],
            unlockedBadges: ['first_correct'],
            studentProgress: {},
            worldAccuracy: {},
            muted: false,
          },
        },
      ],
      error: null,
    })
  })

  it('renders child ID input on load', () => {
    render(<ParentDashboard />)
    expect(screen.getByPlaceholderText(/child id/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /načíst/i })).toBeInTheDocument()
  })

  it('prefills input from localStorage', () => {
    localStorage.setItem('educraft-parent-child-id', 'saved-id-abc')
    render(<ParentDashboard />)
    expect(screen.getByPlaceholderText(/child id/i)).toHaveValue('saved-id-abc')
  })

  it('shows data after successful load', async () => {
    render(<ParentDashboard />)
    fireEvent.change(screen.getByPlaceholderText(/child id/i), {
      target: { value: 'test-child-id' },
    })
    fireEvent.click(screen.getByRole('button', { name: /načíst/i }))
    await waitFor(() => {
      expect(screen.getByText(/level/i)).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  it('shows error message when ID not found', async () => {
    mockLimit.mockResolvedValueOnce({ data: [], error: null })
    render(<ParentDashboard />)
    fireEvent.change(screen.getByPlaceholderText(/child id/i), {
      target: { value: 'unknown-id' },
    })
    fireEvent.click(screen.getByRole('button', { name: /načíst/i }))
    await waitFor(() => {
      expect(screen.getByText(/id nenalezeno/i)).toBeInTheDocument()
    })
  })
})
