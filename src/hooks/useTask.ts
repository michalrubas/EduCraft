// src/hooks/useTask.ts
import { useState, useCallback, useRef } from 'react'
import { Task, TaskType, TaskTypeEntry } from '../data/types'
import { TASK_GENERATORS } from '../data/tasks'
import { TASKS_BEFORE_EASY } from '../data/config'
import { getWorld } from '../data/worlds'
import { useGameStore } from '../store/gameStore'
import { selectSkill, generateSkillTask, selectLangSkill, generateLangTask, SKILL_DOMAINS } from '../data/skills'
import { generateRunnerMath, generateRunnerCompare, generateRunnerLanguage } from '../data/runnerGenerators'

// Vybere typ úkolu podle vah. Typy bez váhy mají implicitně weight: 1.
// Parametr `exclude` slouží k vynechání posledního typu (pro pestrost).
function pickWeighted(entries: TaskTypeEntry[], exclude: TaskType | null): TaskType {
  const weighted = entries.map(e =>
    typeof e === 'string' ? { type: e, weight: 1 } : e
  )
  const available = exclude ? weighted.filter(e => e.type !== exclude) : weighted
  const pool = available.length > 0 ? available : weighted  // fallback: ignoruj exclude

  const total = pool.reduce((s, e) => s + e.weight, 0)
  let r = Math.random() * total
  for (const e of pool) {
    r -= e.weight
    if (r <= 0) return e.type
  }
  return pool[pool.length - 1].type
}

export interface UseTaskReturn {
  task: Task | null
  nextTask: () => void
  checkAnswer: (answer: number | string) => boolean
}

export function useTask(worldId: string, rangeOverride?: [number, number]): UseTaskReturn {
  const world = getWorld(worldId)
  const studentProgress = useGameStore(s => s.studentProgress)
  const taskCountRef = useRef(0)
  const lastTypeRef = useRef<TaskType | null>(null)
  const effectiveRange = rangeOverride ?? world?.numberRange ?? [1, 5] as [number, number]

  const generateNext = useCallback((): Task => {
    if (!world) throw new Error(`World "${worldId}" not found`)
    taskCountRef.current++

    // Easy-task insert only for math worlds (lang worlds have no numberRange)
    if (taskCountRef.current % TASKS_BEFORE_EASY === 0 && world.numberRange) {
      const easyRange: [number, number] = [
        effectiveRange[0],
        Math.ceil((effectiveRange[0] + effectiveRange[1]) / 2),
      ]
      const easyTypes: TaskType[] = ['counting', 'tapNumber']
      const t = easyTypes[Math.floor(Math.random() * easyTypes.length)]
      return TASK_GENERATORS[t](easyRange, world.biome)
    }

    // Vyber typ úkolu váženým výběrem; vyhni se opakování posledního typu
    const chosen = pickWeighted(world.taskTypes, lastTypeRef.current)
    lastTypeRef.current = chosen

    // Math tasks go through the skill system for personalized difficulty
    if (chosen === 'math') {
      const skillId = selectSkill(studentProgress, 'add_sub')
      return generateSkillTask(skillId)
    }
    if (chosen === 'mathMultiply') {
      const hasMultiply = SKILL_DOMAINS.multiply.some(id => studentProgress[id]?.unlocked)
      const skillId = hasMultiply
        ? selectSkill(studentProgress, 'multiply')
        : selectSkill(studentProgress, 'add_sub')
      return generateSkillTask(skillId)
    }
    if (chosen === 'missingLetter') {
      return generateLangTask(selectLangSkill(studentProgress, 'missing_letter'))
    }
    if (chosen === 'diacritics') {
      return generateLangTask(selectLangSkill(studentProgress, 'diacritics'))
    }
    if (chosen === 'wordOrder') {
      return generateLangTask(selectLangSkill(studentProgress, 'word_order'))
    }
    if (chosen === 'runner') {
      const LANG_BIOMES = ['village', 'castle', 'library', 'graveyard']
      const COMPARE_BIOMES = ['desert']
      if (LANG_BIOMES.includes(world.biome)) return generateRunnerLanguage()
      if (COMPARE_BIOMES.includes(world.biome)) return generateRunnerCompare(effectiveRange)
      return generateRunnerMath(effectiveRange)
    }

    return TASK_GENERATORS[chosen](effectiveRange, world.biome)
  }, [world, worldId, effectiveRange, studentProgress])

  const [task, setTask] = useState<Task | null>(() =>
    world ? generateNext() : null
  )

  const nextTask = useCallback(() => setTask(generateNext()), [generateNext])

  const checkAnswer = useCallback(
    (answer: number | string) => task !== null && String(answer) === String(task.correctAnswer),
    [task]
  )

  return { task, nextTask, checkAnswer }
}
