'use client'
import { Project, CoordinationTask, AssemblySection, Prompt } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Zap } from 'lucide-react'

export function SharedProjectView({ project, tasks, sections, prompts, token }: {
  project: Project; tasks: CoordinationTask[]; sections: AssemblySection[]; prompts: Prompt[]; token: string
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">Framework Command Center — Shared Project</span>
        </div>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        {project.description && <p className="text-muted-foreground mt-1">{project.description}</p>}
      </header>
      <div className="p-6">
        <Tabs defaultValue="tasks">
          <TabsList>
            <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
            <TabsTrigger value="assembly">Assembly ({sections.length})</TabsTrigger>
            <TabsTrigger value="prompts">Prompts ({prompts.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks" className="mt-4 space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="border rounded-lg p-3 bg-card">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{task.title ?? task.task_id}</span>
                  <Badge variant="outline" className="text-xs">{task.assigned_ai}</Badge>
                  <Badge variant={task.status === 'completed' ? 'default' : 'secondary'} className="text-xs">{task.status}</Badge>
                  <Badge variant="outline" className="text-xs">{task.priority}</Badge>
                </div>
                {task.description && <p className="text-xs text-muted-foreground mt-1">{task.description}</p>}
              </div>
            ))}
          </TabsContent>
          <TabsContent value="assembly" className="mt-4 space-y-4">
            {sections.map(section => (
              <div key={section.id} className="border rounded-lg p-4 bg-card">
                <h3 className="font-medium mb-2">{section.title}</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground text-sm">
                  {typeof section.content === 'object' && (section.content as any)?.content?.map((node: any, i: number) => (
                    <p key={i}>{node.content?.map((c: any) => c.text).join('') ?? ''}</p>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="prompts" className="mt-4 space-y-2">
            {prompts.map(prompt => (
              <div key={prompt.id} className="border rounded-lg p-3 bg-card">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{prompt.title}</span>
                  {prompt.ai_target && <Badge variant="outline" className="text-xs">{prompt.ai_target}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{prompt.content}</p>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
