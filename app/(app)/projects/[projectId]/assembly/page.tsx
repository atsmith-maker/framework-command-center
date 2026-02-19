import { createServerClient } from '@/lib/supabase/server'
import { AssemblyEditor } from '@/components/assembly/AssemblyEditor'

export default async function AssemblyPage({ params }: { params: { projectId: string } }) {
  const supabase = createServerClient()
  const { data: sections } = await supabase.from('assembly_sections').select('*').eq('project_id', params.projectId).order('sort_order')
  return <AssemblyEditor projectId={params.projectId} initialSections={sections ?? []} />
}
