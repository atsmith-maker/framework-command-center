import type { SupabaseClient } from '@supabase/supabase-js'
export async function getPromptsByProject(supabase: SupabaseClient, projectId: string) {
  const { data, error } = await supabase.from('prompts').select('*').eq('project_id', projectId).order('sort_order')
  if (error) throw error
  return data ?? []
}
