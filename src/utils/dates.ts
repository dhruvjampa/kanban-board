export type DueDateStatus = 'overdue' | 'soon' | 'ok' | null

export function getDueDateStatus(dueDate: string | null): DueDateStatus {
  if (!dueDate) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)

  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0)  return 'overdue'
  if (diffDays <= 2) return 'soon'
  return 'ok'
}

export function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}