'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname()
  const tabs = [
    { href: `/projects/${projectId}/tasks`, label: 'Coordination' },
    { href: `/projects/${projectId}/assembly`, label: 'Assembly' },
    { href: `/projects/${projectId}/prompts`, label: 'Prompts' },
    { href: `/projects/${projectId}/performance`, label: 'Performance' },
    { href: `/projects/${projectId}/settings`, label: 'Settings' },
  ]
  return (
    <div className="border-b flex gap-0">
      {tabs.map(t => (
        <Link key={t.href} href={t.href} className={cn('px-4 py-2 text-sm border-b-2 -mb-px transition-colors hover:text-foreground', pathname === t.href ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground')}>
          {t.label}
        </Link>
      ))}
    </div>
  )
}
