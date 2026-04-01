import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import type {
  DragEndEvent,
  DragStartEvent
} from '@dnd-kit/core'
import { BoardColumn } from './BoardColumn'
import { TaskCard } from '../tasks/TaskCard'
import { useTasks, useUpdateTaskStatus } from '../../hooks/useTasks'
import { COLUMNS } from '../../types'
import type { Task, Status } from '../../types'

interface BoardProps {
  onTaskClick: (task: Task) => void
  onAddTask: (status: Status) => void
}

export function Board({ onTaskClick, onAddTask }: BoardProps) {
  const { data: tasks = [], isLoading, isError } = useTasks()
  const updateStatus = useUpdateTaskStatus()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string

    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    // Check if dropped over a column directly
    const isColumn = COLUMNS.some(col => col.id === overId)
    const newStatus = isColumn
      ? overId as Status
      : tasks.find(t => t.id === overId)?.status

    if (!newStatus || newStatus === task.status) return

    updateStatus.mutate({ taskId, status: newStatus })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-400 text-sm">Loading board...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-rose-400 text-sm">Failed to load tasks. Please refresh.</p>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(column => (
          <BoardColumn
            key={column.id}
            column={column}
            tasks={tasks.filter(t => t.status === column.id)}
            onAddTask={onAddTask}
            onTaskClick={onTaskClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <TaskCard
            task={activeTask}
            onClick={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}