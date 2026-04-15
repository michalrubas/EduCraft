import { useRef, useState } from 'react'
import { motion, useAnimation, PanInfo } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function DragDropTask({ task, onAnswer }: Props) {
  const target = task.dragTarget ?? Number(task.correctAnswer)
  const totalObjects = task.objects?.length ?? target + 3
  const emoji = task.objects?.[0] ?? '⭐'

  const [sourceIds, setSourceIds] = useState<number[]>(() =>
    Array.from({ length: totalObjects }, (_, i) => i)
  )
  const [basketCount, setBasketCount] = useState(0)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const basketControls = useAnimation()

  function isOverDropZone(point: { x: number; y: number }): boolean {
    const rect = dropZoneRef.current?.getBoundingClientRect()
    if (!rect) return false
    return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
  }

  async function handleDragEnd(id: number, _e: unknown, info: PanInfo) {
    if (!isOverDropZone(info.point)) return

    const newBasket = basketCount + 1
    setSourceIds(ids => ids.filter(i => i !== id))
    setBasketCount(newBasket)

    if (newBasket > target) {
      await basketControls.start({
        x: [0, -10, 10, -8, 8, 0],
        transition: { duration: 0.4 },
      })
      setSourceIds(Array.from({ length: totalObjects }, (_, i) => i))
      setBasketCount(0)
      return
    }

    if (newBasket === target) {
      setTimeout(() => onAnswer(newBasket), 300)
    }
  }

  return (
    <div className="task-area">
      <p className="task-question">{task.question}</p>

      <div className="drag-source">
        {sourceIds.map(id => (
          <motion.div
            key={id}
            className="drag-item"
            drag
            dragSnapToOrigin
            dragElastic={0.2}
            onDragEnd={(e, info) => handleDragEnd(id, e, info)}
            whileDrag={{ scale: 1.25, zIndex: 50 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <motion.div
        ref={dropZoneRef}
        className="drop-zone"
        animate={basketControls}
      >
        {Array.from({ length: basketCount }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ fontSize: 28 }}
          >
            {emoji}
          </motion.span>
        ))}
        <span className="drop-zone-label">
          {basketCount} / {target}
        </span>
      </motion.div>
    </div>
  )
}
