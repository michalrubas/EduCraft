// src/hooks/useTask.ts
import { useState, useCallback, useRef } from 'react'
import { Task, TaskType } from '../data/types'
import { TASK_GENERATORS } from '../data/tasks'
import { TASKS_BEFORE_EASY } from '../data/config'
import { getWorld } from '../data/worlds'

export interface UseTaskReturn {
  task: Task | null
  nextTask: () => void
  checkAnswer: (answer: number | string) => boolean
}

export function useTask(worldId: string, rangeOverride?: [number, number]): UseTaskReturn {
  const world = getWorld(worldId)
  const taskCountRef = useRef(0)
  const lastTypeRef = useRef<TaskType | null>(null)
  const effectiveRange = rangeOverride ?? world?.numberRange ?? [1, 5] as [number, number]

  const generateNext = useCallback((): Task => {
    if (!world) throw new Error(`World "${worldId}" not found`)
    taskCountRef.current++

    // Every TASKS_BEFORE_EASY tasks, insert an easier one to prevent frustration
    if (taskCountRef.current % TASKS_BEFORE_EASY === 0) {
      const easyRange: [number, number] = [
        effectiveRange[0],
        Math.ceil((effectiveRange[0] + effectiveRange[1]) / 2),
      ]
      const easyTypes: TaskType[] = ['counting', 'tapNumber']
      const t = easyTypes[Math.floor(Math.random() * easyTypes.length)]
      return TASK_GENERATORS[t](easyRange, world.biome)
    }

    // Avoid repeating last type for variety
    const available = world.taskTypes.filter(t => t !== lastTypeRef.current)
    const chosen = available[Math.floor(Math.random() * available.length)]
    lastTypeRef.current = chosen
    return TASK_GENERATORS[chosen](effectiveRange, world.biome)
  }, [world, worldId, effectiveRange])

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
