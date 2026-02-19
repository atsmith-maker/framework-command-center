'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPrompt(projectId: string, title: string, content: string, targetAi?: string, category?: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data, error } = await supabase.from('prompts').insert({ project_id: projectId, user_id: user.id, title, content, target_ai: targetAi ?? null, category: category ?? null, sort_order: 0 }).select().single()
  if (error) throw error
  revalidatePath(`/projects/${projectId}/prompts`)
  return data
}

export async function updatePrompt(id: string, updates: { title?: string; content?: string; target_ai?: string; category?: string }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('prompts').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id)
  if (error) throw error
}

export async function deletePrompt(id: string, projectId: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('prompts').delete().eq('id', id).eq('user_id', user.id)
  if (error) throw error
  revalidatePath(`/projects/${projectId}/prompts`)
}
