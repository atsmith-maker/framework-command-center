'use client'
import { useState } from 'react'
import { usePrompts } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Prompt } from '@/types/database'
import { AI_MODELS } from '@/types/database'
import { Plus, Copy, Trash2, Edit2, Check } from 'lucide-react'

export function PromptLibrary({ projectId, initialPrompts }: { projectId: string; initialPrompts: Prompt[] }) {
  const { prompts, create, update, remove } = usePrompts(projectId, initialPrompts)
  const [showNew, setShowNew] = useState(false)
  const [editing, setEditing] = useState<Prompt | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', content: '', target_ai: '', category: '' })

  const copyPrompt = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCreate = () => {
    create.mutate({ title: form.title, content: form.content, target_ai: form.target_ai || undefined, category: form.category || undefined })
    setShowNew(false)
    setForm({ title: '', content: '', target_ai: '', category: '' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Prompt Library</h2>
        <Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-2" />Add Prompt</Button>
      </div>

      {prompts.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No prompts yet. Add prompts to use in your AI workflows.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {prompts.map((p: Prompt) => (
            <Card key={p.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm">{p.title}</CardTitle>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => copyPrompt(p.id, p.content)} className="text-muted-foreground hover:text-foreground">
                      {copied === p.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => setEditing(p)} className="text-muted-foreground hover:text-foreground"><Edit2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => remove.mutate(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {p.target_ai && <Badge variant="outline" className="text-xs">{p.target_ai}</Badge>}
                  {p.category && <Badge variant="secondary" className="text-xs">{p.category}</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-3 font-mono">{p.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Add Prompt</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
            <div><Label>Content</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={6} className="font-mono text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Target AI</Label>
                <Select value={form.target_ai} onValueChange={v => setForm(f => ({ ...f, target_ai: v }))}>
                  <SelectTrigger><SelectValue placeholder="Any AI" /></SelectTrigger>
                  <SelectContent><SelectItem value="">Any AI</SelectItem>{AI_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Research, Writing" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!form.title.trim() || !form.content.trim() || create.isPending}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editing && (
        <Dialog open onOpenChange={() => setEditing(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Edit Prompt</DialogTitle></DialogHeader>
            <div className="space-y-3 py-2">
              <div><Label>Title</Label><Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><Label>Content</Label><Textarea value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} rows={6} className="font-mono text-sm" /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={() => { update.mutate({ id: editing.id, updates: { title: editing.title, content: editing.content } }); setEditing(null) }}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
