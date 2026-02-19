import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DocEditor } from '@/components/docs/DocEditor'

export default async function DocPage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient()
  const { data: doc } = await supabase.from('framework_docs').select('*').eq('slug', params.slug).single()
  if (!doc) notFound()
  return <DocEditor initialDoc={doc} />
}
