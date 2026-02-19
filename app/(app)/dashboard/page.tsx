import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, FolderOpen, CheckCircle2, Clock } from 'lucide-react'
import { NewProjectModal } from '@/components/projects/NewProjectModal'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: projects } = await supabase.from('projects').select('*').order('updated_at', { ascending: false })

  const active = projects?.filter(p => p.status === 'active').length ?? 0
  const completed = projects?.filter(p => p.status === 'completed').length ?? 0
  const totalTasks = projects?.reduce((a, p) => a + p.task_count, 0) ?? 0
  const completedTasks = projects?.reduce((a, p) => a + p.completed_tasks, 0) ?? 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Your AI project coordination hub</p>
        </div>
        <NewProjectModal />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: active, icon: FolderOpen },
          { label: 'Completed', value: completed, icon: CheckCircle2 },
          { label: 'Total Tasks', value: totalTasks, icon: Clock },
          { label: 'Tasks Done', value: completedTasks, icon: CheckCircle2 },
        ].map(stat => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Projects</h2>
        {!projects?.length ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <FolderOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No projects yet. Create your first one!</p>
              <NewProjectModal />
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {projects.map(project => (
              <Link key={project.id} href={`/projects/${project.id}/tasks`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{project.name}</h3>
                          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>{project.status}</Badge>
                        </div>
                        {project.description && <p className="text-sm text-muted-foreground mt-1">{project.description}</p>}
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{project.completed_tasks}/{project.task_count} tasks</p>
                        <p>Updated {formatDate(project.updated_at)}</p>
                      </div>
                    </div>
                    {project.task_count > 0 && (
                      <div className="mt-3 bg-muted rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${Math.round((project.completed_tasks / project.task_count) * 100)}%` }} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
