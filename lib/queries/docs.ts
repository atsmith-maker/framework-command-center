import type { SupabaseClient } from '@supabase/supabase-js'
export async function getDocs(supabase: SupabaseClient) {
  const { data, error } = await supabase.from('framework_docs').select('*').order('title')
  if (error) throw error
  return data ?? []
}
export async function getDoc(supabase: SupabaseClient, slug: string) {
  const { data, error } = await supabase.from('framework_docs').select('*').eq('slug', slug).single()
  if (error) throw error
  return data
}
