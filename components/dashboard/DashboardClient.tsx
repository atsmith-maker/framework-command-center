'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { createProject, deleteProject } from '@/lib/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/types/database'
import Link from 'next/link'
import { Plus, Trash2, FolderOpen } from 'lucide-react'

export function DashboardClient({ initialProjects }: { initialProjects: Project[] }) {
  const qc = useQueryClient()
  const supabase = createClient()
  const [showNew, setShowNew] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').order('updated_at', { ascending: false })
      if (error) throw error
      return data ?? []
    },
    initialData: initialProjects,
  })

  const create = useMutation({
    mutationFn: () => createProject(name, desc),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projects'] }); setShowNew(false); setName(''); setDesc('') },
  })

  const remove = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['projects'] }),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-2" />New Project</Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No projects yet. Create your first project to get started.</p>
            <Button onClick={() => setShowNew(true)}>Create Project</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: Project) => (
            <Card key={p.id} className="relative hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base line-clamp-2">{p.name}</CardTitle>
                  <button onClick={() => remove.mutate(p.id)} className="text-muted-foreground hover:text-destructive ml-2 shrink-0"><Trash2 className="h-4 w-4" /></button>
                </div>
                <Badge variant="outline" className="w-fit text-xs">{p.status}</Badge>
              </CardHeader>
              <CardContent>
                {p.description && <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.description}</p>}
                <Link href={`/projects/${p.id}/tasks`}>
                  <Button variant="outline" size="sm" className="w-full">Open Project</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Project</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <Input placeholder="Project name" value={name} onChange={e => setName(e.target.value)} />
            <Input placeholder="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button onClick={() => create.mutate()} disabled={!name.trim() || create.isPending}>
              {create.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
