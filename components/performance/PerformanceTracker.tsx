'use client'
import { useState } from 'react'
import { usePerformance } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PerformanceLog } from '@/types/database'
import { AI_MODELS } from '@/types/database'
import { Plus, Trash2, Star } from 'lucide-react'

function Stars({ rating }: { rating: number }) {
  return <span className="text-yellow-500">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
}

export function PerformanceTracker({ projectId, initialLogs }: { projectId: string; initialLogs: PerformanceLog[] }) {
  const { logs, create, remove } = usePerformance(projectId, initialLogs)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ ai_model: '', rating: 3, revisions: 0, time_spent: '', notes: '' })

  const byAI = AI_MODELS.map(ai => {
    const aiLogs = logs.filter((l: PerformanceLog) => l.ai_model === ai)
    if (aiLogs.length === 0) return null
    const avg = aiLogs.reduce((s: number, l: PerformanceLog) => s + l.rating, 0) / aiLogs.length
    return { ai, count: aiLogs.length, avg: avg.toFixed(1) }
  }).filter(Boolean)

  const exportCSV = () => {
    const rows = [['AI Model', 'Rating', 'Revisions', 'Time (min)', 'Notes', 'Date']]
    logs.forEach((l: PerformanceLog) => rows.push([l.ai_model, String(l.rating), String(l.revisions), String(l.time_spent ?? ''), l.notes ?? '', l.created_at]))
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv,' + encodeURIComponent(csv)
    a.download = 'performance.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Performance Tracker</h2>
        <div className="flex gap-2">
          {logs.length > 0 && <Button variant="outline" size="sm" onClick={exportCSV}>Export CSV</Button>}
          <Button onClick={() => setShowNew(true)}><Plus className="h-4 w-4 mr-2" />Log Entry</Button>
        </div>
      </div>

      {byAI.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {byAI.map((a: { ai: string; count: number; avg: string } | null) => a && (
            <Card key={a.ai}>
              <CardHeader className="pb-1"><CardTitle className="text-sm">{a.ai}</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{a.avg} <span className="text-yellow-500 text-lg">★</span></div>
                <div className="text-xs text-muted-foreground">{a.count} {a.count === 1 ? 'entry' : 'entries'}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {logs.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No performance logs yet.</p>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50"><tr>
              <th className="text-left p-3 font-medium">AI</th>
              <th className="text-left p-3 font-medium">Rating</th>
              <th className="text-left p-3 font-medium">Revisions</th>
              <th className="text-left p-3 font-medium">Notes</th>
              <th className="w-10"></th>
            </tr></thead>
            <tbody className="divide-y">
              {logs.map((l: PerformanceLog) => (
                <tr key={l.id} className="hover:bg-muted/30">
                  <td className="p-3 font-medium">{l.ai_model}</td>
                  <td className="p-3"><Stars rating={l.rating} /></td>
                  <td className="p-3">{l.revisions}</td>
                  <td className="p-3 text-muted-foreground text-xs">{l.notes}</td>
                  <td className="p-3"><button onClick={() => remove.mutate(l.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent>
          <DialogHeader><DialogTitle>Log Performance Entry</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label>AI Model</Label>
              <Select value={form.ai_model} onValueChange={v => setForm(f => ({ ...f, ai_model: v }))}>
                <SelectTrigger><SelectValue placeholder="Select AI" /></SelectTrigger>
                <SelectContent>{AI_MODELS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Rating (1-5)</Label>
              <Select value={String(form.rating)} onValueChange={v => setForm(f => ({ ...f, rating: Number(v) }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{'★'.repeat(n)} ({n})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Revisions</Label><Input type="number" min={0} value={form.revisions} onChange={e => setForm(f => ({ ...f, revisions: Number(e.target.value) }))} /></div>
              <div><Label>Time (minutes)</Label><Input type="number" min={0} value={form.time_spent} onChange={e => setForm(f => ({ ...f, time_spent: e.target.value }))} /></div>
            </div>
            <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button onClick={() => { create.mutate({ ai_model: form.ai_model, rating: form.rating, revisions: form.revisions, time_spent: form.time_spent ? Number(form.time_spent) : undefined, notes: form.notes || undefined }); setShowNew(false) }} disabled={!form.ai_model || create.isPending}>Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
