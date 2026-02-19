import { createServerClient } from '@/lib/supabase/server'
import { seedFrameworkDocs } from '@/lib/actions/docs'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function LibraryPage() {
  const supabase = createServerClient()
  await seedFrameworkDocs()
  const { data: docs } = await supabase.from('framework_docs').select('id,title,slug,category,description,updated_at').order('category').order('title')

  const byCategory: Record<string, typeof docs> = {}
  docs?.forEach(d => { if (!byCategory[d.category]) byCategory[d.category] = []; byCategory[d.category]!.push(d) })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Framework Library</h1>
          <p className="text-muted-foreground">{docs?.length ?? 0} documents</p>
        </div>
      </div>
      {Object.entries(byCategory).map(([cat, catDocs]) => (
        <div key={cat}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">{cat}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {catDocs!.map(doc => (
              <Link key={doc.id} href={`/library/${doc.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <BookOpen className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{doc.title}</p>
                        {doc.description && <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
