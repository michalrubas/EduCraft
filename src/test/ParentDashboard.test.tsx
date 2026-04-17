import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ParentDashboard from '../components/screens/ParentDashboard'

// Mock supabase klient
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: vi.fn().mockResolvedValue({
              data: [
                {
                  synced_at: '2026-04-17T10:00:00Z',
                  snapshot: {
                    level: 5,
                    xp: 500,
                    diamonds: 42,
                    emeralds: 7,
                    stars: 1,
                    totalCorrect: 100,
                    totalAttempts: 120,
                    maxCombo: 15,
                    unlockedBadges: ['first_correct'],
                    studentProgress: {},
                    worldAccuracy: {},
                    unlockedWorlds: ['forest'],
                  },
                },
              ],
              error: null,
            }),
          }),
        }),
      }),
    }),
  },
}))

describe('ParentDashboard', () => {
  beforeEach(() => {
    localStorage.clear()
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
})
