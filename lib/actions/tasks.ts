'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTask(projectId: string, title: string, data?: { description?: string; assigned_ai?: string; priority?: string; sort_order?: number }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data: task, error } = await supabase.from('coordination_tasks').insert({ project_id: projectId, user_id: user.id, title, status: 'todo', priority: data?.priority ?? 'medium', ...data }).select().single()
  if (error) throw error
  revalidatePath(`/projects/${projectId}/tasks`)
  return task
}

export async function updateTask(id: string, updates: Record<string, unknown>) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('coordination_tasks').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id)
  if (error) throw error
}

export async function deleteTask(id: string, projectId: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('coordination_tasks').delete().eq('id', id).eq('user_id', user.id)
  if (error) throw error
  revalidatePath(`/projects/${projectId}/tasks`)
}
