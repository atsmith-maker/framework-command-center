import { createServerClient } from '@/lib/supabase/server'
import { CoordinationTable } from '@/components/coordination/CoordinationTable'

export default async function TasksPage({ params }: { params: { projectId: string } }) {
  const supabase = createServerClient()
  const { data: tasks } = await supabase.from('coordination_tasks').select('*').eq('project_id', params.projectId).order('sort_order')
  return <CoordinationTable projectId={params.projectId} initialTasks={tasks ?? []} />
}
