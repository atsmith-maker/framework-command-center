import { createServerClient } from '@/lib/supabase/server'
import { getPromptsByProject } from '@/lib/queries/prompts'
import { PromptLibrary } from '@/components/prompts/PromptLibrary'

export default async function PromptsPage({ params }: { params: { projectId: string } }) {
  const supabase = createServerClient()
  const prompts = await getPromptsByProject(supabase, params.projectId).catch(() => [])
  return <PromptLibrary projectId={params.projectId} initialPrompts={prompts} />
}
