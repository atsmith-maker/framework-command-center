'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPerformanceLog(projectId: string, aiModel: string, rating: number, revisions?: number, timeSpent?: number, notes?: string, taskId?: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data, error } = await supabase.from('performance_logs').insert({ project_id: projectId, user_id: user.id, ai_model: aiModel, rating, revisions: revisions ?? 0, time_spent: timeSpent ?? null, notes: notes ?? null, task_id: taskId ?? null }).select().single()
  if (error) throw error
  revalidatePath(`/projects/${projectId}/performance`)
  return data
}

export async function deletePerformanceLog(id: string, projectId: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('performance_logs').delete().eq('id', id).eq('user_id', user.id)
  if (error) throw error
  revalidatePath(`/projects/${projectId}/performance`)
}
