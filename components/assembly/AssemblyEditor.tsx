'use client'
import { useState, useCallback } from 'react'
import { useSections } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Section } from '@/types/database'
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

function SectionEditor({ section, onUpdate, onDelete }: { section: Section; onUpdate: (id: string, updates: { title?: string; content?: string }) => void; onDelete: (id: string) => void }) {
  const [title, setTitle] = useState(section.title)
  const [content, setContent] = useState(section.content ?? '')
  const [saveTimer, setSaveTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  const handleContentChange = (val: string) => {
    setContent(val)
    if (saveTimer) clearTimeout(saveTimer)
    setSaveTimer(setTimeout(() => onUpdate(section.id, { content: val }), 1500))
  }

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Input className="font-semibold" value={title} onChange={e => setTitle(e.target.value)} onBlur={() => onUpdate(section.id, { title })} />
        <button onClick={() => onDelete(section.id)} className="text-muted-foreground hover:text-destructive shrink-0"><Trash2 className="h-4 w-4" /></button>
      </div>
      <Textarea
        value={content}
        onChange={e => handleContentChange(e.target.value)}
        rows={8}
        placeholder="Paste or type content here... Auto-saves as you type."
        className="font-mono text-sm resize-y"
      />
      <div className="text-xs text-muted-foreground text-right">{content.split(/\s+/).filter(Boolean).length} words</div>
    </div>
  )
}

export function AssemblyEditor({ projectId, initialSections }: { projectId: string; initialSections: Section[] }) {
  const { sections, create, update, remove } = useSections(projectId, initialSections)
  const [newTitle, setNewTitle] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Assembly Editor</h2>
      </div>
      <div className="flex gap-2">
        <Input placeholder="New section title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && newTitle.trim() && (create.mutate(newTitle), setNewTitle(''))} />
        <Button onClick={() => { if (newTitle.trim()) { create.mutate(newTitle); setNewTitle('') } }} disabled={!newTitle.trim() || create.isPending}><Plus className="h-4 w-4" /></Button>
      </div>
      {sections.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No sections yet. Add your first section above.</p>
      ) : (
        <div className="space-y-4">
          {sections.map((s: Section) => (
            <SectionEditor key={s.id} section={s} onUpdate={(id, updates) => update.mutate({ id, updates })} onDelete={(id) => remove.mutate(id)} />
          ))}
        </div>
      )}
    </div>
  )
}
