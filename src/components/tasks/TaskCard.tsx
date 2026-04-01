import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, Flag } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Avatar } from '../ui/Avatar'
import { cn } from '../../utils/cn'
import { getDueDateStatus, formatDueDate } from '../../utils/dates'
import type { Task, Priority } from '../../types'

interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
}

function getPriorityVariant(priority: Priority) {
  if (priority === 'high')   return 'high'
  if (priority === 'normal') return 'normal'
  return 'low'
}

function getPriorityLabel(priority: Priority) {
  if (priority === 'high')   return 'High'
  if (priority === 'normal') return 'Normal'
  return 'Low'
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const dueDateStatus = getDueDateStatus(task.due_date)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className={cn(
        'bg-slate-800 border border-slate-700 rounded-lg p-3 cursor-pointer',
        'hover:border-slate-500 transition-colors',
        'flex flex-col gap-2',
        isDragging && 'opacity-50 shadow-2xl scale-105'
      )}
    >
      {/* Title */}
      <p className="text-sm text-slate-100 font-medium leading-snug">
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-400 leading-snug line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <Badge
          label={getPriorityLabel(task.priority)}
          variant={getPriorityVariant(task.priority)}
        />
        {dueDateStatus === 'overdue' && (
          <Badge label="Overdue" variant="overdue" />
        )}
        {dueDateStatus === 'soon' && (
          <Badge label="Due Soon" variant="soon" />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-1">
        {/* Due date */}
        {task.due_date && (
          <div className={cn(
            'flex items-center gap-1 text-xs',
            dueDateStatus === 'overdue' && 'text-rose-400',
            dueDateStatus === 'soon'    && 'text-amber-400',
            dueDateStatus === 'ok'      && 'text-slate-400',
            !dueDateStatus              && 'text-slate-400',
          )}>
            <Calendar className="w-3 h-3" />
            {formatDueDate(task.due_date)}
          </div>
        )}

        {/* Assignee avatars */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-1.5 ml-auto">
            {task.assignees.slice(0, 3).map(member => (
              <Avatar
                key={member.id}
                name={member.name}
                color={member.color}
                size="sm"
              />
            ))}
            {task.assignees.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-xs text-slate-400">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}