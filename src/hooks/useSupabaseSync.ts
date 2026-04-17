import { useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { supabase } from '../lib/supabase'
import type { GameState } from '../data/types'

export const CHILD_ID_KEY = 'educraft-child-id'
const SYNC_DEBOUNCE_MS = 60_000

export type SnapshotPayload = {
  level: number
  xp: number
  combo: number
  maxCombo: number
  diamonds: number
  emeralds: number
  stars: number
  totalCorrect: number
  totalAttempts: number
  sessionsPlayed: number
  totalCorrectSession: number
  unlockedWorlds: string[]
  ownedItems: string[]
  showcaseSlots: (string | null)[]
  unlockedBadges: string[]
  studentProgress: GameState['studentProgress']
  worldAccuracy: GameState['worldAccuracy']
  muted: boolean
}

export function serializeSnapshot(state: GameState): SnapshotPayload {
  return {
    level: state.level,
    xp: state.xp,
    combo: state.combo,
    maxCombo: state.maxCombo,
    diamonds: state.diamonds,
    emeralds: state.emeralds,
    stars: state.stars,
    totalCorrect: state.totalCorrect,
    totalAttempts: state.totalAttempts,
    sessionsPlayed: state.sessionsPlayed,
    totalCorrectSession: state.totalCorrectSession,
    unlockedWorlds: state.unlockedWorlds,
    ownedItems: state.ownedItems,
    showcaseSlots: state.showcaseSlots,
    unlockedBadges: state.unlockedBadges,
    studentProgress: state.studentProgress,
    worldAccuracy: state.worldAccuracy,
    muted: state.muted,
  }
}

export function getOrCreateChildId(): string {
  let id = localStorage.getItem(CHILD_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(CHILD_ID_KEY, id)
  }
  return id
}

async function insertSnapshot(childId: string, state: GameState) {
  if (!supabase) return
  const { error } = await supabase.from('child_snapshots').insert({
    child_id: childId,
    snapshot: serializeSnapshot(state),
  })
  if (error && import.meta.env.DEV) console.error('[useSupabaseSync] insert failed', error)
}

export function useSupabaseSync() {
  useEffect(() => {
    if (!supabase) return

    const childId = getOrCreateChildId()

    // Initial snapshot on mount — ensures child ID exists in DB immediately
    insertSnapshot(childId, useGameStore.getState())

    let timer: ReturnType<typeof setTimeout> | null = null

    const unsubscribe = useGameStore.subscribe((state) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => insertSnapshot(childId, state), SYNC_DEBOUNCE_MS)
    })

    return () => {
      unsubscribe()
      if (timer) clearTimeout(timer)
    }
  }, [])
}
