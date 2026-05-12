import { motion, AnimatePresence } from 'framer-motion'
import { Task } from '../../data/types'
import { CountingTask } from './CountingTask'
import { TapNumberTask } from './TapNumberTask'
import { CompareTask } from './CompareTask'
import { WhereMoreTask } from './WhereMoreTask'
import { MultiChoiceTask } from './MultiChoiceTask'
import { MathTask } from './MathTask'
import { FindTask } from './FindTask'
import { DragDropTask } from './DragDropTask'
import { MissingLetterTask } from './MissingLetterTask'
import { DiacriticsTask }    from './DiacriticsTask'
import { WordOrderTask }     from './WordOrderTask'
import { RunnerTask }        from './RunnerTask'
import { EngPictureTask } from './EngPictureTask'
import { EngWordTask }    from './EngWordTask'

interface Props {
  task: Task
  onAnswer: (answer: number | string) => void
}

export function TaskRenderer({ task, onAnswer }: Props) {
  const inner = (() => {
    switch (task.type) {
      case 'counting':    return <CountingTask    task={task} onAnswer={onAnswer} />
      case 'tapNumber':   return <TapNumberTask   task={task} onAnswer={onAnswer} />
      case 'compare':     return <CompareTask     task={task} onAnswer={onAnswer} />
      case 'whereMore':   return <WhereMoreTask   task={task} onAnswer={onAnswer} />
      case 'multiChoice': return <MultiChoiceTask task={task} onAnswer={onAnswer} />
      case 'math':         return <MathTask        task={task} onAnswer={onAnswer} />
      case 'mathMultiply': return <MathTask        task={task} onAnswer={onAnswer} />
      case 'find':         return <FindTask        task={task} onAnswer={onAnswer} />
      case 'dragDrop':      return <DragDropTask      task={task} onAnswer={onAnswer} />
      case 'missingLetter': return <MissingLetterTask task={task} onAnswer={onAnswer} />
      case 'diacritics':    return <DiacriticsTask    task={task} onAnswer={onAnswer} />
      case 'wordOrder':     return <WordOrderTask      task={task} onAnswer={onAnswer} />
      case 'runner':        return <RunnerTask         task={task} onAnswer={onAnswer} />
      case 'engPicture': return <EngPictureTask task={task} onAnswer={onAnswer} />
      case 'engWord':    return <EngWordTask    task={task} onAnswer={onAnswer} />
    }
  })()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={task.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.2 }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {inner}
      </motion.div>
    </AnimatePresence>
  )
}
