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
    <div className="flex gap-1">
      {tabs.map(tab => (
        <Link key={tab.href} href={tab.href}
          className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors",
            pathname.startsWith(tab.href) ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
          )}>
          {tab.label}
        </Link>
      ))}
    </div>
  )
}
