import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input, Textarea } from '../ui/Input'
import { Button } from '../ui/Button'
import { useCreateTask } from '../../hooks/useTasks'
import type { Status, Priority } from '../../types'

interface CreateTaskModalProps {
  initialStatus: Status
  onClose: () => void
}

export function CreateTaskModal({ initialStatus, onClose }: CreateTaskModalProps) {
  const createTask = useCreateTask()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    await createTask.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      due_date: dueDate || undefined,
      status: initialStatus,
    })

    onClose()
  }

  return (
    <Modal title="Create Task" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Input
          label="Title"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => {
            setTitle(e.target.value)
            setError('')
          }}
          error={error}
          autoFocus
        />

        <Textarea
          label="Description"
          placeholder="Add more details..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />

        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-medium text-slate-400">
              Priority
            </label>
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

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={createTask.isPending}
          >
            {createTask.isPending ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}