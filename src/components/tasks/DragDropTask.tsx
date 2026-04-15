import { useRef, useState } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { Task } from '../../data/types'

interface Props { task: Task; onAnswer: (a: number | string) => void }

export function DragDropTask({ task, onAnswer }: Props) {
  const target = task.dragTarget ?? Number(task.correctAnswer)
  const totalObjects = task.objects?.length ?? target + 2
  const emoji = task.objects?.[0] ?? '📦'

  const [sourceIds, setSourceIds] = useState<number[]>(() =>
    Array.from({ length: totalObjects }, (_, i) => i)
  )
  const [basketCount, setBasketCount] = useState(0)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  function isOverDropZone(point: { x: number; y: number }): boolean {
    const rect = dropZoneRef.current?.getBoundingClientRect()
    if (!rect) return false
    return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom
  }

  function handleDragEnd(id: number, _e: unknown, info: PanInfo) {
    if (!isOverDropZone(info.point)) return
    setSourceIds(ids => ids.filter(i => i !== id))
    setBasketCount(c => c + 1)
  }

  function handleReset() {
    setSourceIds(Array.from({ length: totalObjects }, (_, i) => i))
    setBasketCount(0)
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

      <div ref={dropZoneRef} className="drop-zone">
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
      </div>

      <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 320 }}>
        <motion.button
          className="pixel-btn"
          disabled={basketCount === 0}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
          style={{ flex: 1, opacity: basketCount === 0 ? 0.4 : 1 }}
        >
          ↺ Znovu
        </motion.button>
        <motion.button
          className="pixel-btn primary"
          disabled={basketCount === 0}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer(basketCount)}
          style={{ flex: 2, opacity: basketCount === 0 ? 0.4 : 1 }}
        >
          ✓ OK
        </motion.button>
      </div>
    </div>
  )
}
