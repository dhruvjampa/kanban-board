# Kanban Board

A beautiful, fully-featured Kanban-style task board built with React, TypeScript, and Supabase. Inspired by Linear and Asana.

🔗 **Live Demo:** https://kanban-board-omega-five.vercel.app/

---

## Features

### Core
- **4-column Kanban board** — To Do, In Progress, In Review, Done
- **Drag and drop** — smooth task movement between columns with optimistic updates
- **Guest accounts** — anonymous sign-in via Supabase Auth, no email or password required
- **Task management** — create, edit, and delete tasks with title, description, priority, and due date
- **Data persistence** — all tasks stored in Supabase PostgreSQL with Row Level Security
- **Loading and error states** — clear feedback throughout the UI

### Advanced
- **Team Members & Assignees** — create team members with custom colors, assign multiple members to tasks, display assignee avatars on cards with overflow indicator
- **Due Date Indicators** — color-coded urgency badges on cards (Overdue in red, Due Soon in amber)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v3 |
| Drag and Drop | @dnd-kit |
| Data Fetching | TanStack Query |
| Backend | Supabase (PostgreSQL + Auth) |
| Hosting | Vercel |

---

## Database Schema
```sql
-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Team Members
create table team_members (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  color       text not null default '#6366f1',
  created_at  timestamptz not null default now()
);

-- Tasks
create table tasks (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  description text,
  status      text not null default 'todo'
                check (status in ('todo', 'in_progress', 'in_review', 'done')),
  priority    text not null default 'normal'
                check (priority in ('low', 'normal', 'high')),
  due_date    date,
  created_at  timestamptz not null default now()
);

-- Task Assignees (junction table)
create table task_assignees (
  task_id          uuid not null references tasks(id) on delete cascade,
  team_member_id   uuid not null references team_members(id) on delete cascade,
  primary key (task_id, team_member_id)
);

-- RLS
alter table team_members enable row level security;
alter table tasks enable row level security;
alter table task_assignees enable row level security;

create policy "Users manage their own team members"
  on team_members for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own tasks"
  on tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage their own task assignees"
  on task_assignees for all
  using (
    exists (
      select 1 from tasks
      where tasks.id = task_assignees.task_id
      and tasks.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from tasks
      where tasks.id = task_assignees.task_id
      and tasks.user_id = auth.uid()
    )
  );
```

---

## Local Setup

### Prerequisites
- Node.js v18+
- npm v9+
- A Supabase account

### Steps

1. Clone the repository
```bash
git clone https://github.com/dhruvjampa/kanban-board.git
cd kanban-board
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the project root
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up your Supabase project
   - Create a new project at supabase.com
   - Run the SQL schema above in the Supabase SQL editor
   - Enable anonymous sign-in under Authentication → Providers

5. Start the development server
```bash
npm run dev
```

6. Open http://localhost:5173

---

## Project Structure
```
src/
├── components/
│   ├── board/        # Board and column components
│   ├── tasks/        # Task card, modals, team members
│   └── ui/           # Reusable primitives (Button, Badge, Avatar, Modal)
├── hooks/            # Data fetching hooks (useTasks, useTeamMembers, useAuth)
├── lib/              # Supabase client initialization
├── types/            # TypeScript interfaces and constants
└── utils/            # Date utilities and class name helper
```

---

## Security

- Supabase anon key only — service role key is never exposed to the frontend
- Row Level Security enforced on all tables at the database level
- Users can only read and write their own data
- `.env.local` is gitignored — no secrets committed to the repository