import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { TaskCard } from '../tasks/TaskCard'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'
import type { Task, Column } from '../../types'

interface BoardColumnProps {
  column: Column
  tasks: Task[]
  onAddTask: (status: Column['id']) => void
  onTaskClick: (task: Task) => void
}

export function BoardColumn({
  column,
  tasks,
  onAddTask,
  onTaskClick,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })

  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-slate-300">
            {column.title}
          </h2>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAddTask(column.id)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Column Body */}
      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-2 flex-1 rounded-xl p-2 min-h-[500px] transition-colors',
          'bg-slate-900 border border-slate-800',
          isOver && 'border-jungle-green-500/50 bg-jungle-green-500/5'
        )}
      >
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
            />
          ))}
        </SortableContext>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-slate-600 text-center">
              No tasks yet
            </p>
          </div>
        )}
      </div>
    </div>
  )
}