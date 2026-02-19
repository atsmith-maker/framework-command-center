import { createServerClient } from '@/lib/supabase/server'
import { getTasksByProject } from '@/lib/queries/tasks'
import { getProject } from '@/lib/queries/projects'
import { CoordinationTable } from '@/components/coordination/CoordinationTable'
import { notFound } from 'next/navigation'

export default async function TasksPage({ params }: { params: { projectId: string } }) {
  const supabase = createServerClient()
  const [project, tasks] = await Promise.all([
    getProject(supabase, params.projectId).catch(() => null),
    getTasksByProject(supabase, params.projectId).catch(() => []),
  ])
  if (!project) notFound()
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{project.name} — Coordination</h1>
      <CoordinationTable projectId={params.projectId} initialTasks={tasks} />
    </div>
  )
}
