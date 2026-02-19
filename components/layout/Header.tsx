'use client'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter()
  const supabase = createClient()
  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <Button variant="ghost" size="icon" onClick={onMenuClick}><Menu className="h-5 w-5" /></Button>
      <Button variant="ghost" size="sm" onClick={signOut}>Sign out</Button>
    </header>
  )
}
