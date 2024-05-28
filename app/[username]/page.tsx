import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

export default async function ProfilePage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  if (!profile) notFound()

  return <h3>diary.dev/{profile.username}</h3>
}
