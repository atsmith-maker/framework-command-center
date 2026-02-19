'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FolderOpen, BookOpen, FlaskConical, HelpCircle, Settings, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderOpen },
  { href: '/library', label: 'Framework Library', icon: BookOpen },
  { href: '/testing', label: 'Testing Lab', icon: FlaskConical },
  { href: '/help', label: 'Help & Guide', icon: HelpCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()
  if (!open) return null
  return (
    <aside className="flex w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <span className="font-semibold text-sm">Framework Command Center</span>
        <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground', pathname.startsWith(href) && href !== '/dashboard' ? 'bg-accent text-accent-foreground font-medium' : pathname === href ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground')}>
            <Icon className="h-4 w-4" />{label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
