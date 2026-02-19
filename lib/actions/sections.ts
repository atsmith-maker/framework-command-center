'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSection(projectId: string, title: string, sortOrder?: number) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data, error } = await supabase.from('assembly_sections').insert({ project_id: projectId, user_id: user.id, title, content: '', sort_order: sortOrder ?? 0 }).select().single()
  if (error) throw error
  revalidatePath(`/projects/${projectId}/assembly`)
  return data
}

export async function updateSection(id: string, updates: { title?: string; content?: string; sort_order?: number }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('assembly_sections').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id)
  if (error) throw error
}

export async function deleteSection(id: string, projectId: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('assembly_sections').delete().eq('id', id).eq('user_id', user.id)
  if (error) throw error
  revalidatePath(`/projects/${projectId}/assembly`)
}
