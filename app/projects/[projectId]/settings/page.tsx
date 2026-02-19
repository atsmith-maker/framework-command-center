import { createServerClient } from '@/lib/supabase/server'
import { getProject } from '@/lib/queries/projects'
import { ProjectSettings } from '@/components/projects/ProjectSettings'
import { notFound } from 'next/navigation'

export default async function SettingsPage({ params }: { params: { projectId: string } }) {
  const supabase = createServerClient()
  const project = await getProject(supabase, params.projectId).catch(() => null)
  if (!project) notFound()
  return <ProjectSettings project={project} />
}
