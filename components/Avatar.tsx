import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'

export default async function Avatar(props: { size: number }) {
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user) return null

  return (
    <Image
      alt="Avatar"
      className="rounded-full"
      height={props.size}
      priority
      src={user.user_metadata.avatar_url}
      width={props.size}
    />
  )
}
