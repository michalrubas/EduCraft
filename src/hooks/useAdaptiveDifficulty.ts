// src/hooks/useAdaptiveDifficulty.ts
import { useState, useCallback } from 'react'

/** Pure function — testable without React */
export function getAdaptedRange(
  base: [number, number],
  correct: number,
  attempts: number
): [number, number] {
  if (attempts < 5) return base
  const [min, max] = base
  const mid = Math.ceil((min + max) / 2)
  const accuracy = correct / attempts

  if (accuracy < 0.6) {
    const upperBound = Math.max(min + 1, mid)
    return [min, upperBound]
  }
  if (accuracy > 0.9) {
    const lowerBound = Math.min(max - 1, mid)
    return [lowerBound, max]
  }
  return base
}

export interface UseAdaptiveDifficultyReturn {
  adaptedRange: [number, number]
  recordCorrect: () => void
  recordIncorrect: () => void
  reset: () => void
}

export function useAdaptiveDifficulty(base: [number, number]): UseAdaptiveDifficultyReturn {
  const [correct, setCorrect] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const recordCorrect = useCallback(() => {
    setCorrect(c => c + 1)
    setAttempts(a => a + 1)
  }, [])

  const recordIncorrect = useCallback(() => {
    setAttempts(a => a + 1)
  }, [])

  const reset = useCallback(() => {
    setCorrect(0)
    setAttempts(0)
  }, [])

  return {
    adaptedRange: getAdaptedRange(base, correct, attempts),
    recordCorrect,
    recordIncorrect,
    reset,
  }
}
