import type { SupabaseClient } from '@supabase/supabase-js'
export async function getSectionsByProject(supabase: SupabaseClient, projectId: string) {
  const { data, error } = await supabase.from('assembly_sections').select('*').eq('project_id', projectId).order('sort_order')
  if (error) throw error
  return data ?? []
}
