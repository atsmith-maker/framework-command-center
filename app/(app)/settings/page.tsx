import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function SettingsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader><CardTitle>Account</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
          <p className="text-sm text-muted-foreground mt-1">Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</p>
        </CardContent>
      </Card>
    </div>
  )
}
