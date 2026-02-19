'use client'
import Link from 'next/link'
import { useState } from 'react'
import type { FrameworkDoc } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookOpen } from 'lucide-react'

export function DocsBrowser({ initialDocs }: { initialDocs: FrameworkDoc[] }) {
  const [search, setSearch] = useState('')
  const filtered = initialDocs.filter(d => d.title.toLowerCase().includes(search.toLowerCase()))
  const byCategory = filtered.reduce((acc: Record<string, FrameworkDoc[]>, doc) => {
    const cat = doc.category ?? 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(doc)
    return acc
  }, {})
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Framework Library</h1>
      <Input placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
      {Object.entries(byCategory).map(([cat, docs]) => (
        <div key={cat}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">{cat}</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {docs.map(doc => (
              <Link key={doc.id} href={`/library/${doc.slug}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <CardTitle className="text-sm">{doc.title}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
