import { AppShell } from '@/components/layout/AppShell'
import { ProjectTabs } from '@/components/projects/ProjectTabs'

export default function ProjectLayout({ children, params }: { children: React.ReactNode; params: { projectId: string } }) {
  return (
    <AppShell>
      <div className="space-y-0">
        <ProjectTabs projectId={params.projectId} />
        <div className="mt-6">{children}</div>
      </div>
    </AppShell>
  )
}
