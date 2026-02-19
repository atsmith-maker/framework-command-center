import { createServerClient } from '@/lib/supabase/server'
import { getDocs } from '@/lib/queries/docs'
import { seedFrameworkDocs } from '@/lib/actions/docs'
import { DocsBrowser } from '@/components/docs/DocsBrowser'

export default async function LibraryPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) await seedFrameworkDocs(user.id)
  const docs = await getDocs(supabase).catch(() => [])
  return <DocsBrowser initialDocs={docs} />
}
