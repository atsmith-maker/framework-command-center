import type { SupabaseClient } from '@supabase/supabase-js'
export async function getShareByToken(supabase: SupabaseClient, token: string) {
  const { data, error } = await supabase.from('project_shares').select('*').eq('token', token).single()
  if (error) throw error
  return data
}
