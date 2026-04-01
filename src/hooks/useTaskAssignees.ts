import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useUpdateTaskAssignees() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      taskId,
      assigneeIds,
    }: {
      taskId: string
      assigneeIds: string[]
    }) => {
      // Delete all existing assignees for this task
      const { error: deleteError } = await supabase
        .from('task_assignees')
        .delete()
        .eq('task_id', taskId)

      if (deleteError) throw deleteError

      // Insert the new set of assignees
      if (assigneeIds.length > 0) {
        const { error: insertError } = await supabase
          .from('task_assignees')
          .insert(
            assigneeIds.map(team_member_id => ({ task_id: taskId, team_member_id }))
          )

        if (insertError) throw insertError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    }
  })
}