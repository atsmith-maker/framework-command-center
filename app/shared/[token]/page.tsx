import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function SharedPage({ params }: { params: { token: string } }) {
  const supabase = createServerClient()
  const { data: share } = await supabase.from('project_shares').select('*').eq('token', params.token).single()
  if (!share) notFound()
  if (share.expires_at && new Date(share.expires_at) < new Date()) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">This share link has expired.</p></div>
  }
  const { data: project } = await supabase.from('projects').select('*').eq('id', share.project_id).single()
  if (!project) notFound()
  const [tasks, sections, prompts] = await Promise.all([
    supabase.from('coordination_tasks').select('*').eq('project_id', share.project_id).order('sort_order').then(r => r.data ?? []),
    supabase.from('assembly_sections').select('*').eq('project_id', share.project_id).order('sort_order').then(r => r.data ?? []),
    supabase.from('prompts').select('*').eq('project_id', share.project_id).order('sort_order').then(r => r.data ?? []),
  ])
  // Increment view count
  await supabase.from('project_shares').update({ view_count: share.view_count + 1 }).eq('id', share.id)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{project.name}</h1>
        {project.description && <p className="text-muted-foreground mt-1">{project.description}</p>}
        <p className="text-xs text-muted-foreground mt-2">Shared project — read only</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3">Tasks ({tasks.length})</h2>
        <div className="space-y-2">
          {tasks.map((t: { id: string; title: string; assigned_ai: string | null; status: string; description: string | null }) => (
            <div key={t.id} className="rounded border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t.title}</span>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  {t.assigned_ai && <span>{t.assigned_ai}</span>}
                  <span>{t.status}</span>
                </div>
              </div>
              {t.description && <p className="text-muted-foreground text-xs mt-1">{t.description}</p>}
            </div>
          ))}
        </div>
      </div>
      {prompts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Prompts ({prompts.length})</h2>
          <div className="space-y-2">
            {prompts.map((p: { id: string; title: string; content: string; target_ai: string | null }) => (
              <div key={p.id} className="rounded border p-3 text-sm">
                <div className="font-medium">{p.title} {p.target_ai && <span className="text-xs text-muted-foreground">({p.target_ai})</span>}</div>
                <p className="text-xs text-muted-foreground font-mono mt-1 line-clamp-3">{p.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
