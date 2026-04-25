// src/store/gameStore.ts
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { GameState, Screen, ShopItem, MathSkillId, LangSkillId, SkillState, TaskType } from '../data/types'
import { COMBO_REWARDS, SHOWCASE_SLOTS, TASK_TYPE_REWARDS, getComboLevel } from '../data/config'
import { WORLDS } from '../data/worlds'
import { setMuted as setMutedSound } from '../audio/sounds'
import { SHOP_ITEMS } from '../data/shopItems'
import { WheelReward } from '../data/types'
import { createInitialProgress, checkUnlocks, updateMastery, applyMasteryDecay, LANG_SKILL_TREE } from '../data/skills'
import { getLevelData, getLevelReward, BASE_XP_PER_ANSWER } from '../data/levels'
import { checkNewBadges } from '../data/badges'
import { playSound } from '../audio/sounds'

export const useGameStore = create<GameState>()(
  devtools(
  persist(
    (set, get) => ({
      currentScreen: 'home' as Screen,
      currentWorldId: null,
      combo: 0,
      maxCombo: 0,
      diamonds: 10,
      emeralds: 0,
      stars: 0,
      unlockedWorlds: import.meta.env.DEV ? ['forest'] : ['forest'],
      ownedItems: ['sword_wood'],
      shopPurchases: 0,
      showcaseSlots: Array<string | null>(SHOWCASE_SLOTS).fill(null),
      totalCorrect: 0,
      totalAttempts: 0,
      sessionsPlayed: 0,
      muted: false,
      wheelSpinsToday: 0,
      totalCorrectSession: 0,
      wheelPending: false,
      chestPending: false,
      xp: 0,
      level: 1,
      levelUpPending: false,
      studentProgress: createInitialProgress(),
      particles: [],
      unlockedBadges: [],
      badgePending: null,
      worldAccuracy: {} as Record<string, { correct: number; total: number }>,

      spawnParticles: (emoji, count, startX, startY) => {
        const newParticles = Array.from({ length: count }).map(() => ({
          id: Math.random().toString(36),
          emoji,
          startX: startX + (Math.random() * 60 - 30),
          startY: startY + (Math.random() * 60 - 30),
        }))
        set(s => ({ particles: [...s.particles, ...newParticles] }))
      },

      removeParticle: (id) => set(s => ({ particles: s.particles.filter(p => p.id !== id) })),

      navigateTo: (screen: Screen) => set({ currentScreen: screen }),

      enterWorld: (worldId: string) => {
        const s = get()
        const now = Date.now()
        // Křivka zapomínání: jednou za sezení snížit mastery netrénovaných dovedností
        const decayedProgress = applyMasteryDecay(s.studentProgress, now)
        // Exponenciální fading paměti přesnosti: stará sezení mají 70 % váhy
        const oldWa = s.worldAccuracy[worldId] ?? { correct: 0, total: 0 }
        const fadedWa = { correct: Math.round(oldWa.correct * 0.7), total: Math.round(oldWa.total * 0.7) }
        set({
          currentWorldId: worldId,
          currentScreen: 'game',
          wheelSpinsToday: 0,
          totalCorrectSession: 0,
          studentProgress: decayedProgress,
          worldAccuracy: { ...s.worldAccuracy, [worldId]: fadedWa },
        })
      },

      answerCorrect: (worldId: string, taskType?) => {
        const s = get()
        const world = WORLDS.find(w => w.id === worldId)
        const multiplier = world?.comboMultiplier ?? 1
        const newCombo = s.combo + 1
        const comboLevel = getComboLevel(newCombo)
        const base = COMBO_REWARDS[comboLevel]
        
        const gainedXp = Math.round(BASE_XP_PER_ANSWER * multiplier)
        const nextXp = s.xp + gainedXp
        const nextLevelData = getLevelData(nextXp)
        const leveledUp = nextLevelData.level > s.level
        const taskMultiplier = taskType ? (TASK_TYPE_REWARDS[taskType] ?? 1) : 1

        const wa = s.worldAccuracy[worldId] ?? { correct: 0, total: 0 }
        set({
          combo: newCombo,
          maxCombo: Math.max(s.maxCombo, newCombo),
          diamonds: s.diamonds + Math.round((base.diamonds ?? 0) * multiplier * taskMultiplier),
          emeralds: s.emeralds + Math.round((base.emeralds ?? 0) * multiplier * taskMultiplier),
          stars: s.stars + Math.round((base.stars ?? 0) * multiplier * taskMultiplier),
          totalCorrect: s.totalCorrect + 1,
          totalAttempts: s.totalAttempts + 1,
          totalCorrectSession: s.totalCorrectSession + 1,
          currentScreen: 'reward',
          xp: nextXp,
          level: nextLevelData.level,
          worldAccuracy: { ...s.worldAccuracy, [worldId]: { correct: wa.correct + 1, total: wa.total + 1 } },
        })
        get().checkBadges()
        return leveledUp
      },

      answerIncorrect: () =>
        set(s => {
          const worldId = s.currentWorldId
          const wa = worldId ? (s.worldAccuracy[worldId] ?? { correct: 0, total: 0 }) : null
          return {
            totalAttempts: s.totalAttempts + 1,
            ...(worldId && wa ? { worldAccuracy: { ...s.worldAccuracy, [worldId]: { correct: wa.correct, total: wa.total + 1 } } } : {}),
          }
        }),

      resetCombo: () => set({ combo: 0 }),

      setMuted: (muted: boolean) => {
        set({ muted })
        setMutedSound(muted)
      },

      triggerWheel: () => set({ wheelPending: true }),

      dismissWheel: () => set(s => ({
        wheelPending: false,
        wheelSpinsToday: s.wheelSpinsToday + 1,
      })),

      collectWheelReward: (reward: WheelReward) => {
        const s = get()
        let resolvedItemId: string | undefined
        if (reward.itemId === 'random') {
          const available = SHOP_ITEMS.filter(i => !s.ownedItems.includes(i.id) && !i.shopOnly)
          if (available.length > 0) {
            resolvedItemId = available[Math.floor(Math.random() * available.length)].id
          }
        } else if (reward.itemId) {
          resolvedItemId = reward.itemId
        }
        set(prev => ({
          diamonds: prev.diamonds + (reward.diamonds ?? 0),
          emeralds: prev.emeralds + (reward.emeralds ?? 0),
          stars: prev.stars + (reward.stars ?? 0),
          ownedItems: resolvedItemId ? [...prev.ownedItems, resolvedItemId] : prev.ownedItems,
          wheelPending: false,
          wheelSpinsToday: prev.wheelSpinsToday + 1,
        }))
        get().checkBadges()
      },

      triggerChest: () => set({ chestPending: true }),

      collectChestReward: (reward: WheelReward) => {
        const s = get()
        let resolvedItemId: string | undefined
        if (reward.itemId === 'random') {
          const available = SHOP_ITEMS.filter(i => !s.ownedItems.includes(i.id) && !i.shopOnly)
          if (available.length > 0) {
            resolvedItemId = available[Math.floor(Math.random() * available.length)].id
          }
        } else if (reward.itemId) {
          resolvedItemId = reward.itemId
        }
        set(prev => ({
          diamonds: prev.diamonds + (reward.diamonds ?? 0),
          emeralds: prev.emeralds + (reward.emeralds ?? 0),
          stars: prev.stars + (reward.stars ?? 0),
          ownedItems: resolvedItemId ? [...prev.ownedItems, resolvedItemId] : prev.ownedItems,
          chestPending: false,
        }))
        get().checkBadges()
      },

      triggerLevelUp: () => set({ levelUpPending: true }),

      dismissLevelUp: () => set({ levelUpPending: false }),

      checkBadges: () => {
        const s = get()
        const newBadges = checkNewBadges(s)
        if (newBadges.length > 0) {
          set({
            unlockedBadges: [...s.unlockedBadges, ...newBadges.map(b => b.id)],
            badgePending: s.badgePending || newBadges[0],
          })
          playSound.reward()
        }
      },

      dismissBadge: () => {
        set({ badgePending: null })
        get().checkBadges() // Zkontrolujeme, jestli nečeká další odznak
      },

      collectLevelUpReward: () => {
        const s = get()
        const reward = getLevelReward(s.level)
        set({
          diamonds: s.diamonds + reward.diamonds,
          emeralds: s.emeralds + reward.emeralds,
          levelUpPending: false,
        })
      },

      spendDiamonds: (amount: number) => {
        const s = get()
        if (s.diamonds < amount) return false
        set({ diamonds: s.diamonds - amount })
        return true
      },

      spendStars: (amount: number) => {
        const s = get()
        if (s.stars < amount) return false
        set({ stars: s.stars - amount })
        return true
      },

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
          shopPurchases: s.shopPurchases + 1,
        })
        get().checkBadges()
        return true
      },

      addToShowcase: (itemId: string, slot: number) =>
        set(s => {
          const slots = [...s.showcaseSlots]
          slots[slot] = itemId
          return { showcaseSlots: slots }
        }),

      unlockWorld: (worldId: string, cost: number, currency: 'diamonds' | 'emeralds' | 'stars' = 'diamonds') => {
        const s = get()
        if (s[currency] < cost || s.unlockedWorlds.includes(worldId)) return false
        set({
          [currency]: s[currency] - cost,
          unlockedWorlds: [...s.unlockedWorlds, worldId],
        })
        get().checkBadges()
        return true
      },

      updateSkillMastery: (skillId: MathSkillId | LangSkillId, isCorrect: boolean) => {
        set(s => {
          const current = s.studentProgress[skillId]
          const updated = {
            ...s.studentProgress,
            [skillId]: {
              ...current,
              mastery: updateMastery(current.mastery, isCorrect),
              attempts: current.attempts + 1,
              lastPracticed: Date.now(),
            },
          }
          return { studentProgress: checkUnlocks(updated) }
        })
      },
    }),
    {
      name: 'adicraft-game-v1',
      version: 1,
      migrate: (old: unknown) => {
        const state = old as Record<string, unknown>
        const existingProgress = (state.studentProgress ?? {}) as Record<string, SkillState>
        const langDefaults: Record<string, SkillState> = {}
        for (const skill of LANG_SKILL_TREE) {
          langDefaults[skill.id] = { mastery: 0, unlocked: skill.prerequisites.length === 0, attempts: 0, lastPracticed: 0 }
        }
        return { ...state, studentProgress: { ...langDefaults, ...existingProgress }, shopPurchases: state.shopPurchases ?? 0 }
      },
    }
  ), { name: 'AdiCraft' })
)
