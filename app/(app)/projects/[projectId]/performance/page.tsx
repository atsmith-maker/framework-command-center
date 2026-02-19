import { createServerClient } from '@/lib/supabase/server'
import { PerformanceTracker } from '@/components/performance/PerformanceTracker'

export default async function PerformancePage({ params }: { params: { projectId: string } }) {
  const supabase = createServerClient()
  const { data: records } = await supabase.from('ai_performance').select('*').eq('project_id', params.projectId).order('created_at', { ascending: false })
  return <PerformanceTracker projectId={params.projectId} initialRecords={records ?? []} />
}
