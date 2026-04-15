// src/store/gameStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameState, Screen, ShopItem } from '../data/types'
import { COMBO_REWARDS, SHOWCASE_SLOTS, getComboLevel } from '../data/config'
import { WORLDS } from '../data/worlds'

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      currentScreen: 'home' as Screen,
      currentWorldId: null,
      combo: 0,
      maxCombo: 0,
      diamonds: 10,
      emeralds: 0,
      stars: 0,
      unlockedWorlds: ['forest'],
      ownedItems: ['sword_wood'],
      showcaseSlots: Array<string | null>(SHOWCASE_SLOTS).fill(null),
      totalCorrect: 0,
      totalAttempts: 0,
      sessionsPlayed: 0,

      navigateTo: (screen: Screen) => set({ currentScreen: screen }),

      enterWorld: (worldId: string) =>
        set({ currentWorldId: worldId, currentScreen: 'game' }),

      answerCorrect: (worldId: string) => {
        const s = get()
        const world = WORLDS.find(w => w.id === worldId)
        const multiplier = world?.comboMultiplier ?? 1
        const newCombo = s.combo + 1
        const level = getComboLevel(newCombo)
        const base = COMBO_REWARDS[level]
        set({
          combo: newCombo,
          maxCombo: Math.max(s.maxCombo, newCombo),
          diamonds: s.diamonds + Math.round((base.diamonds ?? 0) * multiplier),
          emeralds: s.emeralds + Math.round((base.emeralds ?? 0) * multiplier),
          stars: s.stars + Math.round((base.stars ?? 0) * multiplier),
          totalCorrect: s.totalCorrect + 1,
          totalAttempts: s.totalAttempts + 1,
          currentScreen: 'reward',
        })
      },

      answerIncorrect: () =>
        set(s => ({ totalAttempts: s.totalAttempts + 1 })),

      resetCombo: () => set({ combo: 0 }),

      buyItem: (item: ShopItem) => {
        const s = get()
        if (s.ownedItems.includes(item.id)) return false
        const { diamonds = 0, emeralds = 0, stars = 0 } = item.cost
        if (s.diamonds < diamonds || s.emeralds < emeralds || s.stars < stars) return false
        set({
          diamonds: s.diamonds - diamonds,
          emeralds: s.emeralds - emeralds,
          stars: s.stars - stars,
          ownedItems: [...s.ownedItems, item.id],
        })
        return true
      },

      addToShowcase: (itemId: string, slot: number) =>
        set(s => {
          const slots = [...s.showcaseSlots]
          slots[slot] = itemId
          return { showcaseSlots: slots }
        }),

      unlockWorld: (worldId: string, cost: number) => {
        const s = get()
        if (s.diamonds < cost || s.unlockedWorlds.includes(worldId)) return false
        set({
          diamonds: s.diamonds - cost,
          unlockedWorlds: [...s.unlockedWorlds, worldId],
        })
        return true
      },
    }),
    { name: 'educraft-game-v1' }
  )
)
