import { createServerClient } from '@/lib/supabase/server'
import { getSectionsByProject } from '@/lib/queries/sections'
import { AssemblyEditor } from '@/components/assembly/AssemblyEditor'

export default async function AssemblyPage({ params }: { params: { projectId: string } }) {
  const supabase = createServerClient()
  const sections = await getSectionsByProject(supabase, params.projectId).catch(() => [])
  return <AssemblyEditor projectId={params.projectId} initialSections={sections} />
}
