import { createServerClient } from '@/lib/supabase/server'
import { getPerformanceByProject } from '@/lib/queries/performance'
import { PerformanceTracker } from '@/components/performance/PerformanceTracker'

export default async function PerformancePage({ params }: { params: { projectId: string } }) {
  const supabase = createServerClient()
  const logs = await getPerformanceByProject(supabase, params.projectId).catch(() => [])
  return <PerformanceTracker projectId={params.projectId} initialLogs={logs} />
}
