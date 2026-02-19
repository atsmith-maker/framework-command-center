'use client'
import { useState } from 'react'
import { updateProject, deleteProject } from '@/lib/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Project } from '@/types/database'
import { useRouter } from 'next/navigation'

export function ProjectSettings({ project }: { project: Project }) {
  const router = useRouter()
  const [name, setName] = useState(project.name)
  const [desc, setDesc] = useState(project.description ?? '')
  const [saving, setSaving] = useState(false)

  const exportJSON = () => {
    const data = { project, exported_at: new Date().toISOString() }
    const a = document.createElement('a')
    a.href = 'data:application/json,' + encodeURIComponent(JSON.stringify(data, null, 2))
    a.download = `${project.name.replace(/\s+/g, '-')}-backup.json`
    a.click()
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-semibold">Project Settings</h2>
      <Card>
        <CardHeader><CardTitle className="text-base">General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div><Label>Description</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} /></div>
          <Button onClick={async () => { setSaving(true); await updateProject(project.id, { name, description: desc }); setSaving(false) }} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-base">Export</CardTitle></CardHeader>
        <CardContent>
          <Button variant="outline" onClick={exportJSON}>Export as JSON</Button>
        </CardContent>
      </Card>
      <Card className="border-destructive/50">
        <CardHeader><CardTitle className="text-base text-destructive">Danger Zone</CardTitle></CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={async () => { if (confirm('Delete this project? This cannot be undone.')) { await deleteProject(project.id); router.push('/dashboard') } }}>Delete Project</Button>
        </CardContent>
      </Card>
    </div>
  )
}
