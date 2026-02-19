'use client'
import { useState } from 'react'
import { updateDoc } from '@/lib/actions/docs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { FrameworkDoc } from '@/types/database'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export function DocEditor({ initialDoc }: { initialDoc: FrameworkDoc }) {
  const [title, setTitle] = useState(initialDoc.title)
  const [content, setContent] = useState(initialDoc.content ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async () => {
    setSaving(true)
    await updateDoc(initialDoc.id, { title, content })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4 max-w-4xl">
      <Link href="/library" className="flex items-center text-sm text-muted-foreground hover:text-foreground gap-1">
        <ChevronLeft className="h-4 w-4" />Back to Library
      </Link>
      <div className="flex items-center justify-between">
        <Input className="text-xl font-bold border-none px-0 text-2xl h-auto focus-visible:ring-0" value={title} onChange={e => setTitle(e.target.value)} />
        <Button onClick={save} disabled={saving} variant="outline" size="sm">{saved ? '✓ Saved' : saving ? 'Saving...' : 'Save'}</Button>
      </div>
      <Textarea value={content} onChange={e => setContent(e.target.value)} rows={30} className="font-mono text-sm resize-y" placeholder="Document content (Markdown supported)..." />
    </div>
  )
}
