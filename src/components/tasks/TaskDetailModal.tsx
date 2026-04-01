import { useState } from 'react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Input, Textarea } from '../ui/Input'
import { useTeamMembers } from '../../hooks/useTeamMembers'
import { useDeleteTask, useUpdateTask } from '../../hooks/useTasks'
import { useUpdateTaskAssignees } from '../../hooks/useTaskAssignees'
import { getDueDateStatus, formatDueDate } from '../../utils/dates'
import { cn } from '../../utils/cn'
import { COLUMNS } from '../../types'
import type { Task, Priority, Status } from '../../types'

interface TaskDetailModalProps {
  task: Task
  onClose: () => void
}

function getPriorityVariant(priority: Priority) {
  if (priority === 'high')   return 'high'
  if (priority === 'normal') return 'normal'
  return 'low'
}

export function TaskDetailModal({ task, onClose }: TaskDetailModalProps) {
  const { data: allMembers = [] } = useTeamMembers()
  const deleteTask = useDeleteTask()
  const updateTask = useUpdateTask()
  const updateAssignees = useUpdateTaskAssignees()

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [priority, setPriority] = useState<Priority>(task.priority)
  const [dueDate, setDueDate] = useState(task.due_date ?? '')
  const [status, setStatus] = useState<Status>(task.status)
  const [titleError, setTitleError] = useState('')

  const [assigneeIds, setAssigneeIds] = useState<string[]>(
    task.assignees?.map(a => a.id) ?? []
  )

  const dueDateStatus = getDueDateStatus(task.due_date)

  function toggleAssignee(memberId: string) {
    const next = assigneeIds.includes(memberId)
      ? assigneeIds.filter(id => id !== memberId)
      : [...assigneeIds, memberId]

    setAssigneeIds(next)
    updateAssignees.mutate({ taskId: task.id, assigneeIds: next })
  }

  async function handleSave() {
    if (!title.trim()) {
      setTitleError('Title is required')
      return
    }

    await updateTask.mutateAsync({
      taskId: task.id,
      updates: {
        title: title.trim(),
        description: description.trim() || null,
        priority,
        due_date: dueDate || null,
        status,
      }
    })

    setIsEditing(false)
  }

  function handleCancelEdit() {
    setTitle(task.title)
    setDescription(task.description ?? '')
    setPriority(task.priority)
    setDueDate(task.due_date ?? '')
    setStatus(task.status)
    setTitleError('')
    setIsEditing(false)
  }

  async function handleDelete() {
    await deleteTask.mutateAsync(task.id)
    onClose()
  }

  return (
    <Modal title={isEditing ? 'Edit Task' : task.title} onClose={onClose}>
      <div className="flex flex-col gap-4">

        {isEditing ? (
          /* Edit Mode */
          <>
            <Input
              label="Title"
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                setTitleError('')
              }}
              error={titleError}
              autoFocus
            />

            <Textarea
              label="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Add more details..."
            />

            <div className="flex gap-3">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-medium text-slate-400">Priority</label>
                <select
                  value={priority}
                  onChange={e => setPriority(e.target.value as Priority)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>

              <Input
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="flex-1"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as Status)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {COLUMNS.map(col => (
                  <option key={col.id} value={col.id}>{col.title}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
              <Button variant="ghost" onClick={handleCancelEdit}>
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={updateTask.isPending}
              >
                <Check className="w-4 h-4" />
                {updateTask.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </>
        ) : (
          /* View Mode */
          <>
            {task.description && (
              <p className="text-sm text-slate-400 leading-relaxed break-words">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge
                label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                variant={getPriorityVariant(task.priority)}
              />
              {task.due_date && (
                <Badge
                  label={formatDueDate(task.due_date)}
                  variant={
                    dueDateStatus === 'overdue' ? 'overdue' :
                    dueDateStatus === 'soon'    ? 'soon' : 'default'
                  }
                />
              )}
            </div>

            {allMembers.length > 0 && (
              <div className="flex flex-col gap-2">
                <p className="text-xs font-medium text-slate-400">Assignees</p>
                <div className="flex flex-wrap gap-2">
                  {allMembers.map(member => {
                    const isAssigned = assigneeIds.includes(member.id)
                    return (
                      <button
                        key={member.id}
                        onClick={() => toggleAssignee(member.id)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors',
                          isAssigned
                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500'
                        )}
                      >
                        <Avatar name={member.name} color={member.color} size="sm" />
                        {member.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2 border-t border-slate-700">
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={deleteTask.isPending}
              >
                <Trash2 className="w-4 h-4" />
                {deleteTask.isPending ? 'Deleting...' : 'Delete Task'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}