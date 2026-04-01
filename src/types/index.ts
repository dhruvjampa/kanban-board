export type Status = 'todo' | 'in_progress' | 'in_review' | 'done'
export type Priority = 'low' | 'normal' | 'high'

export interface TeamMember {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  due_date: string | null
  created_at: string
  assignees?: TeamMember[]
}

export interface TaskAssignee {
  task_id: string
  team_member_id: string
}

export interface Column {
  id: Status
  title: string
}

export const COLUMNS: Column[] = [
  { id: 'todo',        title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'in_review',   title: 'In Review' },
  { id: 'done',        title: 'Done' },
]