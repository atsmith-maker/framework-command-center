import { createServerClient } from '@/lib/supabase/server'
import { getProjects } from '@/lib/queries/projects'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const projects = await getProjects(supabase).catch(() => [])
  return <DashboardClient initialProjects={projects} />
}
