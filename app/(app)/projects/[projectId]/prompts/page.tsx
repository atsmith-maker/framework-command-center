import { createServerClient } from '@/lib/supabase/server'
import { PromptLibrary } from '@/components/prompts/PromptLibrary'

export default async function PromptsPage({ params }: { params: { projectId: string } }) {
  const supabase = createServerClient()
  const { data: prompts } = await supabase.from('prompts').select('*').eq('project_id', params.projectId).order('created_at')
  return <PromptLibrary projectId={params.projectId} initialPrompts={prompts ?? []} />
}
