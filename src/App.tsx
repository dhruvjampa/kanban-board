import { useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { useAuth } from './hooks/useAuth'
import { useSignIn } from './hooks/useSignIn'
import { Board } from './components/board/Board'
import { Button } from './components/ui/Button'
import { CreateTaskModal } from './components/tasks/CreateTaskModal'
import { TaskDetailModal } from './components/tasks/TaskDetailModal'
import { TeamMemberModal } from './components/tasks/TeamMemberModal'
import type { Task, Status } from './types'

export default function App() {
  useSignIn()
  const { user, loading } = useAuth()

  const [createStatus, setCreateStatus] = useState<Status | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTeam, setShowTeam] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 text-sm">Starting session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-jungle-green-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <h1 className="text-slate-100 font-semibold text-sm">
              Kanban Board
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTeam(true)}
            >
              <Users className="w-4 h-4" />
              Team
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setCreateStatus('todo')}
            >
              <Plus className="w-4 h-4" />
              New Task
            </Button>
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="px-6 py-6 max-w-screen-2xl mx-auto">
        <Board
          onTaskClick={setSelectedTask}
          onAddTask={setCreateStatus}
        />
      </main>

      {/* Modals */}
      {createStatus && (
        <CreateTaskModal
          initialStatus={createStatus}
          onClose={() => setCreateStatus(null)}
        />
      )}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
      {showTeam && (
        <TeamMemberModal
          onClose={() => setShowTeam(false)}
        />
      )}
    </div>
  )
}