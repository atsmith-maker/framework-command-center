import type { SupabaseClient } from '@supabase/supabase-js'
export async function getPerformanceByProject(supabase: SupabaseClient, projectId: string) {
  const { data, error } = await supabase.from('performance_logs').select('*').eq('project_id', projectId).order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
