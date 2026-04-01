import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Avatar } from '../ui/Avatar'
import { useTeamMembers, useCreateTeamMember, useDeleteTeamMember } from '../../hooks/useTeamMembers'

interface TeamMemberModalProps {
  onClose: () => void
}

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899',
  '#f43f5e', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#3b82f6',
]

export function TeamMemberModal({ onClose }: TeamMemberModalProps) {
  const { data: members = [] } = useTeamMembers()
  const createMember = useCreateTeamMember()
  const deleteMember = useDeleteTeamMember()

  const [name, setName] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [error, setError] = useState('')

  async function handleCreate() {
    if (!name.trim()) {
        setError('Name is required')
        return
    }

    const duplicate = members.some(
        m => m.name.toLowerCase() === name.trim().toLowerCase()
    )

    if (duplicate) {
        setError('A team member with this name already exists')
        return
    }

    await createMember.mutateAsync({ name: name.trim(), color })
    setName('')
    setColor(PRESET_COLORS[0])
  }

  return (
    <Modal title="Team Members" onClose={onClose}>
      <div className="flex flex-col gap-4">
        {/* Create new member */}
        <div className="flex flex-col gap-3">
          <Input
            label="Name"
            placeholder="e.g. Alice Johnson"
            value={name}
            onChange={e => {
              setName(e.target.value)
              setError('')
            }}
            error={error}
          />

          {/* Color picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-400">Color</label>
            <div className="flex gap-2 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                  style={{ backgroundColor: c }}
                >
                  {color === c && (
                    <span className="flex items-center justify-center text-white text-xs font-bold">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={handleCreate}
            disabled={createMember.isPending}
          >
            {createMember.isPending ? 'Adding...' : 'Add Member'}
          </Button>
        </div>

        {/* Existing members */}
        {members.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-slate-700 pt-4">
            <p className="text-xs font-medium text-slate-400">Current Members</p>
            {members.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between py-1"
              >
                <div className="flex items-center gap-2">
                  <Avatar name={member.name} color={member.color} size="sm" />
                  <span className="text-sm text-slate-300">{member.name}</span>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteMember.mutate(member.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}