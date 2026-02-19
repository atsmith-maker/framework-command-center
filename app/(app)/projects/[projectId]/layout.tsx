import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProjectTabs } from './ProjectTabs'

export default async function ProjectLayout({ children, params }: { children: React.ReactNode; params: { projectId: string } }) {
  const supabase = createServerClient()
  const { data: project } = await supabase.from('projects').select('*').eq('id', params.projectId).single()
  if (!project) notFound()

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-card px-6 pt-4">
        <h1 className="text-xl font-bold mb-3">{project.name}</h1>
        <ProjectTabs projectId={params.projectId} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
