'use server'
import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(name: string, description?: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { data, error } = await supabase.from('projects').insert({ user_id: user.id, name, description: description ?? null, status: 'active' }).select().single()
  if (error) throw error
  revalidatePath('/dashboard')
  return data
}

export async function updateProject(id: string, updates: { name?: string; description?: string; status?: string }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('projects').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id)
  if (error) throw error
  revalidatePath('/dashboard')
  revalidatePath(`/projects/${id}`)
}

export async function deleteProject(id: string) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const { error } = await supabase.from('projects').delete().eq('id', id).eq('user_id', user.id)
  if (error) throw error
  revalidatePath('/dashboard')
}
