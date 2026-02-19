import type { SupabaseClient } from '@supabase/supabase-js'
export async function getProjects(supabase: SupabaseClient) {
  const { data, error } = await supabase.from('projects').select('*').order('updated_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
export async function getProject(supabase: SupabaseClient, id: string) {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
  if (error) throw error
  return data
}
