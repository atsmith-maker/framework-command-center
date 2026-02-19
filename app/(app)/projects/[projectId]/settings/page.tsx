import { createServerClient } from '@/lib/supabase/server'
import { ProjectSettings } from '@/components/projects/ProjectSettings'

export default async function ProjectSettingsPage({ params }: { params: { projectId: string } }) {
  const supabase = createServerClient()
  const { data: project } = await supabase.from('projects').select('*').eq('id', params.projectId).single()
  const { data: shares } = await supabase.from('project_shares').select('*').eq('project_id', params.projectId)
  return <ProjectSettings project={project} shares={shares ?? []} />
}
