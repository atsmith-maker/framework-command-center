'use client'
import { useState } from 'react'
import { useTasks } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Task } from '@/types/database'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { AI_MODELS, TASK_STATUSES, TASK_PRIORITIES } from '@/types/database'

const STATUS_COLORS: Record<string, string> = {
  'todo': 'secondary', 'in-progress': 'default', 'review': 'outline', 'done': 'default', 'blocked': 'destructive'
}

export function CoordinationTable({ projectId, initialTasks }: { projectId: string; initialTasks: Task[] }) {
  const { tasks, create, update, remove } = useTasks(projectId, initialTasks)
  const [newTitle, setNewTitle] = useState('')
  const [editing, setEditing] = useState<Task | null>(null)

  const handleCreate = () => {
    if (!newTitle.trim()) return
    create.mutate({ title: newTitle })
    setNewTitle('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input placeholder="New task title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} />
        <Button onClick={handleCreate} disabled={!newTitle.trim() || create.isPending}><Plus className="h-4 w-4" /></Button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No tasks yet. Add your first task above.</p>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Task</th>
                <th className="text-left p-3 font-medium w-32">AI</th>
                <th className="text-left p-3 font-medium w-28">Status</th>
                <th className="text-left p-3 font-medium w-24">Priority</th>
                <th className="w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tasks.map((task: Task) => (
                <tr key={task.id} className="hover:bg-muted/30">
                  <td className="p-3">
                    <div className="font-medium">{task.title}</div>
                    {task.description && <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{task.description}</div>}
                  </td>
                  <td className="p-3">
                    <Select value={task.assigned_ai ?? ''} onValueChange={v => update.mutate({ id: task.id, updates: { assigned_ai: v || null } })}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue placeholder="Assign AI" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {AI_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Select value={task.status} onValueChange={v => update.mutate({ id: task.id, updates: { status: v } })}>
                      <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TASK_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Badge variant={task.priority === 'critical' ? 'destructive' : 'outline'} className="text-xs">{task.priority}</Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      <button onClick={() => setEditing(task)} className="text-muted-foreground hover:text-foreground"><Edit2 className="h-3.5 w-3.5" /></button>
                      <button onClick={() => remove.mutate(task.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Edit Task</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label>Title</Label>
                <Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={editing.description ?? ''} onChange={e => setEditing({ ...editing, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>AI</Label>
                  <Select value={editing.assigned_ai ?? ''} onValueChange={v => setEditing({ ...editing, assigned_ai: v || null })}>
                    <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {AI_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={editing.status} onValueChange={v => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{TASK_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={editing.priority} onValueChange={v => setEditing({ ...editing, priority: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{TASK_PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={() => { update.mutate({ id: editing.id, updates: { title: editing.title, description: editing.description, assigned_ai: editing.assigned_ai, status: editing.status, priority: editing.priority } }); setEditing(null) }}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
